const User = require('../models/user');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {

    async getAll(req, res, next) {
        try{
            const data = await User.getAll();
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtner los usuarios'
            });
        }
    },

    async findDeliveryMen(req, res, next) {
        try{
            const data = await User.findDeliveryMen();
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los deliverys'
            });
        }
    },

    async register(req, res, next) {
        try{
            const user = req.body;
            const data = await User.create(user);

            await Rol.create(data.id, 1);

            const token = jwt.sign({
                id: data.id,
                email: user.email
            }, keys.secretOrKey,{
                //expiresIn:
            });

            const myData = {
                id: data.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                image: user.image,
                session_token: `JWT ${token}`
            };

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: myData
            });

        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en el registro',
                error: error
            });
         }
    },

    async login(req, res, next) {
        try{
            const email = req.body.email;
            const password = req.body.password;

            const myUser = await User.findByEmail(email);

            if(!myUser){
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if(isPasswordValid) {
                const token = jwt.sign({
                    id: myUser.id,
                    email: myUser.email
                }, keys.secretOrKey,{
                    //expiresIn:
                });

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                };

                console.log(`USUARIO ENVIADO ${data}`);

                await User.updateSessionToken(myUser.id, `JWT ${token}`);

                return res.status(201).json({
                    success: true,
                    message: ' El usuario ha sido autenticado',
                    data: data
                });
            }
            else{
                return res.status(401).json({
                    success: false,
                    message: 'El usuario no ha sido autenticado'
                });
            }

        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en el login',
                error: error
            });
         }
    },

    async update(req, res, next){
        try{

            console.log('Usuario:', req.body.user);

            const user = JSON.parse(req.body.user);

            console.log('Usuario Parseado:', user);

            const files = req.files;

            if(files.length > 0){

                const pathImage = `image_${Date.now()}`;
                const url = await storage(files[0], pathImage);

                if(url != undefined && url != null){
                    user.image = url;
                }
            }

            await User.update(user);

            return res.status(201).json({
                success: true,
                message: 'Los datos del usuario se han actualizado correctamente',
                data: user
            })

        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en la actualizacion de datos',
                error: error
            });
         }
    },

    async updateWithoutImage(req, res, next){
        try{

            console.log('Usuario:', req.body);

            const user = req.body;

            await User.update(user);

            return res.status(201).json({
                success: true,
                message: 'Los datos del usuario se han actualizado correctamente',
                data: user
            })

        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en la actualizacion de datos',
                error: error
            });
         }
    },

    async updateNotificationToken(req, res, next){
        try{

            const user = req.body;

            await User.updateNotificationToken(user.id, user.notification_token);

            return res.status(201).json({
                success: true,
                message: 'Se ha actualizado el notification token'
            })

        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en la actualizacion del token de notificaciones',
                error: error
            });
         }
    }

};