'use strict';

const connectToDatabase = require('../../db');
const Fridge = require('./fridge');
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');

//#region Create
module.exports.create = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;             // Call the Create Function
    return connectToDatabase()
        .then(() =>
            create(JSON.parse(event.body))
        )
        .then(session => ({                                    // Return when the creation it's OK
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session)
        }))
        .catch(err => ({                                       // Return when find some error 
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'application/json' },
            body: err.message
        }));
}

function checkIfInputIsValid(eventBody) {
    if (!eventBody.economico) {
        return Promise.reject(new Error('IN-001'))
    }
    if (!eventBody.modelo_id) {
        return Promise.reject(new Error('IN-004'))
    }
    return Promise.resolve();
}

function create(eventBody) {
    return checkIfInputIsValid(eventBody)                       // Test validations 
        .then(() =>
            Fridge.findOne({ economico: eventBody.economico })        //check if Fridge exists
        )
        .then(economico =>
            economico
                ? Promise.reject(new Error('IN-002'))                  //Fridge exists
                : Fridge.create(eventBody)                             //Fridge not exists, Create new fridge
        )
}
//#endregion

//#region Get
module.exports.getOne = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(() =>
            getOne(event.pathParameters.id)
        )
        .then(session => ({
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session[0])
        }))
        .catch(err => ({
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'application/json' },
            body: { stack: err.stack, message: err.message }
        }));
};

function getOne(FridgeId) {
    return Fridge
        .find({ "economico": FridgeId })
        .then(fridge =>
            !fridge
                ? Promise.rejected('IN-003')
                : fridge
        )
        .catch(err => Promise.reject(new Error(err)));
};
//#endregion

//#region Update
module.exports.update = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
      .then(() =>
        update(JSON.parse(event.body),
          event.pathParameters.id)                         // Call the update function
      )
      .then(session => ({
        statusCode: 200,                                   // Return when update the Agency
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      }))
      .catch(err => ({                                     // Return when find some error
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'application/json' },
        body: { stack: err.stack, message: err.message }
      }));
  };

function update(eventBody, FridgeId) {
    return Fridge.findByIdAndUpdate(FridgeId, eventBody, { new: true })
        .then(fridge =>
            !fridge
                ? Promise.rejected('IN-003')
                : fridge
        )
        .catch(err => Promise.reject(new Error(err)));
};
  //#endregion

  //#region By_subsiadiary
  module.exports.bysubsidiary = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    switch (event.queryStringParameters.attribute){
        case "marca":
        {
        return connectToDatabase()
            .then(() => 
                bybrand(event.pathParameters.id)           
            )        
            .then(session => ({
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session[0])
        }))
        .catch(err => ({
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'application/json' },
            body: { stack: err.stack, message: err.message }
        }));
        }            
        break;
        case "tipo":
        {
        return connectToDatabase()
            .then(() => 
                bykind(event.pathParameters.id)           
            )        
            .then(session => ({
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session[0])
        }))
        .catch(err => ({
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'application/json' },
            body: { stack: err.stack, message: err.message }
        }));
        }
        break;
        case "nuevo":
            {
            return connectToDatabase()
                .then(() => 
                    bynew(event.pathParameters.id)           
                )        
                .then(session => ({
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session[0])
            }))
            .catch(err => ({
                statusCode: err.statusCode || 500,
                headers: { 'Content-Type': 'application/json' },
                body: { stack: err.stack, message: err.message }
            }));
            }
        break;
        case "condition":
            {
            return connectToDatabase()
                .then(() => 
                    bycondition(event.pathParameters.id)           
                )        
                .then(session => ({
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session[0])
            }))
            .catch(err => ({
                statusCode: err.statusCode || 500,
                headers: { 'Content-Type': 'application/json' },
                body: { stack: err.stack, message: err.message }
            }));
            }
        break;
        case "year":
            {
            return connectToDatabase()
                .then(() => 
                    byyear(event.pathParameters.id)           
                )        
                .then(session => ({
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session[0])
            }))
            .catch(err => ({
                statusCode: err.statusCode || 500,
                headers: { 'Content-Type': 'application/json' },
                body: { stack: err.stack, message: err.message }
            }));
            }
        break;
        case "unilever":
            {
            return connectToDatabase()
                .then(() => 
                    byunilever(event.pathParameters.id)           
                )        
                .then(session => ({
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session[0])
            }))
            .catch(err => ({
                statusCode: err.statusCode || 500,
                headers: { 'Content-Type': 'application/json' },
                body: { stack: err.stack, message: err.message }
            }));
            }
        break;
        case "modelo":
            {
            return connectToDatabase()
                .then(() => 
                    bymodelo(event.pathParameters.id)           
                )        
                .then(session => ({
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session[0])
            }))
            .catch(err => ({
                statusCode: err.statusCode || 500,
                headers: { 'Content-Type': 'application/json' },
                body: { stack: err.stack, message: err.message }
            }));
            }
        break;
    }
};

