"use client";

import IconSvg from "@/CommonComponent/SVG/IconSvg";
import React from "react";
import { X } from "react-feather";
import { Button, Card, CardBody } from "reactstrap";

const ClientSurveySubmittedContainer: React.FC = () => {
  const handleClose = React.useCallback(() => {
    try {
      window.close();
    } catch {
      // ignore
    }

    setTimeout(() => {
      if (window.closed) return;
      try {
        window.open("", "_self");
        window.close();
      } catch {
        // ignore
      }
    }, 50);

    // Last best-effort: navigate to about:blank then retry close.
    setTimeout(() => {
      if (window.closed) return;
      try {
        window.location.href = "about:blank";
      } catch {
        // ignore
      }

      setTimeout(() => {
        if (window.closed) return;
        try {
          window.close();
        } catch {
          // ignore
        }
      }, 50);
    }, 150);
  }, []);

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      handleClose();
    }, 10_000);
    return () => window.clearTimeout(t);
  }, [handleClose]);

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

                <div className="d-flex justify-content-center gap-2 mt-3">
                  <Button color="primary" onClick={handleClose}>
                    <X size={15} /> Close Tab
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSurveySubmittedContainer;
