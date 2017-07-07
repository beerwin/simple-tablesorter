# simple-tablesorter
A very simple table sorter to work with Knockout.js

# Usage

	var sorter = new tableSort({
		selector: "#mytable",
		sortColumn: 1,
		sortDirection: 'desc',
		orderTypes: ["stringInsensitive", "int", null, "int"]
	});

- `selector`: the selector pointing to the table you wish to apply the sorter on
- `sortColumn`: the column you wish to sort by initially (zero-based index)
- `sortDirection`: the direction you would like to sort the data. Accepted values are `asc` and `desc`
- `orderTypes`: a list of data types in the order of the table columns. Valid options are: 
	- `stringInsensitive` (string case insensitive compare, default), 
	- `string` (case sensitive compare), 
	- `int` (integer compare), 
	- `float` (float compare), 
	- `null` (no sorting for that column)

When not using Knockout, this is pretty much enough. The sorter supports scenarios where the table contents are replaced.

For the situations, where the table body contents are replaced, the sorter provides a convenience method to re-sort the table with the last sorting criteria:

	sorter.sortLastCriteria();

While you are replacing the table content, it is recommended to hide the table contents while the DOM changes are ongoing. This prevents needless repaints and reflows while the table is being updated.
The sorter provides methods for this as well. Before you start updating the table:

	sorter.beginUpdate();

After you have finished updating:

	sorter.endUpdate();

When you are using it with Knockout.js, it is required to notify the sorter that the underlying data has been updated/replaced.

First, you remove the knockout data, then call:

	sorter.resetRows();

Then you fill the data with new information.

Then you call the sort on the table:

	sorter.sortLastCriteria()
