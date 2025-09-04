import next from "next";
import { createServer } from "http";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      try {
        handle(req, res);
      } catch (err) {
        console.error("Error occurred handling request:", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    })
      .listen(port, () => {
        console.log(
          `> Server listening at http://${hostname}:${port} as ${
            dev ? "development" : "production"
          }`
        );
      })
      .on("error", (err) => {
        console.error("Failed to start server:", err);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error("Failed to prepare Next.js app:", err);
    process.exit(1);
  });

process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server...");
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
