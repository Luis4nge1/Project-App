const https = require('https');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');


module.exports = {

    sendNotification(token, data) {

        const notification = JSON.stringify({
            'to': token,
            "data": {
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'key=8e0ecbcba43fe58a51860e19e3fe82350ec06214'
            }
        }

        const req = https.request(options, (res) => {
            console.log('Status code Notification', res.statusCode);
            res.on('data', (d) => {
                process.stdout.write(d)
            })
        })

        req.on('error', (err) => {
            console.error(err)
        })

        req.write(notification);
        req.end();
    },

    sendNotificationToMultipleDevices(tokens, data) {

        const notification = JSON.stringify({
            'registration_ids': tokens,
            "data": {
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'key=8e0ecbcba43fe58a51860e19e3fe82350ec06214'
            }
        }

        const req = https.request(options, (res) => {
            console.log('Status code Notification', res.statusCode);
            res.on('data', (d) => {
                process.stdout.write(d)
            })
        })

        req.on('error', (err) => {
            console.error(err)
        })

        req.write(notification);
        req.end();
    }
}