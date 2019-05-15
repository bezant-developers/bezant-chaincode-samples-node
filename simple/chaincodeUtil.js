const jsrsa = require('jsrsasign');

exports.getEnrollmentId = (stub) => {
    const signingId = stub.getCreator();
    const idBytes = signingId.getIdBytes().toBuffer();

    const regex = /(\-\-\-\-\-\s*BEGIN ?[^-]+?\-\-\-\-\-)([\s\S]*)(\-\-\-\-\-\s*END ?[^-]+?\-\-\-\-\-)/;
    let matches = idBytes.toString().match(regex);
    if (!matches || matches.length !== 4) {
        throw new Error('Failed to find start line or end line of the certificate.');
    }

    // remove the first element that is the whole match
    matches.shift();
    // remove LF or CR
    matches = matches.map((element) => {
        return element.trim();
    });

    // make sure '-----BEGIN CERTIFICATE-----' and '-----END CERTIFICATE-----' are in their own lines
    // and that it ends in a new line
    const normalizedCert = matches.join('\n') + '\n';

    // assemble the unique ID based on certificate
    const x = new jsrsa.X509();
    x.readCertPEM(normalizedCert);
    return x.getSubjectString().split('CN=')[1];
};