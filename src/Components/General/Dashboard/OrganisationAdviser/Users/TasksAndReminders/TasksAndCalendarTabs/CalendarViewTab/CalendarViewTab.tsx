import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Card, CardBody, Col, Row } from "reactstrap";
import "./style.css";

// Legend items and colors
const legendItems = [
  { label: "Call", color: "#4285F4" },
  { label: "Document Request", color: "#FFA500" },
  { label: "Compliance", color: "#EA4335" },
  { label: "Review", color: "#A259FF" },
  { label: "Follow-up", color: "#34A853" },
  { label: "Meeting", color: "#7B61FF" },
];

const TasksCalendar = () => {
  const [dateValue, setDateValue] = useState<Date>(new Date());

  return (
    <Col sm="12" className="mx-auto">
      <Card>
        <CommonCardHeader
          title="Tasks Calendar"
          icon={<FaRegCalendarAlt size={22} className="me-1" />}
        />

        <CardBody className="card-wrapper">
          <div
            style={{
              display: "flex",
              gap: 18,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            {legendItems.map((item) => (
              <span
                key={item.label}
                style={{ display: "flex", alignItems: "center", fontSize: 15 }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    backgroundColor: item.color,
                    borderRadius: "50%",
                    marginRight: 6,
                  }}
                />
                {item.label}
              </span>
            ))}
          </div>
          <Row className="g-3">
            <Col xs="12">
              <div>
                <span className="bg-light-success rounded-3 px-3 py-2 mb-2">
                  Selected:{" "}
                  <strong>{`${dateValue.getDate()} - ${
                    dateValue.getMonth() + 1
                  } - ${dateValue.getFullYear()}`}</strong>
                </span>
              </div>
              <Calendar
                onChange={(value) => setDateValue(value as Date)}
                value={dateValue}
                className="w-100 big-calendar"
                prev2Label={null}
                next2Label={null}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default TasksCalendar;
