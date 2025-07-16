const { Router } = require('express');
const router = Router();

const funcController = require('../controllers/funcController');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

router.get('/', ensureAuthenticated, funcController.getHomePage);
router.post('/admin', ensureAuthenticated, funcController.handleAdmin);
router.post('/membership', ensureAuthenticated, funcController.handleMembership);
router.post('/addNewMessage', ensureAuthenticated, funcController.addNewMessage);
router.delete('/messages/:id', ensureAuthenticated, funcController.deleteMessage);

module.exports = router;