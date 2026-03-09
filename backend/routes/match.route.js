const { Router } = require('express');
const router = Router();

const { authMiddleware } = require('../utils/middlewares/auth.middleware');
const { matchValidation } = require('../utils/validations/match.validation')
const matchController = require('../src/controllers/match.controller');

// Match following routes
router.post('/:id/follow', authMiddleware, matchController.follow);
router.delete('/:id/unfollow', authMiddleware, matchController.unfollow);
router.get('/:id/followers', matchController.getFollowers);

router.post('/create', matchValidation, matchController.create);
router.get('/', matchController.findMany);
router.get('/:id', matchController.find);
router.put('/update/:id', matchValidation, matchController.update);
router.delete('/delete/:id', matchValidation, matchController.remove);

module.exports = router;