function bybrand(FridgeId) {
    return Fridge
    .aggregate( [
        {
            $facet: {
                "total":[{$match:{"sucursal._id":ObjectId(FridgeId)}},
                { $group: { _id: null, cantidad: { $sum: 1 } } }],
                            "AHT":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"AHT"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                "CARPOL":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"CARPOL"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "ENERFREEZER":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"ENERFREEZER"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "ESPECIAL":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"ESPECIAL"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "FRICON":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"FRICON"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "HAIER":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"HAIER"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "IMBERA":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"IMBERA"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "METALFRIO":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"METALFRIO"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "OJEDA":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"OJEDA"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "S/M":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"S/M"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "MIMET":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.marca.nombre":"MIMET"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }]           
            }
        } ] )
        .then(total =>
            !total
                ? Promise.rejected('IN-003')
                : total
        )
        .catch(err => Promise.reject(new Error(err)));
};


function bykind(FridgeId) {
    return Fridge
    .aggregate( [
        {
            $facet: {
                "total":[{$match:{"sucursal._id":ObjectId(FridgeId)}},
                { $group: { _id: null, cantidad: { $sum: 1 } } }],
                            "MIN B PUSH":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"MIN B PUSH"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                "COUNTER TOP":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"COUNTER TOP"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "KIOSCO":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"KIOSCO"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "AT2":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"AT2"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "AT3":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"AT3"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "S/R":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"S/R"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "BICICLETA":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"BICICLETA"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "CARRITO":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"CARRITO"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "170":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"170"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "JAMAICA":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"JAMAICA"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "TAPA DE COFRE":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"TAPA DE COFRE"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "VERTICAL":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"VERTICAL"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "AT4":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"AT4"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                         "AT1":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.tipo.nombre":"AT1"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }]                       
            }
        } ] )
        .then(total =>
            !total
                ? Promise.rejected('IN-003')
                : total
        )
        .catch(err => Promise.reject(new Error(err)));
};


function bynew(FridgeId) {
    return Fridge
    .aggregate( [
        {
            $facet: {
                "total":[{$match:{"sucursal._id":ObjectId(FridgeId)}},
                { $group: { _id: null, cantidad: { $sum: 1 } } }],
                            "NUEVO":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"nuevo":true}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }]                   
            }
        } ] )
        .then(total =>
            !total
                ? Promise.rejected('IN-003')
                : total
        )
        .catch(err => Promise.reject(new Error(err)));
};

function bycondition(FridgeId) {
    return Fridge
    .aggregate( [
        {
            $facet: {
                "total":[{$match:{"sucursal._id":ObjectId(FridgeId)}},
                { $group: { _id: null, cantidad: { $sum: 1 } } }],
                            "A":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"condicion.letra":"A"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "B":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"condicion.letra":"B"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "C":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"condicion.letra":"C"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "D":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"condicion.letra":"D"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],                               
            }
        } ] )
        .then(total =>
            !total
                ? Promise.rejected('IN-003')
                : total
        )
        .catch(err => Promise.reject(new Error(err)));
};

