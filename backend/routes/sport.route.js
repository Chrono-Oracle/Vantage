const { Router } = require('express');
const router = Router();

const { sportValidation } = require('../utils/validations/sport.validation')
const sportController = require('../src/controllers/sport.controller')

router.post('/create', sportValidation, sportController.create);
router.get('/', sportController.findMany);
router.get('/find/:id', sportController.find);
router.put('/update/:id', sportValidation, sportController.update);
router.delete('/delete/:id', sportValidation, sportController.remove);


module.exports = router;