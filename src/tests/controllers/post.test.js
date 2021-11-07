import chai from "chai";
import chaiHttp from "chai-http";
import server from "../../app";
import db from "../../models";
import { user } from "./user-sign-in-test-data";
import {
  post, post2, post4, post5, edit
} from "./post-data";

chai.should();

const { expect } = chai;
chai.use(chaiHttp);
describe("Add post", () => {
  let userToken;
  before((done) => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(user)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data;
        done();
      });
  });
  it("should allow user add a post", (done) => {
    chai
      .request(server)
      .post("/api/v1/posts")
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${userToken}`)
      .send(post)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it("should not allow user add a post with incomplete details", (done) => {
    chai
      .request(server)
      .post("/api/v1/posts")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(post2)
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
});

describe("Like a post", () => {
  beforeEach(async () => {
    await db.Post.create(post4);
    await db.Post.create(post5);
  });
  let userToken;
  before((done) => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(user)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data;
        done();
      });
  });
  it("should allow user like a post", (done) => {
    chai
      .request(server)
      .patch("/api/v1/posts/6186f39a38a969e972804ad3/like")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Successfully liked Post.");
        done();
      });
  });
  it("returns 404 when liking a post which is not in db", (done) => {
    chai
      .request(server)
      .patch("/api/v1/posts/6186f39a38a969e972804ad5/like")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal("Post not found.");
        done();
      });
  });
  it("should allow user unlike a post", (done) => {
    chai
      .request(server)
      .patch("/api/v1/posts/6186f39a38a969e972804ad3`/unlike")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Successfully unliked Post.");
        done();
      });
  });
  it("returns 404 when unliking a post which is not in db", (done) => {
    chai
      .request(server)
      .patch("/api/v1/posts/6186f39a38a969e972804ad5/unlike")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal("Post not found.");
        done();
      });
  });
});

describe("Delete post", () => {
  beforeEach(async () => {
    await db.Post.create(post4);
  });
  let userToken;
  before((done) => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(user)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data;
        done();
      });
  });
  it("should allow user Delete a post", (done) => {
    chai
      .request(server)
      .delete("/api/v1/posts/6186f39a38a969e972804ad3")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Successfully Deleted Post.");
        done();
      });
  });
  it("should not allow user without token delete a post", (done) => {
    chai
      .request(server)
      .delete("/api/v1/posts/6186f39a38a969e972804ad4")
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should not allow user delete a post with invalid ID data type", (done) => {
    chai
      .request(server)
      .delete("/api/v1/posts/8d58")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
  it("returns 404 when deleting post which is not in db", (done) => {
    chai
      .request(server)
      .delete("/api/v1/posts/6186f39a38a969e982804ad4")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal("Post not found.");
        done();
      });
  });
});

describe("Edit post", () => {
  beforeEach(async () => {
    await db.Post.create(post4);
    await db.Post.create(post5);
  });
  let userToken;
  before((done) => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(user)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data;
        done();
      });
  });
  it("should allow user edit a post", (done) => {
    chai
      .request(server)
      .patch("/api/v1/posts/6186f39a38a969e972804ad3/edit")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Successfully edited Post.");
        done();
      });
  });
  it("should not allow user without token edit a post", (done) => {
    chai
      .request(server)
      .patch("/api/v1/posts/6186f39a38a969e972804ad4/edit")
      .send(edit)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should not allow user edit a post with invalid ID data type", (done) => {
    chai
      .request(server)
      .patch("/api/v1/posts/8d58/edit")
      .set("Authorization", `Bearer ${userToken}`)
      .send(edit)
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
  it("returns 404 when editing post which is not in db", (done) => {
    chai
      .request(server)
      .delete("/api/v1/posts/6186f39a38a999e982804ad4/edit")
      .set("Authorization", `Bearer ${userToken}`)
      .send(edit)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal("Post not found.");
        done();
      });
  });
});

describe("GET post api route", () => {
  beforeEach(async () => {
    await db.Post.create(post4);
    await db.Post.create(post5);
  });
  let userToken;
  before((done) => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(user)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data;
        done();
      });
  });
  it("returns all posts", (done) => {
    chai
      .request(server)
      .get("/api/v1/posts")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { status, body } = res;
        const { data } = body;
        expect(status).to.equal(200);
        expect(body.status).to.equal(200);
        expect(body.message).to.equal("Successfully retrieved all Posts.");

        data.forEach((posts) => {
          expect(posts).to.have.property("_id");
          expect(posts).to.have.property("post");
          expect(posts).to.have.property("likes");
          expect(posts).to.have.property("owner");
          expect(posts).to.have.property("comments");
          expect(posts).to.have.property("likes_count");
        });

        expect(data).to.have.length(2);

        expect(data).to.be.an("array");
        done();
      });
  });
  it("returns post with specific id", (done) => {
    chai
      .request(server)
      .get("/api/v1/posts/6186f39a38a969e972804ad4")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { status, body } = res;
        const { data } = body;
        expect(status).to.equal(200);
        expect(body.status).to.equal(200);
        expect(body.message).to.equal("Successfully retrieved Post.");
        expect(data).to.have.property("_id");
        expect(posts).to.have.property("post");
        expect(posts).to.have.property("likes");
        expect(posts).to.have.property("owner");
        expect(posts).to.have.property("comments");
        expect(posts).to.have.property("likes_count");

        expect(data).to.be.an("object");
        done();
      });
  });
});
