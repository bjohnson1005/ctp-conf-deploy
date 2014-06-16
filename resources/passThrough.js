/**
 * Created by wallj on 12/2/13.
 */

//Inspect the object and transform as needed.
function inspectObject(jsonobj) {
    return jsonobj;
}

// Iterate through the object.
// Note that we SHALL wrap the obj JSON string in parentheses for
// the eval for Java 6 to work - or no joy is to be found in this world.
function iterateObject(json) {

    var jsonobj = JSON.parse(json);

    return JSON.stringify(inspectObject(jsonobj));
}
