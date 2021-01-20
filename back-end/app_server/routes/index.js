const express = require('express');
const router = express.Router();
const postcontrollers = require('../controllers/post')
const othercontrollers = require('../controllers/others')

/* GET home page. */
router.get('/', postcontrollers.homelist)
router.get('/post', postcontrollers.postinfo)
router.get('/review/new', postcontrollers.addreview)

// Other pages
router.get('/about', othercontrollers.about)

module.exports = router;