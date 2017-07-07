/* Data helper class */
var dataHelper = function() {
	// random integer generator
	this.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	};
  
  // generates a random string
  this.getRandomString = function(length)
  {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";

      for( var i=0; i < length ; i++ )
          text += possible.charAt(this.getRandomInt(0, possible.length - 1));

      return text;
  };

  // generates rows amount of data and adds it to knockout observable collection
  this.generateContent = function(rows, data) {
    for (var i = 1; i <= rows; i++) {
      data.items.push(ko.mapping.fromJS({
        a: this.getRandomString(this.getRandomInt(1, 25)),
        b: this.getRandomInt(0, 200001),
        c: this.getRandomInt(-100,101),
        d: this.getRandomInt(-100,101),
      }));
    };
	};
};

// empty knockout view model
var data = ko.mapping.fromJS({items: []});

// bind data to DOM element
ko.applyBindings(data, document.getElementById("s"));

var sTableSort = new tableSort({
	selector: "table#s", 
  sortColumn: 1, 
  sortDirection: "desc", 
  orderTypes: ["stringInsensitive", "int", null, "int"]});
  
var dh = new dataHelper();

// generates a new set of data, fills the table and reapplies sorting
var replaceContent = function() {
	document.querySelector("button#aaa").disabled = true;
	
  sTableSort.beginUpdate();  
  data.items.removeAll();
  sTableSort.endUpdate();
  sTableSort.resetRows();

  sTableSort.beginUpdate();
  setTimeout(function() {
    dh.generateContent(dh.getRandomInt(100, 100), data);
    sTableSort.endUpdate();
    sTableSort.sortLastCriteria();
    document.querySelector("button#aaa").disabled = false; 
  },10);

};

// bind the replaceContent function to a button
document.getElementById("aaa").onclick = replaceContent;

// generate initial data
replaceContent();