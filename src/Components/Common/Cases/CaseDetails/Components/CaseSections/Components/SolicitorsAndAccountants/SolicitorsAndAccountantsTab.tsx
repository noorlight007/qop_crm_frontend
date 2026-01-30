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
import SolicitorsAndAccountantsContent from "./SolicitorsAndAccountantsContent";

const SolicitorsAndAccountantsTab = () => {
  const [activeTab, setActiveTab] = useState<string>("solicitor");

  return (
    <Col xxl="12" className="px-5">
      <Card>
        <CardBody>
          <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-2 pb-2 p-0">
            <Nav className="nav-warning" pills>
              <NavItem>
                <NavLink
                  className={activeTab === "solicitor" ? "active" : ""}
                  onClick={() => setActiveTab("solicitor")}
                  style={{ cursor: "pointer" }}
                >
                  Solicitor
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "accountant" ? "active" : ""}
                  onClick={() => setActiveTab("accountant")}
                  style={{ cursor: "pointer" }}
                >
                  Accountant
                </NavLink>
              </NavItem>
            </Nav>
          </CardHeader>
          <CardBody className="px-0 pb-0">
            <SolicitorsAndAccountantsContent activeTab={activeTab} />
          </CardBody>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SolicitorsAndAccountantsTab;
