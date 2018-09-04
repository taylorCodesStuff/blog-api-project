const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Post', function(){
    
    before(function(){
        return runServer();
    });

    after(function(){
        return closeServer();
    });

    it('should list items on GET', function(){
        return chai.request(app)
                .get('/blog-posts')
                .then(function(res){
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');

                    const expectedKeys = ['title', 'content', 'author', 'publishDate'];
                    res.body.forEach(function(item){
                        expect(item).to.be.a('object');
                        expect(item).to.include.keys(expectedKeys);
                    });
                });
    });

    it('should add an item on POST', function(){
        const newItem = {
            title: 'test post',
            content: 'Testing 1 2 3',
            author: 'Me, Myself, and I',
            publishDate: 'Today'
        };
        return chai.request(app)
                .post('/blog-posts')
                .send(newItem)
                .then(function(res){
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res).to.not.equal(null);
                    expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
                    expect(res.body).to.deep.equal(Object.assign(newItem, {id:res.body.id}));
                });
    });

    it('should update items on PUT', function(){
        const updateItem = {
            title: 'update post',
            content: '3 2 1 Testing',
            author: 'I and other people',
            publishDate: 'Later that sameday'
        };
        return chai.request(app)
                .get('/blog-posts')
                .then(function(res){
                    updateItem.id = res.body[0].id;
                    return chai.request(app)
                            .put(`/blog-posts/${updateItem.id}`)
                            .send(updateItem)
                })
                .then(function(res){
                    res.should.have.status(204);
                });
    });

    it('should delete item on DELETE', function(){
        return chai.request(app)
                .get('/blog-posts')
                .then(function(res){
                    return chai.request(app)
                            .delete(`/blog-posts/${res.body[0].id}`);
                })
                .then(function(res){
                    expect(res).to.have.status(204);
                });
    });


});

