const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// title, content, author, publishDate
BlogPosts.create(
    'First Blog',
    'Blah Blah Blah',
    'Taylor',
    '08/30/18'
);

BlogPosts.create(
    'Second Blog',
    'More Blah Blah Blah',
    'Another Taylor',
    '08/30/18'
);

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});


router.post('/', jsonParser, (req, res) => {
    // ensure title, content, author, date are in request body
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for(let i=0;i<requiredFields.length;i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            return res.status(400).send('Missing item');
        }
    }

    const post = BlogPosts.create(
        req.body.title,
        req.body.content,
        req.body.author,
        req.body.publishDate
    );

    res.status(201).json(post);
});


router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    res.status(204).end();
});


router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
    for(let i=0;i<requiredFields.length;i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            return res.status(400).send('Missing item');
        }
    }

    if(req.params.id !== req.body.id){
        return res.status(400).send("Wrong IDs");
    }

    const updatedPost = BlogPosts.update({
       id: req.params.id,
       title: req.body.title,
       content: req.body.content,
       author: req.body.author,
       publishDate: req.body.publishDate
    });
    res.status(204).end();
});


module.exports = router;