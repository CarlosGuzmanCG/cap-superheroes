const cds = require("@sap/cds");
const { message } = require("@sap/cds/lib/log/cds-error");
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");
dotenv.config();

const sMongoUrl = process.env.MONGO_URL;
const sDbName = process.env.DATABASE_NAME;
const client = new MongoClient(sMongoUrl);

async function _CrearSuperheroe(req) {
    if (req.data.franquicia != "Marvel" && req.data.franquicia != "DC") {
        req.error({ code: 400, message: "La franquicia debe ser Marvel o DC" });
    }

    await client.connect();
    let database = await client.db(sDbName);
    let superheroe = await database.collection("superHeroes");
    let result = await superheroe.insertOne(req.data);

    if (result.insertedId) {
        req.data.id = result.insertedId;
    }

    return req.data;
}

async function _recuperarSuperheroes(req) {
    await client.connect();
    let database = await client.db(sDbName);
    let superheroes = await database.collection("superHeroes"); //colección de la base de datos

    let ilimit, ioffset, oFilter;

    ilimit = 9999;
    ioffset = 0;

    //top y skip -> ?$top=2&$skip=1
    console.log(req.query.SELECT.limit);

    if (req.query.SELECT.limit) {
        console.log(req.query.SELECT.limit);


        ilimit = req.query.SELECT.limit.rows.val;

        console.log("ilimit: " + req.query.SELECT.limit.rows.val);

        if (req.query.SELECT.ilimit) { //si existe el limit
            ioffset = req.query.SELECT.limit.offset.val;
        } else {
            ioffset = 0;
        }

        if (req.query.SELECT.limit.offset) { //si existe el offset
            ioffset = req.query.SELECT.limit.offset.val;
        } else {
            ioffset = 0;
        }
    } else {
        ilimit = 9999;
        ioffset = 0;
    }

    //Implementación del Filter

    // console.log("Filtro: "+oFilter);
    if (req.query.SELECT.one) {
        let sId = req.query.SELECT.from.ref[0].where[2].val;
        console.log("sId: " + sId);
        oFilter = {
            "_id": ObjectId.createFromHexString(sId)
        };
        // console.log("oFilter: "+oFilter);
    }

    // let result = await superheroes.find(oFilter).limit(ilimit).skip(ioffset).toArray();
    let result = await superheroes.find(oFilter).limit(ilimit + ioffset).toArray();
    // console.log("resultado: " + JSON.stringify(result));
    // console.log("resultado: " + result.length);

    //Mapping
    for (let i = 0; i < result.length; i++) {
        // console.log(`result[${i}]._id = `+result[i]._id);
        // console.log(`result[${i}]._id = `+result[i]._id.toString());
        result[i].id = result[i]._id.toString();
    }

    result = result.slice(ioffset);

    return result;
}

async function _actualizarSuperheroe(req) {

    await client.connect();
    let database = await client.db(sDbName);
    let superheroes = await database.collection("superHeroes");

    let oSuperHeroe = req.data; //objeto que viene en la petición
    // console.log("resultado" + JSON.stringify(oSuperHeroe));

    let sId = ObjectId.createFromHexString(oSuperHeroe.id);
    delete oSuperHeroe.id; //borramos el id del objeto

    let oResult = await superheroes.updateOne({ _id: sId }, { $set: oSuperHeroe });
    // console.log("resultado: " + JSON.stringify(oResult));

    if (oResult.modifiedCount > 0) {
        return oSuperHeroe;
    } else {
        return oResult;
    }

}

async function _borrarSuperheroe(req) {
    await client.connect();
    let database = await client.db(sDbName);
    let superheroes = await database.collection("superHeroes");

    let oSuperHeroe = req.data; //objeto que viene en la petición
    let sId = ObjectId.createFromHexString(oSuperHeroe.id);
    let result = await superheroes.deleteOne({ _id: sId });
    return result;
}

module.exports = cds.service.impl(function () {
    const { superheroe } = this.entities;
    this.on("INSERT", superheroe, _CrearSuperheroe);
    this.on("READ", superheroe, _recuperarSuperheroes);
    this.on("UPDATE", superheroe, _actualizarSuperheroe);
    this.on("DELETE", superheroe, _borrarSuperheroe);
});
