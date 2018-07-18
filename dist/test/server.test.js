"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiHttp = require("chai-http");
const chai_1 = require("chai");
const app_1 = __importDefault(require("../app"));
const user_1 = require("../Models/user");
const todo_1 = require("../Models/todo");
const seed_1 = require("./seed/seed");
chai.use(chaiHttp);
before(function (done) {
    this.timeout(40000);
    user_1.User.remove({})
        .then(() => {
        const userOne = new user_1.User(seed_1.users[0]).save();
        const userTwo = new user_1.User(seed_1.users[1]).save();
        return Promise.all([userOne, userTwo]);
    })
        .then(() => {
        done();
    });
});
before(function (done) {
    this.timeout(40000);
    todo_1.Todo.remove({})
        .then(() => {
        return todo_1.Todo.insertMany(seed_1.todos);
    })
        .then(() => {
        done();
    });
});
after((done) => {
    user_1.User.remove({})
        .then(() => {
        return todo_1.Todo.remove({});
    })
        .then(() => done());
});
describe("SERVER", () => {
    describe("POST /signup", () => {
        it("should create new user", (done) => {
            const username = "test100";
            const email = "test100@test.com";
            const password = "password10";
            chai.request(app_1.default)
                .post("/signup")
                .send({
                username,
                email,
                password,
                confirmPassword: password
            })
                .end((err, res) => {
                chai_1.expect(res.status).equal(200);
                chai_1.expect(res.body.success).to.be.true;
                chai_1.expect(res.body.message).to.equal("created new user");
                done();
            });
        });
        it("should not create new user for already existed user", (done) => {
            const username = "test100";
            const email = "test100@test.com";
            const password = "password10";
            chai.request(app_1.default)
                .post("/signup")
                .send({
                username,
                email,
                password,
                confirmPassword: password
            })
                .end((err, res) => {
                chai_1.expect(res.status).equal(400);
                chai_1.expect(res.body.success).to.be.false;
                chai_1.expect(res.body.error).to.equal("email already registered");
                done();
            });
        });
        it("should not create user with invalid email", (done) => {
            const username = "test200";
            const email = "test200";
            const password = "password10";
            chai.request(app_1.default)
                .post('/signup')
                .send({
                username,
                email,
                password,
                confirmPassword: password
            })
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(400);
                chai_1.expect(res.body.errors[0].msg).to.equal("invalid email");
                done();
            });
        });
    });
    describe("POST /login", () => {
        it("should login a user", (done) => {
            chai.request(app_1.default)
                .post("/login")
                .send({
                email: seed_1.users[0].email,
                password: seed_1.users[0].password
            })
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(200);
                chai_1.expect(res.body.user.email).to.equal(seed_1.users[0].email);
                chai_1.expect(res.body.user.username).to.equal(seed_1.users[0].username);
                chai_1.expect(res.body.token).to.exist;
                done();
            });
        });
        it("should not login a invalid user", (done) => {
            chai.request(app_1.default)
                .post("/login")
                .send({
                email: seed_1.users[0].email,
                password: "notthecorrectpassword"
            })
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(401);
                chai_1.expect(res.body.errors).to.equal("Incorrect password");
                done();
            });
        });
    });
    describe("GET /todos", () => {
        it("should return list of todos for valid token", (done) => {
            chai.request(app_1.default)
                .get("/todos")
                .set("Authorization", `bearer ${seed_1.userOneToken}`)
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(200);
                chai_1.expect(res.body.success).to.be.true;
                chai_1.expect(res.body.todos.length).to.equal(1);
                done();
            });
        });
        it("should not return list of todos for invalid token", (done) => {
            chai.request(app_1.default)
                .get("/todos")
                .set("Authorization", `bearer dafdfa`)
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(401);
                done();
            });
        });
    });
    describe("POST /todo", () => {
        it("should create a todo for a valid token", (done) => {
            const title = "New Todo";
            const description = "New Todo Description";
            chai.request(app_1.default)
                .post("/todo")
                .set("Authorization", `bearer ${seed_1.userOneToken}`)
                .send({
                title,
                description
            })
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(200);
                chai_1.expect(res.body.success).to.be.true;
                chai_1.expect(res.body.todo).to.include({
                    title,
                    description,
                    author: seed_1.userOneId.toHexString()
                });
                done();
            });
        });
        it("should not create a todo for invalid data", (done) => {
            const title = "";
            const description = "New Todo Description";
            chai.request(app_1.default)
                .post("/todo")
                .set("Authorization", `bearer ${seed_1.userOneToken}`)
                .send({
                title,
                description
            })
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(400);
                chai_1.expect(res.body.success).to.be.false;
                chai_1.expect(res.body.errors[0].msg).to.equal("Should not be empty");
                done();
            });
        });
    });
    describe("GET /todo/:id", () => {
        it("should return a todo for valid token and id", (done) => {
            chai.request(app_1.default)
                .get(`/todo/${seed_1.todos[1]._id}`)
                .set("Authorization", `bearer ${seed_1.userTwoToken}`)
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(200);
                chai_1.expect(res.body.success).to.be.true;
                chai_1.expect(res.body.todo).to.include({
                    title: seed_1.todos[1].title,
                    description: seed_1.todos[1].description,
                    author: seed_1.todos[1].author.toHexString(),
                    _id: seed_1.todos[1]._id.toHexString()
                });
                done();
            });
        });
        it("should not return a todo for valid token and invalid id", (done) => {
            const id = "asasdafd";
            chai.request(app_1.default)
                .get(`/todo/${id}`)
                .set("Authorization", `bearer ${seed_1.userTwoToken}`)
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(400);
                done();
            });
        });
    });
    describe("PUT /todo/:id", () => {
        it("should update a todo with valid id and token", (done) => {
            const completed = true;
            chai.request(app_1.default)
                .put(`/todo/${seed_1.todos[0]._id}`)
                .set("Authorization", `bearer ${seed_1.userOneToken}`)
                .send({
                completed
            })
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(200);
                chai_1.expect(res.body.success).to.true;
                chai_1.expect(res.body.todo).to.include({
                    title: seed_1.todos[0].title,
                    description: seed_1.todos[0].description,
                    author: seed_1.todos[0].author.toHexString(),
                    _id: seed_1.todos[0]._id.toHexString(),
                    completed: true
                });
                done();
            });
        });
        it("should not update a todo with valid id and token for invalid input", (done) => {
            chai.request(app_1.default)
                .put(`/todo/${seed_1.todos[0]._id}`)
                .set("Authorization", `bearer ${seed_1.userOneToken}`)
                .send({})
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(400);
                done();
            });
        });
    });
    describe("DELETE /todo/:id", () => {
        it("should delete a todo for valid id and token", (done) => {
            chai.request(app_1.default)
                .del(`/todo/${seed_1.todos[0]._id}`)
                .set("Authorization", `bearer ${seed_1.userOneToken}`)
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(200);
                chai_1.expect(res.body.success).to.be.true;
                chai_1.expect(res.body.todo).include(Object.assign({}, seed_1.todos[0], { _id: seed_1.todos[0]._id.toHexString(), author: seed_1.todos[0].author.toHexString() }));
                done();
            });
        });
        it("should not delete a todo for invalid id and token", (done) => {
            chai.request(app_1.default)
                .del(`/todo/dfadfa`)
                .set("Authorization", `bearer ${seed_1.userTwoToken}`)
                .end((err, res) => {
                chai_1.expect(res.status).to.equal(400);
                done();
            });
        });
    });
});
