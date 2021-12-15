const jwt = require("jsonwebtoken");
const jwtSalt = "blog";
const base64url = require("base64url");
const Result = require("./status-handle.js");

const {
  insertDoc,
  findDoc,
  updateDocById,
  // removeDocById,
} = require("../mongodb/method.js");

const DEFAULT_ADMIN_ACCOUNT = {
  adminName: "admin",
  adminPwd: "admin",
};

module.exports = (router, mongodbConnection, NormalUserTable) => {
  router.get("/user/getAllUser", (req, res) => {
    // return new Promise((resolve, reject) => {
    findDoc(NormalUserTable)
      .then((allUser) => {
        const temp = allUser.map((item) => {
          let user = {};
          user.userName = base64url.decode(item.userName);
          user.userPwd = base64url.decode(item.userPwd);
          user.userDesc = base64url.decode(item.userDesc);
          return user;
        });
        console.log("获取所有用户 ==", temp);
        new Result(temp, "获取获取所有用户信息成功").success(res);
      })
      .catch((err) => {
        console.log(err);
        new Result("获取获取所有用户信息失败").fail(res);
      });
    // });
  });

  router.post("/user/login", (req, res) => {
    const { userName, userPwd } = req.body;
    const postName = base64url.encode(userName);
    const postPwd = base64url.encode(userPwd);
    // console.log("login", postName);
    /* get user info from db */
    findDoc(NormalUserTable, { userName: postName })
      .then((respUserArray) => {
        // console.log("login", userName, userPwd);
        if (respUserArray.length > 0) {
          const { userPwd, isAdmin, _id } = respUserArray[0];
          if (postPwd === userPwd) {
            const jwtToken = jwt.sign(
              {
                userId: _id,
                userName,
                isAdmin,
              },
              jwtSalt
            );
            res.cookie("jwtToken", jwtToken);

            new Result(
              {
                userId: _id,
                userName,
                isAdmin,
              },
              "登录成功"
            ).success(res);
          } else {
            new Result("密码错误").fail(res);
          }
        } else {
          new Result("用户不存在").fail(res);
        }
      })
      .catch((err) => {
        console.error("login error:==", err);
        new Result("登录出错").fail(res);
      });
  });

  router.get("/user/getAdmin", async (req, res) => {
    try {
      const respAdminInfoArray = await findDoc(NormalUserTable, { isAdmin: true });
      /* if admin account exist then response it */
      if (respAdminInfoArray.length > 0) {
        // console.log('admin account exist');
        res.json({
          success: true,
          data: respAdminInfoArray[0],
        });
      } else {
        /* create it */
        const respCreatedAdmin = await insertDoc(NormalUserTable, {
          userName: base64url.encode(DEFAULT_ADMIN_ACCOUNT.adminName),
          userPwd: base64url.encode(DEFAULT_ADMIN_ACCOUNT.adminPwd),
          userDesc: base64url.encode("管理员账户用于创建模板"),
          isAdmin: true,
        });
        // console.log('admin account does not exist:==', respCreatedAdmin);
        res.json({
          success: true,
          data: respCreatedAdmin,
        });
      }
    } catch (err) {
      console.log("getAdmin err:==", err);
      res.json({
        success: false,
        data: "查询管理员错误",
      });
    }
  });
  /* 验证是否已经登录 */
  router.get("/user/authenticate", (req, res) => {
    // console.log('req.cookies.jwtToken:==', req.cookies.jwtToken);
    let decodedJwt = null;
    if (req.cookies.jwtToken) {
      try {
        decodedJwt = jwt.verify(req.cookies.jwtToken, jwtSalt);
        res.json({
          success: true,
          data: decodedJwt,
        });
      } catch (err) {
        console.log("decodedJwt error:==", err);
        res.json({
          success: true,
          data: "fail",
        });
      }
    } else {
      res.json({
        success: true,
        data: "fail",
      });
    }
  });

  /* 用户登出清除 cookie */
  router.get("/user/logout", (req, res) => {
    // console.log('req.cookies.jwtToken:==', req.cookies.jwtToken);
    res.clearCookie("jwtToken");
    res.json({
      success: true,
      data: "登出成功",
    });
  });

  router.post("/user/createNormalUser", async (req, res) => {
    try {
      const { userName, userPwd, userDesc } = req.body;
      const userInfo = {
        userName: base64url.encode(userName),
        userPwd: base64url.encode(userPwd),
        userDesc: base64url.encode(userDesc),
        isAdmin: false,
      };
      const respNorUser = await insertDoc(NormalUserTable, userInfo);
      const respNorUserData = Object.assign({}, userInfo, { _id: respNorUser._id });
      res.json({
        success: true,
        data: respNorUserData,
      });
    } catch (err) {
      console.error("createNormalUser error:==", err);
      res.json({
        success: false,
        data: "创建普通用户失败",
      });
    }
  });

  router.post("/user/modifyNormalUser", async (req, res) => {
    try {
      // console.log('modifyNormalUser req.body:==', req.body);
      const { userName, userPwd, userDesc, _id } = req.body;
      const userInfo = {
        userName: base64url.encode(userName),
        userPwd: base64url.encode(userPwd),
        userDesc: base64url.encode(userDesc),
      };
      await updateDocById(NormalUserTable, { _id }, userInfo);
      res.json({
        success: true,
        data: "修改普通用户信息成功",
      });
    } catch (err) {
      console.error("modifyNormalUser error:==", err);
      res.json({
        success: false,
        data: "修改普通用户信息失败",
      });
    }
  });

  router.get("/user/getAllNormalUser", async (req, res) => {
    try {
      const findResp = await findDoc(NormalUserTable);
      /* we should decode userName and password before send to client */
      const allNormalUserListArray = [...findResp];
      allNormalUserListArray.splice(0, 1);
      res.json({
        success: true,
        data: allNormalUserListArray,
      });
    } catch (err) {
      console.log("getAllNormalUser err:==", err);
      res.json({
        success: false,
        data: "查询普通用户错误",
      });
    }
  });
};
