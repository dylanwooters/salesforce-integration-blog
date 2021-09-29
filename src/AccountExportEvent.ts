import { SalesforceConnection } from './SalesforceConnection';

(async () => {

    //SOQL query for Account data
    const soql = 
    `
    SELECT Id,
    Name,
    AccountNumber,
    Phone,
    Website
    FROM Account
    `;
    const accounts = [];


    const conn = await SalesforceConnection.open();
    //query via event-driven style and populate accounts array
    await conn.query(soql)
    .on("record", (record) => {
        accounts.push(record);
    })
    .on("end", async () => {          
        console.log(`Account fetch complete. ${accounts.length} total records returned.`);
    })
    .on("error", (err) => {
        throw err;
    })
    .run({ autoFetch : true });

    SalesforceConnection.close(conn);
})();