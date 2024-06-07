import { LightningElement, wire } from 'lwc';

//Message Channel Service dependencies to communicate between components
import { publish, MessageContext } from "lightning/messageService";
import zipCodeValidationMessage from "@salesforce/messageChannel/zipCodeValidationMessage__c";

//Apex controller dependency
import zipValidationCaller from '@salesforce/apex/ZipCodeWebServiceCaller.zipCodeValidation';

//Zip Code Log object dependencies, so we can insert the Zip Logs
import { createRecord } from 'lightning/uiRecordApi';
import ZIP_LOG_OBJECT from '@salesforce/schema/ZipCodeLog__c';
import ZIP_CODE_FIELD from '@salesforce/schema/ZipCodeLog__c.Zip_Code__c';
import COUNTRY_FIELD from '@salesforce/schema/ZipCodeLog__c.Country__c';
import RESPONSE_FIELD from '@salesforce/schema/ZipCodeLog__c.Response__c';

//Dependency to show a toast message components
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ZipCodeValidation extends LightningElement {
    countryList = [
        {label: 'United States', value: 'US'},
        {label: 'Canada', value: 'CA'},
        {label: 'Mexico', value: 'MX'}
    ];

    strZipCode = '';
    strCountry = 'US';

    objResponse = {};

    @wire(MessageContext)
    messageContext;

    
    handleZipCodeChange(event) {
        this.strZipCode = event.detail.value;
    }
    
    handleCountryChange(event) {
        this.strCountry = event.detail.value;
    }
        
    handleValidationClick(event){
        this.makeZipCodeValidationRequest();
    }

    async makeZipCodeValidationRequest(){
        try {
            const objZipCodeData = { strCountry: this.strCountry, strZipCode: this.strZipCode };
        
            let objResponse = await zipValidationCaller(objZipCodeData);
            objResponse = JSON.parse(objResponse);

            if(objResponse.strStatus == 'ok'){
                let objWSresponse = JSON.parse(objResponse.strMsg);
                this.objResponse = objWSresponse;
                if(objWSresponse.country == 'United States'){
                    const objMessage = {response: objWSresponse}
                    publish(this.messageContext, zipCodeValidationMessage, objMessage);
                }else{
                    this.createZipLog();
                }
            }else{
                this.dispatchErrorToast(objResponse.strMsg);
            }
            
        } catch (error) {
            this.dispatchErrorToast(error);
        }
    }

    async createZipLog() {
        let fieldList = {};
        fieldList[ZIP_CODE_FIELD.fieldApiName] = this.strZipCode;
        fieldList[COUNTRY_FIELD.fieldApiName] = this.strCountry;
        fieldList[RESPONSE_FIELD.fieldApiName] = JSON.stringify(this.objResponse, null, 4);
        let recordInput = { apiName: ZIP_LOG_OBJECT.objectApiName, fields: fieldList };
        try {
            const objZipCodeLog = await createRecord(recordInput);
            var zipCodeId = objZipCodeLog.id;
            window.open('/'+zipCodeId, '_blank');
        } catch (error) {
            this.dispatchErrorToast(error);
        }
    }

    // Helper
    dispatchErrorToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Error loading response",
                message: error,
                variant: "error",
            }),
        );
    }
}