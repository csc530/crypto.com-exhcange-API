/* From https://exchange-docs.crypto.com/spot/index.html#digital-signature */
//loads env vars from .env file
const { parsed: keys } = require("dotenv").config();
const crypto = require("crypto-js");

const signRequest = (request_body, api_key, secret) => {
    const { id, method, params, nonce } = request_body;

    /**preamlbe to order params in ascending (alphabetical) order**/
    function isObject(obj) { return obj !== undefined && obj !== null && obj.constructor == Object; }
    function isArray(obj) { return obj !== undefined && obj !== null && obj.constructor == Array; }
    function arrayToString(obj) { return obj.reduce((a, b) => { return a + (isObject(b) ? objectToString(b) : (isArray(b) ? arrayToString(b) : b)); }, ""); }
    /**sort params**/
    function objectToString(obj) { return (obj == null ? "" : Object.keys(obj).sort().reduce((a, b) => { return a + b + (isArray(obj[b]) ? arrayToString(obj[b]) : (isObject(obj[b]) ? objectToString(obj[b]) : obj[b])); }, "")); }

    const paramsString = objectToString(params);

    console.log(paramsString);
    /**request url + params*/
    const sigPayload = method + id + api_key + paramsString + nonce;
    /**encode request string with crypto[graphic] key's hex value**/
    request_body.sig = crypto.HmacSHA256(sigPayload, secret).toString(crypto.enc.Hex);
    return request_body;
};

const apiKey = keys.read_api; /* REPLACE: User API Key */
const apiSecret = keys.read_secret; /* REPLACE: User API Secret */

//ensure keys are correctly obtained
console.log("api key: " + apiKey + "\napi secret: " + apiSecret);

let request = {
    id: 11,
    //recall: Basics -> Requests
    method: "private/get-order-detail",
    api_key: apiKey,
    params: {
        order_id: 53287421324
    },
    nonce: 1587846358253,
};

const requestBody = JSON.stringify(signRequest(request, apiKey, apiSecret));
console.log(requestBody);