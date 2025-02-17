import "@sentry/node/preload";
import { createApp } from "./app.js";
import { appConfig } from "./infrastructure/configuration/appConfig.js";

const serverConfig = appConfig.get("server");
const debugConfig = appConfig.get("debug");

if (debugConfig.sourcemap) {
  (await import("source-map-support")).install();
}

const HOST = "::";
async function start() {
  try {
    const app = await createApp();
    app.listen({ host: HOST, port: serverConfig.port }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });

    app.ready(() => {
      const routes = app.printRoutes();
      console.log(`Available Routes:\n${routes}`);
      console.log(`Server listening on http://${HOST}:${serverConfig.port}`);
    });
  } catch (error) {
    console.error("unhandled error -> stopping...", error);
    process.exit(1);
  }
}

start();
