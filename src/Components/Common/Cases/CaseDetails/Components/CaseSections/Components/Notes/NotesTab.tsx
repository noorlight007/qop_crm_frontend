import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { NotesTabContent } from "./NotesTabContent";

export const NotesTab = () => {
  const [basicTab, setBasicTab] = useState("1");

  return (
    <Col xxl="12" className="px-5">
      <Card>
        <CardBody>
          <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-2 pb-2 p-0">
            <Nav className="nav-warning" pills>
              {[
                { id: "1", nav: "Notes" },
                { id: "2", nav: "Activities" },
              ].map((item, index) => (
                <NavItem key={index}>
                  <NavLink
                    className={`${basicTab === item.id ? "active" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setBasicTab(item.id)}
                  >
                    {item.nav}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </CardHeader>
          <CardBody className="px-0 pb-0">
            <NotesTabContent tabId={basicTab} setTabId={setBasicTab} />
          </CardBody>
        </CardBody>
      </Card>
    </Col>
  );
};
