import minimist from "minimist";

let options = minimist(process.argv.slice(2));

let today = new Date();
let year = options.y || today.getFullYear();
let cal_month = options.m || today.getMonth() + 1;
// jsの仕様に合わせる
let month = cal_month - 1;

let first_date = new Date(year, month, 1);
let last_date = new Date(year, month + 1, 0);

let format = (str) => {
  return str.padStart(2, " ") + " ";
};

console.log(`      ${cal_month}月 ${year}`);
console.log("日 月 火 水 木 金 土");
[...Array(first_date.getDay())].map(() => process.stdout.write("   "));

for (let index = 1; index <= last_date.getDate(); index++) {
  let cal_date = new Date(year, month, index);
  let day = format(String(cal_date.getDate()));

  if (cal_date.getDay() === 6) {
    console.log(day);
  } else {
    process.stdout.write(day);
  }
}
