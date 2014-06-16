var rootId;
var instanceId;
var associateId;
var ids;
var cdmObjects;
var po;
var data;
var dataSourceObject;
var dataSourceId;
var tsacNteeMappings;

var Konst = {
    "NIL" : "nil",
    "STRING": "str",
    "DECIMAL": "dec",
    "DATETIME": "dteime"
}

function genUuid(){
    var id = ids.pop();
    return id;
}

function encryptPrivateData(key){

    var i, l, hval = 0x811c9dc5;

    for (i = 0, l = key.length; i < l; i++) {
        hval ^= key.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }

    return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
}

function lookUpNteeCode(tsac){
    var bestMatch = Konst.NIL;

    if (tsacNteeMappings[tsac] != null && tsacNteeMappings[tsac] != undefined){
        bestMatch = tsacNteeMappings[tsac];
    }

    return bestMatch;
}

function lookupNteeCodeTopLevelGroup(tsac){
    var bestMatch = lookUpNteeCode(tsac);
    var primary = Konst.NIL;

    if (!bestMatch != Konst.NIL){
        primary = bestMatch.substring(0,1);

    }

    return primary;
}

function cleanDecimal(newValue){
    if (newValue == null || newValue == undefined){
        newValue = "0";
    }

    var newNumValue = parseFloat(newValue.toString());
    if (newNumValue == null || newNumValue == undefined || isNaN(newNumValue)){
        newNumValue = 0
    }

    return newNumValue;
}

function cleanString(str, isPrivate){
    var strToReturn = "";

    if (str == null || str == undefined || str.trim() == "")
        strToReturn = Konst.NIL;
    else{
        strToReturn = str;
    }

    if (isPrivate && dataSourceObject.encryptPrivateFields){
        return encryptPrivateData(strToReturn);
    } else {
        return strToReturn;
    }
}


// parse a date in yyyy-mm-dd format
function parseDate(input) {
    var parts = input.split('-');

    return new Date(parts[0], parts[1], parts[2].substr(0, 2)); // Note: months are 0-based
}


function getNewCDMObject(signature, rootId, instanceId, associateId){
    var CDMObject = cdmObjects[signature];

    if (CDMObject != null || CDMObject != undefined){
        var newCDMObjectInstance = JSON.parse(JSON.stringify(CDMObject));
        newCDMObjectInstance.rootId = rootId;
        newCDMObjectInstance.instanceId = instanceId;
        newCDMObjectInstance.associateId = associateId;

        return newCDMObjectInstance;
    }
}

function getListByType(list, type, parentInstanceId){
    var typeList = [];

    if (list != null && list != undefined){
        for (var i=0; i < list.length; i++){
            if (list[i].rootId == rootId
                && list[i].associateId == parentInstanceId
                && list[i].type == type){
                typeList.push(list[i]);
            }
        }
    }

    return typeList;
}

function addToPo(objectTobeAdded){
    if (po.domainMatter.domainMatter.EntityMatterObject_001 == null || po.domainMatter.domainMatter.EntityMatterObject_001 == undefined) {
        po.domainMatter.domainMatter["EntityMatterObject_001"] = {
            multiMap : {}
        }
    }

    if (po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[objectTobeAdded.signature] == null || po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[objectTobeAdded.signature] == undefined){
        po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[objectTobeAdded.signature] = [];
    }

    po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[objectTobeAdded.signature].push(objectTobeAdded);
}

function getSequence(signature){
    var sequence = 0;
    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null
        && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined
        && po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[signature] !=null
        && po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[signature] != undefined) {
        sequence = getSequenceByList(po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[signature]);
    }

    return sequence;
}

function getSequenceByList(list){

    if (list == null || list == undefined){
        return 0;
    } else {
        return list.length;
    }
}

function getInstanceIdByType(signature, type, parentInstanceId){
    var latestObject = getLatestVersionOfObject(signature, type, parentInstanceId);

    if (latestObject == null || latestObject == undefined) {
        return genUuid();
    } else {
        return latestObject.instanceId;
    }
}

