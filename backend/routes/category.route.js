const { Router } = require('express');
const router = Router();

const { categoryValidation } = require('../utils/validations/category.validation')
const categoryController = require('../src/controllers/category.controller');

router.post('/create', categoryValidation, categoryController.create);
router.get('/', categoryController.findMany);
router.get('/find/:id', categoryController.find);
router.put('/update/:id', categoryValidation, categoryController.update);
router.delete('/delete/:id', categoryValidation, categoryController.remove);

module.exports = router;