/* From https://exchange-docs.crypto.com/spot/index.html#digital-signature */
const crypto = require("crypto-js");

const signRequest =
    /**
     * Generate digital signature for a request using API key secret
     * @param {Request} request_body full API request's body
     * @param {*} api_key public API key
     * @param {*} secret secret API key
     * @returns  the request's body the digital signature = request body's hex value encoded with API secret
     */
    (request_body, api_key, secret) => {
        const { id, method, params, nonce } = request_body;

        /**preamlbe to order params in ascending (alphabetical) order**/
        function isObject(obj) { return obj !== undefined && obj !== null && obj.constructor == Object; }
        function isArray(obj) { return obj !== undefined && obj !== null && obj.constructor == Array; }
        function arrayToString(obj) { return obj.reduce((a, b) => { return a + (isObject(b) ? objectToString(b) : (isArray(b) ? arrayToString(b) : b)); }, ""); }
        /**sort params**/
        function objectToString(obj) { return (obj == null ? "" : Object.keys(obj).sort().reduce((a, b) => { return a + b + (isArray(obj[b]) ? arrayToString(obj[b]) : (isObject(obj[b]) ? objectToString(obj[b]) : obj[b])); }, "")); }

        const paramsString = objectToString(params);

        /**request url + params*/
        const sigPayload = method + id + api_key + paramsString + nonce;
        /**encode request string with crypto[graphic] key's hex value**/
        request_body.sig = crypto.HmacSHA256(sigPayload, secret).toString(crypto.enc.Hex);
        return request_body;
    };

/**
 * A request Crypto.com exchange API
 */
class SpotRequest {

    /**
     * Constructor to return a new SpotRequest
     * @param {String} method method to be invoked
     * @param {Number} id request identifier 
     * @param {String} apiKey public API key
     * @param {Object} params parameters for the method
     * @param {Number} time Current timestamp in milliseconds since the Unix epoch
     * @param {String} apiSecret private/sercret API key
     */
    constructor(id, method, apiKey, params, time, apiSecret) {
        this.id =
            this.method =
            this.apiKey =
            this.params =
            this.time =
            this.sig = null;
        if (!!method && typeof method === 'string' && !!time && typeof time === 'object') {
            this.id = id;
            this.method = method;
            this.apiKey = apiKey;
            this.params = params;
            this.time = time;
            signRequest(this, apiKey, apiSecret);
        }
    }
};
