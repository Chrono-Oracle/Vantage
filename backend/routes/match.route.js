const { Router } = require('express');
const router = Router();

const { matchValidation } = require('../utils/validations/match.validation')
const matchController = require('../src/controllers/match.controller');

router.post('/create', matchValidation, matchController.create);
router.get('/', matchController.findMany);
router.get('/:id', matchController.find);
router.put('/update/:id', matchValidation, matchController.update);
router.delete('/delete/:id', matchValidation, matchController.remove);

module.exports = router;