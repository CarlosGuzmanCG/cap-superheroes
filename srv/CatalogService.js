const cds =  require('@sap/cds');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();

const sMongoUrl = process.env.MONGO_URL;
const sDbName = process.env.DATABASE_NAME;
const client = new MongoClient(sMongoUrl, { useUnifiedTopology: true });

async function _CrearSuperheroe(req) {
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