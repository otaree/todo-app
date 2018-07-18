import chai = require("chai");
import chaiHttp = require("chai-http");
import { expect } from 'chai';
import { Done } from 'mocha';

import app from '../app';
import { User } from '../Models/user';
import { Todo } from '../Models/todo';
import { users, todos, userOneId, userTwoId, userOneToken, userTwoToken } from './seed/seed';

chai.use(chaiHttp);

before(function (done: Done) {
    this.timeout(40000);
    
    User.remove({})
        .then(() => {
            const userOne = new User(users[0]).save();    
            const userTwo = new User(users[1]).save();
            return Promise.all([userOne, userTwo]);
        })
        .then(() => {
            done();
        });
});
before(function (done: Done)  {
    this.timeout(40000);
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => {
            done();
        });
});

after((done: Done) => {
    User.remove({})
        .then(() => {
           return Todo.remove({})
        })
        .then(() => done());
});

describe("SERVER", () => {
    describe("POST /signup", () => {
        it("should create new user", (done: Done) => {
            const username = "test100"
            const email = "test100@test.com";
            const password = "password10";

            chai.request(app)
                .post("/signup")
                .send({
                    username,
                    email,
                    password,
                    confirmPassword: password
                })
                .end((err, res) => {
                    expect(res.status).equal(200);
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.equal("created new user");
                    done();
                });
        });

        it("should not create new user for already existed user", (done: Done) => {
            const username = "test100"
            const email = "test100@test.com";
            const password = "password10";

            chai.request(app)
                .post("/signup")
                .send({
                    username,
                    email,
                    password,
                    confirmPassword: password
                })
                .end((err, res) => {
                    expect(res.status).equal(400);
                    expect(res.body.success).to.be.false;
                    expect(res.body.error).to.equal("email already registered");
                    done();
                });
        });

        it("should not create user with invalid email", (done: Done) => {
            const username = "test200";
            const email = "test200";
            const password = "password10";

            chai.request(app)
                .post('/signup')
                .send({
                    username,
                    email,
                    password,
                    confirmPassword: password
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body.errors[0].msg).to.equal("invalid email");
                    done();
                });
        });
    });

    describe("POST /login", () => {
        it("should login a user", (done: Done) => {
            chai.request(app)
                .post("/login")
                .send({
                    email: users[0].email,
                    password: users[0].password
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.user.email).to.equal(users[0].email);
                    expect(res.body.user.username).to.equal(users[0].username);
                    expect(res.body.token).to.exist;
                    done();
                });
        });

        it("should not login a invalid user", (done: Done) => {
            chai.request(app)
                .post("/login")
                .send({
                    email: users[0].email,
                    password: "notthecorrectpassword"
                })
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    expect(res.body.errors).to.equal("Incorrect password");
                    done();
                });
        });
    });

    describe("GET /todos", () => {
        it("should return list of todos for valid token", (done: Done) => {
            chai.request(app)
                .get("/todos")
                .set("Authorization", `bearer ${userOneToken}`)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.success).to.be.true;
                    expect(res.body.todos.length).to.equal(1);
                    done();
                });
        });

        it("should not return list of todos for invalid token", (done: Done) => {
            chai.request(app)
                .get("/todos")
                .set("Authorization", `bearer dafdfa`)
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        });
    });

    describe("POST /todo", () => {
        it("should create a todo for a valid token", (done: Done) => {
            const title = "New Todo";
            const description = "New Todo Description";
            chai.request(app)
                .post("/todo")
                .set("Authorization", `bearer ${userOneToken}`)
                .send({
                    title,
                    description
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.success).to.be.true;
                    expect(res.body.todo).to.include({
                        title,
                        description,
                        author: userOneId.toHexString()
                    });
                    done();
                });
        });

        it("should not create a todo for invalid data", (done: Done) => {
            const title = "";
            const description = "New Todo Description";
            chai.request(app)
                .post("/todo")
                .set("Authorization", `bearer ${userOneToken}`)
                .send({
                    title,
                    description
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body.success).to.be.false;
                    expect(res.body.errors[0].msg).to.equal("Should not be empty");
                    done();
                });
        });
    });

    describe("GET /todo/:id", () => {
        it("should return a todo for valid token and id", (done: Done) => {
            chai.request(app)
                .get(`/todo/${todos[1]._id}`)
                .set("Authorization", `bearer ${userTwoToken}`)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.success).to.be.true;
                    expect(res.body.todo).to.include({
                        title: todos[1].title,
                        description: todos[1].description,
                        author: todos[1].author.toHexString(),
                        _id: todos[1]._id.toHexString()
                    });
                    done();
                });
        });

        it("should not return a todo for valid token and invalid id", (done: Done) => {
            const id = "asasdafd"
            chai.request(app)
                .get(`/todo/${id}`)
                .set("Authorization", `bearer ${userTwoToken}`)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    done();
                });
        });
    });

    describe("PUT /todo/:id", () => {
        it("should update a todo with valid id and token", (done: Done) => {
            const completed = true;
            chai.request(app)
                .put(`/todo/${todos[0]._id}`)
                .set("Authorization", `bearer ${userOneToken}`)
                .send({
                    completed
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.success).to.true;
                    expect(res.body.todo).to.include({
                        title: todos[0].title,
                        description: todos[0].description,
                        author: todos[0].author.toHexString(),
                        _id: todos[0]._id.toHexString(),
                        completed: true
                    });
                    done();
                });
        });

        it("should not update a todo with valid id and token for invalid input", (done: Done) => {
            chai.request(app)
                .put(`/todo/${todos[0]._id}`)
                .set("Authorization", `bearer ${userOneToken}`)
                .send({ })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    done();
                });
        });
    });

    describe("DELETE /todo/:id", () => {
        it("should delete a todo for valid id and token", (done: Done) => {
            chai.request(app)
                .del(`/todo/${todos[0]._id}`)
                .set("Authorization", `bearer ${userOneToken}`)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.success).to.be.true;
                    expect(res.body.todo).include({
                        ...todos[0],
                        _id: todos[0]._id.toHexString(),
                        author: todos[0].author.toHexString()
                    });
                    done();    
                }); 
        });
        
        it("should not delete a todo for invalid id and token", (done: Done) => {
            chai.request(app)
                .del(`/todo/dfadfa`)
                .set("Authorization", `bearer ${userTwoToken}`)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    done();    
                }); 
        });  
    });
});
