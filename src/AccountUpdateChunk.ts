import { Connection } from 'jsforce';
import { SalesforceConnection } from './SalesforceConnection';

(async () => {

    const batchUpdate = (arr: any[], objectName: string, conn: Connection) => {
        console.log(`Batch updating ${arr.length} records in Salesforce`);
        let x,y,batch = 200;
        for (x=0,y=arr.length; x<y; x+=batch) {
            let chunkedArr = arr.slice(x,x+batch);
            let rets: any = conn.sobject(objectName).update(chunkedArr);
            for (var i=0; i < rets.length; i++) {
                if (!rets[i].success) {
                    console.error('error', rets[i].errors[0]);
                    throw new Error(rets[i].errors[0]);
                }
            }
        }
    }

    //SOQL query for Account data
    const soql = 
    `
    SELECT Id,
    Name
    FROM Account
    `;

    //Query data from Salesforce
    const conn = await SalesforceConnection.open();
    const accounts = await conn.query(soql);
    console.log(`${accounts.totalSize} records returned from Salesforce.`);
    
    //Update records
    accounts.records.forEach((r: any) => {
        r.Name = 'New Account Number ' + Math.floor(1000 + Math.random() * 9000);
    });
    console.log(accounts.records);
    batchUpdate(accounts.records, 'Account', conn);

    SalesforceConnection.close(conn);
})();