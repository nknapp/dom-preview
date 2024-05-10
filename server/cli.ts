import { startServer } from "@server/main";

startServer(1111)
  .then(() => console.log("Server started"))
  .catch(console.error);
