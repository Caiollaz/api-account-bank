const router = require("express").Router();
const BankAccountDAO = require("../dao/bankAccountDAO");
const Transfers = require("../models/transfers_model");

router.get("/getBank", async function (req, res) {

    res.status(200).json({ success: true, message: "API Bank Account Okey" });

})

router.get("/balance", async function (req, res) {

    const { account_id } = req.query;

    try {

        let data = await Transfers.findOne({ destination: account_id });
        let amount = data ? data.amount : 0;

        if (!data) {
            res.status(404).json({ success: false, balance: amount });
        }
        else {
            res.status(200).json({ success: true, balance: amount });
        }

    } catch (error) {
        res.status(404).json({ success: false, message: "ERRO na busca do saldo da conta!" });
    }

})

router.post("/event", async function (req, res) {

    const { type, origin } = req.body;
    const destination = req.body.destination ? req.body.destination : req.body.origin;

    let dao = new BankAccountDAO();

    try {

        let dataDestin = await Transfers.findOne({ destination: destination });

        if (!dataDestin) {

            if(type == "deposit"){

                let data = await dao.MountDeposit(dataDestin, req.body, false);
                return res.status(201).json(data);

            }
            else {
                return res.status(404).json({ success: false, balance: 0 });
            }

        }
        else {

            if (type == "deposit") {

                let data = await dao.MountDeposit(dataDestin, req.body, true);
                return res.status(201).json(data);

            }
            else if (type == "withdraw") {

                let data = await dao.MountWithdraw(dataDestin, req.body);
                return res.status(201).json(data);

            }
            else if (type == "transfer") {
                
                let dataOrigin = await Transfers.findOne({ destination: origin });

                if(!dataOrigin){
                    return res.status(404).json({ success: false, balance: 0 });
                }

                let data = await dao.MountTransfer(dataOrigin, dataDestin, req.body);
                return res.status(201).json(data);

            }

        }


    } catch (error) {
        res.status(404).json({ success: false, message: "ERRO no evento da conta!" });
    }

})

module.exports = router