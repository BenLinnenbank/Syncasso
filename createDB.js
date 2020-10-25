const { Client } = require('pg');
const { createTables } = require('./createTables');

async function start() {
    const client = new Client({
        user: 'Ben',
        database: 'postgres'
    });
    await client.connect();
    try {
        await client.query('DROP DATABASE syncasso;');
        console.log('old database removed...');

        await client.query('CREATE DATABASE syncasso OWNER "Ben";');
        console.log('database created...');

        await createTables();

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit();
    }
}
start();