var po = {
    "state" : true,
	"signature" : "ProcessObject_001",
	"timestamp" : "1390591231544",
	"id" : "5870205568456_31f4",
	"key" : "7bcafdbc_4160_4de3_a6a0_5f689b504bc4",
	"source" : "Importer",
	"processedBy" : [
		"Importer-001",
		"MongoDbSearch@1390583667586",
		"ImportRecordCheck@1390583667560",
		"ImportMapToProcessObject@1390583667587"
	],
	"domainMatter" : {
		"timestamp" : "1390591231544",
		"poid" : "5870205568456_31f4",
		"signature" : "DomainMatterObject_001",
		"domainMatter" : {
			"ProcessMatterObject_001" : {
				"multiMap" : {
					"ProcessedObject_001" : [
						{
							"timestamp" : "1390591231544",
							"signature" : "ProcessedObject_001",
							"poid" : "5870205568456_31f4",
							"workerProcessData" : {
								"ImportMapNumber" : 1,
								"direct_query_mongodb" : "query_string=domainMatter.domainMatter.EntityMatterObject_001.multiMap.ExternalReferenceObject_001.type:$eq:orgonyx:string, domainMatter.domainMatter.EntityMatterObject_001.multiMap.ExternalReferenceObject_001.typeValue:$eq:816476:string",
								"ImportDataSourceId" : "816476",
								"ImportPOID" : "5870205744833_52b4",
								"cooperative_hash" : "nil",
								"cooperative_filename" : "nil"
							}
						}
					]
				}
			},
			"EntityMatterObject_001" : {
				"multiMap" : {
					"EntityObject_001" : [
						{
							"timestamp" : "1390595497823",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302177_cf31",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "UNKNOWN",
							"typeValue" : "nil",
							"signature" : "EntityObject_001",
							"domicileCountryId" : "nil"
						},
						{
							"timestamp" : "1390595497823",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302177_cf31",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 1,
							"type" : "NPO",
							"typeValue" : "nil",
							"signature" : "EntityObject_001",
							"domicileCountryId" : "DE"
						}
					],
					"ExternalReferenceObject_001" : [
						{
							"timestamp" : "1390595497823",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302177_d050",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "orgonyx",
							"typeValue" : "816476",
							"signature" : "ExternalReferenceObject_001",
							"typeSource" : "nil"
						}
					],
					"NameObject_001" : [
						{
							"timestamp" : "1390595497823",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302177_4c5f",
							"associateId" : "5870201302177_cf31",
							"crc" : "c14a62b1",
							"sequence" : 0,
							"type" : "legalName",
							"typeValue" : "Fruehfoerderung Detmold",
							"signature" : "NameObject_001"
						}
					],
					"StatusObject_001" : [
						{
							"timestamp" : "1380007946327",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302176_7a88",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "main",
							"typeValue" : "Qualified",
							"signature" : "StatusObject_001"
						}
					],
					"FinancialObject_001" : [
						{
							"timestamp" : "1390595497824",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302176_4260",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "operatingBudget",
							"typeValue" : 828513,
							"signature" : "FinancialObject_001"
						}
					],
					"LegalIdentifierObject_001" : [
						{
							"timestamp" : "1390595497824",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302176_f8c4",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "Unknown",
							"typeValue" : "313/5900/1164",
							"signature" : "LegalIdentifierObject_001"
						}
					],
					"PurposeObject_001" : [
						{
							"timestamp" : "1390595497824",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302176_d8b2",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "priActivity",
							"typeValue" : "05",
							"signature" : "PurposeObject_001"
						},
						{
							"timestamp" : "1390595497824",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302176_2eeb",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 1,
							"type" : "subActivity",
							"typeValue" : "160",
							"signature" : "PurposeObject_001"
						},
						{
							"timestamp" : "1390595497824",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302176_1d24",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 2,
							"type" : "priActivityNTEE",
							"typeValue" : "P",
							"signature" : "PurposeObject_001"
						},
						{
							"timestamp" : "1390595497824",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302176_ce85",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 3,
							"type" : "subActivityNTEE",
							"typeValue" : "P80",
							"signature" : "PurposeObject_001"
						}
					],
					"PhoneObject_001" : [
						{
							"timestamp" : "1390595497825",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302175_8e08",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "main",
							"typeValue" : "0523132728",
							"signature" : "PhoneObject_001",
							"typePrefix" : "nil",
							"primary" : false
						}
					],
					"EmailObject_001" : [
						{
							"timestamp" : "1390595497825",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302175_0901",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "main",
							"typeValue" : "info@fruehfoerderung-detmold.de",
							"signature" : "EmailObject_001",
							"primary" : false
						}
					],
					"WebsiteObject_001" : [
						{
							"timestamp" : "1390595497825",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302175_c7ab",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "main",
							"typeValue" : "www.fruehfoerderung-lippe.de",
							"signature" : "WebsiteObject_001",
							"primary" : false
						}
					],
					"OrderObject_001" : [
						{
							"timestamp" : "1390595497825",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302175_fc57",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "nil",
							"typeValue" : "nil",
							"signature" : "OrderObject_001",
							"orderId" : "5870201302175_2d74",
							"dates" : [
								{
									"timestamp" : "1390595497825",
									"version" : 0,
									"rootId" : "5870205568456_31f4",
									"instanceId" : "5870201302175_ceeb",
									"associateId" : "5870201302175_fc57",
									"crc" : "4d33c2a5",
									"sequence" : 0,
									"type" : "orderDate",
									"typeValue" : "2013-11-17T08:00:00GMT",
									"signature" : "DateObject_001"
								},
								{
									"timestamp" : "1390595497825",
									"version" : 0,
									"rootId" : "5870205568456_31f4",
									"instanceId" : "5870201302175_d9ba",
									"associateId" : "5870201302175_fc57",
									"crc" : "c14a62b1",
									"sequence" : 1,
									"type" : "fulfillmentDate",
									"typeValue" : "2013-11-29T08:00:00GMT",
									"signature" : "DateObject_001"
								}
							],
							"status" : [
								{
									"timestamp" : "1390595497825",
									"version" : 0,
									"rootId" : "5870205568456_31f4",
									"instanceId" : "5870201302175_6f8d",
									"associateId" : "5870201302175_fc57",
									"crc" : "c14a62b1",
									"sequence" : 0,
									"type" : "orderStatus",
									"typeValue" : "Shipped",
									"signature" : "StatusObject_001"
								}
							],
							"lineItems" : [
								{
									"timestamp" : "1390595497825",
									"version" : 0,
									"rootId" : "5870205568456_31f4",
									"instanceId" : "5870201302175_f11f",
									"associateId" : "5870201302175_fc57",
									"crc" : "4d33c2a5",
									"sequence" : 0,
									"type" : "nil",
									"typeValue" : "nil",
									"signature" : "LineItemObject_001",
									"quantity" : 1,
									"offering" : {
										"timestamp" : "1390595497826",
										"version" : 0,
										"rootId" : "5870205568456_31f4",
										"instanceId" : "5870201302174_25fb",
										"associateId" : "5870201302175_f11f",
										"crc" : "4d33c2a5",
										"sequence" : 0,
										"type" : "nil",
										"typeValue" : "nil",
										"signature" : "OfferingObject_001",
										"identifications" : [
											{
												"timestamp" : "1390595497826",
												"version" : 0,
												"rootId" : "5870205568456_31f4",
												"instanceId" : "5870201302174_fd82",
												"associateId" : "5870201302174_25fb",
												"crc" : "c14a62b1",
												"sequence" : 0,
												"type" : "programCode",
												"typeValue" : "MicrosoftWW",
												"signature" : "IdentificationObject_001"
											}
										],
										"names" : [ ],
										"dates" : [ ],
										"items" : [ ],
										"eligibilityRules" : [ ]
									},
									"item" : {
										"timestamp" : "1390595497825",
										"version" : 0,
										"rootId" : "5870205568456_31f4",
										"instanceId" : "5870201302175_45ab",
										"associateId" : "5870201302175_f11f",
										"crc" : "4d33c2a5",
										"sequence" : 0,
										"type" : "nil",
										"typeValue" : "nil",
										"signature" : "ItemObject_001",
										"names" : [
											{
												"timestamp" : "1390595497826",
												"version" : 0,
												"rootId" : "5870205568456_31f4",
												"instanceId" : "5870201302174_4194",
												"associateId" : "5870201302175_45ab",
												"crc" : "4d33c2a5",
												"sequence" : 0,
												"type" : "itemName",
												"typeValue" : "Office for Mac 2011 Standard Edition (German)",
												"signature" : "NameObject_001"
											}
										],
										"identifications" : [
											{
												"timestamp" : "1390595497825",
												"version" : 0,
												"rootId" : "5870205568456_31f4",
												"instanceId" : "5870201302174_361d",
												"associateId" : "5870201302175_45ab",
												"crc" : "4d33c2a5",
												"sequence" : 0,
												"type" : "itemId",
												"typeValue" : "LS-42184",
												"signature" : "IdentificationObject_001"
											}
										],
										"details" : [
											{
												"timestamp" : "1390595497826",
												"version" : 0,
												"rootId" : "5870205568456_31f4",
												"instanceId" : "5870201302174_13ec",
												"associateId" : "5870201302175_45ab",
												"crc" : "4d33c2a5",
												"sequence" : 0,
												"type" : "typeItemLicense",
												"typeValue" : "Basic",
												"signature" : "DetailObject_001"
											},
											{
												"timestamp" : "1390595497826",
												"version" : 0,
												"rootId" : "5870205568456_31f4",
												"instanceId" : "5870201302174_72c5",
												"associateId" : "5870201302175_45ab",
												"crc" : "4d33c2a5",
												"sequence" : 0,
												"type" : "availability",
												"typeValue" : "Available",
												"signature" : "DetailObject_001"
											},
											{
												"timestamp" : "1390595497826",
												"version" : 0,
												"rootId" : "5870205568456_31f4",
												"instanceId" : "5870201302174_d67e",
												"associateId" : "5870201302175_45ab",
												"crc" : "4d33c2a5",
												"sequence" : 0,
												"type" : "typeFulfillment",
												"typeValue" : "Logical",
												"signature" : "DetailObject_001"
											}
										],
										"financials" : [
											{
												"timestamp" : "1390595497826",
												"version" : 0,
												"rootId" : "5870205568456_31f4",
												"instanceId" : "5870201302174_17d5",
												"associateId" : "5870201302175_45ab",
												"crc" : "4d33c2a5",
												"sequence" : 0,
												"type" : "cogs",
												"typeValue" : 0,
												"signature" : "FinancialObject_001"
											},
											{
												"timestamp" : "1390595497826",
												"version" : 0,
												"rootId" : "5870205568456_31f4",
												"instanceId" : "5870201302174_cc54",
												"associateId" : "5870201302175_45ab",
												"crc" : "4d33c2a5",
												"sequence" : 0,
												"type" : "price",
												"typeValue" : 24,
												"signature" : "FinancialObject_001"
											},
											{
												"timestamp" : "1390595497826",
												"version" : 0,
												"rootId" : "5870205568456_31f4",
												"instanceId" : "5870201302174_05ec",
												"associateId" : "5870201302175_45ab",
												"crc" : "4d33c2a5",
												"sequence" : 0,
												"type" : "retailPrice",
												"typeValue" : 588,
												"signature" : "FinancialObject_001"
											},
											{
												"timestamp" : "1390595497826",
												"version" : 0,
												"rootId" : "5870205568456_31f4",
												"instanceId" : "5870201302174_13f3",
												"associateId" : "5870201302175_45ab",
												"crc" : "4d33c2a5",
												"sequence" : 0,
												"type" : "extendedPrice",
												"typeValue" : 24,
												"signature" : "FinancialObject_001"
											}
										],
										"eligibilityRules" : [ ]
									},
									"assignees" : [ ],
									"dates" : [
										{
											"timestamp" : "1390595497825",
											"version" : 0,
											"rootId" : "5870205568456_31f4",
											"instanceId" : "5870201302175_d9ba",
											"associateId" : "5870201302175_fc57",
											"crc" : "c14a62b1",
											"sequence" : 1,
											"type" : "fulfillmentDate",
											"typeValue" : "2013-11-29T08:00:00GMT",
											"signature" : "DateObject_001"
										}
									],
									"status" : [
										{
											"timestamp" : "1390595497825",
											"version" : 0,
											"rootId" : "5870205568456_31f4",
											"instanceId" : "5870201302175_6f8d",
											"associateId" : "5870201302175_fc57",
											"crc" : "c14a62b1",
											"sequence" : 0,
											"type" : "orderStatus",
											"typeValue" : "Shipped",
											"signature" : "StatusObject_001"
										}
									],
									"financials" : [
										{
											"timestamp" : "1390595497826",
											"version" : 0,
											"rootId" : "5870205568456_31f4",
											"instanceId" : "5870201302174_cc54",
											"associateId" : "5870201302175_45ab",
											"crc" : "4d33c2a5",
											"sequence" : 0,
											"type" : "price",
											"typeValue" : 24,
											"signature" : "FinancialObject_001"
										},
										{
											"timestamp" : "1390595497826",
											"version" : 0,
											"rootId" : "5870205568456_31f4",
											"instanceId" : "5870201302174_13f3",
											"associateId" : "5870201302175_45ab",
											"crc" : "4d33c2a5",
											"sequence" : 0,
											"type" : "extendedPrice",
											"typeValue" : 24,
											"signature" : "FinancialObject_001"
										}
									],
									"eligibilityRulesAudit" : [ ]
								}
							],
							"financials" : [ ],
							"externalReferences" : [
								{
									"timestamp" : "1390595497825",
									"version" : 0,
									"rootId" : "5870205568456_31f4",
									"instanceId" : "5870201302175_4358",
									"associateId" : "5870201302175_fc57",
									"crc" : "c14a62b1",
									"sequence" : 0,
									"type" : "onyxOrderId",
									"typeValue" : "1048427",
									"signature" : "ExternalReferenceObject_001",
									"typeSource" : "nil"
								}
							]
						}
					],
					"LocationObject_001" : [
						{
							"timestamp" : "1390595497826",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302174_3139",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 0,
							"type" : "main",
							"typeValue" : "nil",
							"signature" : "LocationObject_001",
							"address" : "Leopoldstr. 32",
							"addressExt" : "nil",
							"city" : "Detmold",
							"stateRegion" : "NW",
							"postalCode" : "32756",
							"countryId" : "DE",
							"latitude" : 34.9372,
							"longitude" : 88.5153
						},
						{
							"timestamp" : "1390595497827",
							"version" : 0,
							"rootId" : "5870205568456_31f4",
							"instanceId" : "5870201302173_5358",
							"associateId" : "5870201302177_cf31",
							"crc" : "4d33c2a5",
							"sequence" : 1,
							"type" : "legal",
							"typeValue" : "nil",
							"signature" : "LocationObject_001",
							"address" : "Leopoldstr. 32",
							"addressExt" : "nil",
							"city" : "Detmold",
							"stateRegion" : "NW",
							"postalCode" : "32756",
							"countryId" : "DE",
							"latitude" : 34.9372,
							"longitude" : 88.5153
						}
					]
				}
			}
		}
	}
}
