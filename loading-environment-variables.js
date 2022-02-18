//initilalizes vars from .env into the system's environment variables upon runtime
//returns an object with all vars from .env
//rename a decontructed variable
const {parsed: envVars} = require('dotenv').config();
console.log(`Environment variables from .env file:\n${envVars}`);
//logs all the other environment (from the current running OS) variables
console.log(`Local environment variables:${process.env.toString()}`);