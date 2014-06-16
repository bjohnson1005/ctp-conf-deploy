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
    "NIL": "nil",
    "STRING": "str",
    "DECIMAL": "dec",
    "DATETIME": "dteime"
}

function genUuid() {
    var id = ids.pop();
    return id;
}

function encryptPrivateData(key) {

    var i, l, hval = 0x811c9dc5;

    for (i = 0, l = key.length; i < l; i++) {
        hval ^= key.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }

    return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
}

function cleanDecimal(newValue) {
    if (newValue == null || newValue == undefined) {
        newValue = "0";
    }

    var newNumValue = parseFloat(newValue.toString());
    if (newNumValue == null || newNumValue == undefined || isNaN(newNumValue)) {
        newNumValue = 0
    }

    return newNumValue;
}

function cleanString(str, isPrivate) {
    var strToReturn = "";

    if (str == null || str == undefined || str.trim() == "")
        strToReturn = Konst.NIL;
    else {
        strToReturn = str;
    }

    if (isPrivate && dataSourceObject.encryptPrivateFields) {
        return encryptPrivateData(strToReturn);
    } else {
        return strToReturn;
    }
}

function addToPo(objectTobeAdded) {
    if (po.domainMatter.domainMatter.EntityMatterObject_001 == null || po.domainMatter.domainMatter.EntityMatterObject_001 == undefined) {
        po.domainMatter.domainMatter["EntityMatterObject_001"] = {
            multiMap: {}
        }
    }

    if (po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[objectTobeAdded.signature] == null || po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[objectTobeAdded.signature] == undefined) {
        po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[objectTobeAdded.signature] = [];
    }

    po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[objectTobeAdded.signature].push(objectTobeAdded);
}

function addToList(objectTobeAdded, list) {
    list.push(objectTobeAdded);
}

function getSequenceByList(list) {

    if (list == null || list == undefined) {
        return 0;
    } else {
        return list.length;
    }
}


function getNewCDMObject(signature, rootId, instanceId, associateId) {
    var CDMObject = cdmObjects[signature];

    if (CDMObject != null || CDMObject != undefined) {
        var newCDMObjectInstance = JSON.parse(JSON.stringify(CDMObject));
        newCDMObjectInstance.rootId = rootId;
        newCDMObjectInstance.instanceId = instanceId;
        newCDMObjectInstance.associateId = associateId;

        return newCDMObjectInstance;
    }
}

function getListByTypeByList(list, type, parentInstanceId){
    var typeList = [];
    if (parentInstanceId == null || parentInstanceId == undefined) {
        parentInstanceId = instanceId;
    }

    if (list != null && list != undefined) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].rootId == rootId
                && list[i].associateId == parentInstanceId
                && list[i].type == type) {
                typeList.push(list[i]);
            }
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

function getObjectByTypeByList(list, type, parentInstanceId){
    var objList = getListByTypeByList(list, type, parentInstanceId);

    if (objList.length > 0) {
        return objList[0];
    } else {
        return null;
    }
}

function findExternalReference(externalReferences, entity, dataSource, dataSourceId) {
    if (externalReferences != null && externalReferences != undefined && dataSourceId != null) {
        for (var i = 0; i < externalReferences.length; i++) {
            var externalReference = externalReferences[i];

            if (externalReference.rootId == entity.rootId
                && externalReference.associateId == entity.instanceId) {
                if (externalReference.type.toLowerCase() == dataSource.toLowerCase()
                    && externalReference.typeValue.toLowerCase() == dataSourceId.toLowerCase()) {

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

        if (entities != null || entities != undefined) {
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

function updateObjectByList(list, signature, type, newValue, isPrivate, newValueDataType, parentInstanceId, onlyUpdateIfNewValue, insertToList){
    if (insertToList == null || insertToList == undefined) {
        insertToList = false;
    }
    if (newValueDataType == null || newValueDataType == undefined) {
        newValueDataType = Konst.STRING;
    }

    if (parentInstanceId == null || parentInstanceId == undefined) {
        parentInstanceId = instanceId;
    }

    if (onlyUpdateIfNewValue == null || onlyUpdateIfNewValue == undefined) {
        onlyUpdateIfNewValue = true;
    }


    var cleanedValue;
    switch (newValueDataType) {
        case Konst.STRING:
            cleanedValue = cleanString(newValue, isPrivate);
            break;
        case Konst.DECIMAL:
            cleanedValue = cleanDecimal(newValue);
            break;
        default :
            cleanedValue = Konst.NIL;
    }


    var doUpdate = true;

    var obj = getObjectByTypeByList(list, type, parentInstanceId);


    if (obj == null || obj == undefined) {
        if (cleanedValue != Konst.NIL || !onlyUpdateIfNewValue) {
            obj = getNewCDMObject(signature, rootId, genUuid(), parentInstanceId);

            if (!insertToList)
                addToPo(obj);
            else
                addToList(obj, list);

        } else
            doUpdate = false;
    }

    if (doUpdate) {
        if (cleanedValue != obj.typeValue || !onlyUpdateIfNewValue) {

            obj.type = type
            obj.typeValue = cleanedValue;
            obj.version = obj.version + 1;
            obj.sequence = getSequenceByList(list);

            return obj;
        }
    }

    return null;
}

function updateObject(signature, type, newValue, isPrivate, newValueDataType, parentInstanceId, onlyUpdateIfNewValue) {
    var list = getListByType(signature, type, parentInstanceId);

    return updateObjectByList(list, signature, type, newValue, isPrivate, newValueDataType, parentInstanceId, onlyUpdateIfNewValue);
}

function setGlobalVars(strmapofvars) {
    var mapofvars = JSON.parse(strmapofvars);

    po = mapofvars.po;
    data = mapofvars.data;
    ids = mapofvars.ids;
    cdmObjects = mapofvars.cdmObjects;
    dataSourceObject = mapofvars.dataSourceObject;
    dataSourceId = mapofvars.dataSourceId;
    tsacNteeMappings = mapofvars.tsacNteeMappings;
}

function iterate(strmapofvars) {

    setGlobalVars(strmapofvars);

    var orgEntity = findEntity(po, "org" + dataSourceObject.dataSource, dataSourceId);

    if (orgEntity == null || orgEntity == undefined) {
        rootId = po.id;
        instanceId = genUuid();
        associateId = instanceId;
        
        var orgEntity = getNewCDMObject(cdmObjects.EntityObject_001.signature, rootId, instanceId, associateId);
        orgEntity.type = "Organization";
        orgEntity.typeValue = "UNKNOWN";

        addToPo(orgEntity);
    } else {
        rootId = orgEntity.rootId;
        instanceId = orgEntity.instanceId;
        associateId = orgEntity.associateId;
    }

    var orgExternalReference = null;

    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined) {
        orgExternalReference = findExternalReference(po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.ExternalReferenceObject_001, orgEntity, "org" + dataSourceObject.dataSource, dataSourceId);
    }

    if (orgExternalReference == null || orgExternalReference == undefined) {
        orgExternalReference = updateObject(cdmObjects.ExternalReferenceObject_001.signature, "org" + dataSourceObject.dataSource, dataSourceId, false, Konst.STRING, instanceId);
        orgExternalReference.typeSource = "onyx";
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

function iterateOrganisationFile(org, source){
    var s = updateObject(cdmObjects.ExternalReferenceObject_001.signature, "ppOrg", org.entity_id, false, Konst.STRING, instanceId);
    if (s != null) {
        s.source = "pp_" + source;
    }

    updateObject(cdmObjects.DescriptiveTextObject_001.signature, "missionStatement", org["mission statement"], false, Konst.STRING, instanceId);
}