const Transfers = require("../models/transfers_model");

class BankAccountDAO {

    async MountDeposit(dataDestin, dataCurrent, update) {

        if (!update) {

            let transfers = new Transfers({
                type: dataCurrent.type,
                destination: dataCurrent.destination,
                amount: dataCurrent.amount
            });

            await transfers.save();

            return { destination: { id: transfers.destination, balance: transfers.amount } }

        }
        else {

            let sumAmount = dataDestin.amount + dataCurrent.amount;

            await Transfers.updateOne(dataDestin, { amount: sumAmount });

            dataDestin.amount = sumAmount;
            dataDestin.save();

            return { destination: { id: dataDestin.destination, balance: dataDestin.amount } }

        }

    }

    async MountWithdraw(dataDestin, dataCurrent) {

        let sumAmount = dataDestin.amount - dataCurrent.amount;

        await Transfers.updateOne(dataDestin, { amount: sumAmount });

        dataDestin.amount = sumAmount;
        dataDestin.save();

        return { origin: { id: dataDestin.destination, balance: dataDestin.amount } }

    }

    async MountTransfer(dataOrigin, dataDestin, dataCurrent) {

        let amountOrigin = dataOrigin.amount - dataCurrent.amount;
        await Transfers.updateOne(dataOrigin, { amount: amountOrigin });
        dataOrigin.amount = amountOrigin;
        dataOrigin.save();

        let amountDestin = dataDestin.amount + dataCurrent.amount;
        await Transfers.updateOne(dataDestin, { amount: amountDestin });
        dataDestin.amount = amountDestin;
        dataDestin.save();

        return { origin: { id: dataOrigin.destination, balance: dataOrigin.amount }, destination: { id: dataDestin.destination, balance: dataDestin.amount } }

    }

}

module.exports = BankAccountDAO