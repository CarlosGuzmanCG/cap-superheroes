const cds =  require('@sap/cds');
const { message } = require('@sap/cds/lib/log/cds-error');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();

const sMongoUrl = process.env.MONGO_URL;
const sDbName = process.env.DATABASE_NAME;
const client = new MongoClient(sMongoUrl, { useUnifiedTopology: true });

async function _CrearSuperheroe(req) {

    if(req.data.franquicia != "Marvel" && req.data.franquicia != "DC") {
        req.error({code:400, message:"La franquicia debe ser Marvel o DC"});
    }

    await client.connect();
    let database = await client.db(sDbName);
    let superheroe = await database.collection('superHeroes');
    let result = await superheroe.insertOne(req.data);

    if (result.insertedId) {
        req.data.id = result.insertedId;
    }

    return req.data;
}

async function _recuperarSuperheroes(req) {
    return req;
}

async function _actualizarSuperheroe(req) {
    return req.data;
}

async function _borrarSuperheroe(req) {
    return req;
}

module.exports = cds.service.impl(function() {

    const { superheroe } = this.entities;
    this.on("INSERT", superheroe, _CrearSuperheroe);
    this.on("READ", superheroe, _recuperarSuperheroes);
    this.on("UPDATE", superheroe, _actualizarSuperheroe);
    this.on("DELETE", superheroe, _borrarSuperheroe);

});