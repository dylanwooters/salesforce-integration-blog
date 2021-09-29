import * as excel from 'xlsx';
import { SalesforceConnection } from './SalesforceConnection';

(async () => {

    //SOQL query for Account data
    const soql = 
    `
    SELECT Id,
    Name,
    AccountNumber,
    Phone,
    Website,
    Owner.FirstName,
    Owner.LastName,
    (SELECT FirstName, LastName, Phone FROM Contacts)
    FROM Account
    `;

    //Query data from Salesforce
    const conn = await SalesforceConnection.open();
    const accounts = await conn.query(soql);
    console.log(`${accounts.totalSize} records returned from Salesforce.`);
    //log the owners (unique) for all accounts
    const owners = new Set(accounts.records.map((x: any) => { return x.Owner.FirstName + ' ' + x.Owner.LastName }));
    console.log(owners);

    let contacts: any[] = [];
    for (let x=0; x<accounts.records.length; x++) {
        contacts = contacts.concat((accounts.records[x] as any).Contacts.records);
    }

    //Save contacts to spreadsheet
    const wb = excel.utils.book_new();
    const ws = excel.utils.json_to_sheet(contacts);
    excel.utils.book_append_sheet(wb, ws, 'contacts');
    //Change this to your local file path
    excel.writeFile(wb,'/Users/dylan/Documents/repos/salesforce-blog/ContactsExport.xlsx')
    SalesforceConnection.close(conn);
})();