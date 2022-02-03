const endpoint = 'https://uat-api.3ona.co/v2/{method}';

//below code from https://exchange-docs.crypto.com/spot/index.html#digital-signature
const crypto = require("crypto-js");

const signRequest = (request_body, api_key, secret) => {
    const { id, method, params, nonce } = request_body;

    function isObject(obj) { return obj !== undefined && obj !== null && obj.constructor == Object; }
    function isArray(obj) { return obj !== undefined && obj !== null && obj.constructor == Array; }
    function arrayToString(obj) { return obj.reduce((a, b) => { return a + (isObject(b) ? objectToString(b) : (isArray(b) ? arrayToString(b) : b)); }, ""); }
    function objectToString(obj) { return (obj == null ? "" : Object.keys(obj).sort().reduce((a, b) => { return a + b + (isArray(obj[b]) ? arrayToString(obj[b]) : (isObject(obj[b]) ? objectToString(obj[b]) : obj[b])); }, "")); }

    const paramsString = objectToString(params);

    console.log(paramsString);

    const sigPayload = method + id + api_key + paramsString + nonce;
    request_body.sig = crypto.HmacSHA256(sigPayload, secret).toString(crypto.enc.Hex);
};

const apiKey = "token"; /* User API Key */
const apiSecret = "secretKey"; /* User API Secret */

let request = {
    id: 11,
    method: "private/get-order-detail",
    api_key: process.env.read_api,
    params: {
        order_id: 53287421324
    },
    nonce: 1587846358253,
};

const requestBody = JSON.stringify(signRequest(request, apiKey, apiSecret));
console.log(requestBody);