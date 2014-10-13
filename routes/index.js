var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});
router.get('/opus/:opus/index', function(req, res) {
	var opus = req.params.opus;
	res.render('opus/' + opus + '/index', { title: 'Express' });
});
router.get('/:htmlName', function(req, res) {
	var htmlName = req.params.htmlName;
	res.render(htmlName, { title: 'Express' });
});


module.exports = router;
