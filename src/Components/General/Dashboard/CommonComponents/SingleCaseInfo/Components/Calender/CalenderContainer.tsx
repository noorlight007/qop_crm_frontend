"use client";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import DragCalendar from "./DragCalendar/DragCalendar";

const CalenderContainer = () => {
  return (
    <>
      <Container fluid className="calendar-basic">
        <Card>
          <CardHeader>
            <h3>Calender</h3>
          </CardHeader>
          <CardBody>
            <Row>
              <Col sm="12">
                <Row>
                  <DragCalendar />
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default CalenderContainer;
