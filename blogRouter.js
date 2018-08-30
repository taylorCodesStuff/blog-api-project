const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Blogs} = require('./models');

// title, content, author, publishDate
Blogs.create(
    'First Blog',
    'Blah Blah Blah',
    'Taylor',
    '08/30/18'
);

Blogs.create(
    'Second Blog',
    'More Blah Blah Blah',
    'Another Taylor',
    '08/30/18'
);

router.get('/', (req, res) => {
    res.json(Blogs.get());
});


module.exports = router;