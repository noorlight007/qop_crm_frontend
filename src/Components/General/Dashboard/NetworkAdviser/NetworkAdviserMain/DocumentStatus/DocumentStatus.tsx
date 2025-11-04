import React from "react";
import { FileText } from "react-feather";
import { Badge, Card, CardBody, Col, Row } from "reactstrap";

interface Document {
  title: string;
  company: string;
  updatedTime: string;
  status: "Approved" | "Pending Review" | "In Progress";
}

const DocumentStatus: React.FC = () => {
  const documents: Document[] = [
    {
      title: "Investment Proposal - Tech Solutions",
      company: "Tech Solutions Ltd",
      updatedTime: "1 hour ago",
      status: "Approved",
    },
    {
      title: "Risk Assessment - Global Investments",
      company: "Global Investments",
      updatedTime: "3 hours ago",
      status: "Pending Review",
    },
    {
      title: "Compliance Report - Innovation Corp",
      company: "Innovation Corp",
      updatedTime: "1 day ago",
      status: "In Progress",
    },
    {
      title: "Compliance Report - Innovation Corp",
      company: "Innovation Corp",
      updatedTime: "1 day ago",
      status: "In Progress",
    },
    {
      title: "Compliance Report - Innovation Corp",
      company: "Innovation Corp",
      updatedTime: "1 day ago",
      status: "In Progress",
    },
    {
      title: "Compliance Report - Innovation Corp",
      company: "Innovation Corp",
      updatedTime: "1 day ago",
      status: "In Progress",
    },
  ];

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending Review":
        return "warning";
      case "In Progress":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <h4 className="p-3 pb-0">Document Upload & Status</h4>
      <CardBody style={{ maxHeight: "500px", overflowY: "auto" }}>
        {documents.map((doc, index) => (
          <Row
            key={index}
            className="mb-3 p-3 bg-light rounded align-items-center "
            style={{ cursor: "pointer" }}
          >
            <Col xs="auto">
              <div className="bg-white rounded-circle p-2 d-flex align-items-center justify-content-center">
                <FileText size={20} className="text-primary" />
              </div>
            </Col>
            <Col>
              <h5 className="mb-1 text-dark">{doc.title}</h5>
              <small className="text-muted">Updated {doc.updatedTime}</small>
            </Col>
            <Col xs="auto">
              <Badge color={getStatusColor(doc.status)} className="px-3 py-2">
                {doc.status}
              </Badge>
            </Col>
          </Row>
        ))}
      </CardBody>
    </Card>
  );
};

export default DocumentStatus;
