//initilalizes vars from .env into the system's environment variables upon runtime
//returns an object with all vars from .env
//rename a decontructed variable
const {parsed: envVars} = require('dotenv').config();
console.log(envVars);
console.log();