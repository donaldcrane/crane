import seeder from "mongoose-seed";

const userSeed = require("./userSeed");
const postSeed = require("./postSeed");
const commentSeed = require("./commentSeed");
const config = require("../config/index");

// Data array containing seed data - documents organized by Model
const data = [userSeed, postSeed, commentSeed];
seeder.connect(config.TEST_DATABASE_URL, () => {
  // load models
  seeder.loadModels(["./src/models/user.js", "./src/models/post.js", "./src/models/comment.js"]);
  //   clear database
  seeder.clearModels(["user", "post", "comment"], () => {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, (err, done) => {
      if (err) {
        console.log(err);
        return err;
      }
      if (done) {
        console.log("seeding done");
      }
      seeder.disconnect();
    });
  });
});
