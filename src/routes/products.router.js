/* Rutas para Manejo de Productos (/api/products/) */

//USANDO HTTP

import express, { raw } from 'express';
import fs from 'fs/promises';
export const routerProducts = express.Router();


routerProducts.use(express.json());

async function dbCheck(path) {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    console.log(`Archivo Json de productos no existe \nGenerando uno nuevo...`);
    await fs.writeFile(path, '[]');
  }
}

dbCheck('./db/products.json');

/* GET /:
Debe listar todos los productos de la base de datos.  */

routerProducts.get('/api/products/', async (req, res) => {
  try {
    const rawData = await fs.readFile('./db/products.json', 'utf-8');
    let data = JSON.parse(rawData);
    res.status(200).render('home', {
      titulo: "Lista de productos",
      protocolo: "HTTP",
      productos: data,
      hayProductos: data.length > 0
    });

  } catch (err) {
    console.error(`Error al recuperar el archivo JSON:\n${err}`);
    res.status(500).send(`Error al recuperar el archivo JSON.\n${err}`);
  }
});

/* 
GET /:pid:
Debe traer solo el producto con el id proporcionado.
 */

routerProducts.get('/api/products/:pid', async (request, res) => {
  const pid = request.params.pid;

  try {
    const data = await fs.readFile('./db/products.json', 'utf-8');
    let dataObject = JSON.parse(data) || [];
    dataObject = dataObject.find(pObj => pObj.id == pid);

    if (dataObject) {
      res.status(200).json(dataObject);
    } else {
      res.status(404).send(`No hay objeto con el ID: ${pid}`);
    }

  } catch (err) {
    console.error(`Error al recuperar el producto ID: ${pid} del archivo JSON:\n${err}`);
    res.status(500).send(`Error al recuperar el producto ID: ${pid} del archivo JSON.\n${err}`);
  }
});


/* POST /:
Debe agregar un nuevo producto con los siguientes campos: */
// id: Number/String (No se manda desde el body, se autogenera para asegurar que nunca se repitan los ids).

// title: String

// description: String

// code: String

// price: Number

// status: Boolean

// stock: Number

// category: String

// thumbnails: Array de Strings (rutas donde están almacenadas las imágenes del producto).

routerProducts.post('/api/products/', async (request, res) => {
  let data = new Array
  let rawData
  const io = request.app.get('io');

  try {
    rawData = await fs.readFile('./db/products.json', 'utf-8');
    data = (JSON.parse(rawData) || []);
  } catch (err) {
    console.error(`Error al recuperar el archivo JSON:\n${err}`);
    res.status(500).send(`Error al recuperar el archivo JSON.\n${err}`);
    return
  }

  const { title } = request.body;
  const { description } = request.body;
  const { code } = request.body;
  const { price } = request.body;
  const { status } = request.body;
  const { stock } = request.body;
  const { category } = request.body;
  const { thumbnails } = request.body;

  let newProduct = {
    id: data[data.length - 1].id + 1 || 1,
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
    thumbnails: thumbnails
  };

  /*       if (Array.isArray(data)){
        
        } else {
          res.status(500).send(`El Archivo JSON no es un Array`);
          return
        } */

  data.push(newProduct);
  rawData = JSON.stringify(data, null, 2);

  try {
    await fs.writeFile('./db/products.json', rawData);
    io.emit('refresh', data);
    res.status(201).json(data);
  } catch (err) {
    console.error(`Error al guardar el archivo JSON:\n${err}`);
    res.status(500).send(`Error al guardar el archivo JSON.\n${err}`);
  }
})

/* PUT /:pid:
Debe actualizar un producto por los campos enviados desde el body. No se debe actualizar ni eliminar el idal momento de hacer la actualización. */

routerProducts.put('/api/products/:pid', async (request, res) => {
  const pid = request.params.pid
  const io = request.app.get('io');
  if (pid == null) {
    return res.status(204).send(`Parametro ID vacío`);
  }

  const { title } = request.body;
  const { description } = request.body;
  const { code } = request.body;
  const { price } = request.body;
  const { status } = request.body;
  const { stock } = request.body;
  const { category } = request.body;
  const { thumbnails } = request.body;

  let rawData
  let data = new Array

  try {
    rawData = await fs.readFile('./db/products.json', 'utf-8');
    data = (JSON.parse(rawData) || []);
  } catch (err) {
    console.error(`Error al recuperar el archivo JSON:\n${err}`);
    res.status(500).send(`Error al recuperar el archivo JSON.\n${err}`);
    return
  }


  let dataToUpdate = data.find(pObj => pObj.id == pid);
  if (title != null) {
    dataToUpdate.title = title;
  }
  if (description != null) {
    dataToUpdate.description = description;
  }
  if (code != null) {
    dataToUpdate.code = code;
  }
  if (price != null) {
    dataToUpdate.price = price;
  }
  if (status != null) {
    dataToUpdate.status = status;
  }
  if (stock != null) {
    dataToUpdate.stock = stock;
  }
  if (category != null) {
    dataToUpdate.category = category;
  }
  if (thumbnails != null) {
    dataToUpdate.thumbnails = thumbnails;
    // Alternativamente .push(thumbnails);
  }

  rawData = JSON.stringify(data, null, 2);

  try {
    await fs.writeFile('./db/products.json', rawData);
    res.status(201).json(data);
    io.emit('refresh', data);
  } catch (err) {
    console.error(`Error al guardar el archivo JSON:\n${err}`);
    res.status(500).send(`Error al guardar el archivo JSON.\n${err}`);
  }
})

/* 
DELETE /:pid:
Debe eliminar el producto con el pid indicado. */

routerProducts.delete('/api/products/', async (request, res) => {
  res.status(202).send(`Parametro ID vacio`);
});

routerProducts.delete('/api/products/:pid', async (request, res) => {
  const io = request.app.get('io');
  const pid = request.params.pid;
  /*  if (pid == null){
     return res.status(204).send(`Parametro ID vacío`);
   } */

  let rawData
  let data = new Array

  try {
    rawData = await fs.readFile('./db/products.json', 'utf-8');
    data = (JSON.parse(rawData) || []);
  } catch (err) {
    console.error(`Error al recuperar el archivo JSON:\n${err}`);
    res.status(500).send(`Error al recuperar el archivo JSON.\n${err}`);
    return
  }

  let dataAfterDelete = data.filter(pObj => pObj.id != pid);
  rawData = JSON.stringify(dataAfterDelete, null, 2);

  try {
    await fs.writeFile('./db/products.json', rawData);
    res.status(204).json(dataAfterDelete);
    io.emit('refresh', dataAfterDelete);
  } catch (err) {
    console.error(`Error al guardar el archivo JSON:\n${err}`);
    res.status(500).send(`Error al guardar el archivo JSON.\n${err}`);
  }
})