import { SalesforceConnection } from './SalesforceConnection';

(async () => {

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
    
    //Update a record
    const accountToUpdate: any = accounts.records.find((x: any) => x.Name === 'Woot Industrial Complex');
    if (accountToUpdate) {
        const resp: any = await conn.sobject('Account').update({ Id: accountToUpdate.Id, Name: 'The Pibble Zone'});
        console.log(resp);
        if (resp.success) {
            console.log(`Record with id ${resp.id} updated successfully.`);
        } else {
            console.error(resp.errors[0]);
        }
    }

    SalesforceConnection.close(conn);
})();