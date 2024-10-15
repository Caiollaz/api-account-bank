const config = require("../config")
const mongoose = require("mongoose");

class MongoPool {

    /**
     * Utilizado para gerenciar as conexoes com o MongoDB
     * @author caiol
     * @return connection
    */

    async getConnection() {
        await mongoose.connect(config.mongo.url);
    }

    async closeConnection() {
        mongoose.disconnect();
    }

}

module.exports = MongoPool