function getInstanceIdByList(list, type, parentInstanceId){
    var latestObject = getLatestVersionOfObjectByList(list, type, parentInstanceId);

    if (latestObject == null || latestObject == undefined){
        return genUuid();
    } else {
        return latestObject.instanceId;
    }
}

function checkLatestObjectTypeValue(signature, type, parentInstanceId, newTypeValue){
    var latestObject = getLatestVersionOfObject(signature, type, parentInstanceId);

    if (latestObject != null && latestObject != undefined) {
        if(latestObject.typeValue == newTypeValue)   {
            return true;
        }

        if (typeof newTypeValue == "string" && newTypeValue.trim() == "" && latestObject.typeValue.trim() == ""){
            return true;
        }
    }

    return false;
}

function checkLatestObjectTypeValueByList(list, type, parentInstanceId, newTypeValue){
    if (newTypeValue != null){
        var latestObject = getLatestVersionOfObjectByList(list, type, parentInstanceId);

        if (latestObject != null && latestObject != undefined) {
            if(latestObject.typeValue == newTypeValue)   {
                return true;
            }

            if (typeof newTypeValue == "string" && newTypeValue.trim() == "" && latestObject.typeValue.trim() == ""){
                return true;
            }
        }

        return false;
    } else {
        return true;
    }
}

function getVersion(signature, type, parentInstanceId){
    var latestObject = getLatestVersionOfObject(signature, type, parentInstanceId);

    if (latestObject == null || latestObject == undefined) {
        return 0;
    } else {
        return latestObject.version + 1;
    }
}

function getVersionByList(list, type, parentInstanceId){
    var latestObject = getLatestVersionOfObjectByList(list, type, parentInstanceId);

    if (latestObject == null || latestObject == undefined) {
        return 0;
    } else {
        return latestObject.version + 1;
    }
}

function getLatestVersionOfObject(signature, type, parentInstanceId){
    var returnObject = null;

    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined) {
        if (parentInstanceId == null || parentInstanceId == undefined) {
            parentInstanceId = instanceId;
        }

        var list = getListByType(po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[signature], type, parentInstanceId);

        returnObject = getLatestVersionOfObjectByList(list, type, parentInstanceId);
    }


    return returnObject;
}

function getLatestVersionOfObjectByList(list, type, parentInstanceId){
    var version = -1;
    var returnObject = null;

    for (var i = 0; i < list.length; i++) {
        if (list[i].version > version) {
            version = list[i].version;
            returnObject = list[i];
        }
    }

    if (version == -1) {
        return null;
    } else {
        return returnObject;
    }
}

function findExternalReference(externalReferences, entity, dataSource, dataSourceId){
    if (externalReferences != null && externalReferences != undefined && dataSourceId != null){
        for (var i=0; i < externalReferences.length; i++){
            var externalReference = externalReferences[i];

            if (externalReference.rootId == entity.rootId
                && externalReference.associateId == entity.instanceId){
                if (externalReference.type.toLowerCase() == dataSource.toLowerCase()
                    && externalReference.typeValue.toLowerCase() == dataSourceId.toLowerCase()){

                    return externalReference;
                }
            }
        }
    }

    return null;
}

function findEntity(po, dataSource, dataSourceId) {
    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined) {
        var entities = po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.EntityObject_001;

        if (entities != null || entities != undefined){
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];

                var externalReferences = po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.ExternalReferenceObject_001;

                if (externalReferences.length > 0) {
                    if (findExternalReference(externalReferences, entity, dataSource, dataSourceId) != null) {
                        return entity;
                    }
                }
            }
        }
    }

    return null;
}

