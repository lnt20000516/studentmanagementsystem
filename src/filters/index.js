export function YMD(timeStamp) {
  let date = new Date(timeStamp * 1000);
  let year = date.getFullYear();
  let mouth = date.getMonth() + 1;
  let day = date.getDate();
  if (mouth < 10) {
    mouth = "0" + mouth
  }
  if (day < 10) {
    day = "0" + day;
  }
  return year + "-" + mouth + "-" + day
}

export function timeStamp(YMD) {
  let date = new Date(YMD);
  return date.getTime();
}

export function sex(value) {
  switch (value) {
    case 1:
      return "男"
    case -1:
      return "女"
    case 0:
      return "保密"
  }
}