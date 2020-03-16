'use strict';

const connectToDatabase = require('../../db');
const FridgeModel = require('../../models/Fridgemodel');
const mongoose = require('mongoose');

module.exports.create = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
      .then(() =>
        create(JSON.parse(event.body))          //Call the create function
      )
      .then(session => ({                         // Return when the creation it's OK
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      }))
      .catch(err => ({                            // Return when find some error
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'application/json' },
        body: err.message
      }));
  }
  
  function checkIfInputIsValid(eventBody) {
    if (!eventBody.nombre) {                           // Check if contains name
      return Promise.reject(new Error('MG-010'))
    }
    return Promise.resolve();
  }
  
  function create(eventBody) {
    return checkIfInputIsValid(eventBody)               // Test validations
      .then(() =>
        FridgeModel.findOne({ nombre: eventBody.nombre }) //check if FridgeModel exists
      )
      .then(nombre =>
        nombre
          ? Promise.reject(new Error('MG-028'))                 //Fridgemodel exists
          : FridgeModel.create(eventBody)                       //Fridgemodel not exists, Create new fridgemodel
      )
      .catch(err => Promise.reject(new Error(err)));
  };
  