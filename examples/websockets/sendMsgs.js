const ws = require('ws');
// ? Sending information
// We will send a hello message to the ech websocket server
const echo = new ws.WebSocket('wss://ws.postman-echo.com/raw');
echo.on('open', websocket => {
	console.log(`WebSocket opened to ${echo.url}:\nReady state = ${echo.readyState}\n`);
	// ? Sending a message
	//this should always be done in the on open method
	//or any scope to ensure the websocket connection is ready to send messages
	echo.send('hello', err => {
		//A callback function that could have an error
		const newMSG = "I'm glad you got my message";
		echo.send(newMSG);
	});

    //ping server
	echo.ping('ping', false, err => console.error(err));
});
echo.on('message', (msg, isbinary) => {
	console.log(`Incoming message: ${msg}`);
	console.log('This message is binary: ' + isbinary);
	// console.debug(msg);
	//   console.dir(msg);
	//Respond to the message
	echo.send(msg, err => (err ? console.error(err) : null));
});
echo.on('pong', data => console.log('Ping-pong: ' + data));
