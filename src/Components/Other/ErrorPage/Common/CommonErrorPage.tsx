"use client";
import { CommonErrorPageProps } from "@/Types/PagesType";
import { getRedirectPaths } from "@/utils/RedirectPaths";
import React from "react";
import { Col, Container } from "reactstrap";

const CommonErrorPage: React.FC<CommonErrorPageProps> = ({
  errorIcon,
  title,
  subTitle,
}) => {
  return (
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <div className="error-wrapper">
        <Container>
          <div className="svg-wrraper">{errorIcon}</div>
          <Col md="8" className="offset-md-2">
            <h3>{title}</h3>
            <p className="sub-content">{subTitle}</p>
            <a href={getRedirectPaths()} className="btn btn-primary">
              {"BACK TO MAIN PAGE"}
            </a>
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default CommonErrorPage;
