/*
	A simple table sorter which works with Knockout.js and possibly with other MVVM libraries
	version. 1.0;
*/

/* The very simple, yet functional table sorter */
var tableSort = function(options) {
	
	var instance = this;
  
	instance.updating = false;
	instance.oldDisplay = null;
	
	// Pass in the objects to merge as arguments.
	// For a deep extend, set the first argument to `true`.
	instance.extend = function () {

			// Variables
			var extended = {};
			var deep = false;
			var i = 0;
			var length = arguments.length;

			// Check if a deep merge
			if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
					deep = arguments[0];
					i++;
			}

			// Merge the object into the extended object
			var merge = function (obj) {
					for ( var prop in obj ) {
							if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
									// If deep merge and property is an object, merge properties
									if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
											extended[prop] = extend( true, extended[prop], obj[prop] );
									} else {
											extended[prop] = obj[prop];
									}
							}
					}
			};

			// Loop through each object and conduct a merge
			for ( ; i < length; i++ ) {
					var obj = arguments[i];
					merge(obj);
			}

			return extended;

	};
	
    // the ordering "engine"
	instance.compare = function(left, right, direction, columnType) {
	  var r, l;
		switch(columnType) {
			default: 
			case "stringInsensitive": 
				l = left.toLowerCase();
				r = right.toLowerCase();
				break;
			case "string": 
				l = left;
				r = right;
				break;
			case "int": 
				l = parseInt(left);
				r = parseInt(right);
				break;
			case "float":
				l = parseFloat(left);
				r = parseFloat(right);
				break;
		}
		
		switch (direction) {
			default: 
			case "asc": 
				return l > r ? 1 : -1;
			case "desc":
				return l < r ? 1 : -1;
		}
	};
	
    // determine the column type from setup (defaults to string)
	instance.getColumnType = function(column) {
		
		var ret = instance.options.orderTypes[column];
		return typeof ret === "undefined" ? "stringInsensitive" : ret;
	}

 	// the sort function
 	instance.sort = function (column, direction) {
 		var columnType = instance.getColumnType(column);
		if (columnType === null) {
			return;
		}
    	
    	var tb = instance.table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
        tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
        i;
        
        instance.beginUpdate();
    	tb.style.display = "none";
    	tr = tr.sort(function (a, b) { // sort rows
			return instance.compare(a.cells[column].textContent.trim(), b.cells[column].textContent.trim(), direction, columnType);
    	});
    	
    	for(i = 0; i < tr.length; ++i) {
    		tb.appendChild(tr[i]); // append each row in order
    	}
    	
    	instance.endUpdate();
  }
	
  	// DOM classList heler
	instance.removeClass = function(element, className) {
		if (element.classList.contains(className)) {
			element.classList.remove(className);
		}
	};
	
  	// DOM classList helper
	instance.addClass = function(element, className) {
		if (!element.classList.contains(className)) {
			element.classList.add(className);
		}
	};
	
  	// updates headers to reflect current sorting
	instance.updateHeaders = function(sortColumn, sortDirection) {
		for (var x = 0; x < instance.headers.length; x++) {
			if (parseInt(x) !== sortColumn) {
				instance.removeClass(instance.headers[x], "sortUp");
				instance.removeClass(instance.headers[x], "sortDown");
			} else {
				if (sortDirection === "asc") {
					instance.removeClass(instance.headers[x], "sortDown");
					instance.addClass(instance.headers[x], "sortUp");
				} else {
					instance.removeClass(instance.headers[x], "sortUp");
					instance.addClass(instance.headers[x], "sortDown");
				}
			}
		}
	};

  	// the header click event
	instance.headerClick = function(element, e, index) {
		if (index !== instance.options.sortColumn) {
			instance.options.sortColumn = index;
			instance.options.sortDirection = "asc";
		} else {
			instance.options.sortDirection = instance.options.sortDirection !== "asc" ? "asc" : "desc";
		};
		
		instance.updateHeaders(instance.options.sortColumn, instance.options.sortDirection);
		instance.sort(instance.options.sortColumn, instance.options.sortDirection);
		
	};
  
  	// sorts by last applied sort criteria
  	instance.sortLastCriteria = function() {
    	instance.updateHeaders(instance.options.sortColumn, instance.options.sortDirection);
  		instance.sort(instance.options.sortColumn, instance.options.sortDirection);
  	}
	
  	// sets up headers to allow sort by click
	instance.setupHeaders = function() {
		for (var x = 0; x < instance.headers.length; x++) {
			(function(index){
				if (instance.getColumnType(index) === null) {
					return;
				}
				instance.headers[x].onclick = function(e) {
					instance.headerClick(this, e, index);
				}
			})(x);
		}
	}
	
  	// deletes table rows, keeping one row to serv as a template (to work with Knockout)
	instance.resetRows = function() {
  		instance.beginUpdate();
		while (instance.table.tBodies[0].rows.length > 0) {
			instance.table.tBodies[0].deleteRow(0);
		}
    	instance.endUpdate();
	}
	
  	// initializes the options
	instance.setupOptions = function() {
		instance.options = instance.extend({
			selector: '#tableSort',
			sortColumn: 0,
			sortDirection: "asc",
			orderTypes: []
		}, options);
	};
  	
  	// hides table body while updating it - allows updating the table without redrawing 
  	instance.beginUpdate = function() {
  		if (!instance.updating) {
    		instance.updating = true;
      		instance.oldDisplay = instance.table.tBodies[0].style.display;
      		instance.table.tBodies[0].style.display = "none";
    	}
  	};
  
  	// shows table body
  	instance.endUpdate = function() {
  		if (instance.updating) {
    		instance.table.tBodies[0].style.display = instance.oldDisplay;
      	instance.updating = false;
    	}
  	};
	
  	// set up tableSort
	instance.setupOptions();
	instance.table = document.querySelector(instance.options.selector);
	instance.headers = document.querySelectorAll(instance.options.selector + ' thead th');
	instance.setupHeaders();
	
	return instance;
	
};
/* End table sorter */