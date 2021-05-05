
exports.lambdaHandler = async (event, context) => {
    // Get the price of the stock provided as input
    url = event["url"]
    return {
      'action' : "Archived",
      'timestamp': new Date().toISOString()
    }
};
