//封装一个网络模块
const DOMAIN_MAP = {
    development: "http://localhost:3002",//开发环境接口地址
    production: "",
  };
  const ENV = process.env.NODE_ENV;
  export const get = function (url, params) {
    const domain = new URL(`${DOMAIN_MAP[ENV]}${url}`);
    domain.search = new URLSearchParams(params).toString();
    return fetch(domain).then((res) => res.json());
  };
//提供一个 get 方法供外部使用,网络库直接使用浏览器自带的 fetch 方法