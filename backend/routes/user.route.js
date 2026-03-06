const { Router } = require('express');
const router = Router();
const userController = require('../src/controllers/user.controller')
const { userValidation } = require('../utils/validations/user.validation')
const { authLogin } = require('../utils/middlewares/auth.middleware')
const adminMiddleware = require('../utils/middlewares/admin.middleware')


router.post('/register', userValidation, userController.register);
router.post('/login', authLogin, userController.login);

router.post('/verify-auth', authLogin, userController.profile);

router.get('/profile', authLogin, userController.profile);

//Admin Only Routes
router.get('/', adminMiddleware, userController.findMany);
router.get('/find/:id', adminMiddleware, userController.find);
router.put('/update/:id', adminMiddleware, userController.update);
router.delete('/delete/:id', adminMiddleware, userController.remove);

module.exports = router;