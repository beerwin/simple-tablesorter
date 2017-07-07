# simple-tablesorter
A very simple table sorter to work with Knockout.js

# Usage

	var sorter = new tableSort({
		selector: "#mytable",
		sortColumn: 1,
		sortDirection: 'desc',
		orderTypes: ["stringInsensitive", "int", null, "int"]
	});

`selector`: the selector pointing to the table you wish to apply the sorter on
`sortColumn`: the column you wish to sort by initially (zero-based index)
`sortDirection`: the direction you would like to sort the data. Accepted values are `asc` and `desc`
`orderTypes`: a list of data types in the order of the table columns. Valid options are: `stringInsensitive` (string case insensitive compare, default), `string` (case sensitive compare), `int` (integer compare), `float` (float compare), `null` (no sorting for that column)

