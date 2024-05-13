import { LightningElement,wire, track } from 'lwc';
import findContactbyAccountId from '@salesforce/apex/AccountToContactsController.findContactbyAccountId';
import { subscribe,MessageContext } from 'lightning/messageService';
import ACCMC from "@salesforce/messageChannel/AccountContacts__c";
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const actions = [    
    { label: 'Delete', name: 'delete' },
 ];
export default class ContactRecordsList extends NavigationMixin(LightningElement) {
    record = {};
    
    columns =  [
        { label: 'First Name', fieldName: 'FirstName', type:'button', typeAttributes: { label: { fieldName: 'FirstName' }, name:'urlredirect',variant:'base' }},
        { label: 'Last Name', fieldName: 'LastName'},
        { label: 'Email', fieldName: 'Email', type: 'email' },        
        { 
            type: 'action',
            typeAttributes: {
                rowActions: actions,
                menuAlignment: 'right'
            }
        },    
    ];

    subscription = null;
    @track receivedMessage = '';
    @track accountId;
    @track showLoadingSpinner = false;
    refreshTable;

    @wire(MessageContext)
    messageContext;

    @wire(findContactbyAccountId,{accountId:'$accountId'}) 
    contacts;  

    connectedCallback(){
        this.subscribeToMessageChannel();
    }
    subscribeToMessageChannel(){
        this.subscription = subscribe(this.messageContext, ACCMC, (message) => this.handleMessage(message));
    }
    handleMessage(message){
        this.accountId = message.recordId;
        this.receivedMessage = message ? message.recordData.value : 'no message payload';
    }
    handleRowAction(event){        
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        alert('actionName:' +actionName);
        alert('selectedRow values' +JSON.stringify(row));
        switch(actionName){
            case 'urlredirect':
                this.showRowDetails(row);
                break;
            case 'delete':
                this.showLoadingSpinner = true;
                deleteRecord(row.id)
                .then(() => {
                    this.showLoadingSpinner = false;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title : 'Success',
                            message : 'Contact has been deleted successfully' ,
                            variant : 'success'
                        })
                    );
                    return refreshApex(this.refreshTable);
                    
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title : 'Error while deleting record',
                            message : error.body.message ,
                            variant : 'success'
                        })
                    );
            
                });
                break;
            default:
        }
    }
    showRowDetails(row){
        this.record = row;
        console.log('sud row',this.record);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.record.Id,
                objectApiName: 'Contact',
                //relationshipApiName: 'Contacts',
                actionName: 'view'
            }
        });
    }    
}