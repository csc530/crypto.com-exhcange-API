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
        console.log('Hello message sent\n');
		echo.send(newMSG, err=>console.error('Thank you msg sent\n'));
        // if close was outside of the brackets the ws is closed
        // b4 the thank you msg is sent
        echo.close();
	});

    //ping server
	// echo.ping('ping', false)
});
echo.on('message', (msg, isbinary) => {
	console.log(`Incoming message: ${msg}`);
	console.log('This message is binary: ' + isbinary);
	// console.debug(msg);
	//   console.dir(msg);
	//Respond to the message
    if(msg === 'hello')
	echo.send(msg, err => (err ? console.error(err) : null));
});
echo.on('pong', data => console.log('Ping-pong: ' + data));
echo.on('close', code => console.log(code+"\nBye-bye"))

// ? NOTE a websocket will throw an error if you try to close it when it's sending a message 
//refer to ln 25-26 and ln 17