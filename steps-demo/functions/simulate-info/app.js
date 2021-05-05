const crypto = require("crypto");

exports.lambdaHandler = async (event, context) => {
    return {
      'id': crypto.randomBytes(16).toString("hex"),
      'quality': Math.floor(Math.random() * Math.floor(100)),
      'archive': (Math.random() > 0.5)?true:false,
      'url': 's3://aws/some_bucket/some_key/'+Math.floor(Math.random() * Math.floor(10000))+".dat"
   }
}
