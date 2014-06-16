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

function lookUpNteeCode(tsac) {
    var bestMatch = Konst.NIL;

    if (tsacNteeMappings[tsac] != null && tsacNteeMappings[tsac] != undefined) {
        bestMatch = tsacNteeMappings[tsac];
    }

    return bestMatch;
}

function lookupNteeCodeTopLevelGroup(tsac) {
    var bestMatch = lookUpNteeCode(tsac);
    var primary = Konst.NIL;

    if (!bestMatch != Konst.NIL) {
        primary = bestMatch.substring(0, 1);

    }

    return primary;
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


// parse a date in yyyy-mm-dd format
function parseDate(input) {
    var parts = input.split('-');

    return new Date(parts[0], parts[1], parts[2].substr(0, 2)); // Note: months are 0-based
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


function getSequence(signature) {
    var sequence = 0;
    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null
        && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined
        && po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[signature] != null
        && po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[signature] != undefined) {
        sequence = getSequenceByList(po.domainMatter.domainMatter.EntityMatterObject_001.multiMap[signature]);
    }

    return sequence;
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

function getObjectByType(signature, type, parentInstanceId) {
    var objList = getListByType(signature, type, parentInstanceId);

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

function countNumberOfContacts(){
    var contacts = {};
    var count = 0;
    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined){
        if (po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.EntityObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.EntityObject_001 != undefined){
            for (var index in po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.EntityObject_001){
                var entity = po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.EntityObject_001[index];
                if (entity.type == "Person"){
                    if (contacts[entity.instanceId] == null
                        || contacts[entity.instanceId] == undefined){
                        contacts[entity.instanceId] = entity;
                        count ++;
                    }
                }
            }
        }
    }

    return count;
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

    if (data["Orgs.csv"] != null && data["Orgs.csv"] != undefined)
        for (var i = 0; i < data["Orgs.csv"].length; i++) {
            iterateOrganisationFile(data["Orgs.csv"][i]);
        }

    if (data["Locations.csv"] != null && data["Locations.csv"] != undefined)
        for (var i = 0; i < data["Locations.csv"].length; i++) {
            iterateLocationFile(data["Locations.csv"][i]);
        }

     if (data["Contacts.csv"] != null && data["Contacts.csv"] != undefined)
     for (var i=0; i<data["Contacts.csv"].length; i++){
     iterateContactFile(data["Contacts.csv"][i]);
     }


     if (data["Orders.csv"] != null && data["Orders.csv"] != undefined)
     for (var i=0; i<data["Orders.csv"].length; i++){
       iterateOrderFile(data["Orders.csv"][i]);
     }


    return JSON.stringify(po);
}

function iterateOrganisationFile(org) {
    var e = updateObject(cdmObjects.EntityObject_001.signature, "Organization", org.typeEntity, false, Konst.STRING, instanceId);
    if (e != null) {
        e.domicileCountryId = cleanString(org.domicileCountryId, false);
    }

    var s = updateObject(cdmObjects.StatusObject_001.signature, "main", org.status, false, Konst.STRING, instanceId);
    if (s != null) {
        var dte = parseDate(org.statusDate.toString()).getTime();
        s.timestamp = dte;
    }

    updateObject(cdmObjects.NameObject_001.signature, "legalName", org.legalName, false, Konst.STRING, instanceId);
    updateObject(cdmObjects.FinancialObject_001.signature, "operatingBudget", org.operatingBudget, false, Konst.DECIMAL, instanceId);
    updateObject(cdmObjects.LegalIdentifierObject_001.signature, org.identifierType, org.identifier, false, Konst.STRING, instanceId);
    updateObject(cdmObjects.PurposeObject_001.signature, "priActivity", org.missionMain, false, Konst.STRING, instanceId);
    updateObject(cdmObjects.PurposeObject_001.signature, "subActivity", org.missionSub, false, Konst.STRING, instanceId);
    updateObject(cdmObjects.PurposeObject_001.signature, "priActivityNTEE", lookupNteeCodeTopLevelGroup(org.missionSub), false, Konst.STRING, instanceId);
    updateObject(cdmObjects.PurposeObject_001.signature, "subActivityNTEE", lookUpNteeCode(org.missionSub), false, Konst.STRING, instanceId);
    updateObject(cdmObjects.EmailObject_001.signature, org.typeEmail, org.orgEmail, false, Konst.STRING, instanceId);
    updateObject(cdmObjects.WebsiteObject_001.signature, org.typeWebsite, org.website, false, Konst.STRING, instanceId);
}

function iterateLocationFile(location) {
    var locationObject = updateObject(cdmObjects.LocationObject_001.signature, location.locationType, Konst.NIL, false, Konst.STRING, instanceId, false);

    var doAdd = true;

    if (locationObject != null && locationObject != undefined) {
        if (locationObject.address == cleanString(location.address1, false)
            && locationObject.addressExt == cleanString(location.address2, false)
            && locationObject.city == cleanString(location.city, false)
            && locationObject.stateRegion == cleanString(location.stateRegion, false)
            && locationObject.postalCode == cleanString(location.postalCode, false)
            && locationObject.countryId == cleanString(location.countryId, false)) {

            doAdd = false;
        }
    }

    if (doAdd) {
        locationObject.type = cleanString(location.locationType, false);
        locationObject.address = cleanString(location.address1, false);
        locationObject.addressExt = cleanString(location.address2, false);
        locationObject.city = cleanString(location.city, false);
        locationObject.stateRegion = cleanString(location.stateRegion, false);
        locationObject.postalCode = cleanString(location.postalCode, false);
        locationObject.countryId = cleanString(location.countryId, false);
    }
}

function iterateContactFile(contact) {
    if (contact.contactOnyxId != null){
        var contactEntity = findEntity(po, dataSourceObject.dataSource + "Contact", contact.contactOnyxId);
        if (contactEntity == null){
            contactEntity = getNewCDMObject(cdmObjects.EntityObject_001.signature, rootId, genUuid(), instanceId);
            contactEntity.type = "Person";
            contactEntity.typeValue = "CONTACT_" + countNumberOfContacts();
            contactEntity.sequence = getSequence(cdmObjects.EntityObject_001.signature);
            contactEntity.version = 1;

            addToPo(contactEntity);
        }

        var contactExternalReference = null;
        if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined) {
            contactExternalReference = findExternalReference(po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.ExternalReferenceObject_001, contactEntity, dataSourceObject.dataSource + 'Contact', contact.contactOnyxId);
        }

        if (contactExternalReference == null || contactExternalReference == undefined) {
            contactExternalReference = updateObject(cdmObjects.ExternalReferenceObject_001.signature, dataSourceObject.dataSource + "Contact", cleanString(contact.contactOnyxId), false, Konst.STRING, contactEntity.instanceId);
            contactExternalReference.typeSource = "onyx";
        }

        updateObject(cdmObjects.NameObject_001.signature, "firstName", contact.firstName, false, Konst.STRING, contactEntity.instanceId);
        updateObject(cdmObjects.NameObject_001.signature, "lastName", contact.lastName, false, Konst.STRING, contactEntity.instanceId);
        updateObject(cdmObjects.EmailObject_001.signature, "main", contact.email, false, Konst.STRING, contactEntity.instanceId);
        updateObject(cdmObjects.DescriptiveTextObject_001.signature, "designation", contact.title, false, Konst.STRING, contactEntity.instanceId);

    }
}

function iterateOrderFile(order) {
    var orderObject = null;

    if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined){
        var ordersList = po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.OrderObject_001;

        if (ordersList != null && ordersList != undefined){
            for (var i=0; i < ordersList.length; i++){
                var externalReferences = ordersList[i].externalReferences;
                for (var j=0; j < externalReferences.length; j++){
                    if (externalReferences[j].type == "onyxOrderId"
                        && externalReferences[j].typeValue == order.orderId){

                        orderObject = ordersList[i];

                        break;
                    }
                }

                if (orderObject != null){
                    break;
                }
            }
        }
    }

    if (orderObject == null){
        orderObject = getNewCDMObject(cdmObjects.OrderObject_001.signature, rootId, genUuid(), instanceId);
        orderObject.orderId = genUuid();
        addToPo(orderObject);
    }

    orderObject.version = orderObject.version + 1;
    orderObject.sequence = getSequence(cdmObjects.OrderObject_001.signature);

    var retObject = updateObjectByList(orderObject.externalReferences, cdmObjects.ExternalReferenceObject_001.signature, "onyxOrderId", order.orderId.toString(), false, Konst.STRING, orderObject.instanceId, false, true);
    if (retObject != null){
        retObject.typeSource = "onyx";
    }

    updateObjectByList(orderObject.status, cdmObjects.StatusObject_001.signature, "orderStatus", order.status, false, Konst.STRING, orderObject.instanceId, false, true);

    if (order.orderDate != null && order.orderDate != undefined)
        updateObjectByList(orderObject.dates, cdmObjects.DateObject_001.signature, "orderDate", order.orderDate.replace("+0000",'GMT'), false, Konst.STRING, orderObject.instanceId, false, true);

    if (order.fulfillmentDate != null && order.fulfillmentDate != undefined)
        updateObjectByList(orderObject.dates, cdmObjects.DateObject_001.signature, "fulfillmentDate", order.fulfillmentDate.replace("+0000",'GMT'), false, Konst.STRING, orderObject.instanceId, false, true);

    var lineItem = null;

    if (orderObject.lineItems != null && orderObject.lineItems != undefined && orderObject.lineItems.length > 0){
        for (var i=0; i < orderObject.lineItems.length; i++){
            if (orderObject.lineItems[i].identifications != null && orderObject.lineItems[i].identifications != undefined && orderObject.lineItems[i].identifications.length > 0){
                for (var j=0; j < orderObject.lineItems[i].identifications.length; j++){
                    if (orderObject.lineItems[i].identifications[j].type == "itemId" && orderObject.lineItems[i].identifications[j].typeValue == order.itemId){
                        lineItem = orderObject.lineItems[i];
                        break;
                    }
                }
            }

            if (lineItem != null){
                break;
            }
        }
    }

    if (lineItem == null){
        lineItem = getNewCDMObject(cdmObjects.LineItemObject_001.signature, rootId, genUuid(), orderObject.instanceId);
        lineItem.sequence = getSequenceByList(orderObject.lineItems);

        var item = lineItem.item;
        item.rootId = rootId;
        item.instanceId = genUuid();
        item.associateId = lineItem.instanceId;

        var offering = lineItem.offering;
        offering.rootId = rootId;
        offering.instanceId = genUuid();
        offering.associateId = lineItem.instanceId;

        orderObject.lineItems.push(lineItem);
    }

    lineItem.version = lineItem.version + 1;
    lineItem.sequence = getSequenceByList(orderObject.lineItems);

    orderObject.lineItems.quantity = cleanDecimal(order.quantity);

    updateObjectByList(lineItem.status, cdmObjects.StatusObject_001.signature, "orderStatus", order.status, false, Konst.STRING, lineItem.instanceId, false, true);
    if (order.fulfillmentDate != null && order.fulfillmentDate != undefined)
        updateObjectByList(lineItem.dates, cdmObjects.DateObject_001.signature, "fulfillmentDate", order.fulfillmentDate.replace("+0000",'GMT'), false, Konst.STRING, lineItem.instanceId, false, true);
    updateObjectByList(lineItem.financials, cdmObjects.FinancialObject_001.signature, "price", order.price, false, Konst.DECIMAL, lineItem.instanceId, false, true);
    updateObjectByList(lineItem.financials, cdmObjects.FinancialObject_001.signature, "extendedPrice", order.extendedPrice, false, Konst.DECIMAL, lineItem.instanceId, false, true);

    var item = lineItem.item;
    item.version = item.version + 1;

    updateObjectByList(item.identifications, cdmObjects.IdentificationObject_001.signature, "itemId", order.itemId, false, Konst.STRING, item.instanceId, false, true);
    updateObjectByList(item.names, cdmObjects.NameObject_001.signature, "itemName", order.itemName, false, Konst.STRING, item.instanceId, false, true);
    updateObjectByList(item.details, cdmObjects.DetailObject_001.signature, "typeItemLicense", order.typeItemLicense, false, Konst.STRING, item.instanceId, false, true);
    updateObjectByList(item.details, cdmObjects.DetailObject_001.signature, "availability", order.availability, false, Konst.STRING, item.instanceId, false, true);
    updateObjectByList(item.details, cdmObjects.DetailObject_001.signature, "typeFulfillment", order.typeFulfillment, false, Konst.STRING, item.instanceId, false, true);
    updateObjectByList(item.financials, cdmObjects.FinancialObject_001.signature, "price", order.price, false, Konst.DECIMAL, item.instanceId, false, true);
    updateObjectByList(item.financials, cdmObjects.FinancialObject_001.signature, "extendedPrice", order.extendedPrice, false, Konst.DECIMAL, item.instanceId, false, true);
    updateObjectByList(item.financials, cdmObjects.FinancialObject_001.signature, "cogs", order.cogs, false, Konst.DECIMAL, item.instanceId, false, true);
    updateObjectByList(item.financials, cdmObjects.FinancialObject_001.signature, "retailPrice", order.retailPrice, false, Konst.DECIMAL, item.instanceId, false, true);

    var offering = lineItem.offering;
    offering.version = offering.version + 1;

    updateObjectByList(offering.identifications, cdmObjects.IdentificationObject_001.signature, "programCode", order.programCode, false, Konst.STRING, offering.instanceId, false, true);
    updateObjectByList(offering.names, cdmObjects.NameObject_001.signature, "programName", order.programName, false, Konst.STRING, offering.instanceId, false, true);

    if (order.contactOnyxId != null){
        var contactEntity = findEntity(po, dataSourceObject.dataSource + "Contact", order.contactOnyxId);

        if (contactEntity == null){
            iterateContactFile(order);
            contactEntity = findEntity(po, dataSourceObject.dataSource + "Contact", order.contactOnyxId);
        }

        if (contactEntity != null){
            updateObjectByList(lineItem.assignees, cdmObjects.AssigneeObject_001.signature, "orderPlacedBy", contactEntity.instanceId, false, Konst.STRING, lineItem.instanceId, false, true);
        }
    }








}