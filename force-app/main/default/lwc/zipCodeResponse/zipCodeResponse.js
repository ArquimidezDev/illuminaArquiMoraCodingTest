import { LightningElement, wire } from 'lwc';

import {subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext} from 'lightning/messageService';
import zipCodeValidationMessage from '@salesforce/messageChannel/zipCodeValidationMessage__c';

import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ZipCodeResponse extends LightningElement {
    subscription = null;
    response = '';

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                zipCodeValidationMessage,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE },
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
    
    // Handler for message received by component
    handleMessage(message) {
        this.response = JSON.stringify(message.response, null, 4);
        console.log('response', this.response);
    }
    
    // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    
    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
    
    // Helper
    dispatchToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Error loading response",
                message: error,
                variant: "error",
            }),
        );
    }
}