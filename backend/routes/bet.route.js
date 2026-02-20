const { Router } = require('express');
const router = Router();

const betController = require('../src/controllers/bet.controller');

router.post('/create', betController.create);
router.get('/', betController.findMany);
router.get('/find/:id', betController.find);
router.put('/update/:id', betController.update);
router.delete('/delete/:id', betController.remove);

module.exports = router;