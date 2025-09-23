"use client";
import { Button, Col, Container, Row } from "reactstrap";
import { MaintenanceTitle } from "@/Constant";
import Link from "next/link";
import { MaintenanceIcon } from "@/Data/Pages/PagesSvgIcons";

const MaintenanceContainer = () => {
  return (
    <div className="page-wrapper">
      <div className="error-wrapper maintenance-bg">
        <Container>
          <Row>
            <Col xs="12">
              <MaintenanceIcon />
              <div className="maintenance-heading">
                <h2 className="headline">{MaintenanceTitle}</h2>
              </div>
              <h4 className="sub-content">
                {"Our Site is Currently under maintenance We will be back Shortly"}
                <br />
                {"Thank You For Patience"}
              </h4>
              <Link href={`/dashboard/organization`}> 
                <Button color="primary">{"BACK TO HOME PAGE"}</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default MaintenanceContainer;
