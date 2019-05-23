const shim = require('fabric-shim');
const chaincodeUtil = require('./chaincodeUtil');

const SimpleACL = class {
    async Init(stub) {
        console.info('========= Init =========');

        const invokerAddress = chaincodeUtil.getWalletAddress(stub);
        const resultValueBytes = await stub.getState('Admin');

        //this is a validation logic for upgrading chaincode.
        // when upgrading chaincode, the key for Admin already exists because it was put when instantiating chaincode.
        if (resultValueBytes.length !== 0) {
            return shim.success();
        }

        stub.putState('Admin', invokerAddress);
        return shim.success();
    }

    async Invoke(stub) {
        console.info('========= Invoke =========');
        const ret = stub.getFunctionAndParameters();
        const func = this[ret.fcn];
        if (!func) {
            return shim.error('No function name :' + ret.fcn + ' found');
        }
        try {
            return await func(stub, ret.params);
        } catch (err) {
            return shim.error(err);
        }
    }

    /**
     *  Makes key as the invoker's address.
     */
    async put(stub, args) {
        if (args.length !== 1) {
            return shim.error('Incorrect number of arguments. Expecting 1');
        }

        const invokerAddress = chaincodeUtil.getWalletAddress(stub);
        //Puts invoker's address as a key
        const key = invokerAddress,
              value = args[0];

        await stub.putState(key, Buffer.from(value));

        return shim.success();
    }

    /**
     * Only the invoker and the admin can query this asset.
     */
    async get(stub, args) {
        if (args.length !== 0) {
            return shim.error('Incorrect number of arguments. Expecting 0');
        }

        //retrieves the invoker's address
        const invokerAddress = chaincodeUtil.getWalletAddress(stub);

        const resultValueBytes = await stub.getState(invokerAddress);

        if (resultValueBytes.length === 0) {
            return shim.error('Key for ' + invokerAddress + ' does not exists');
        }

        return shim.success(resultValueBytes);
    }


    /**
     *  if the invoker's address is the same as the value of the key 'Admin', the invoker can access any data.
     */
    async getByAdmin(stub, args) {
        if (args.length !== 1) {
            return shim.error('Incorrect number of arguments. Expecting 1');
        }

        const invokerAddress = chaincodeUtil.getWalletAddress(stub);

        const adminBytes = await stub.getState('Admin');

        if (adminBytes.toString() !== invokerAddress) {
            return shim.error(invokerAddress + ' is not an Admin');
        }
        const resultValueBytes = await stub.getState(args[0]);

        if (resultValueBytes.length === 0) {
            return shim.error('Key for ' + invokerAddress + ' does not exists');
        }

        return shim.success(resultValueBytes);
    }


    /**
     *  Change value for key 'Admin'.
     */
    async changeAdmin(stub, args) {
        if (args.length !== 1) {
            return shim.error('Incorrect number of arguments. Expecting 1');
        }

        const invokerAddress = chaincodeUtil.getWalletAddress(stub);

        const adminBytes = await stub.getState('Admin');

        if (adminBytes.toString() !== invokerAddress) {
            return shim.error(invokerAddress + ' is not an Admin');
        }

        await stub.putState('Admin', Buffer.from(args[0]));
        return shim.success();
    }
    /**
     *  key name is provided by the parameter.
     *  value and invokerAddress are stored in JSON form.
     */
    async put2(stub, args) {
        if (args.length !== 2) {
            return shim.error('Incorrect number of arguments. Expecting 2');
        }

        const resultBytes = await stub.getState(args[0]);

        if (resultBytes.length !== 0) {
            return shim.error('Key for ' + args[0] + ' does not exists');
        }

        const invokerAddress = chaincodeUtil.getWalletAddress(stub);

        const valueObj = {
            owner: invokerAddress,
            value: args[1]
        };

        await stub.putState(args[0], Buffer.from(JSON.stringify(valueObj)));

        return shim.success();
    }


    /**
     *  Only the admin or if the invoker's address matches the owner of a specific key provided by the parameter, can query.
     */
    async get2(stub, args) {
        if (args.length !== 1) {
            return shim.error('Incorrect number of arguments. Expection 1');
        }

        const resultBytes = await stub.getState(args[0]);

        if (resultBytes.length === 0) {
            return shim.error('Key for ' + args[0] + ' does not exists');
        }

        const resultObj = JSON.parse(resultBytes.toString());
        const invokerAddress = chaincodeUtil.getWalletAddress(stub);
        const admin = stub.getState('Admin').toString();

        if (invokerAddress !== admin && invokerAddress !== resultObj['owner']) {
            return shim.error('Owner of Key for ' + args[0] + ' does not match to ' + invokerAddress);
        }

        return shim.success(resultBytes);
    }
};

shim.start(new SimpleACL());