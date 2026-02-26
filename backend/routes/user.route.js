const { Router } = require('express');
const router = Router();
const userController = require('../src/controllers/user.controller')
const { userValidation } = require('../utils/validations/user.validation')
const authMiddleware = require('../utils/middlewares/auth.middleware')
const adminMiddleware = require('../utils/middlewares/admin.middleware')


router.post('/create', userValidation, userController.create);
router.post('/login', userController.login);

router.get('/profile', authMiddleware, userController.profile);

//Admin Only Routes
router.get('/', adminMiddleware, userController.findMany);
router.get('/find/:id', adminMiddleware, userController.find);
router.put('/update/:id', adminMiddleware, userController.update);
router.delete('/delete/:id', adminMiddleware, userController.remove);

module.exports = router;