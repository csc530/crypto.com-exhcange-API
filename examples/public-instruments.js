// Websocket connection
const ws = require('ws');
const { parsed: keys } = require('dotenv').config({ path: '../.env' });
const endpoints = require('../modules/endpoints');
const methods = require('../modules/methods');
const spotRequest = require('../modules/spotRequest');
const instrument = require('../modules/instrument');

let nonce = new Date().getTime();
const key = keys.test_key;
const secret = keys.test_secret;

const websocket = new ws.WebSocket(endpoints.uat.websocket.user);

websocket.on('open', () => {
    console.log('websocket opened to - ' + websocket.url);
    let request = new spotRequest.SpotRequest(530, methods.public.get.instruments, key, {}, nonce, secret);
    websocket.send(request.stringify());
});

websocket.on('message', (data, isbinary) => {
    const msg = JSON.parse(data);
    const instruments = Array(msg.result);
    instruments.forEach(e => e = instrument.createInstrument(e));
    console.log("Raw: \n" + data);
    console.log("Parsed: \n" + msg);
});


websocket.on('close', (code, reason) => {
    console.log("\nWebSocket closed");
    console.log(`Exit code: ${code}\nReason: ${reason}`);
});
websocket.on('error', err => {
    console.error(`Error: ${err}\n`);
});
