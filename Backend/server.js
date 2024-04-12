const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger  = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');
const io = require('socket.io')(server);
const ordersDeliverySockets = require('./sockets/orders_delivery_socket');
const mercadoPago = require('mercadopago');

mercadoPago.configure ({
  access_token: 'TEST-8724115554838541-020712-f25bd39c2b5763d862fa281092ee40a8-1673487716',
});


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});


/*
* RUTAS
*/
const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const orders = require('./routes/ordersRoutes');
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

/*
* LLAMANDO A LAS RUTAS
*/

users(app, upload);
categories(app, upload);
products(app, upload);
address(app);
orders(app);
mercadoPagoRoutes(app);

/*
* LLAMANDO A LOS SOCKETS
*/

ordersDeliverySockets(io);

server.listen(3000, '192.168.1.36' || 'localhost', function() {
    console.log('Aplicacion de NodeJS ' + port+ ' Iniciando...') 
});

app.get('/', (req, res) => { 
    res.send('Ruta raiz del backend')
});

app.get('/test', (req, res) => { 
    res.send('Ruta de prueba')
});

// ERROR MANEJO
app.use((err, req, res, next) =>{
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}