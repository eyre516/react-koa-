//暴漏出两个函数 :query 按照条件查询所有课程;search 搜索某个课程
const xlsx = require("node-xlsx");

const TYPE_MAP = {
  NEW: 1,
  HOT: 2,
  DISCOUNT: 3,
};
// 解析得到文档中的所有 sheet
const sheets = xlsx.parse("course.xlsx");

const sheets1 = sheets[0];
const courseList = [];
for (const rowId in sheets1["data"]) {
  const row = sheets1["data"][rowId];
  courseList.push({
    cover_img: row[0],
    booklet_id: row[1],
    title: row[2],
    summary: row[3],
    buy_count: row[4],
    price: row[5],
    put_on_time: row[6],
    discount_rate: row[7],
  });
}
const getReturnCourse = (course) => ({
  coverImg: course.cover_img,
  title: course.title,
  summary: course.summary,
  buyCount: course.buy_count,
  price: Number((course.price / 100).toFixed(2))
    .toFixed(2)
    .replace(/\.?0+$/, ""),
  isDiscount: course.discount_rate < 10,
  discountPrice: ((course.price * course.discount_rate) / 10 / 100)
    .toFixed(2)
    .replace(/\.?0+$/, ""),
  returnRedPacket: ((course.price * 0.2) / 100)
    .toFixed(2)
    .replace(/\.?0+$/, ""),
  shareUrl: `https://juejin.cn/book/${course.booklet_id}?suid=3350967171169901&source=pc`, // 每个人的 suid 不同
});
const query = async (type = TYPE_MAP.NEW) => {
  // 最新
  if (type === TYPE_MAP.NEW) {
    return courseList
      .slice()
      .sort((a, b) => b.put_on_time - a.put_on_time)
      .map(getReturnCourse);
  }
  // 最热
  if (type === TYPE_MAP.HOT) {
    return courseList
      .slice()
      .sort((a, b) => b.buy_count - a.buy_count)
      .map(getReturnCourse);
  }
  // 活动
  if (type === TYPE_MAP.DISCOUNT) {
    return courseList
      .filter((course) => course.discount_rate < 10)
      .sort((a, b) => b.put_on_time - a.put_on_time)
      .map(getReturnCourse);
  }
};
const search = async (title) => {
  if (!title) {
    return [];
  }
  return courseList
    .filter((course) => course.title.indexOf(title) !== -1)
    .sort((a, b) => b.put_on_time - a.put_on_time)
    .map(getReturnCourse);
};

//可以把 console.log 取消注释进行调试:
// (async () => {
//   console.log((await query(1))[0]);
//   console.log((await query(1))[1]);
//   console.log((await query(2))[0]);
//   console.log((await query(2))[1]);
//   console.log((await query(3))[0]);
//   console.log((await query(3))[1]);

//   console.log(await search("Nest"));
// })();

//暴露出两个函数
module.exports = {
  query,
  search,
};