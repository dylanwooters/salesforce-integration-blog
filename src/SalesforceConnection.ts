import * as jsforce from 'jsforce';
import * as fs from 'fs';
import * as path from 'path';

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../config.json')).toString());

/** Static class used to connect to Salesforce instance. */
export abstract class SalesforceConnection {

    constructor(){}

    /** Opens a new connection to Salesforce instance using settings from Config. */
    public static async open() : Promise<jsforce.Connection> {

            let conn = new jsforce.Connection({
                loginUrl : config.url
            });
            await conn.login(config.username, config.password);
            console.log('Connected to Salesforce.');
            return conn;
    }

    /** Closes an existing connection to Salesforce. */
    public static async close(conn: any) : Promise<void> {
        await conn.logout();
        console.log('Closed connection to Salesforce.');
        return;
    }
}