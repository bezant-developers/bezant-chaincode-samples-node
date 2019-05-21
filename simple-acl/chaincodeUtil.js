const shim = require('fabric-shim');

exports.getWalletAddress = (stub) => {
    const cid = new shim.ClientIdentity(stub);
    const x509 = cid.getX509Certificate();
    return x509.subject.commonName;
};