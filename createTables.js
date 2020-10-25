const { Client } = require('pg');
const { dossierTableQuery, factuurTableQuery } = require('./queries');
const { createRows } = require('./createRows.js');

const createTables = async () => {
    const client = new Client({
        user: 'Ben',
        database: 'syncasso'
    });

    await client.connect();

    try {
        await client.query(dossierTableQuery);
        console.log('dossier table created...');

        await client.query(factuurTableQuery);
        console.log('factuur table created...');

        await createRows();

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit();
    }
}

module.exports = {
    createTables,
}