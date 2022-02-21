const crypto = require('crypto-js');
const { objectToString } = require('./objToString');

/**
 * A request to Crypto.com exchange API
 */
class SpotRequest {
	/**{String} method to be invoked*/
	method = '';
	/**{Number} request identifier*/
	id = 0;
	/**{String} public API key*/
	api_key = '';
	/**{Object} parameters for the method*/
	params = {};
	/**{Number} Current timestamp in milliseconds since the Unix epoch*/
	nonce = -1;
	/**{String} the digital signature for this API request*/
	sig = '';
	/**
	 * Constructor to return a new SpotRequest
	 * @param {String} method method to be invoked
	 * @param {Number?} id request identifier
	 * @param {String?} apiKey public API key
	 * @param {Object?} params parameters for the method
	 * @param {Number} time Current timestamp in milliseconds since the Unix epoch
	 * @param {String?} apiSecret private/secret API key
	 */
	constructor(id, method, apiKey, params, time, apiSecret) {
		this.id = id;
		this.method = method;
		this.api_key = apiKey;
		this.params = params;
		this.nonce = time;
		if (apiSecret)
			this.generateSignature(apiSecret);
	}
	/**
	 * configure each property of the request
	 * @param {String} method method to be invoked
	 * @param {Number} id request identifier
	 * @param {String} api_key public API key
	 * @param {Object} params parameters for the method
	 * @param {Number} time Current timestamp in milliseconds since the Unix epoch
	 * @param {String} sig the signature for the API request
	 */
	config(id, method, apiKey, params, time, sig) {
		this.id = id;
		this.method = method;
		this.api_key = apiKey;
		this.params = params;
		this.nonce = time;
		this.sig = sig;
	}
	/**
	 * Generates a digital signature of this API request
	 * @param {String} apiSecret API secret key
	 * @returns {String} digital signature for this request
	 */
	generateSignature(apiSecret) {
		const paramsString = objectToString(this.params);
		/**request url + params*/
		//only add none null/empty params
		let sigPayload = '';
		sigPayload += this.method ? this.method : '';
		sigPayload += this.id ? this.id : '';
		sigPayload += this.api_key ? this.api_key : '';
		sigPayload += paramsString ? paramsString : '';
		sigPayload += this.nonce ? this.nonce : '';
		/**encode request string with crypto[graphic] key's hex value**/
		this.sig = crypto.HmacSHA256(sigPayload, apiSecret).toString(crypto.enc.Hex);
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
		url += 'api_key=' + this.api_key + and;
		url += 'nonce=' + this.nonce;
		return url;
	}
	/**
	 * A JSON representation of the request
	 * @returns {String} a string representation of this API request
	 */
	toString() {
		const keys = Object.keys(this);
		const values = keys.map(key => this[key]);
		let string = '{';
		for (let i = 0; i < keys.length; i++) {
			if (keys[i] === 'params') string += `"${keys[i]}":{` + objectToString(values[i]) + '}';
			/*{
				for (const param in values[i]) {
					if (Object.hasOwnProperty.call(values[i], param)) {
						const element = values[i][param];
						
					}
				}
			}*/
			else if (typeof values[i] === 'string')
				string += `"${keys[i]}":"${values[i]}"`;
			else
				string += `"${keys[i]}":${values[i]}`;
			if (i !== keys.length - 1)
				string += ',';
		}
		return string + '}';
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

module.exports = {
	createSpotRequest,
	SpotRequest,
};
// TODO?: add sign request externally made request not in class??