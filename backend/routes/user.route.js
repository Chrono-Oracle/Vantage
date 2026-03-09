const { Router } = require('express');
const router = Router();
const userController = require('../src/controllers/user.controller')
const { userValidation } = require('../utils/validations/user.validation')
const { authMiddleware } = require('../utils/middlewares/auth.middleware')
const adminMiddleware = require('../utils/middlewares/admin.middleware')


router.post('/register', userValidation, userController.register);
router.post('/login', userController.login);

router.post('/verify-auth', authMiddleware, userController.profile);

router.get('/me', authMiddleware, userController.profile);

// POST /user/follow/:userId
router.post("/follow/:userId", authMiddleware, userController.follow);

// POST /user/unfollow/:userId
router.post("/unfollow/:userId", authMiddleware, userController.unfollow);


//Admin Only Routes
router.get('/', adminMiddleware, userController.findMany);
router.get('/find/:id', adminMiddleware, userController.find);
router.put('/update/:id', adminMiddleware, userController.update);
router.delete('/delete/:id', adminMiddleware, userController.remove);

module.exports = router;