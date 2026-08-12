// noinspection JSCheckFunctionSignatures

const express = require('express');
const multer = require('../middleware/multer-config');

const router = express.Router();
const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');

// Public routes
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRated);
router.get('/:id', bookCtrl.getBook);

// Protected routes
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;
