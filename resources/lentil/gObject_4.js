////////////////////////////////////////////////////////////////////////////
// TRANSFORMER SCRIPT STARTS HERE ...
////////////////////////////////////////////////////////////////////////////
// This is the script to test with !!!
/**
 * gObject_4.js
 * Created by wallj on 01/09/13.
 */


//Inspect the object and transform as needed.
function inspectObject(jsonobj) {

////////////////////////////////////////////////////
    var entity_object = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.EntityObject_001;

////////////////////////////////////////////////////
    var name_object = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.NameObject_001;
    var nameObjectLen = 0;

    if (name_object) {
        if (name_object.length > 0) {
            nameObjectLen = name_object.length - 1;
        }
    }

////////////////////////////////////////////////////
    var legal_object = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.LegalIdentifierObject_001;
    var legalObjectLen = 0;

    if (legal_object) {
        if (legal_object.length > 0) {
            legalObjectLen = legal_object.length - 1;
        }
    }

////////////////////////////////////////////////////
    var status_object = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.StatusObject_001;
    var statusObjectLen = 0;

    if (status_object) {
        if (status_object.length > 0) {
            statusObjectLen = status_object.length - 1;
        }
    }

////////////////////////////////////////////////////
    var financial_object = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.FinancialObject_001;
    var financialsArray = [];

    if (financial_object) {
        for (var i = 0; i < financial_object.length; i++) {
            financialsArray[i] = {
                timestamp: financial_object[i].timestamp,
                version: financial_object[i].version,
                type: financial_object[i].type,
                type_value: financial_object[i].typeValue
            }
        }
    }


////////////////////////////////////////////////////
    var location_object = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.LocationObject_001;
    var locationsArray = [];

    if (location_object) {
        for (var i = 0; i < location_object.length; i++) {
            locationsArray[i] = {
                timestamp: location_object[i].timestamp,
                version: location_object[i].version,
                type: location_object[i].type,
                address: location_object[i].address,
                address_ext: location_object[i].addressExt,
                city: location_object[i].city,
                state_region: location_object[i].stateRegion,
                postal_code: location_object[i].postalCode,
                country_id: location_object[i].countryId,
                latitude: location_object[i].latitude,
                longitude: location_object[i].longitude
            }
        }
    }


////////////////////////////////////////////////////
    var purpose_object = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.PurposeObject_001;
    var purposesArray = [];

    if (purpose_object) {
        for (var i = 0; i < purpose_object.length; i++) {
            purposesArray[i] = {
                timestamp: purpose_object[i].timestamp,
                version: purpose_object[i].version,
                type: purpose_object[i].type,
                type_value: purpose_object[i].typeValue
            }
        }
    }


////////////////////////////////////////////////////
    var descriptive_text_object = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.DescriptiveTextObject_001;
    var descriptiveTextsArray = [];

    if (descriptive_text_object) {
        for (var i = 0; i < descriptive_text_object.length; i++) {
            descriptiveTextsArray[i] = {
                timestamp: descriptive_text_object[i].timestamp,
                version: descriptive_text_object[i].version,
                type: descriptive_text_object[i].type,
                type_value: descriptive_text_object[i].typeValue
            }
        }
    }

////////////////////////////////////////////////////
    var websites_object = jsonobj.domainMatter.domainMatter.EntityMatterObject_001.multiMap.WebsiteObject_001;
    var websitesArray = [];

    if (websites_object) {
        for (var i = 0; i < websites_object.length; i++) {
            
             // Repair the website type if value === nil
            if( websites_object[i].typeValue === ' ') {
                websites_object[i].typeValue = 'nil';
            }

            if( websites_object[i].typeValue != 'nil') {
                websites_object[i].type = 'main';
            }

            websitesArray[i] = {
                timestamp: websites_object[i].timestamp,
                version: websites_object[i].version,
                type: websites_object[i].type,
                type_value: websites_object[i].typeValue
            }
        }
    }

////////////////////////////////////////////////////
    var instancesArray = [];

    for (var i = 0; i < entity_object.length; i++) {

        instancesArray[i] = {
            timestamp: entity_object[i].timestamp,
            version: entity_object[i].version,
            org_id: entity_object[0].rootId,
            country_code: entity_object[0].domicileCountryId,
            instance_id: entity_object[i].instanceId,
            instance_code: entity_object[i].crc,
            name: {
                timestamp: name_object[nameObjectLen].timestamp,
                version: name_object[nameObjectLen].version,
                type: name_object[nameObjectLen].type,
                type_value: name_object[nameObjectLen].typeValue
            },
            legal_identifier: {
                timestamp: legal_object[legalObjectLen].timestamp,
                version: legal_object[legalObjectLen].version,
                type: legal_object[legalObjectLen].type,
                type_value: legal_object[legalObjectLen].typeValue
            },
            status: {
                timestamp: status_object[statusObjectLen].timestamp,
                version: status_object[statusObjectLen].version,
                type: status_object[statusObjectLen].type,
                type_value: status_object[statusObjectLen].typeValue
            },
            financials: financialsArray,
            locations: locationsArray,
            purposes: purposesArray,
            descriptive_texts: descriptiveTextsArray,
            websites: websitesArray
        }
    }

    var organization = {

        timestamp: entity_object[0].timestamp,
        version: entity_object[0].version,
        org_id: entity_object[0].rootId,
        country_code: entity_object[0].domicileCountryId,
        instance_id: entity_object[0].instanceId,
        instance_code: entity_object[0].crc,
        name: {
            timestamp: name_object[nameObjectLen].timestamp,
            version: name_object[nameObjectLen].version,
            type: name_object[nameObjectLen].type,
            type_value: name_object[nameObjectLen].typeValue
        },
        legal_identifier: {
            timestamp: legal_object[legalObjectLen].timestamp,
            version: legal_object[legalObjectLen].version,
            type: legal_object[legalObjectLen].type,
            type_value: legal_object[legalObjectLen].typeValue
        },
        status: {
            timestamp: status_object[statusObjectLen].timestamp,
            version: status_object[statusObjectLen].version,
            type: status_object[statusObjectLen].type,
            type_value: status_object[statusObjectLen].typeValue
        },
        financials: financialsArray,
        locations: locationsArray,
        purposes: purposesArray,
        descriptive_texts: descriptiveTextsArray,
        websites: websitesArray
    }

    return organization;
}

// Iterate through the object.
// Note that we SHALL wrap the obj JSON string in parentheses for
// the eval for Java 6 to work - or no joy is to be found in this world.
function iterateObject(json) {

    var jsonobj = JSON.parse(json);

	// Obviously, returns the JSON string of the
	// transformed object.
   	return JSON.stringify(inspectObject(jsonobj));
     
}

////////////////////////////////////////////////////////////////////////////
// TRANSFORMER SCRIPT ENDS HERE ...
////////////////////////////////////////////////////////////////////////////