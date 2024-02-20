import "./index.css";
import Card from "../Card";
import { Spin } from "antd";
import { useState, useEffect, useRef } from "react";
import { queryCourse, searchCourse } from "../../../api";

const list = ["最新", "最热", "活动"];

let allCourses = null; //前端伪分页
let offset = 0;
const limit = 20;
function Course({ searchKey }) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const handleClick = async (index) => {
    setFocusIndex(index);
    refreshData(index + 1);
  };
  const refreshData = async (type = 1) => {
    setIsLoading(true);
    const res = await queryCourse({
      type,
    });
    setIsLoading(false);
    allCourses = res.data || [];
    offset = 0;
    setCourseList(allCourses.slice(0, limit));
    offset = offset + limit;
  };
  const searchData = async (title) => {
    if (!title) {
      return;
    }
    setIsLoading(true);
    const res = await searchCourse({
      title,
    });
    setIsLoading(false);
    allCourses = res.data || [];
    offset = 0;
    setCourseList(allCourses.slice(0, limit));
    offset = offset + limit;
  };
  useEffect(() => {
    if (searchKey) {
      searchData(searchKey);
      return;
    }
    setFocusIndex(0);
    refreshData();
  }, [searchKey]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          moreData();
        }
      },
      { rootMargin: "0px 0px 100% 0px" }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loaderRef.current]);
  const moreData = () => {
    if (!allCourses || offset >= allCourses.length) {
      return;
    }
    setCourseList(allCourses.slice(0, offset + limit));
    offset = offset + limit;
  };
  return (
    <div>
      <div className="header-tags">
        {!searchKey &&
          list.map((item, index) => (
            <div
              className={index === focusIndex ? "item item-focus" : "item"}
              onClick={() => handleClick(index)}
              key={index}
            >
              {item}
            </div>
          ))}
      </div>
      <Spin spinning={isLoading}>
        <div className="courses">
          {courseList.map((item) => (
            <Card className="card" key={item.title} course={item}></Card>
          ))}
        </div>
      </Spin>
      <div ref={loaderRef} />
    </div>
  );
}

export default Course;