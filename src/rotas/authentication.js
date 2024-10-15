const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Accounts = require("../models/accounts_model");
const Transfers = require("../models/transfers_model");

router.get("/getAuth", async function (req, res) {

    res.status(200).json({ success: true, message: "API Authentication Okey" });

})

router.post("/createLogin", async function (req, res) {

    try {

        const newPassword = await bcrypt.hash(req.body.password, 8);

        let account = new Accounts({
            username: req.body.username,
            password: newPassword
        })

        await account.save().then(function () {
            res.status(200).json({ success: true, message: "Usuário criado com sucesso!" })
        });

    }
    catch (error) {
        res.status(404).json({ success: false, message: "ERRO na criação do usuário!" });
    }

})

router.post("/login", async function (req, res) {

    try {

        const { username, password } = req.body;

        let user = await Accounts.findOne({ username: username });

        if (!user) {
            res.status(404).json({ success: false, message: "Usuário não encontrado!" });
        }

        let comparePassword = await bcrypt.compare(password, user.password);

        if (comparePassword) {

            const token = jwt.sign({
                id: user._id, username
            }, "SECRET");

            user.token = token;

            return res.status(200).json({ username, token });

        }

        return res.status(403).json({ success: false, message: "Usuário ou senha inválida!" });


    }
    catch (error) {
        res.status(404).json({ success: false, message: "ERRO no login do usuário!" });
    }

})

router.post("/reset", async function (req, res) {

    try {

        Accounts.collection.drop();
        Transfers.collection.drop();

        return res.status(200).json({ success: true, message: "Reset concluído!" });

    }
    catch (error) {
        res.status(404).json({ success: false, message: "ERRO ao resetar dados!" });
    }

})

module.exports = router