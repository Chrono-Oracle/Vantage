const { Router } = require('express');
const router = Router();

const sportController = require('../src/controllers/sport.controller')

router.post('/create', sportController.create);
router.get('/', sportController.findMany);
router.get('/find/:id', sportController.find);
router.put('/update/:id', sportController.update);
router.delete('/delete/:id', sportController.remove);


module.exports = router;