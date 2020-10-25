const { insertQueries } = require('./queries.js');
const { Client } = require('pg');

const createRows = async () => {
    const client = new Client({
        user: 'Ben',
        database: 'syncasso'
    });

    await client.connect();

    try {
        const dossierRowsQuery = (await insertQueries()).dossierSqlArray;
        const factuurRowsQuery = (await insertQueries()).factuurSqlArray;

        for (let i = 0; i < dossierRowsQuery.length; i++) {
            await client.query(dossierRowsQuery[i]);
            console.log('dossier row added');
        }
        for (let i = 0; i < factuurRowsQuery.length; i++) {
            await client.query(factuurRowsQuery[i]);
            console.log('factuur row added');
        }

        process.exit();

    } catch (e) {
        console.error(e);
        process.exit();
    }
}

module.exports = {
    createRows,
}