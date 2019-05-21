const shim = require('fabric-shim');
const chaincodeUtil = require('./chaincodeUtil');

const SimpleACL = class {
    async Init(stub) {
        console.info('========= Init =========');

        const invokerAddress = chaincodeUtil.getWalletAddress(stub);
        const resultValueBytes = await stub.getState('Admin');

        //this is a validation logic for upgrading chaincode.
        // when upgrading chaincode, getState for Admin already exists because it was put when instantiating chaincode.
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

    async put(stub, args) {
        if (args.length !== 1) {
            return shim.error('Incorrect number of arguments. Expecting 1');
        }

        const invokerAddress = chaincodeUtil.getWalletAddress(stub);
        //make invokerAddress as a key
        const key = invokerAddress,
              value = args[0];

        await stub.putState(key, Buffer.from(value));
        return shim.success();
    }

    async get(stub, args) {
        if (args.length !== 0) {
            return shim.error('Incorrect number of arguments. Expecting 0');
        }
        const invokerAddress = chaincodeUtil.getWalletAddress(stub);
        const resultValueBytes = await stub.getState(invokerAddress);

        if (resultValueBytes.length === 0) {
            return shim.error('Failed to get state for ' + invokerAddress);
        }

        return shim.success(resultValueBytes);
    }

    async getByAdmin(stub, args) {
        if (args.length !== 1) {
            return shim.error('Incorrect number of arguments. Expecting 1');
        }

        const invokerAddress = chaincodeUtil.getWalletAddress(stub);

        const adminBytes = await stub.getState('Admin');

        if (adminBytes.toString() !== invokerAddress) {
            return shim.error(invokerAddress + ' is not an Admin');
        }

        const resultValueBytes = stub.getState(args[0]);

        if (resultValueBytes.length === 0) {
            return shim.error('Failed to get state for ' + invokerAddress);
        }

        return shim.success(resultValueBytes);
    }

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
};

shim.start(new SimpleACL());