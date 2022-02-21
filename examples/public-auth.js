// Websocket connection
const ws = require('ws');
const { parsed: keys } = require('dotenv').config({ path: '../.env' });
const endpoints = require('../modules/endpoints');
const methods = require('../modules/methods');
const spotRequest = require('../modules/spotRequest');
const key = keys.test_key;
const secret = keys.test_secret;
const crypto = require('crypto-js');

//create a spot request object, only to authorize the connection
let request = spotRequest.createSpotRequest(53, methods.public.auth, key, {}, new Date().getTime());

/* To open a web socket connection only enter the endpoint and everything else a parameter in the messages(send)*/
const websocket = new ws.WebSocket(endpoints.uat.websocket.user);
websocket.on('error', err => {
    console.error(`Error: ${err}\n`);
});

websocket.on('open', () => {
    console.log('websocket opened to - ' + websocket.url);
    //genereate the digital Signature
    request.generateSignature(secret);
    //when the connection is opened send (JSON) info
    //for their method and it's required parameters
    const send = request.stringify();
    console.log("send params = \n" + send);
    websocket.send(send)
});

websocket.on('message', (data, isbinary) => {
    console.log(`\nMsg:\n${data}`);
});

websocket.on('close', (code, reason) => {
    console.log("\nWebSocket closed");
    console.log(`Exit code: ${code}\nReason: ${reason}`);
});