function createCDMEntry(signature, type, newValue, isPrivate, newValueType, parentInstanceId){
    if (newValueType == null || newValueType == undefined){
        newValueType = Konst.STRING;
    }

    if (parentInstanceId == null || parentInstanceId == undefined){
        parentInstanceId = instanceId;
    }


    if (!checkLatestObjectTypeValue(signature, type, parentInstanceId, newValue)){
        var obj = getNewCDMObject(signature, rootId, getInstanceIdByType(signature, type, parentInstanceId), parentInstanceId);
        obj.type = type;

        switch (newValueType){
            case Konst.STRING: obj.typeValue = cleanString(newValue,isPrivate); break;
            case Konst.DECIMAL: obj.typeValue = cleanDecimal(newValue); break;
            default : obj.typeValue = Konst.NIL;
        }


        obj.version = getVersion(signature, obj.type, parentInstanceId);
        obj.sequence = getSequence(signature);

        addToPo(obj);
    }
}

function setGlobalVars(strmapofvars){
    var mapofvars = JSON.parse(strmapofvars);

    po = mapofvars.po;
    data = mapofvars.data;
    ids = mapofvars.ids;
    cdmObjects = mapofvars.cdmObjects;
    dataSourceObject = mapofvars.dataSourceObject;
    dataSourceId = mapofvars.dataSourceId;
    tsacNteeMappings = mapofvars.tsacNteeMappings;
}



function iterateOrganisationFile(org, source){

   if (!checkLatestObjectTypeValue(cdmObjects.ExternalReferenceObject_001.signature, "ppOrg", instanceId, org.entity_id)){
       var obj = getNewCDMObject(cdmObjects.ExternalReferenceObject_001.signature, rootId, getInstanceIdByType(cdmObjects.ExternalReferenceObject_001.signature, "ppOrg", instanceId), instanceId);
        obj.type = "ppOrg";
        obj.typeValue = cleanString(org.entity_id.toString(), false);
        obj.typeSource = "pp_" + source;
        obj.version = getVersion(cdmObjects.ExternalReferenceObject_001.signature,"ppOrg", obj.instanceId);
        obj.sequence = getSequence(cdmObjects.ExternalReferenceObject_001.signature);
        addToPo(obj);
    }

      createCDMEntry(cdmObjects.DescriptiveTextObject_001.signature, "missionStatement", org["mission statement"], false);
}



function iterate(strmapofvars) {
    setGlobalVars(strmapofvars);

    var orgEntity = findEntity(po, "org" + dataSourceObject.dataSource, dataSourceId);

    if (orgEntity == null || orgEntity == undefined){
        rootId = po.id;
        instanceId = genUuid();
        associateId = instanceId;

        orgEntity = getNewCDMObject(cdmObjects.EntityObject_001.signature, rootId, instanceId, associateId);
        orgEntity.type = "Organization";
        orgEntity.typeValue = "UNKNOWN";
        orgEntity.domicileCountryId = Konst.NIL;
        orgEntity.version = getVersion(cdmObjects.EntityObject_001.signature, orgEntity.type);
        orgEntity.sequence = getSequence(cdmObjects.EntityObject_001.signature);

        addToPo(orgEntity);
    } else {
        rootId = orgEntity.rootId;
        instanceId = orgEntity.instanceId;
        associateId = orgEntity.associateId;
    }

    var orgExternalReference = null;

    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined){
        orgExternalReference = findExternalReference(po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.externalReferences, orgEntity, "org" + dataSourceObject.dataSource, dataSourceId);
    }

    if (orgExternalReference == null || orgExternalReference == undefined){
        orgExternalReference = getNewCDMObject(cdmObjects.ExternalReferenceObject_001.signature, rootId, genUuid() , instanceId);
        orgExternalReference.type = "org" + dataSourceObject.dataSource;
        orgExternalReference.typeValue = dataSourceId;
        orgExternalReference.typeSource = "onyx";
        orgExternalReference.version = getVersion(cdmObjects.ExternalReferenceObject_001.signature, orgExternalReference.type);
        orgExternalReference.sequence = getSequence(cdmObjects.ExternalReferenceObject_001.signature);

        addToPo(orgExternalReference)
    }

    if (data != null && data != undefined){
        for (var key in data){
            var source = key.substring(key.indexOf(".") - 2, key.length - 4) ;
            if (data[key].length >0){
                for (var i=0; i < data[key].length; i++){
                    iterateOrganisationFile(data[key][i], source);
                }
            }

        }
    }

    return JSON.stringify(po);
}