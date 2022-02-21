const uat = {
    rest: 'https://uat-api.3ona.co/v2',
    websocket: {
        user: 'wss://uat-stream.3ona.co/v2/user',
        market: 'wss://uat-stream.3ona.co/v2/market'
    }
}
const production = {
    rest: 'https://api.crypto.com/v2',
    websocket: {
        user: 'wss://stream.crypto.com/v2/user',
        market: 'wss://stream.crypto.com/v2/market'
    }
}

const send = { uat, production }
module.exports = send;