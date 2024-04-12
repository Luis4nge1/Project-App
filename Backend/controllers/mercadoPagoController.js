const mercadoPago = require('mercadopago');
const Order = require('../models/order');
const User = require('../models/user');
const OrderHasProducts = require('../models/order_has_products');
const pushNotificationController = require('../controllers/pushNotificationController');

mercadoPago.configure({
  access_token: 'TEST-8724115554838541-020712-f25bd39c2b5763d862fa281092ee40a8-1673487716',
  sandbox: true,
});

module.exports = {
    
    async createPayment(req, res, next) {

        let payment = req.body;

        console.log('Datos enviados', payment);

        const payment_data = {
            transaction_amount: payment.transaction_amount,
            token: payment.token,
            description: payment.description,
            installments: payment.installments,
            payment_method_id: payment.payment_method_id,
            issuer_id: payment.issuer_id,
            payer: {
              email: payment.payer.email,
            }
          };

          const data = await mercadoPago.payment.create(payment_data).catch((err) =>{
            console.log('Error: ', err);
            return res.status(501).json({
                message: `Error al crear el pago: ${err}`,
                success: false,
                error: err
            });
          })

          if(data){

            const tokens = await User.getAdminsNotificationsTokens();
            let tokensString = []

            tokens.forEach( t => {
              tokensString.push(t.notification_token);
            })

            pushNotificationController.sendNotificationToMultipleDevices(tokensString,{
              title: 'SE HA REALIZADO UNA COMPRA',
              body: 'Revisa tus órdenes para realizar el pedido',
              id_notification: '1'
            });

            //pushNotificationController.sendNotification('cPA8HtBJT_yljxcmiCv9Ik:APA91bGf17dBQVX7J0yE4V8P-wP50zItvAijXt2pHrLyEiXlN9KnqYDnKAnkJBxEZHTuga4lAzG-jFDYPLdSwAuiWPFSiA-G6B9KDhoxqWSX9cn4aF9EQQH69H-aD0d7z06dAf5fEEjp',{
            //  title: 'COMPRA REALIZADA CON ÉXITO',
            //body: 'Se ha realizado su compra y está en camino',
            //id_notification: '1'
            //});

            let order = payment.order;
            order.status = "PAGADO";
            const orderData = await Order.create(order);

            for(const product of order.products){
                await OrderHasProducts.create(orderData.id, product.id, product.quantity);
            }

            console.log('Respuesta de Mercadopago: ', data.response);
            
            return res.status(201).json({
                message: `El pago se ha realizado correctamente`,
                success: true,
                data: data.response
            });
          }
          else{
            return res.status(501).json({
                message: `El pago no se ha realizado correctamente`,
                success: false
            });
          }  
    }
}