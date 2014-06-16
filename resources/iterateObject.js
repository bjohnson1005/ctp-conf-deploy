// Make the various URL live links.
function setFormat(property, value) {
	var output = value;
	var val = String(value);
	var http = 'http://';
	var https = 'https://';
if(property=='url' || property=='parentUrl' || (val.indexOf(http) == 0) || (val.indexOf(https) == 0)) { 
	output = '<a href="' + value + '">' + value + '</a>';
}
	return output;
}

// Inspect the object.
// This works when called and an object has been created 
// via 'var anObject = jsonString;' or by performing an
// eval to 
function inspectObject(obj, maxLevels, level) {

  var str = '', type, msg;

// Start Input Validations
// Don't touch, we start iterating at level zero
if(level == null)  level = 0;

// At least you want to show the first level
if(maxLevels == null) maxLevels = 20;
if(maxLevels < 1) 
return '<font color="red">Error: Levels number must be > 0</font>';

// We start with a non null object
if(obj == null)
return '<font color="red">Error: Object <b>NULL</b></font>';
// End Input Validations

// Each Iteration must be indented
str += '<ul>';

// Start iterations for all objects in obj
for(property in obj)
{
  try
  {
  // Show "property" and "type property"
  type =  typeof(obj[property]);
  value = obj[property];
  str += '<li>(' + type + ') ' + property + ' : ' +
 ( (value==null)?(': <b>null</b>'):('<font color="blue ">'+ setFormat(property,value) +'</font>')) + '</li>';

  // We keep iterating if this property is an Object, non null
  // and we are inside the required number of levels
  if((type == 'object') && (obj[property] != null) && (level+1 < maxLevels))
  str += inspectObject(obj[property], maxLevels, level+1);
  }
  catch(err)
  {
// Is there some properties in obj we can't access? Print it red.
if(typeof(err) == 'string') msg = err;
else if(err.message)msg = err.message;
else if(err.description)msg = err.description;
elsemsg = 'Unknown';

str += '<li><font color="red">(Error) ' + property + ': ' + msg +'</font></li>';
  }
}

  // Close indent
  str += '</ul>';

return str;
}

// Iterate through the object.
// Note that we SHALL wrap the obj JSON string in parentheses for
// the eval to work - or no joy is to be found in this world.
function iterateObject(json) {
	// This works with Java 6.
	var jsonobj = eval('(' + json + ')');
	// Only available wt JavaScript engine in Java 7
	// var jsonobj = JSON.parse(json);
	var inspect = inspectObject(jsonobj, 20);
	return inspect;
}