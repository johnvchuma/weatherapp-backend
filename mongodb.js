const { MongoClient } = require("mongodb");

let connectedDb;
module.exports = {
  connectToDb: (callbackFunction) => {
    MongoClient.connect(
      "mongodb+srv://johnvchuma:john@cluster0.csqp09p.mongodb.net/weatherapp?retryWrites=true&w=majority"
    )
      .then((client) => {
        connectedDb = client.db();
        return callbackFunction();
      })
      .catch((err) => {
        return callbackFunction(err);
      });
  },
  getDb: () => connectedDb
};
