const express = require('express');
const router = express.Router();
const oauth = require('./oauth');
const token = require('../token');

module.exports = router;

router.get('/wxactivity', (req, res) => {
    token.getToken();
    oauth.threeParty(req, res);
});