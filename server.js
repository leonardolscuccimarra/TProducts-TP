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
const liveIo = io.of('/realtimeproducts');


app.engine('handlebars', handlebars.engine);
app.set('views', './views');
app.set('view engine', 'handlebars')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routerMain);
app.use(routerProducts);
app.use('/api/realtimeproducts', routerView);
app.use(express.static('/public'));

app.use((req, res, next) => {
    req.io = liveIo;
    next();
});



liveIo.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    socket.on('update', data => {
        console.log(`Cambio en la base de datos:\n`, data)
        io.emit('mensaje', data)
    })
});

server.listen(PORT, () => {
    console.clear();
    console.log(`SERVER ON: http://localhost:${PORT} \n\nhttp://localhost:${PORT}/api/products/ \nhttp://localhost:${PORT}/api/realtimeproducts/`);
});






