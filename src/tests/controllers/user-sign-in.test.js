import chai from "chai";
import chaiHttp from "chai-http";
import server from "../../app";
import {
  user, user2, user3, user4, user5, user6, profile, photo
} from "./user-sign-in-test-data";
import sendGrid from "../../utils/sendgrid";

sendGrid.sandboxMode();

const { expect } = chai;
chai.should();
chai.use(chaiHttp);
describe("Should test all users", async () => {
  describe("/api/v1/users/signin should sign in a user", () => {
    it("it should sign in a user with complete details successfully", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/signin")
        .set("Accept", "application/json")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("User Logged in Successfully.");
          done();
        });
    });
    it("it should not sign in a user with incomplete details", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/signin")
        .set("Accept", "application/json")
        .send(user2)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it("it should not sign in a user without a registered account", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/signin")
        .set("Accept", "application/json")
        .send(user3)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("error").eql("User details supplied does not exist.");
          done();
        });
    });
  });
  describe("api/v1/users/verify should verify a user's account", () => {
    it("it should verify a user's account", (done) => {
      chai
        .request(server)
        .patch("/api/v1/users/verify")
        .set("Accept", "application/json")
        .send(user6)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    describe("reset user  password", () => {
      it("should recover user account", (done) => {
        chai
          .request(server)
          .post("/users/recover")
          .set("Accept", "application/json")
          .send(user4)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
      it("should reset user password", (done) => {
        chai
          .request(server)
          .patch("/users/reset")
          .set("Accept", "application/json")
          .send(user5)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("User password updated successfully",);
            done();
          });
      });
    });
  });

  describe("should handle single user's operation", () => {
    let userToken;
    before((done) => {
      chai
        .request(server)
        .post("/users/signin")
        .set("Accept", "application/json")
        .send(user)
        .end((err, res) => {
          if (err) throw err;
          userToken = res.body.token;
          done();
        });
    });
    it("it should not update a user's profile who is not signed in", (done) => {
      chai
        .request(server)
        .patch("/api/v1/users/update/profile")
        .send(profile)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("error").eql("Authorization not found");
          done();
        });
    });
    it("it should update a logged in user's profile", (done) => {
      chai
        .request(server)
        .patch("/api/v1/users/update/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .send(profile)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Profile updated Successfully");
          done();
        });
    });
    it("it should update a logged in user's profile picture", (done) => {
      chai
        .request(server)
        .patch("/user/update/profile_image")
        .set("Authorization", `Bearer ${userToken}`)
        .send(photo)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Profile picture Updated Successfully");
          done();
        });
    });
  });
});
