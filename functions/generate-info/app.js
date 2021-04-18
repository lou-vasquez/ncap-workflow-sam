
exports.lambdaHandler = async (event, context) => {
    return { 'quality': Math.floor(Math.random() * Math.floor(100)) }
};
