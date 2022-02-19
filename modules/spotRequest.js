const crypto = require('crypto-js');
const { isArray, isObject, objectToString } = require('./objToString');

const signRequest =
	/**
	 * From https://exchange-docs.crypto.com/spot/index.html#digital-signature
	 * Generate digital signature for a request using API key secret
	 * @param {SpotRequest} request_body full API request's body
	 * @param {String} api_key public API key
	 * @param {String} secret secret API key
	 * @returns {String} the request's body the digital signature = request body's hex value encoded with API secret
	 */
	(request_body, api_key, secret) => {
		const { id, method, params, time, apiKey } = request_body;
		const paramsString = objectToString(params);
		/**request url + params*/
		const sigPayload = method + id + apiKey + paramsString + time;
		/**encode request string with crypto[graphic] key's hex value**/
		request_body.sig = crypto.HmacSHA256(sigPayload, secret).toString(crypto.enc.Hex);
		return request_body.sig;
	};

/**
 * A request to Crypto.com exchange API
 */
class SpotRequest {
	/**method to be invoked*/
	method = '';
	/**request identifier*/
	id = 0;
	/**public API key*/
	apiKey = '';
	/**parameters for the method*/
	params = {};
	/**Current timestamp in milliseconds since the Unix epoch*/
	time = -1;
	/**the digital signature for this API request*/
	sig = '';
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
		this.id = this.method = this.apiKey = this.params = this.time = this.sig = null;
		if (!!method && typeof method === 'string' && !!time && typeof time === 'number') {
			this.id = id;
			this.method = method;
			this.apiKey = apiKey;
			this.params = params;
			this.time = time;
			this.sig = signRequest(this, apiKey, apiSecret);
		} else {
			console.error('Method ' + method + '\ntime ' + time + '');
		}
	}
	/**
	 * configure each property of the request
	 * @param {String} method method to be invoked
	 * @param {Number} id request identifier
	 * @param {String} apiKey public API key
	 * @param {Object} params parameters for the method
	 * @param {Number} time Current timestamp in milliseconds since the Unix epoch
	 * @param {String} sig the signature for the API request
	 */
	config(id, method, apiKey, params, time, sig) {
		this.id = id;
		this.method = method;
		this.apiKey = apiKey;
		this.params = params;
		this.time = time;
		this.sig = sig;
	}
	/**
	 * Generates a digital signature of this API request
	 * @param {String} apiSecret API secret key
	 * @returns {String} digital signature for this request
	 */
	generateSignature(apiSecret) {
		this.sig = signRequest(this, this.apiKey, apiSecret);
		return this.sig;
	}
	/**
	 * returns a qualified url of the spot request with each property as a parameter
	 * @param {String} endpoint the endpoint of the url terminated with a slash
	 * @param {String} method the method of the endpoint terminated without a terminating slash
	 * @returns {String} the url of the spot request with the specified parameters for the endpoint and method
	 */
	toURL(endpoint, method) {
		let url = String(endpoint + method + '?');
		const and = '&';
		url += 'id=' + this.id + and;
		url += 'method=' + this.method + and;
		url += 'params=' + objectToString(this.params) + and;
		url += 'api_key=' + this.apiKey + and;
		url += 'nonce=' + this.time;
		return url;
	}
}

/**
 * Creates a SpotRequest object with digital signature if method and apiSecret are provided
 * @param {String} method method to be invoked
 * @param {Number} id request identifier
 * @param {String} apiKey public API key
 * @param {Object} params parameters for the method
 * @param {Number} time Current timestamp in milliseconds since the Unix epoch
 * @param {String} apiSecret secret API key, not held in SpotRequest object
 * @returns {SpotRequest}
 */
function createSpotRequest(id, method, apiKey, params, time, apiSecret) {
	return new SpotRequest(id, method, apiKey, params, time, apiSecret);
}

/**
 * Generates a digital signature of given API request
 * @param {SpotRequest} request request body to generate digital signature
 * @returns {String} digital signature for this request
 */
function generateSignature(request) {
	request.sig = signRequest(request, request.apiKey, apiSecret);
	return this.sig;
}

const send = {
	createSpotRequest,
	generateSignature,
	signRequest,
	SpotRequest,
};
module.exports = send;
