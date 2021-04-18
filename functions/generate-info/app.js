exports.lambdaHandler = async (event, context) => {
    return {
      'granule': {
        'quality': Math.floor(Math.random() * Math.floor(100)) ,
        'archive': (Math.random() > 0.5)?"true":"false"
      }
 }
}
