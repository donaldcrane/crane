import mongoose from "mongoose";
import config from "./index";

const moongoseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connect = async () => {
  const connection = await mongoose.connect(`${config.DEV_DATABASE_URL}`, moongoseConfig);
  if (!connection) {
    config.logger.error("DATABASE connection failed! Exiting Now");
    process.emit("SIGTERM");
    process.exit(1);
  }
  config.logger.info("DATABASE connected successfully!");
  return connection;
};

export default { connect };
