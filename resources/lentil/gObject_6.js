////////////////////////////////////////////////////////////////////////////
// TRANSFORMER SCRIPT STARTS HERE ...
////////////////////////////////////////////////////////////////////////////
// This is the script to test with !!!
/**
 * gObject_4.js
 * Created by wallj on 01/09/13.
 */

var po;

function getListByTypeByList(list, type, parentInstanceId){
    var typeList = [];

    if (list != null && list != undefined) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].associateId == parentInstanceId
                && list[i].type == type) {
                typeList.push(list[i]);
            }
        }
    }

    return typeList;

}

function getListByTypeAndTypeValueByList(list, type, typeValue, parentInstanceId){
    var typeList = [];

    if (list != null && list != undefined) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].associateId == parentInstanceId
                && list[i].type == type
                && list[i].typeValue == typeValue) {
                typeList.push(list[i]);
            }
        }
    }

    return typeList;

}

function getListByParentInstanceIdByList(list, parentInstanceId){
    var typeList = [];

    if (list != null && list != undefined) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].associateId == parentInstanceId) {
                typeList.push(list[i]);
            }
        }
    }

    return typeList;

}

function getListByTypeAndTypeValue(signature, type, typeValue, parentInstanceId) {
    var list = null;
    var typeList = [];

    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined) {

        list = po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[signature];

        if (list != null && list != undefined) {
            typeList = getListByTypeAndTypeValueByList(list, type, typeValue, parentInstanceId);
        }

    }

    return typeList;
}

function getListByType(signature, type, parentInstanceId) {
    var list = null;
    var typeList = [];

    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined) {

        list = po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[signature];

        if (list != null && list != undefined) {
            typeList = getListByTypeByList(list, type, parentInstanceId)
        }

    }

    return typeList;
}

function getListByParentInstanceId(signature, parentInstanceId) {
    var list = null;
    var typeList = [];

    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined) {

        list = po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[signature];

        if (list != null && list != undefined) {
            typeList = getListByParentInstanceIdByList(list, parentInstanceId);
        }

    }

    return typeList;
}

function getObjectByTypeByList(list, type, parentInstanceId){
    var objList = getListByTypeByList(list, type, parentInstanceId);

    if (objList.length > 0) {
        return objList[0];
    } else {
        return null;
    }
}

function getObjectByType(signature, type, parentInstanceId) {
    var objList = getListByType(signature, type, parentInstanceId);

    if (objList.length > 0) {
        return objList[0];
    } else {
        return null;
    }
}

function returnTrimmedList(list){
    var newList = [];

    if (list) {
        for (var i = 0; i < list.length; i++) {
            newList[i] = {
                timestamp: list[i].timestamp,
                version: list[i].version,
                type: list[i].type,
                type_value: list[i].typeValue
            }
        }
    }

    return newList;
}

function returnTrimmedLocationList(location_object){
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

    return locationsArray;
}

function returnOnlyInstanceIdList(list){
    var newList = [];

    if (list){
        for (var i=0; i < list.length; i++){
            newList[i] = list[i].crc;
        }

    }

    return newList;
}

function websiteClean(list){
    var newList = [];

    if (list){
        for (var i = 0; i < list.length; i++){
            // Repair the website type if value === nil
            if( list[i].type_value === ' ') {
                list[i].type_value = 'nil';
            }

            if( list[i].type_value != 'nil' && list[i].type == 'nil') {
                list[i].type = 'main';
            }

            if (list[i].typeValue != 'nil' && list[i].type_value.trim() != ""){
                newList[i] = list[i];
            }

        }
    }

    return newList;
}

//Inspect the object and transform as needed.
function inspectObject() {

////////////////////////////////////////////////////
    var entity_object = po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.EntityObject_001;

    var parentInstanceId = null;

    for (var index in entity_object){
        var e = entity_object[index];
        if (e.type == "Organization" && (e.typeValue == "NPO" || e.typeValue == "LIB"))
            parentInstanceId = e.instanceId
    }

    var NPO_entity_object = getObjectByType("EntityObject_001","Organization", parentInstanceId);
    var NPO_name_object = getObjectByType("NameObject_001","legalName", NPO_entity_object.instanceId);
    var NPO_status_object = getObjectByType("StatusObject_001","main", NPO_entity_object.instanceId);
    var NPO_legalIdentifier_object = {};

    var listLegalIds = getListByParentInstanceId("LegalIdentifierObject_001", NPO_entity_object.instanceId);
    if (listLegalIds != null && listLegalIds != undefined && listLegalIds.length > 0){
        NPO_legalIdentifier_object = listLegalIds[0];
    }

    var NPO_financial_object_list = getListByParentInstanceId("FinancialObject_001", NPO_entity_object.instanceId);
    var NPO_location_object_list = getListByParentInstanceId("LocationObject_001", NPO_entity_object.instanceId);
    var NPO_purpose_object_list = getListByParentInstanceId("PurposeObject_001", NPO_entity_object.instanceId);
    var NPO_descriptiveText_object_list = getListByParentInstanceId("DescriptiveTextObject_001", NPO_entity_object.instanceId);
    var NPO_websites_object_list = getListByParentInstanceId("WebsiteObject_001", NPO_entity_object.instanceId);
    var NPO_agent_list = getListByTypeAndTypeValue("EntityObject_001", "Person", "AGENT", NPO_entity_object.instanceId);


////////////////////////////////////////////////////
    var organization = {

        timestamp: NPO_entity_object.timestamp,
        version: NPO_entity_object.version,
        org_id: NPO_entity_object.rootId,
        country_code: NPO_entity_object.domicileCountryId,
        instance_id: NPO_entity_object.instanceId,
        instance_code: NPO_entity_object.crc,
        instance_handle: NPO_entity_object.handle,
        name: {
            timestamp: NPO_name_object.timestamp,
            version: NPO_name_object.version,
            type: NPO_name_object.type,
            type_value: NPO_name_object.typeValue
        },
        legal_identifier: {
            timestamp: NPO_legalIdentifier_object.timestamp,
            version: NPO_legalIdentifier_object.version,
            type: NPO_legalIdentifier_object.type,
            type_value: NPO_legalIdentifier_object.typeValue
        },
        status: {
            timestamp: NPO_status_object.timestamp,
            version: NPO_status_object.version,
            type: NPO_status_object.type,
            type_value: NPO_status_object.typeValue
        },
        financials: returnTrimmedList(NPO_financial_object_list),
        locations: returnTrimmedLocationList(NPO_location_object_list),
        purposes: returnTrimmedList(NPO_purpose_object_list),
        descriptive_texts: returnTrimmedList(NPO_descriptiveText_object_list),
        websites: websiteClean(returnTrimmedList(NPO_websites_object_list)),
        agents: returnOnlyInstanceIdList(NPO_agent_list)

    }

    return organization;
}

// Iterate through the object.
// Note that we SHALL wrap the obj JSON string in parentheses for
// the eval for Java 6 to work - or no joy is to be found in this world.
function iterateObject(json) {
    po = JSON.parse(json);

	// Obviously, returns the JSON string of the
	// transformed object.
   	return JSON.stringify(inspectObject());
     
}

////////////////////////////////////////////////////////////////////////////
// TRANSFORMER SCRIPT ENDS HERE ...
////////////////////////////////////////////////////////////////////////////