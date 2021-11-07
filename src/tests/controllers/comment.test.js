import chai from "chai";
import chaiHttp from "chai-http";
import { user } from "./user-sign-in-test-data";
import { comment, comment2 } from "./comment-data";
import server from "../../app";

chai.should();

const { expect } = chai;
chai.use(chaiHttp);

describe("Add comment", () => {
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
  it("should allow user add a comment", (done) => {
    chai
      .request(server)
      .post("/api/v1/posts/6186f39a38a969e972804ad3/comment")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(comment)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it("should not allow user add a comment with incomplete details", (done) => {
    chai
      .request(server)
      .post("/api/v1/posts/a430e505-937b-4908-9422-7aa57044e85a/comment")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(comment2)
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
});
