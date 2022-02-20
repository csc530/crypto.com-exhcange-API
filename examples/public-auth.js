// Websocket connection
const ws = require('ws');
const { parsed: keys } = require('dotenv').config({ path: '../.env' });
const req = require('express/lib/request');
const https = require('https');
const endpoints = require('../modules/endpoints');
const methods = require('../modules/methods');
const spotRequest = require('../modules/spotRequest');

//create a spot request object, only to authorize the connection
let request = spotRequest.createSpotRequest(111, methods.auth, keys.read_api, {}, new Date().getTime(), keys.read_secret);
//genereate the digital Signature
request.generateSignature(keys.read_secret);
const url = request.toURL(endpoints.uat.websocket.user, methods.auth);
// console.log(url);

// To open a web socket connection
//only enter the endpoint and everything else a parameter(?)
const websocket = new ws.WebSocket(endpoints.uat.websocket.user);
websocket.on('error', err => {
	console.error(`Error: ${err}\n`);
});
websocket.on('open', () => {
	console.log('opened websocket to -');
    //when the connection is opened send (JSON) info
    //for their method and it's required parameters
    websocket.send()
    console.log(websocket.url);
    console.log();
});
websocket.on('message', (data,isbinary) => {
    console.log("Incoming msg:");
    console.log(data + "\nBinary: " + isbinary+"\n");
});
websocket.on('close', (code, reason)=>{
    console.log("WebSocket closed");
    console.log(`Exit code: ${code}\nReason: ${reason}`);
});