import express, { raw } from 'express';
import fs from 'fs/promises';
export const routerView = express.Router();

// USANDO WEBSOCKETS


routerView.get('/', async (req, res) => {
    let rawData
    try {
        rawData = await fs.readFile('./db/products.json', 'utf-8');
    } catch (err) {
        console.error(`Error al recuperar el archivo JSON:\n${err}`);
        return res.status(500).send(`Error al recuperar el archivo JSON.\n${err}`);
    };

    let data = JSON.parse(rawData);

    //JSON CARGADO

    // Resultado Final:
    res.render('realTimeProducts', {
        titulo: "Editor de Lista de productos LIVE",
        protocolo: "Websocket",
        productos: data,
        hayProductos: data.length > 0
    });
});