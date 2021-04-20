const crypto = require("crypto");

exports.lambdaHandler = async (event, context) => {
    // Get the price of the stock provided as input
    url = event["url"]
    return {
      'action' : "Quality_Fail",
      'timestamp': new Date().toISOString()
    }
};
