const aCity = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外"
}

function isCardID(sId) {
  if (!sId) {
    return '请输入身份证号'
  }
  let iSum = 0;
  let info = "";
  if (!/^\d{17}(\d|x)$/i.test(sId)) return "身份证长度或格式错误";
  sId = sId.replace(/x$/i, "a");
  if (aCity[parseInt(sId.substr(0, 2))] == null) return "身份证地区非法";
  let sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
  let d = new Date(sBirthday.replace(/-/g, "/"));
  if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "身份证上的出生日期非法";
  for (let i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
  if (iSum % 11 != 1) return "身份证号非法";
  //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
  return true;
}

// function isTelOk(tel) {
//   if (!tel) {
//     return '请输入联系方式'
//   }
//   let regex = /0?(13|14|15|17|18|19)[0-9]{9}/;
//   if (!regex.test(tel)) return "手机号格式错误！";
//   return true;
// }
// 手机号校验
function isTelOk(phoneNum) {
  // let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  /*
    * 移动号码包括的号段：134/135/136/137,138,139；
  *                     147/148(物联卡号)；
  *                     150/151/152/157/158/159；
  *                     165（虚拟运营商）；
  *                     1703/1705/1706（虚拟运营商）、178；
  *                     182/183/184/187/188
  *                     198

  * 联通号段包括：130/131
  *               145
  *               155/156
  *               166/167(虚拟运营商)
  *               1704/1707/1708/1709、171
  *               186/186
  *
  * 电信号段包括： 133
  *                153
  *                162(虚拟运营商)
  *                1700/1701/1702(虚拟运营商)
  *                180/181/189
  *                191/199
  * */
  let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
  if (!reg.test(phoneNum)) return "手机号格式错误"
  return true
}

function isChines(name) {
  if (!name) {
    return '请输入姓名'
  }
  let regex = /[\u4e00-\u9fa5]/;
  if (!regex.test(name)) return '姓名必须为中文';
  return true;
}

function isQQ(qq) {
  var filter = /^\s*[.0-9]{5,11}\s*$/;
  if (!filter.test(qq)) {
    return false;
  } else {
    return true;
  }
}

//验证邮箱格式
function isEmail(str) {
  if (str.charAt(0) == "." || str.charAt(0) == "@" || str.indexOf('@', 0) == -1 ||
    str.indexOf('.', 0) == -1 || str.lastIndexOf("@") == str.length - 1 ||
    str.lastIndexOf(".") == str.length - 1 ||
    str.indexOf('@.') > -1)
    return false;
  else
    return true;
}
export {
  isChines,
  isTelOk,
  isCardID,
  isQQ,
  isEmail,
}