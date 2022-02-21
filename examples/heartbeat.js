// Websocket connection
const ws = require('ws');
const endpoints = require('../modules/endpoints');
const methods = require('../modules/methods');

/**To count how long to keep the connection alive/open */
let alive = 2;
let count = 0;
/* Cn be used for user or market endpoint*/
const websocket = new ws.WebSocket(endpoints.uat.websocket.user);
websocket.on('error', err => {
    console.error(`Error: ${err}\n`);
});

websocket.on('open', () => {
    console.log('websocket opened to - ' + websocket.url);
    console.log("We'll keep this socket alive for 1 minute or 2 heatbeats.");
});

websocket.on('message', (data, isbinary) => {
    const msg = JSON.parse(data);
    const id = msg.id;
    const method = msg.method;
    console.log("\nNew message received!\n" + data + '\n');
    if (method === methods.public.heartbeat && alive-- > 0) {
        console.log("The message is the websocket heartbeat");
        console.log("This is heartbet no." + ++count + '\n');
        let response = { id: id, method: methods.public.respond };
        response = JSON.stringify(response);
        console.log("We'll send this response\n" + response);
        websocket.send(response);
    }
    else if (method === methods.public.heartbeat)
        console.log("A heartbeat has been received, but we'll let the connection close now.");
});

websocket.on('close', (code, reason) => {
    console.log("\nWebSocket closed");
    console.log(`Exit code: ${code}\nReason: ${reason}`);
});