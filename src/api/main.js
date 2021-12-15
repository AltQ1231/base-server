const router = require("express").Router();
const connectSelfMongodb = require("../mongodb/index.js");
const { NormalUserSchema, WishSchema } = require("../mongodb/schema.js");

const UserApi = require("./user.js");
const WishApi = require("./wish.js");

module.exports = (httpServer) => {
  let mongodbConnection;
  let NormalUserTable;
  let WishTable;

  connectSelfMongodb()
    .then((resp) => {
      mongodbConnection = resp;
      NormalUserTable = mongodbConnection.model("NormalUserTable", NormalUserSchema);
      WishTable = mongodbConnection.model("WishTable", WishSchema);
      /* createWSS  */
      // createWSS(httpServer);

      UserApi(router, mongodbConnection, NormalUserTable);
      WishApi(router, mongodbConnection, WishTable);
    })
    .catch((err) => {
      console.log("连接自身用 Mongodb 错误:==\n", err);
      mongodbConnection = undefined;
    });
  return router;
};
