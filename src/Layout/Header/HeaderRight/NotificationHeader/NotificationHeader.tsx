import SVG from "@/CommonComponent/SVG";
import { Href } from "@/Constant";
import { notificationData } from "@/Data/Layout/HeaderData";
import { useEffect, useRef, useState } from "react";
import { Badge } from "reactstrap";

const NotificationHeader = () => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLLIElement>(null);

  // close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        show &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [show]);
  return (
    <li className="custom-dropdown" ref={wrapperRef}>
      <a href={Href} onClick={() => setShow(!show)}>
        <SVG iconId="notification" />
      </a>
      <Badge pill color="warning">
        1
      </Badge>
      <div
        className={`custom-menu notification-dropdown py-0 overflow-hidden shadow ${
          show ? "show" : ""
        }`}
      >
        <ul className="activity-timeline">
          {notificationData.map((item, index) => (
            <li className="d-flex align-items-start" key={index}>
              <div className="activity-line" />
              <div className={`activity-dot-${item.dotColor}`} />
              <div className="flex-grow-1">
                <h6 className={`f-w-600 font-${item.fontColor}`}>
                  {item.date}
                  <span>{item.time}</span>
                  <span className={`circle-dot-${item.dotColor} float-end`}>
                    <SVG className="circle-color" iconId="circle" />
                  </span>
                </h6>
                <h5>{item.name}</h5>
                <p>{item.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default NotificationHeader;
