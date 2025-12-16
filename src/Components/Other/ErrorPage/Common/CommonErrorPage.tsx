"use client";
import { CommonErrorPageProps } from "@/Types/PagesType";
import { getDashboardHomeUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import React from "react";
import { Col, Container } from "reactstrap";

const CommonErrorPage: React.FC<CommonErrorPageProps> = ({
  errorIcon,
  title,
  subTitle,
}) => {
  const { data: session } = useSession();
  return (
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <div className="error-wrapper">
        <Container>
          <div className="svg-wrraper">{errorIcon}</div>
          <Col md="8" className="offset-md-2">
            <h3>{title}</h3>
            <p className="sub-content">{subTitle}</p>
            <a href={getDashboardHomeUrl(session)} className="btn btn-primary">
              {"BACK TO MAIN PAGE"}
            </a>
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default CommonErrorPage;
