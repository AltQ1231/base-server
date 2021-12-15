const Result = require("./status-handle.js");

const {
  insertDoc,
  findDoc,
  updateDocById,
  findRandomDoc,
  // removeDocById,
} = require("../mongodb/method.js");

module.exports = (router, mongodbConnection, WishTable) => {
  //  获取所有心愿
  router.get("/wish/getAllWish", (req, res) => {
    findDoc(WishTable)
      .then((resAllWish) => {
        // console.log("获取所有心愿 ==", resAllWish);
        if (resAllWish.length > 0) {
          const allWish = resAllWish.map((item) => {
            let wish = {
              wishId: item._id,
              wishContent: item.wishContent,
              toPerson: item.toPerson,
              name: item.name,
              wishTime: item.wishTime || new Date(),
              star: item.star || 0,
            };
            return wish;
          });
          new Result(allWish, "获取所有心愿成功").success(res);
        } else {
          new Result("心愿池为空").fail(res);
        }
      })
      .catch((err) => {
        console.log(err);
        new Result("获取所有心愿失败").fail(res);
      });
  });
  // 插入一条心愿
  router.post("/wish/addOneWish", (req, res) => {
    const { wishInfo } = req.body;
    // console.log("请求", wishInfo);
    insertDoc(WishTable, { ...wishInfo, wishTime: new Date() })
      .then((addWish) => {
        // console.log("新增心愿 == ", addWish);
        new Result(addWish, "新增心愿成功").success(res);
      })
      .catch((err) => {
        console.log("新增wish 错误 ==", err);
        new Result("新增心愿失败").fail(res);
      });
  });
  //  获取{name}下所有心愿
  router.get("/wish/getAllWishByName", (req, res) => {
    const { name } = req.query;
    // console.log(name);

    // new Result({ name: name }, "获取所有心愿成功").success(res);
    findDoc(WishTable, { name: name })
      .then((resAllWish) => {
        // console.log("获取所有心愿 ==", resAllWish);
        if (resAllWish.length > 0) {
          const allWish = resAllWish.map((item) => {
            let wish = {
              wishId: item._id,
              wishContent: item.wishContent,
              toPerson: item.toPerson,
              name: item.name,
              wishTime: item.wishTime || new Date(),
              star: item.star || 0,
            };
            return wish;
          });
          new Result(allWish, "获取所有心愿成功").success(res);
        } else {
          new Result("心愿池为空").fail(res);
        }
      })
      .catch((err) => {
        console.log(err);
        new Result("获取所有心愿失败").fail(res);
      });
  });
  //  获取{toPerson}下所有心愿
  router.get("/wish/getAllWishByToPerson", (req, res) => {
    const { toPerson } = req.query;
    // console.log(toPerson);

    // new Result({ toPerson: toPerson }, "获取所有心愿成功").success(res);
    findDoc(WishTable, { toPerson: toPerson })
      .then((resAllWish) => {
        // console.log("获取所有心愿 ==", resAllWish);
        if (resAllWish.length > 0) {
          const allWish = resAllWish.map((item) => {
            let wish = {
              wishId: item._id,
              wishContent: item.wishContent,
              toPerson: item.toPerson,
              name: item.name,
              wishTime: item.wishTime || new Date(),
              star: item.star || 0,
            };
            return wish;
          });
          new Result(allWish, "获取所有心愿成功").success(res);
        } else {
          new Result("心愿池为空").fail(res);
        }
      })
      .catch((err) => {
        console.log(err);
        new Result("获取所有心愿失败").fail(res);
      });
  });

  //  获取随机的心愿
  router.get("/wish/getRandomWish", (req, res) => {
    const { num } = req.query;
    console.log(num);

    // new Result({ toPerson: toPerson }, "获取所有心愿成功").success(res);
    findRandomDoc(WishTable, +num)
      .then((resAllWish) => {
        // console.log("获取随机心愿 ==", resAllWish);
        if (resAllWish.length > 0) {
          const allWish = resAllWish.map((item) => {
            let wish = {
              wishId: item._id,
              wishContent: item.wishContent,
              toPerson: item.toPerson,
              name: item.name,
              wishTime: item.wishTime || new Date(),
              star: item.star || 0,
            };
            return wish;
          });
          new Result(allWish, "获取随机心愿成功").success(res);
        } else {
          new Result("心愿池为空").fail(res);
        }
      })
      .catch((err) => {
        console.log(err);
        new Result("获取随机心愿失败").fail(res);
      });
  });
};
