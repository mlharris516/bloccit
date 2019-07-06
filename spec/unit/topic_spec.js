const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("POST", () => {

    beforeEach((done) => {
        this.topic;
        this.post;
        sequelize.sync({force:true}).then((res) => {

            Topic.create({
                title: "My Wonderful Bloccit Tests",
                description: "I hope these work"
            })
            .then((topic) => {
                this.topic = topic;
                
                Post.create({
                    title: "The best post of all time",
                    body: "This post is the best",
                    topicId: this.topic.id
                })
                .then((post) => {
                    this.post = post;
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    
    describe("#create()", () => {
        it("should create a topic object stored in database", (done) => {
            Topic.create({
                title: "Places to climb in Denver",
                description: "Indoor and outdoor"   
            })
            .then((topic) => {
                expect(topic.title).toBe("Places to climb in Denver");
                expect(topic.description).toBe("Indoor and outdoor");
                done();
            });
        });
        it("should not create a topic with a null title or description value", (done) => {
            Topic.create({
                title: "Places to climb in Denver",
                description: "Indoor and outdoor"
            })
            .then((topic) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Topic.description cannot be null");
                done();
            });
        });
        
    });


    describe("#getPosts()", () => {
        it("should return the associated posts", (done) => {
          this.topic.getPosts()
          .then((posts) => {
            expect(posts[0].title).toBe("The best post of all time");
            done();
           });
         });
       });
});