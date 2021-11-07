import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import config from "./config";
import db from "./config/database";
import router from "./routes/index";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: config.COOKIE_KEY,
}));

app.use("/api/v1", router);

app.get("/", (req, res) => res.send({ message: `Welcome to ${config.APP_NAME} server!` }));

// Global 404 error handler
app.use((req, res, next) => res.status(404).send({
  status: "error",
  error: "Not found",
  message: "This is not the route you're looking for. You messed up",
}));

(async () => {
  process.on("warning", (e) => config.logger.warn(e.stack));
  config.logger.info("Waiting for DATABASE Connection...");
  await db.connect();
  app.listen(config.PORT || 5000, async () => {
    config.logger.info(
      `${config.APP_NAME} API listening on ${config.PORT || 5000}`
    );
  });
})();

export default app;
