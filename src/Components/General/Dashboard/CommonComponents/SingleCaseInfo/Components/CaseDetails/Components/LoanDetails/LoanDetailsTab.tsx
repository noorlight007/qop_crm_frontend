import { LoanDetailsFormTabTitleData } from "@/Data/CommonComponentsData/SingleCaseInfo/CaseDetailsData/CaseDetailsFormTabTitleData";
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
import { LoanDetailsTabContent } from "./LoanDetailsTabContent";

export const LoanDetailsTab = () => {
  const [basicTab, setBasicTab] = useState("1");

  return (
    <Col xxl="12" className="px-5">
      <Card>
        <CardBody>
          <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-2 pb-2 p-0">
            <Nav className="nav-warning" pills>
              {LoanDetailsFormTabTitleData.map((item, index) => (
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
            <LoanDetailsTabContent tabId={basicTab} setTabId={setBasicTab} />
          </CardBody>
        </CardBody>
      </Card>
    </Col>
  );
};
