const { Router } = require('express');
const router = Router();

const matchController = require('../src/controllers/match.controller');

router.post('/create', matchController.create);
router.get('/', matchController.findMany);
router.get('/find/:id', matchController.find);
router.put('/update/:id', matchController.update);
router.delete('/delete/:id', matchController.remove);

module.exports = router;