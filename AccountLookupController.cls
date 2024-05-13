public with sharing class AccountLookupController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String accName){
        List<Account> accountList = new List<Account>();
        if(accName != ''){
            String accountName = '%' + accName + '%';
            accountList = [select id, name from Account where name LIKE :accountName];
        }
        return accountList;
    }
}