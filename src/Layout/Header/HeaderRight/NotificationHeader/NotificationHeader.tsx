import SVG from "@/CommonComponent/SVG";
import { Href } from "@/Constant";
import { notificationData } from "@/Data/Layout/HeaderData";
import { useState } from "react";
import { Badge } from "reactstrap";

const NotificationHeader = () => {
  const [show, setShow] = useState(false);
  return (
    <li className="custom-dropdown">
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
