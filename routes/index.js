var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: config.NAME });
});
router.get('/opus/:opus/index', function(req, res) {
	var opus = req.params.opus;
	res.render('opus/' + opus + '/index', { title: config.NAME });
});
router.get('/:htmlName', function(req, res) {
	var htmlName = req.params.htmlName;
	res.render(htmlName, { title: config.NAME });
});


module.exports = router;
