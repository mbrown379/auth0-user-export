const ManagementClient = require('auth0').ManagementClient;
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: '',
        pass: ''
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

var auth0 = new ManagementClient({
    domain: '',
    clientId: '',
    clientSecret: '',
    scope: 'read:users',
    audience: '',
    tokenProvider: {
        enableCache: true,
        cacheTTLInSeconds: 10
    }
});

new Promise(function (resolve) {
    export_settings = {
        format: 'csv',
        limit: 1000,
        fields: [
            { name: 'first_name' },
            { name: 'last_name' },
            { name: 'email' },
            { name: 'last_login' },
            { name: 'logins_count' },
            { name : 'identities[0].connection' }
        ]
    }
    auth0.exportUsers(export_settings, function (err, res) {
        setTimeout(function() {
            resolve(res.id);
        }, 45000);
    });
}).then(function (job_id) {
    new Promise(function (resolve) {
        auth0.getJob( { id: job_id }, function (err, job) {
            resolve(job.location);
        });
    }).then(function (location) {
        mailOptions = {
            from: '',
            to: '',
            subject: 'Weekly User Login Report',
            text: location
        }
        transporter.sendMail(mailOptions);
    });
}).catch(function (err) {
    console.log(err);
});

/* Use task scheduler to run every Monday */
