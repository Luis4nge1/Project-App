module.exports = (io) => {

    const namespace = io.of('/orders/delivery');

    namespace.on('connection', function (socket) {

        console.log('USUARIO SE CONECTÓ AL SOCKET IO');

        socket.on('positions', function (data) {
            console.log('SE EMITIO', JSON.parse(data));

            const d = JSON.parse(data);
            namespace.emit(`position/${d.id_order}`, {id_order: d.id_order, lat: d.lat, lng: d.lng});
        })

        socket.on('disconnect', function (data) {
            console.log('USUARIO SE DESCONECTÓ DEL SOCKET IO');
        })
    })
}
