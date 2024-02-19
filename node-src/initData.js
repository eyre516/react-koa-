const fetch = require("node-fetch");
const xlsx = require("node-xlsx");
const fs = require("fs");
async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}
const courseList = [];
async function fetchData() {
  try {
    const body = {
      category_id: "0",
      cursor: "0",
      sort: 10,
      limit: 20,
      coupon_id: "",
    };
    let hasMore = true;
    while (hasMore) {
      const response = await fetch(
        "https://api.juejin.cn/booklet_api/v1/booklet/listbycategory?aid=2608&uuid=7236932435564824098&spider=0",
        {
          headers: {
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua":
              '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-secsdk-csrf-token":
              "000100000001018618554122450918b0cffbbc37b475dbaf55618286dbd968f06fc756ca563a1762401320da0a20",
            cookie:
              "csrf_session_id=bdf4f55724ffd0acb9b0228ba1ae30cf; msToken=9Np0AFwuj6O0yA1YxYWvqR2Q2xtnUhcghTDm9W7KgH6HrZIYaglNvGfOmxQCKOpI1Qga6Vla1r535UzTVMYMcP1LFRu-yUDXbLICjUwTKUA=; _tea_utm_cache_2608=undefined; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227236932435564824098%2522%252C%2522user_unique_id%2522%253A%25227236932435564824098%2522%252C%2522timestamp%2522%253A1684979661511%257D",
            Referer: "https://juejin.cn/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          body: JSON.stringify(body),
          method: "POST",
        }
      );
      console.log("cursor:", body.cursor);
      const res = await response.json();
      hasMore = res.has_more;
      body.cursor = res.cursor;
      for (let info of res.data) {
        // 背景图：base_info.cover_img
        // 课程号：base_info.booklet_id
        // 标题：base_info.title
        // 描述：base_info.summary
        // 数量：base_info.buy_count
        // 打折：event_discount.discount_rate
        // 原价：base_info.price
        // 上架时间：base_info.put_on_time
        // 返现红包：原价*20%
        const course = {
          cover_img: info.base_info.cover_img,
          booklet_id: info.base_info.booklet_id,
          title: info.base_info.title,
          summary: info.base_info.summary,
          buy_count: info.base_info.buy_count,
          price: info.base_info.price,
          put_on_time: info.base_info.put_on_time,
        };
        // 是否有打折
        if (info.event_discount && info.event_discount.discount_rate) {
          course.discount_rate = info.event_discount.discount_rate;
        } else {
          course.discount_rate = 10; // 没有打折就是 10
        }
        courseList.push(course);
      }
      await sleep(3000);
    }

    console.log("课程数:", courseList.length);
    const courseListData = courseList.map((item) => [
      item.cover_img,
      item.booklet_id,
      item.title,
      item.summary,
      item.buy_count,
      item.price,
      item.put_on_time,
      item.discount_rate,
    ]);
    console.log("开始写入文件:");
    const excel = [
      {
        name: "sheet1",
        data: courseListData,
      },
    ];
    const buffer = xlsx.build(excel);

    // 写入文件
    fs.writeFile("course.xlsx", buffer, function (err) {
      if (err) {
        console.log("Write failed: " + err);
        return;
      }

      console.log("Write completed.");
    });
  } catch (error) {
    console.error(error);
  }
}

fetchData();