import { startServer } from "./main";
import path from "node:path";

const uiDir = path.resolve(__dirname, "..", "..", "ui", "dist");

startServer(1111, uiDir)
  .then(() => console.log("Server started"))
  .catch(console.error);
