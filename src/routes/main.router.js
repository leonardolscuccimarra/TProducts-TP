import express from 'express';
export const routerMain = express.Router();

routerMain.get('/', (request, res) => {
    res.render('home');
});

// module.exports = router;