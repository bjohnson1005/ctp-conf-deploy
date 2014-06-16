// Inspect the object and transform as needed.
function inspectObject(jsonobj) {

    var gObj = {

        EntityObject_001: jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.EntityObject_001,

        NameObject_001: jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.NameObject_001,

        DescriptiveTextObject_001: jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.DescriptiveTextObject_001,

        WebsiteObject_001: jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.WebsiteObject_001,

        FinancialObject_001: jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.FinancialObject_001,

        LegalIdentifierObject_001: jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.LegalIdentifierObject_001,

        StatusObject_001: jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.StatusObject_001,

        PurposeObject_001: jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.PurposeObject_001,

        LocationObject_001: jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.LocationObject_001
    }

    return gObj;
}

// Iterate through the object.
// Note that we SHALL wrap the obj JSON string in parentheses for
// the eval for Java 6 to work - or no joy is to be found in this world.
function iterateObject(json) {
 
    var jsonobj = JSON.parse(json);
    
    return JSON.stringify( inspectObject(jsonobj) );
}