const { Router } = require('express');
const router = Router();

const categoryController = require('../src/controllers/category.controller');

router.post('/create', categoryController.create);
router.get('/', categoryController.findMany);
router.get('/find/:id', categoryController.find);
router.put('/update/:id', categoryController.update);
router.delete('/delete/:id', categoryController.remove);

module.exports = router;