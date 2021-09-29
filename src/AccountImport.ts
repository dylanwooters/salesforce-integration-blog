import * as excel from 'xlsx';
import { SalesforceConnection } from './SalesforceConnection';

(async () => {

    //Change this to your local file path
    const workbook = excel.readFile('/Users/dylan/Documents/repos/salesforce-blog/AccountImport.xlsx');

    //get data as json from worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = excel.utils.sheet_to_json(worksheet);

    //Save data to Salesforce
    const conn = await SalesforceConnection.open();
    await conn.sobject('Account').create(data);
    console.log(data.length + ' accounts loaded into Salesforce.');
    SalesforceConnection.close(conn);
})();