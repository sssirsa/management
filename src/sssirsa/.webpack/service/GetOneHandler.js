!function(e,t){for(var n in t)e[n]=t[n]}(exports,function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t){e.exports=require("mongoose")},function(e,t,n){const o=n(0);let r;o.Promise=global.Promise,e.exports=connectToDatabase=()=>r?(console.log("=> using existing database connection"),Promise.resolve()):(console.log("=> using new database connection"),o.connect("mongodb+srv://lalo:7EXlGBwqcI4u71ZQ@prueba-nztlg.mongodb.net/management?retryWrites=true&w=majority").then(e=>{r=e.connections[0].readyState}))},function(e,t,n){const o=n(0),r=new o.Schema({code:String,description:String});e.exports=o.model("Sssirsa",r)},,function(e,t,n){"use strict";const o=n(1),r=n(2),a=n(5);e.exports.getOne=async(e,t)=>{t.callbackWaitsForEmptyEventLoop=!1;var n=e.pathParameters.id;try{if(!(e&&e.pathParameters&&e.pathParameters.id))return{statusCode:400,headers:{"Content-Type":"application/json"},body:"No se ha indroducido ningún id para busqueda"};if(!a.isNumeric(e.pathParameters.id))return{statusCode:404,headers:{"Content-Type":"application/json"},body:"El id introducido no es un valor numerico valido"};o();let t=await async function(e){return new Promise((function(t,n){r.find({code:e},(function(e,o){e&&n({statusCode:500,body:JSON.stringify(e),headers:{"Content-Type":"application/json"}}),t(o)}))}))}(n);return 0==t.length?{statusCode:404,headers:{"Content-Type":"application/json"},body:"No se encontro estatus sssirsa con el id especificado"}:{statusCode:200,headers:{"Content-Type":"application/json"},body:JSON.stringify(t[0])}}catch(e){return{statusCode:500,headers:{"Content-Type":"application/json"},body:e.message}}}},function(e,t){e.exports=require("validator")}]));