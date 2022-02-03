const http = require("http");

const url = new URL("/v2/public/get-trades", "http://uat-api.3ona.co");
http.get(url, (res)=>{
    console.log(res.statusCode);
})
console.log("\u{1F37F}");
console.log("🧑");