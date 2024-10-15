const config = require("../config");
const jwt = require("jsonwebtoken");
const SECRET = config.auth.secret

const middleware = (req, res, next) => {

    const header = req.headers["authorization"];

    if (!header) {

        const noHeaderError = Error("missing authorization header");
        console.log("unauthorized: %s", noHeaderError.message);

        res.status(401).send({
            error: noHeaderError.message
        })

        return;
    }

    const token = header.substring(6).trim();

    jwt.verify(token, SECRET, function (err, decoded) {

        if (err) {

            console.log("forbidden: %s", err.message);

            res.status(403).send({
                error: err.message
            })

            return;

        } else {

            let login = {
                nome: decoded.username
            }

            req.auth = {}
            req.auth.usuario = login
            req.auth.token = token
            
            next();
        }

    });

}

module.exports = middleware