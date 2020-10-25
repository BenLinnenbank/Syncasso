const fs = require('fs');
const util = require('util');
const neatCsv = require('neat-csv');

const fsReadFile = util.promisify(fs.readFile);

const dossierTableQuery = `CREATE TABLE IF NOT EXISTS dossiers(
    debiteurnummer VARCHAR(255),
    debiteur_naam VARCHAR(255),
    debiteur_postcode VARCHAR(18), 
    debiteur_huisnummer VARCHAR(18), 
    debiteur_geboortedatum VARCHAR(18), 
    debiteur_woonplaats VARCHAR(255),
    dossiernummer VARCHAR(255) PRIMARY KEY NOT NULL,
    hoofdsom VARCHAR(18),
    openstaand_saldo VARCHAR(18),
    factuurnummer VARCHAR(255),
    eisernummer VARCHAR(255),
    eisernaam VARCHAR(255),
    opdrachtgever VARCHAR(255),
    opdrachtgevernaam VARCHAR(255)
);`;

const factuurTableQuery = `CREATE TABLE IF NOT EXISTS facturen(
    dossiernr_id VARCHAR(255),
    factnr VARCHAR(255),
    factdatum VARCHAR(18), 
    factbedrag VARCHAR(18),
    CONSTRAINT FK_dossier_factuur FOREIGN KEY (dossiernr_id)
    REFERENCES dossiers(dossiernummer)
);`;

const insertQueries = async () => {
    let factuurSqlArray = [];
    let dossierSqlArray = [];

    const dossierResult = await fsReadFile('./data/Dossiers.csv');
    const dossierData = dossierResult.toString();
    const cleanDossierData = await neatCsv(dossierData, { separator: ';' });

    const factuurResult = await fsReadFile('./data/Facturen.csv');
    const factuurData = factuurResult.toString();
    const cleanFactuurData = await neatCsv(factuurData, { separator: ';' });

    for (let i = 0; i < cleanDossierData.length; i++) {
        let dossierSql = `INSERT INTO dossiers(debiteurnummer, debiteur_naam, debiteur_postcode, debiteur_huisnummer, debiteur_geboortedatum, debiteur_woonplaats, dossiernummer, hoofdsom, openstaand_saldo, factuurnummer, eisernummer, eisernaam, opdrachtgever, opdrachtgevernaam)
        VALUES (
            '${cleanDossierData[i].Debiteurnummer}',
            '${cleanDossierData[i]['Debiteur Naam']}',
            '${cleanDossierData[i]['Debiteur postcode']}',
            '${cleanDossierData[i]['Debiteur huisnummer']}',
            '${cleanDossierData[i]['Debiteur geboortedatum']}',
            '${cleanDossierData[i]['Debiteur woonplaats']}',
            '${cleanDossierData[i].Dossiernummer}',
            '${cleanDossierData[i].Hoofdsom}',
            '${cleanDossierData[i]['openstaand saldo']}',
            '${cleanDossierData[i].factuurnummer}',
            '${cleanDossierData[i].Eisernummer}',
            '${cleanDossierData[i].Eisernaam}',
            '${cleanDossierData[i].Opdrachtgever}',
            '${cleanDossierData[i].Opdrachtgevernaam}'
            );`;
        dossierSqlArray.push(dossierSql);
    }

    for (let i = 0; i < cleanFactuurData.length; i++) {
        let factuurSql = `INSERT INTO facturen(dossiernr_id, factnr, factdatum, factbedrag)
        VALUES (
            '${cleanFactuurData[i].dossiernr}',
            '${cleanFactuurData[i].factnr}',
            '${cleanFactuurData[i].factdatum}',
            '${cleanFactuurData[i].factbedrag}'
            );`;
        factuurSqlArray.push(factuurSql);
    }
    return { factuurSqlArray, dossierSqlArray };
}


module.exports = {
    dossierTableQuery,
    factuurTableQuery,
    insertQueries,
}