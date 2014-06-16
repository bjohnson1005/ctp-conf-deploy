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
        } else {
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



function iterateOrganisationFile(org){

    if (!checkLatestObjectTypeValue(cdmObjects.EntityObject_001.signature, "Organization", instanceId, org.typeEntity)){
        var orgEntity = getNewCDMObject(cdmObjects.EntityObject_001.signature, rootId, instanceId, associateId);
        orgEntity.type = "Organization";
        orgEntity.typeValue = cleanString(org.typeEntity, false);
        orgEntity.domicileCountryId = cleanString(org.domicileCountryId, false);
        orgEntity.version = getVersion(cdmObjects.EntityObject_001.signature, orgEntity.type);
        orgEntity.sequence = getSequence(cdmObjects.EntityObject_001.signature);

        addToPo(orgEntity);
    }

    createCDMEntry(cdmObjects.NameObject_001.signature, "legalName", org.legalName, false);

    if (!checkLatestObjectTypeValue(cdmObjects.StatusObject_001.signature, "main", instanceId, org.status)){
        var obj = getNewCDMObject(cdmObjects.StatusObject_001.signature, rootId, getInstanceIdByType(cdmObjects.StatusObject_001.signature, "main", instanceId), instanceId);
        obj.type = "main";

        var dte =  parseDate(org.statusDate.toString()).getTime();

        obj.timestamp = dte;
        obj.typeValue = cleanString(org.status, false);
        obj.version = getVersion(cdmObjects.StatusObject_001.signature,"main", obj.instanceId);
        obj.sequence = getSequence(cdmObjects.StatusObject_001.signature);
        addToPo(obj);
    }

    createCDMEntry(cdmObjects.FinancialObject_001.signature, "operatingBudget", org.operatingBudget, false, Konst.DECIMAL);
    createCDMEntry(cdmObjects.LegalIdentifierObject_001.signature, org.identifierType, org.identifier, false);
    createCDMEntry(cdmObjects.PurposeObject_001.signature, "priActivity", org.missionMain, false);
    createCDMEntry(cdmObjects.PurposeObject_001.signature, "subActivity", org.missionSub, false);
    createCDMEntry(cdmObjects.PurposeObject_001.signature, "priActivityNTEE", lookupNteeCodeTopLevelGroup(org.missionSub), false);
    createCDMEntry(cdmObjects.PurposeObject_001.signature, "subActivityNTEE", lookUpNteeCode(org.missionSub), false);
    createCDMEntry(cdmObjects.EmailObject_001.signature, org.typeEmail, org.orgEmail, false);
    createCDMEntry(cdmObjects.WebsiteObject_001.signature, org.typeWebsite, org.website, false);
}

function iterateLocationFile(location){
    var latestLocation = getLatestVersionOfObject(cdmObjects.LocationObject_001.signature, location.locationType, instanceId);

    var doAdd = true;

    if (latestLocation != null && latestLocation != undefined){
        if (latestLocation.address == cleanString(location.address1, false) &&
            latestLocation.addressExt == cleanString(location.address2, false) &&
            latestLocation.city == cleanString(location.city, false) &&
            latestLocation.stateRegion == cleanString(location.stateRegion, false) &&
            latestLocation.postalCode == cleanString(location.postalCode, false) &&
            latestLocation.countryId == cleanString(location.countryId, false)){

            doAdd = false;
        }
    }

    if (doAdd){
        var locationObject = getNewCDMObject(cdmObjects.LocationObject_001.signature, rootId, getInstanceIdByType(cdmObjects.LocationObject_001.signature, location.locationType, instanceId), instanceId);

        locationObject.type = cleanString(location.locationType, false);
        locationObject.address = cleanString(location.address1, false);
        locationObject.addressExt = cleanString(location.address2, false);
        locationObject.city = cleanString(location.city, false);
        locationObject.stateRegion = cleanString(location.stateRegion, false);
        locationObject.postalCode = cleanString(location.postalCode, false);
        locationObject.countryId = cleanString(location.countryId, false);
        locationObject.version = getVersion(cdmObjects.LocationObject_001.signature, locationObject.type);
        locationObject.sequence = getSequence(cdmObjects.LocationObject_001.signature);

        addToPo(locationObject);
    }
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

function iterateContactFile(contact){

    if (contact.contactOnyxId != null){

        var contactEntity = findEntity(po, dataSourceObject.dataSource + "Contact", contact.contactOnyxId);

        if (contactEntity == null){
            contactEntity = getNewCDMObject(cdmObjects.EntityObject_001.signature, rootId, genUuid(), instanceId);
            contactEntity.type = "Person";
            contactEntity.typeValue = "CONTACT_" + countNumberOfContacts();
            contactEntity.sequence = getSequence(cdmObjects.EntityObject_001.signature);

            addToPo(contactEntity);
        }

        var contactExternalReference = null;

        if (po.domainMatter.domainMatter.EntityMatterObject_001 != null && po.domainMatter.domainMatter.EntityMatterObject_001 != undefined){
            contactExternalReference = findExternalReference(po.domainMatter.domainMatter.EntityMatterObject_001.multiMap.externalReferences, contactEntity, dataSourceObject.dataSource + "Contact", contact.contactOnyxId);
        }

        if (contactExternalReference == null || contactExternalReference == undefined){
            contactExternalReference = getNewCDMObject(cdmObjects.ExternalReferenceObject_001.signature, rootId, genUuid() , contactEntity.instanceId);
            contactExternalReference.type = dataSourceObject.dataSource + "Contact";
            contactExternalReference.typeValue = cleanString(contact.contactOnyxId);
            contactExternalReference.typeSource = "onyx";
            contactExternalReference.sequence = getSequence(cdmObjects.ExternalReferenceObject_001.signature);


            addToPo(contactExternalReference);
        }

        createCDMEntry(cdmObjects.NameObject_001.signature, "firstName", contact.firstName, false, Konst.STRING, contactEntity.instanceId);
        createCDMEntry(cdmObjects.NameObject_001.signature, "lastName", contact.lastName, false, Konst.STRING, contactEntity.instanceId);
        createCDMEntry(cdmObjects.EmailObject_001.signature, "main", contact.email, false, Konst.STRING, contactEntity.instanceId);
        createCDMEntry(cdmObjects.DescriptiveTextObject_001.signature, "designation", contact.title, false, Konst.STRING, contactEntity.instanceId);

    }
}

function iterateOrderFile(order){
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

    if (!checkLatestObjectTypeValueByList(orderObject.externalReferences, "onyxOrderId", orderObject.instanceId, order.orderId.toString())){
        var obj = getNewCDMObject(cdmObjects.ExternalReferenceObject_001.signature, rootId, getInstanceIdByList(orderObject.externalReferences, "onyxOrderId", orderObject.instanceId), orderObject.instanceId);
        obj.type = "onyxOrderId";
        obj.typeSource = "onyx";
        obj.typeValue = cleanString(order.orderId.toString(), false);
        obj.version = getVersionByList(orderObject.externalReferences,"onyxOrderId", orderObject.instanceId);
        obj.sequence = getSequenceByList(orderObject.externalReferences);
        orderObject.externalReferences.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(orderObject.status, "orderStatus", orderObject.instanceId, order.status)){
        var obj = getNewCDMObject(cdmObjects.StatusObject_001.signature, rootId, getInstanceIdByList(orderObject.status, "orderStatus", orderObject.instanceId), orderObject.instanceId);
        obj.type = "orderStatus";
        obj.typeValue = cleanString(order.status, false);
        obj.version = getVersionByList(orderObject.status, "orderStatus", orderObject.instanceId);
        obj.sequence = getSequenceByList(orderObject.status);
        orderObject.status.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(orderObject.dates, "orderDate", orderObject.instanceId, order.orderDate)){
        var obj = getNewCDMObject(cdmObjects.DateObject_001.signature, rootId, getInstanceIdByList(orderObject.dates, "orderDate", orderObject.instanceId), orderObject.instanceId);
        obj.type = "orderDate";
        obj.typeValue = cleanString(order.orderDate.replace("+0000",'GMT'),false);
        obj.version = getVersionByList(orderObject.dates,"orderDate", orderObject.instanceId);
        obj.sequence = getSequenceByList(orderObject.dates);
        orderObject.dates.push(obj);
    }


    if (!checkLatestObjectTypeValueByList(orderObject.dates, "fulfillmentDate", orderObject.instanceId, order.fulfillmentDate)){
        var obj = getNewCDMObject(cdmObjects.DateObject_001.signature, rootId, getInstanceIdByList(orderObject.dates, "fulfillmentDate", orderObject.instanceId), orderObject.instanceId);
        obj.type = "fulfillmentDate";
        obj.typeValue = cleanString(order.fulfillmentDate.replace("+0000",'GMT'),false);
        obj.version = getVersionByList(orderObject.dates, "fulfillmentDate", orderObject.instanceId);
        obj.sequence = getSequenceByList(orderObject.dates);
        orderObject.dates.push(obj);
    }

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

    orderObject.lineItems.quantity = cleanDecimal(order.quantity);

    if (!checkLatestObjectTypeValueByList(lineItem.dates, "fulfillmentDate", lineItem.instanceId, order.fulfillmentDate)){
        var obj = getNewCDMObject(cdmObjects.DateObject_001.signature, rootId, getInstanceIdByList(lineItem.dates, "fulfillmentDate", lineItem.instanceId), lineItem.instanceId);
        obj.type = "fulfillmentDate";
        obj.typeValue = cleanString(order.fulfillmentDate.replace("+0000",'GMT'),false);
        obj.version = getVersionByList(lineItem.dates, "fulfillmentDate", lineItem.instanceId);
        obj.sequence = getSequenceByList(lineItem.dates);
        lineItem.dates.push(obj);
    }


    if (!checkLatestObjectTypeValueByList(lineItem.status, "orderStatus", lineItem.instanceId, order.status)){
        var obj = getNewCDMObject(cdmObjects.StatusObject_001.signature, rootId, getInstanceIdByList(lineItem.status, "orderStatus", lineItem.instanceId), lineItem.instanceId);
        obj.type = "orderStatus";
        obj.typeValue = cleanString(order.status, false);
        obj.version = getVersionByList(lineItem.status, "orderStatus", lineItem.instanceId);
        obj.sequence = getSequenceByList(lineItem.status);
        lineItem.status.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(lineItem.financials, "price", lineItem.instanceId, order.price)){
        var obj = getNewCDMObject(cdmObjects.FinancialObject_001.signature, rootId, getInstanceIdByList(lineItem.financials, "price", lineItem.instanceId), lineItem.instanceId);
        obj.type = "price";
        obj.typeValue = cleanDecimal(order.price);
        obj.version = getVersionByList(lineItem.financials, "price", lineItem.instanceId);
        obj.sequence = getSequenceByList(lineItem.financials);
        lineItem.financials.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(lineItem.financials, "extendedPrice", lineItem.instanceId, order.extendedPrice)){
        var obj = getNewCDMObject(cdmObjects.FinancialObject_001.signature, rootId, getInstanceIdByList(lineItem.financials, "extendedPrice", lineItem.instanceId), lineItem.instanceId);
        obj.type = "extendedPrice";
        obj.typeValue = cleanDecimal(order.extendedPrice);
        obj.version = getVersionByList(lineItem.financials, "extendedPrice", lineItem.instanceId);
        obj.sequence = getSequenceByList(lineItem.financials);
        lineItem.financials.push(obj);
    }

    var item = lineItem.item;

    if (!checkLatestObjectTypeValueByList(item.identifications, "itemId", item.instanceId, order.itemId)){
        var obj = getNewCDMObject(cdmObjects.IdentificationObject_001.signature, rootId, getInstanceIdByList(item.identifications, "itemId", item.instanceId), item.instanceId);
        obj.type = "itemId";
        obj.typeValue = cleanString(order.itemId, false);
        obj.version = getVersionByList(item.identifications, "itemId", item.instanceId);
        obj.sequence = getSequenceByList(item.identifications);
        item.identifications.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(item.names, "itemName", item.instanceId, order.itemName)){
        var obj = getNewCDMObject(cdmObjects.NameObject_001.signature, rootId, getInstanceIdByList(item.names, "itemName", item.instanceId), item.instanceId);
        obj.type = "itemName";
        obj.typeValue = cleanString(order.itemName,false);
        obj.version = getVersionByList(item.names, "itemName", item.instanceId);
        obj.sequence = getSequenceByList(item.names);
        item.names.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(item.details, "typeItemLicense", item.instanceId, order.typeItemLicense)){
        var obj = getNewCDMObject(cdmObjects.DetailObject_001.signature, rootId, getInstanceIdByList(item.details, "typeItemLicense", item.instanceId), item.instanceId);
        obj.type = "typeItemLicense";
        obj.typeValue = cleanString(order.typeItemLicense, false);
        obj.version = getVersionByList(item.details, "typeItemLicense", item.instanceId);
        obj.sequence = getSequenceByList(item.details);
        item.details.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(item.details, "availability", item.instanceId, order.availability)){
        var obj = getNewCDMObject(cdmObjects.DetailObject_001.signature, rootId, getInstanceIdByList(item.details, "availability", item.instanceId), item.instanceId);
        obj.type = "availability";
        obj.typeValue = cleanString(order.availability, false);
        obj.version = getVersionByList(item.details, "availability", item.instanceId);
        obj.sequence = getSequenceByList(item.details);
        item.details.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(item.details, "typeFulfillment", item.instanceId, order.typeFulfillment)){
        var obj = getNewCDMObject(cdmObjects.DetailObject_001.signature, rootId, getInstanceIdByList(item.details, "typeFulfillment", item.instanceId), item.instanceId);
        obj.type = "typeFulfillment";
        obj.typeValue = cleanString(order.typeFulfillment, false);
        obj.version = getVersionByList(item.details, "typeFulfillment", item.instanceId);
        obj.sequence = getSequenceByList(item.details);
        item.details.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(item.financials, "price", item.instanceId, order.price)){
        var obj = getNewCDMObject(cdmObjects.FinancialObject_001.signature, rootId, getInstanceIdByList(item.financials, "price", item.instanceId), item.instanceId);
        obj.type = "price";
        obj.typeValue = cleanDecimal(order.price);
        obj.version = getVersionByList(item.financials, "price", item.instanceId);
        obj.sequence = getSequenceByList(item.financials);
        item.financials.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(item.financials, "extendedPrice", item.instanceId, order.extendedPrice)){
        var obj = getNewCDMObject(cdmObjects.FinancialObject_001.signature, rootId, getInstanceIdByList(item.financials, "extendedPrice", item.instanceId), item.instanceId);
        obj.type = "extendedPrice";
        obj.typeValue = cleanDecimal(order.extendedPrice);
        obj.version = getVersionByList(item.financials, "extendedPrice", item.instanceId);
        obj.sequence = getSequenceByList(item.financials);
        item.financials.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(item.financials, "cogs", item.instanceId, order.cogs)){
        var obj = getNewCDMObject(cdmObjects.FinancialObject_001.signature, rootId, getInstanceIdByList(item.financials, "cogs", item.instanceId), item.instanceId);
        obj.type = "cogs";
        obj.typeValue = cleanDecimal(order.cogs);
        obj.version = getVersionByList(item.financials, "cogs", item.instanceId);
        obj.sequence = getSequenceByList(item.financials);
        item.financials.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(item.financials, "retailPrice", item.instanceId, order.retailPrice)){
        var obj = getNewCDMObject(cdmObjects.FinancialObject_001.signature, rootId, getInstanceIdByList(item.financials, "retailPrice", item.instanceId), item.instanceId);
        obj.type = "retailPrice";
        obj.typeValue = cleanDecimal(order.retailPrice);
        obj.version = getVersionByList(item.financials, "retailPrice", item.instanceId);
        obj.sequence = getSequenceByList(item.financials);
        item.financials.push(obj);
    }

    var offering = lineItem.offering;

    if (!checkLatestObjectTypeValueByList(offering.identifications, "programCode", offering.instanceId, order.programCode)){
        var obj = getNewCDMObject(cdmObjects.IdentificationObject_001.signature, rootId, getInstanceIdByList(offering.identifications, "programCode", offering.instanceId), offering.instanceId);
        obj.type = "programCode";
        obj.typeValue = cleanString(order.programCode, false);
        obj.version = getVersionByList(offering.identifications, "programCode", offering.instanceId);
        obj.sequence = getSequenceByList(offering.identifications);
        offering.identifications.push(obj);
    }

    if (!checkLatestObjectTypeValueByList(offering.names, "programName", offering.instanceId, order.programName)){
        var obj = getNewCDMObject(cdmObjects.NameObject_001.signature, rootId, getInstanceIdByList(offering.names, "programName", offering.instanceId), offering.instanceId);
        obj.type = "programName";
        obj.typeValue = cleanString(order.programName,false);
        obj.version = getVersionByList(offering.names, "programName", offering.instanceId);
        obj.sequence = getSequenceByList(offering.names);
        offering.names.push(obj);
    }

    if (order.contactOnyxId != null){
        var contactEntity = findEntity(po, dataSourceObject.dataSource + "Contact", order.contactOnyxId);

        if (contactEntity == null){
            iterateContactFile(order);
            contactEntity = findEntity(po, dataSourceObject.dataSource + "Contact", order.contactOnyxId);
        }

        if (contactEntity != null){
            if (!checkLatestObjectTypeValueByList(lineItem.assignees, "orderPlacedBy", lineItem.instanceId, contactEntity.instanceId)){
                var obj = getNewCDMObject(cdmObjects.AssigneeObject_001.signature, rootId, getInstanceIdByList(lineItem.assignees, "orderPlacedBy", lineItem.instanceId), lineItem.instanceId);
                obj.type = "orderPlacedBy";
                obj.typeValue = cleanString(contactEntity.instanceId,false);
                obj.version = getVersionByList(lineItem.assignees, "orderPlacedBy", lineItem.instanceId);
                obj.sequence = getSequenceByList(lineItem.assignees);
                lineItem.assignees.push(obj);
            }
        }
    }
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

    if (data["Orgs.csv"] != null && data["Orgs.csv"] != undefined)
        for (var i=0; i<data["Orgs.csv"].length; i++){
            iterateOrganisationFile(data["Orgs.csv"][i]);
        }

    if (data["Locations.csv"] != null && data["Locations.csv"] != undefined)
        for (var i=0; i<data["Locations.csv"].length; i++){
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