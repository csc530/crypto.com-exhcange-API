/* From https://exchange-docs.crypto.com/spot/index.html#digital-signature */
//loads env vars from .env file
const { parsed: keys } = require("dotenv").config(
    //REPLACE: with .env path
    { path: './../.env' }
);

const crypto = require("crypto-js");
/**
     * From https://exchange-docs.crypto.com/spot/index.html#digital-signature
     * Generate digital signature for a request using API key secret
     * @param {SpotRequest} request_body full API request's body
     * @param {String} api_key public API key
     * @param {String} secret secret API key
     * @returns {String} the request's body the digital signature = request body's hex value encoded with API secret
     */
const signRequest = (request_body, api_key, secret) => {
    const { id, method, params, nonce } = request_body;

    /**preamble to order params in ascending (alphabetical) order**/
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
    nonce: new Date().getTime(),//1587846358253 example's dummy value,
};

console.log(signRequest(request, apiKey, apiSecret));