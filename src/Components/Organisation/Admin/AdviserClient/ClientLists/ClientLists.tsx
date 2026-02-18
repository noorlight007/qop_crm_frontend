import getCurrencySign from "@/utils/currency";
import React from "react";
import { Card, Badge, Row, Col } from "reactstrap";

const ClientLists = () => {
  return (
    <div>
      <Row>
        <Col md="4">
          <Card className="border-0 shadow-sm p-3 position-relative h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-2">Tech Solutions Ltd</h5>
                <div className="text-muted mb-2">
                  <small>Adviser: Sarah Johnson</small>
                </div>
              </div>
              <div className="position-absolute top-0 end-0 p-3">
                <i className="fa fa-eye"></i>
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <span className="text-muted">Stage:</span>
                <span className="fw-medium">Application Review</span>
              </div>

              <div className="w-100 d-flex justify-content-between align-items-center">
                <span className="text-muted">Value:</span>
                <span className="fw-medium">{getCurrencySign()}450K</span>
              </div>

              <div className="w-100 d-flex justify-content-between align-items-center">
                <span className="text-muted">Last Contact:</span>
                <span className="fw-medium">2 days ago</span>
              </div>
            </div>

            <div className="mt-3 d-flex flex-wrap gap-2">
              <Badge color="success" className="rounded-pill">
                Active
              </Badge>
              <Badge color="danger" className="rounded-pill">
                High
              </Badge>
            </div>
            <div className="mt-3 d-flex flex-wrap gap-2">
              <Badge color="primary" className="rounded-pill">
                Commercial
              </Badge>
              <Badge color="info" className="rounded-pill">
                High Value
              </Badge>
            </div>
          </Card>
        </Col>
        <Col md="4">
          <Card className="border-0 shadow-sm p-3 position-relative h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-2">Tech Solutions Ltd</h5>
                <div className="text-muted mb-2">
                  <small>Adviser: Sarah Johnson</small>
                </div>
              </div>
              <div className="position-absolute top-0 end-0 p-3">
                <i className="fa fa-eye"></i>
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <span className="text-muted">Stage:</span>
                <span className="fw-medium">Application Review</span>
              </div>

              <div className="w-100 d-flex justify-content-between align-items-center">
                <span className="text-muted">Value:</span>
                <span className="fw-medium">{getCurrencySign()}450K</span>
              </div>

              <div className="w-100 d-flex justify-content-between align-items-center">
                <span className="text-muted">Last Contact:</span>
                <span className="fw-medium">2 days ago</span>
              </div>
            </div>

            <div className="mt-3 d-flex flex-wrap gap-2">
              <Badge color="success" className="rounded-pill">
                Active
              </Badge>
              <Badge color="danger" className="rounded-pill">
                High
              </Badge>
            </div>
            <div className="mt-3 d-flex flex-wrap gap-2">
              <Badge color="primary" className="rounded-pill">
                Commercial
              </Badge>
              <Badge color="info" className="rounded-pill">
                High Value
              </Badge>
            </div>
          </Card>
        </Col>
        <Col md="4">
          <Card className="border-0 shadow-sm p-3 position-relative h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-2">Tech Solutions Ltd</h5>
                <div className="text-muted mb-2">
                  <small>Adviser: Sarah Johnson</small>
                </div>
              </div>
              <div className="position-absolute top-0 end-0 p-3">
                <i className="fa fa-eye"></i>
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <span className="text-muted">Stage:</span>
                <span className="fw-medium">Application Review</span>
              </div>

              <div className="w-100 d-flex justify-content-between align-items-center">
                <span className="text-muted">Value:</span>
                <span className="fw-medium">{getCurrencySign()}450K</span>
              </div>

              <div className="w-100 d-flex justify-content-between align-items-center">
                <span className="text-muted">Last Contact:</span>
                <span className="fw-medium">2 days ago</span>
              </div>
            </div>

            <div className="mt-3 d-flex flex-wrap gap-2">
              <Badge color="success" className="rounded-pill">
                Active
              </Badge>
              <Badge color="danger" className="rounded-pill">
                High
              </Badge>
            </div>
            <div className="mt-3 d-flex flex-wrap gap-2">
              <Badge color="primary" className="rounded-pill">
                Commercial
              </Badge>
              <Badge color="info" className="rounded-pill">
                High Value
              </Badge>
            </div>
          </Card>
        </Col>

       
      </Row>

      <style jsx>{`
        .card {
          transition: transform 0.2s ease-in-out;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .badge {
          font-size: 0.8rem;
          padding: 0.5em 1em;
        }
      `}</style>
    </div>
  );
};

export default ClientLists;