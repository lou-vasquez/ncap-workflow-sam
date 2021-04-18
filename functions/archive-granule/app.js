const crypto = require("crypto");

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}

exports.lambdaHandler = async (event, context) => {
    // Get the price of the stock provided as input
    quality = event["quality"]
    var date = new Date();
    let archive_result = {
        'id': crypto.randomBytes(16).toString("hex"), // Unique ID for the transaction
        'quality': quality.toString(), // Price of each share
        'type': "archive", // Type of transaction(buy/ sell)
        'qty': getRandomInt(10).toString(),  // Number of shares bought / sold(We are mocking this as a random integer between 1 and 10)
        'timestamp': date.toISOString(),  // Timestamp of the when the transaction was completed
    }
    return archive_result
};
