/**
 * Created by wallj on 12/2/13.
 */

//Inspect the object and transform as needed.
function inspectObject(jsonobj) {

////////////////////////////////////////////////////
    var entityObject = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.EntityObject_001;

////////////////////////////////////////////////////
    var nameObject = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.NameObject_001;
    var nameObjectLen = 0;

    if (nameObject) {
        if (nameObject.length > 0) {
            nameObjectLen = nameObject.length - 1;
        }
    }

////////////////////////////////////////////////////
    var legalObject = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.LegalIdentifierObject_001;
    var legalObjectLen = 0;

    if (legalObject) {
        if (legalObject.length > 0) {
            legalObjectLen = legalObject.length - 1;
        }
    }

////////////////////////////////////////////////////
    var statusObject = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.StatusObject_001;
    var statusObjectLen = 0;

    if (statusObject) {
        if (statusObject.length > 0) {
            statusObjectLen = statusObject.length - 1;
        }
    }

////////////////////////////////////////////////////
    var financialObject = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.FinancialObject_001;
    var financialsArray = [];

    if (financialObject) {
        for (var i = 0; i < financialObject.length; i++) {
            financialsArray[i] = {
                timestamp: financialObject[i].timestamp,
                version: financialObject[i].version,
                type: financialObject[i].type,
                typeValue: financialObject[i].typeValue
            }
        }
    }


////////////////////////////////////////////////////
    var locationObject = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.LocationObject_001;
    var locationsArray = [];

    if (locationObject) {
        for (var i = 0; i < locationObject.length; i++) {
            locationsArray[i] = {
                timestamp: locationObject[i].timestamp,
                version: locationObject[i].version,
                type: locationObject[i].type,
                address: locationObject[i].address,
                addressExt: locationObject[i].addressExt,
                city: locationObject[i].city,
                stateRegion: locationObject[i].stateRegion,
                postalCode: locationObject[i].postalCode,
                countryId: locationObject[i].countryId,
                latitude: locationObject[i].latitude,
                longitude: locationObject[i].longitude
            }
        }
    }


////////////////////////////////////////////////////
    var purposeObject = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.PurposeObject_001;
    var purposesArray = [];

    if (purposeObject) {
        for (var i = 0; i < purposeObject.length; i++) {
            purposesArray[i] = {
                timestamp: purposeObject[i].timestamp,
                version: purposeObject[i].version,
                type: purposeObject[i].type,
                typeValue: purposeObject[i].typeValue
            }
        }
    }


////////////////////////////////////////////////////
    var descriptiveTextObject = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.DescriptiveTextObject_001;
    var descriptiveTextsArray = [];

    if (descriptiveTextObject) {
        for (var i = 0; i < descriptiveTextObject.length; i++) {
            descriptiveTextsArray[i] = {
                timestamp: descriptiveTextObject[i].timestamp,
                version: descriptiveTextObject[i].version,
                type: descriptiveTextObject[i].type,
                typeValue: descriptiveTextObject[i].typeValue
            }
        }
    }

////////////////////////////////////////////////////
    var websitesObject = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.WebsiteObject_001;
    var websitesArray = [];

    if (websitesObject) {
        for (var i = 0; i < websitesObject.length; i++) {
            websitesArray[i] = {
                timestamp: websitesObject[i].timestamp,
                version: websitesObject[i].version,
                type: websitesObject[i].type,
                typeValue: websitesObject[i].typeValue
            }
        }
    }

////////////////////////////////////////////////////
    var instancesArray = [];

    for (var i = 0; i < entityObject.length; i++) {
        instancesArray[i] = {
            timestamp: entityObject[i].timestamp,
            version: entityObject[i].version,
            instanceId: entityObject[i].instanceId,
            instanceCode: entityObject[i].crc,
            name: {
                timestamp: nameObject[nameObjectLen].timestamp,
                version: nameObject[nameObjectLen].version,
                type: nameObject[nameObjectLen].type,
                typeValue: nameObject[nameObjectLen].typeValue
            },
            legalIdentifier: {
                timestamp: legalObject[legalObjectLen].timestamp,
                version: legalObject[legalObjectLen].version,
                type: legalObject[legalObjectLen].type,
                typeValue: legalObject[legalObjectLen].typeValue
            },
            status: {
                timestamp: statusObject[statusObjectLen].timestamp,
                version: statusObject[statusObjectLen].version,
                type: statusObject[statusObjectLen].type,
                typeValue: statusObject[statusObjectLen].typeValue
            },
            financials: financialsArray,
            locations: locationsArray,
            purposes: purposesArray,
            descriptiveTexts: descriptiveTextsArray,
            websites: websitesArray
        }
    }

    var organization = {
        timestamp: entityObject[0].timestamp,
        version: entityObject[0].version,
        orgId: entityObject[0].rootId,
        countryCode: entityObject[0].domicileCountryId,
        instances: instancesArray
    }

    return organization;
}

// Iterate through the object.
// Note that we SHALL wrap the obj JSON string in parentheses for
// the eval for Java 6 to work - or no joy is to be found in this world.
function iterateObject(json) {

    var jsonobj = JSON.parse(json);

    return JSON.stringify(inspectObject(jsonobj));
}
