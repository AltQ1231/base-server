/** Schema类型 可以如下首字母大写 或者单引号全部小写
String      字符串
Number      数字
Date        日期
Buffer      二进制
Boolean     布尔值
Mixed       混合类型
ObjectId    对象ID
Array       数组
 */
const mongoose = require("mongoose");

const { Schema } = mongoose;

module.exports = {
  WishSchema: new Schema({
    name: String,
    wishContent: String,
    toPerson: String,
    wishTime: Date,
    star: Number,
  }),
  NormalUserSchema: new Schema({
    userName: String,
    userPwd: String,
    userDesc: String,
    isAdmin: Boolean,
  }),
};