function byyear(FridgeId) {
    return Fridge
    .aggregate( [
        {
            $facet: {
                "total":[{$match:{"sucursal._id":ObjectId(FridgeId)}},
                { $group: { _id: null, cantidad: { $sum: 1 } } }],
                            "2000":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2000"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2001":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2001"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2002":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2002"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2003":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2003"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "2004":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2004"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2005":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2005"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2006":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2006"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2007":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2007"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "2008":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2008"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2009":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2009"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2010":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2010"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2011":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2011"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "2012":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2012"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2013":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2013"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2014":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2014"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2015":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2015"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "2016":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2016"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2017":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2017"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2018":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2018"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                                        "2019":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2019"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],   
                                        "2020":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"year":"2020"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],                                                                                       
            }
        } ] )
        .then(total =>
            !total
                ? Promise.rejected('IN-003')
                : total
        )
        .catch(err => Promise.reject(new Error(err)));
};

function byunilever(FridgeId) {
    return Fridge
    .aggregate( [
        {
            $facet: {
                "total":[{$match:{"sucursal._id":ObjectId(FridgeId)}},
                { $group: { _id: null, cantidad: { $sum: 1 } } }],
                            "Buen Estado":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Buen Estado"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "Pendiente Cliente":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Pendiente Cliente"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "En tránsito":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"En tránsito"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "Cliente":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Cliente"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "Reparación":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Reparación"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "Obsoleto":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Obsoleto"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "Prospecto":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Prospecto"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "Estraviado":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Estraviado"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "Garantia":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Garantia"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "Obsoleto por Aprobar":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Obsoleto por Aprobar"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "Prestamo":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Prestamo"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                             "Operaciónes Internar":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"estatus_unilever.description":"Operaciónes Internar"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }]                                                                                                                                                                                                                                                                                                                                       
            }
        } ] )
        .then(total =>
            !total
                ? Promise.rejected('IN-003')
                : total
        )
        .catch(err => Promise.reject(new Error(err)));
};


