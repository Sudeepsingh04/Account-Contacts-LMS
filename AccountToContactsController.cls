public with sharing class AccountToContactsController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> findContactbyAccountId(String accountId){
        return [Select id,firstName,LastName,Email from Contact where AccountId=:accountId limit 10];
    }
    
}