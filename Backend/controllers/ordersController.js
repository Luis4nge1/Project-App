const Order = require('../models/order');
const User = require('../models/user');
const OrderHasProducts = require('../models/order_has_products');
const timeRelative = require('../utils/time_relative');
const pushNotificationController = require('./pushNotificationController');

module.exports = {

    async findByStatus(req, res, next) {

        try{
            const status = req.params.status;
            let data = await Order.findByStatus(status);

            data.forEach(d =>{
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            console.log('Order: ', data);
            return res.status(201).json(data);

        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al obtener las ordenes por status',
                error: error
            });
        }
    },

    async findByClientAndStatus(req, res, next) {

        try{
            const status = req.params.status;
            const id_client = req.params.id_client;
            let data = await Order.findByClientAndStatus(id_client, status);

            data.forEach(d =>{
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            console.log('Order: ', data);

            return res.status(201).json(data);

        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al obtener las ordenes por cliente y status',
                error: error
            });
        }
    },

    async findByDeliveryAndStatus(req, res, next) {

        try{
            const status = req.params.status;
            const id_delivery = req.params.id_delivery;
            let data = await Order.findByDeliveryAndStatus(id_delivery, status);

            data.forEach(d =>{
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            console.log('Order: ', data);

            return res.status(201).json(data);

        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al obtener las ordenes por delivery y status',
                error: error
            });
        }
    },
    
    async create(req, res, next) {

        try{
            let order = req.body;
            order.status = "PAGADO";
            const data = await Order.create(order);

            for(const product of order.products){
                await OrderHasProducts.create(data.id, product.id, product.quantity);
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se creo correctamente',
                data:{
                    'id': data.id
                }
            });

        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    },

    async updateToDispatched(req, res, next) {

        try{
            let order = req.body;
            order.status = "DESPACHADO";
            await Order.update(order);

            const user = await User.getNotificationsTokenById(order.id_delivery);
            await pushNotificationController.sendNotification(user.notification_token,{
                title: 'SE LE HA ASIGNADO UN NUEVO PEDIDO',
                body: 'Revisa los pedidos que tienes que entregar',
                id_notification: '2'
            });

            return res.status(201).json({
                success: true,
                message: 'Se actualizó correctamente',
            });

        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en la actualización',
                error: error
            });
        }
    },

    async updateToOnTheWay(req, res, next) {

        try{
            let order = req.body;
            order.status = "EN CAMINO";
            await Order.update(order);

            const user = await User.getNotificationsTokenById(order.id_client);
            await pushNotificationController.sendNotification(user.notification_token,{
                title: 'TU PEDIDO ESTÁ EN CAMINO',
                body: 'Puedes rastrear tu pedido desde nuestra App.',
                id_notification: '3'
            });

            return res.status(201).json({
                success: true,
                message: 'Se actualizó correctamente',
            });
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en la actualización',
                error: error
            });
        }
    },

    async updateToDelivered(req, res, next) {

        try{
            let order = req.body;
            order.status = "ENTREGADO";
            await Order.update(order);

            return res.status(201).json({
                success: true,
                message: 'Se actualizó correctamente',
            });
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en la actualización',
                error: error
            });
        }
    },

    async updateLatLng(req, res, next) {

        try{
            let order = req.body;
            await Order.updateLatLng(order);

            return res.status(201).json({
                success: true,
                message: 'Se actualizó correctamente',
            });
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en la actualización',
                error: error
            });
        }
    }

}