function bymodelo(FridgeId) {
    return Fridge
    .aggregate( [
        {
            $facet: {
                "total":[{$match:{"sucursal._id":ObjectId(FridgeId)}},
                { $group: { _id: null, cantidad: { $sum: 1 } } }],
                            "KIOSCO":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"KIOSCO"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],                       
                            "METALFRIO BD365":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO BD365"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "METALFRIO SD180":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO SD180"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "METALFRIO CHC200":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO CHC200"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "CARRITO CINEPOLIS":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"CARRITO CINEPOLIS"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "PROMOTORA":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"PROMOTORA"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "AHT GTVS36":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"AHT GTVS36"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "OJEDA CVP15":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CVP15"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "VISIMAX SLIM":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"VISIMAX SLIM"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "FRICON THG6":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"FRICON THG6"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "HAIER SD298C":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"HAIER SD298C"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "METALFRIO SD260":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO SD260"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "OJEDA CHP170HE":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP170HE"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "IMBERA VHP2":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"IMBERA VHP2"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "HAPPY PUSH":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"HAPPY PUSH"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "ATH RIOS100":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"ATH RIOS100"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "OJEDA CT90":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CT90"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "JAMAICA 13":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"KIOSCO"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "KIOSCO":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"JAMAICA 13"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "VERTICAL REB804LED":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"VERTICAL REB804LED"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "OJEDA CVP15H":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CVP15H"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],                                                                                                                                                                                                                                    
                            "OJEDA CVP15HE":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CVP15HE"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "FRICON MBC125":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"FRICON MBC125"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "ECONIC 300":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"ECONIC 300"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "METALFRIO MSC30":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO MSC30"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "IARP AT200":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"IARP AT200"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "IMBERA EHF07":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"IMBERA EHF07"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "COOL PUSH":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"COOL PUSH"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "VISIMAX":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"VISIMAX"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "FRICON HFSC293":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"FRICON HFSC293"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "OJEDA CHP 68T":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP 68T"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],                                                                                                            
                            "SIN DATOS":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"SIN DATOS"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "ENERFREEZER TTGN":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"ENERFREEZER TTGN"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "METALFRIO CPC25":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO CPC25"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "GEMINIS BICICLETA":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"GEMINIS BICICLETA"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "MIMET CV580A":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"MIMET CV580A"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "CARRITO IMBIMA":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"CARRITO IMBIMA"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "IMBERA EH10":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"IMBERA EH10"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "METALFRIO SD282":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO SD282"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "OJEDA CHP68":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP68"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],
                            "METALFRIO SD45":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO SD45"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],             
                            "OJEDA CHP170H":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP170H"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],  
                            "METALFRIO REB220":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO REB220"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],  
                            "OJEDA CHP68H":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP68H"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],  
                            "ENERFREEZER SD260":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"ENERFREEZER SD260"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],  
                            "METALFRIO CVC15HC23IA VERTICAL":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO CVC15HC23IA VERTICAL"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],  
                            "METALFRIO HI30CA":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO HI30CA"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],  
                            "FRICON THG6":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"FRICON THG6"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],  
                            "METALFRIO MSC41":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO MSC41"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],  
                            "METALFRIO MSC70":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO MSC70"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],  
                            "AHT RIOS68":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"AHT RIOS68"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],                                                                                                                                                                                                             
                            "CARRITO MERCADERO":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"CARRITO MERCADERO"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],    
                            "AHT SL 29":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"AHT SL 29"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],    
                            "AHT RIOS125":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"AHT RIOS125"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],    
                            "METALFRIO SD182":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO SD182"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],    
                            "METALFRIO MDC52":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO MDC52"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],    
                            "AHT CF100":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"AHT CF100"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],    
                            "ENERFREEZER SD180":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"ENERFREEZER SD180"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],    
                            "IMBERA VF04":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"IMBERA VF04"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],    
                            "OJEDA CHP68HE":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP68HE"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],    
                            "CARAVELL":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"CARAVELL"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],     
                            "METALFRIO CVC04":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO CVC04"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],     
                            "OJEDA CHP125H":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP125H"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],     
                            "OJEDA CT90H":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CT90H"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],     
                            "OJEDA CHP105T":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP105T"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],     
                            "OJEDA CHP125T":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP125T"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],     
                            "OJEDA CHP105H":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP105H"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],     
                            "OJEDA CHP170":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP170"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],     
                            "HAPPY PLAYA":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"HAPPY PLAYA"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],     
                            "FRICON HFSL388":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"FRICON HFSL388"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],     
                            "BY0GP1E0U":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"BY0GP1E0U"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],               
                            "OJEDA CHP68L":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP68L"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],   
                            "OJEDA CHP125":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP125"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],   
                            "METALFRIO CVC08":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"METALFRIO CVC08"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],   
                            "OJEDA CHP105HE":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP105HE"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],   
                            "HUSSMAN":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"HUSSMAN"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],   
                            "OJEDA CHP105":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP105"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],   
                            "OJEDA CHP83":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP83"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],   
                            "OJEDA CHP125L":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"OJEDA CHP125L"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }],   
                            "SOFT HK22SA5463":[{$match:{ $and :[{"sucursal._id":ObjectId(FridgeId)},{"modelo.nombre":"SOFT HK22SA5463"}]}},
                { $group: { _id: null, cantidad: { $sum: 1 }, economico:{ $push: "$economico"} } }]                                                                                                                                                                                                                                                                                                                                        
            }    
        } ] )
        .then(total =>
            !total
                ? Promise.rejected('IN-003')
                : total
        )
        .catch(err => Promise.reject(new Error(err)));
};
//#endregion