const http = require("http");
const config = require("./config");
const express = require("express");
const MongoPool = require("./connectors/mongoPool");
const jwtCheck = require("./middlewares/jwtcheck");

const app = express();
app.use(express.json());

// ################# Rotas #################
app.use("/", require("./rotas/authentication"));
app.use("/", jwtCheck, require("./rotas/bankAccount"));

var server = http.createServer(app);
server.listen(config.port, () => {

    let connMongo = new MongoPool();
    connMongo.getConnection();

    console.log("Server iniciado com sucesso na porta " + config.port);
    
});