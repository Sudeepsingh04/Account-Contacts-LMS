import { LightningElement,wire, track } from 'lwc';
import {MessageContext,publish} from 'lightning/messageService';
import getAccounts from '@salesforce/apex/AccountLookupController.getAccounts';
import ACCMC from "@salesforce/messageChannel/AccountContacts__c";

export default class Publish extends LightningElement {
    @track accountNameChange=''
    @track accountName = '';
    @track accountList = [];
    @track accountId;
    @track messageResult = false;
    @track showSearchedValues = false;

    @wire(MessageContext)
    messageContext;

    @wire(getAccounts, {accName: '$accountNameChange'})
    retrieveAccounts({error,data}){
        if(data){
            console.log('sud retrieve wire',data);
            this.accountList = data;
            this.showSearchedValues = data.length>0;
            this.messageResult = data.length === 0 && this.accountNameChange!=='';
            //console.log('sud retrieve wire',this.accountList);
        }else if(error){
            console.log(error);
        }
    }
    handleKeyChange(event){ 
        console.log('sud handlekeychange',this.accountNameChange);
        this.accountNameChange = event.target.value;
        
    }
    handleParentSelection(event){
        console.log('sud handleParentSelection',event.target.dataset);
        this.accountId = event.target.dataset.value;
        this.accountName = event.target.dataset.label;

        const selectedEvent = new CustomEvent('selected',{detail:this.accountId});
        this.dispatchEvent(selectedEvent);
        this.showSearchedValues = false;
        const message = {
            recordId: event.target.dataset.value,
            recordData: { value: "message from Lightning Web Component" }
        };
        publish(this.messageContext, ACCMC, message);
    }
    /*
    handleClick(event) {
        event.preventDefault();                
        const message = {
            recordId: event.target.dataset.value,
            recordData: { value: "message from Lightning Web Component" }
        };
        publish(this.messageContext, ACCMC, message);
    }*/

}