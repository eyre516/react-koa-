import "./index.css";
import { Button, message } from "antd";

function Card({ course }) {
  const jumpCourse = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      message.info(
        "请等待更新购买链接，感谢支持。也可以在上边的优惠规则中添加微信询问链接"
      );
    }
  };
  // "coverImg": "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efeb8e1a01904b0690128627433d2552~tplv-k3u1fbpfcp-watermark.image?",
  // "title": "Nest 通关秘籍",
  // "summary": "掌握 Nest 和各种后端中间件，通过大量实战成为真正的全栈工程师！",
  // "buyCount": 2216,
  // "price": "89.9",
  // "isDiscount": true,
  // "discountPrice": "53.94",
  // "returnRedPacket": "17.98",
  // "shareUrl": "https://juejin.cn/book/7226988578700525605?suid=3350967171169901&source=pc"
  return (
    <div
      className="card"
      onClick={() => {
        jumpCourse(course.shareUrl);
      }}
    >
      <div>
        <img alt="img" referrerPolicy="no-referrer" className="background" src={course.coverImg} />
      </div>
      <div className="content">
        <div className="info">
          <div className="title">{course.title}</div>
          <div className="author">{course.summary}</div>
          <div className="people">{course.buyCount} 人已学习</div>
        </div>
        <div className="action">
          <div className="action-left">
            {course.isDiscount && (
              <div className="price">
                <div className="promotion">限时 : ¥{course.discountPrice}</div>
                <div className="origin">原价 : ¥{course.price}</div>
              </div>
            )}
            {!course.isDiscount && (
              <div className="price">
                <div className="promotion">¥{course.price}</div>
              </div>
            )}
            <div className="return">
              成功购买后可得红包¥{course.returnRedPacket}
            </div>
          </div>
          <div className="aciton-right">
            {course.shareUrl ? (
              <Button className="button" shape="round" type="primary">
                立即购买
              </Button>
            ) : (
              <Button className="button" shape="round" type="primary">
                等待更新
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;