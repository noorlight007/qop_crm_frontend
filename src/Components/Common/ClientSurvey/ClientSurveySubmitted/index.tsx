"use client";

import IconSvg from "@/CommonComponent/SVG/IconSvg";
import React from "react";
import { Card, CardBody } from "reactstrap";

const ClientSurveySubmittedContainer: React.FC = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "65vh" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-md-8 col-lg-6">
            <Card className="shadow">
              <CardBody className="text-center p-5">
                <div
                  className="mx-auto mb-4 d-inline-flex align-items-center justify-content-center rounded-circle bg-light-success text-white"
                  style={{ width: 96, height: 96 }}
                >
                  <IconSvg
                    iconId="profile-check"
                    style={{ width: 48, height: 48, fill: "white" }}
                  />
                </div>

                <h2 className="mb-2">Survey already submitted — thank you</h2>
                <p className="text-muted mb-3">
                  We&apos;ve received your feedback. Your responses will be
                  reviewed and used to improve our service.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSurveySubmittedContainer;
