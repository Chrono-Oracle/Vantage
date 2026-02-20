const { Router } = require('express');
const router = Router();

const userController = require('../src/controllers/user.controller');

router.post('/create', userController.create);
router.get('/', userController.findMany);
router.get('/find/:id', userController.find);
router.put('/update/:id', userController.update);
router.delete('/delete/:id', userController.remove);

module.exports = router;