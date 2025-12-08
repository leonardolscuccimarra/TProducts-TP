import express from 'express';
import { routerMain } from './src/routes/main.router.js';
import { routerProducts } from './src/routes/products.router.js';
import { routerView } from './src/routes/view.router.js';
import { Server } from 'socket.io';
import http from 'http';
import handlebars from 'express-handlebars';



const app = express();
const PORT = 8080;

const server = http.createServer(app);
const io = new Server(server);
/* const liveIo = io.of('/realtimeproducts'); */


app.engine('handlebars', handlebars.engine());
app.set('views', './views');
app.set('view engine', 'handlebars')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routerMain);
app.use(routerProducts);
app.use('/realtimeproducts', routerView);
app.use(express.static('public'));

app.set('io', io);



io.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    socket.on('refresh', data => {
        console.log(`Cambio en la base de datos:\n`, data)
        io.emit('update', data.value)
    })
});

server.listen(PORT, () => {
    console.clear();
    console.log(`SERVER ON: http://localhost:${PORT} \n\nhttp://localhost:${PORT}/api/products/ \nhttp://localhost:${PORT}/realtimeproducts/`);
});






