# Websockets

Thanks to\
[![JAVASCRIPT.INFO LOGO](https://javascript.info/img/sitetoolbar__logo_en-white.svg)](https://javascript.info/)\
Also check out [WebSockets and Node.js - testing WS and SockJS by building a web app | Ably Blog: Data in Motion](https://ably.com/blog/web-app-websockets-nodejs)

For more information refer to [JAVASCRIPT.INFO](https://javascript.info/websocket) or [MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## Blurb

A websocket is another web to communicate to servers. In javascript you can use it to send messages and recive messages, making it great for APIs.

![A comparison diagram of HTTP to Websocket connections](https://blog.scaleway.com/content/images/2021/02/websockets-bigger-4.png)

## What is a websocket?

The WebSocket protocol, described in the specification [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455) provides a way to exchange data between browser and server via a persistent connection. The data can be passed in both directions as “packets”, without breaking the connection and send additional HTTP-requests.

WebSocket is especially great for services that require continuous data exchange, e.g. online games, real-time trading systems and so on.

## A simple example

To open a websocket connection, we need to create new WebSocket using the special protocol _ws_ in the url: `let socket = new WebSocket("ws://javascript.info");`

There’s also encrypted wss:// protocol. It’s like _HTTPS_ for websockets.\
**Always prefer wss://**

- The wss:// protocol is not only encrypted, but also more reliable.
- That’s because ws:// data is not encrypted, visible for any intermediary. Old proxy servers do not know about WebSocket, they may see “strange” headers and abort the connection.
- On the other hand, wss:// is WebSocket over TLS, (same as HTTPS is HTTP over TLS), the transport security layer encrypts the data at sender and decrypts at the receiver. So data packets are passed encrypted through proxies. They can’t see what’s inside and let them through.

Once the socket is created, we should listen to events on it. There are totally 4 events:

- **open** – connection established,
- **message** – data received,
- **error** – websocket error,
- **close** – connection closed.
  
…And if we’d like to send something, then socket.send(data) will do that.

Here’s an example:

```javascript
let socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");

socket.onopen = function(e) {
  alert("[open] Connection established");
  alert("Sending to server");
  socket.send("My name is John");
};

socket.onmessage = function(event) {
  alert(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};
```

**Thanks to [JAVASCRIPT.INFO](https://javascript.info/websocket) for their website and server for functional examples**\
For demo purposes, there’s a small server [server.js](https://javascript.info/article/websocket/demo/server.js) written in Node.js, for the example above, running. It responds with “Hello from server, John”, then waits 5 seconds and closes the connection.

So you’ll see events open ⇒ message ⇒ close.

That’s actually it, we can talk WebSocket already. Quite simple, isn’t it?

Now let’s talk more in-depth.

## Opening a websocket

When `new WebSocket(url)` is created, it starts connecting immediately.

During the connection the browser (using headers) asks the server: “Do you support Websocket?” And if the server replies “yes”, then the talk continues in WebSocket protocol, **which is not HTTP at all.**
![Diagram of a websocket connection instantiation](https://miro.medium.com/max/500/1*0w3tMXm7jr174bqOprcdOg.png)

_The 'Handshake (HTTP Upgrade) is the said “Do you support Websocket?”. The server responds with yes, which is represented by the returning red arrow followed by the open connection._

Here’s an example of browser headers for request made by `new WebSocket("wss://javascript.info/chat")`.

```txt
1. GET /chat
2. Host: javascript.info
3. Origin: <https://javascript.info>
4. Connection: Upgrade
5. Upgrade: websocket
6. Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
7. Sec-WebSocket-Version: 13
```

- **Origin** – the origin of the client page, e.g. `https://javascript.info`. WebSocket objects are cross-origin by nature.
  - **Cross-orgin** - they can traverse to multiple destination and thus the previous page is no longer the origin. I.e.

  There are no special headers or other limitations. Old servers are unable to handle WebSocket anyway, so there are no compatibility issues. But Origin header is important, as it allows the server to decide whether or not to talk WebSocket with this website.
Connection: Upgrade – signals that the client would like to change the protocol.
Upgrade: websocket – the requested protocol is “websocket”.
Sec-WebSocket-Key – a random browser-generated key for security.
Sec-WebSocket-Version – WebSocket protocol version, 13 is the current one.
