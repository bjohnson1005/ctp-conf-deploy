// Shall simply return the input parameter.
function validateJson(json) {
	// This works with Java 6.
	// var jsonobj = eval('(' + json + ')');
	// Only available wt JavaScript engine in Java 7
	// var jsonobj = JSON.parse(json);
	return json;
}