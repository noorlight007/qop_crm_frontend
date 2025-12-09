import { Document } from "@/Types/Network/Adviser/DashboardTypes";
import { formatDateToDMYAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import React from "react";
import { FileText } from "react-feather";
import { FaDownload } from "react-icons/fa";
import { Button, Card, CardBody, Col, Row, Spinner } from "reactstrap";

const DocumentStatus: React.FC<{
  isLoading: boolean;
  netAdviserSummaryData: any;
}> = ({ isLoading, netAdviserSummaryData }) => {
  return (
    <Card className="border-0 shadow-sm">
      <h4 className="p-3 pb-0">Document Upload & Status</h4>
      <CardBody style={{ height: "500px", overflowY: "auto" }}>
        {isLoading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "100%" }}
          >
            <div className="text-center">
              <Spinner color="primary" />
            </div>
          </div>
        ) : !netAdviserSummaryData?.documents ||
          netAdviserSummaryData.documents.length === 0 ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "100%" }}
          >
            <div className="text-center text-muted">
              <FileText size={48} className="text-secondary mb-2" />
              <div>No documents uploaded yet.</div>
            </div>
          </div>
        ) : (
          netAdviserSummaryData?.documents?.map(
            (doc: Document, index: number) => (
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
                  <h5 className="mb-1 text-dark">
                    {formatChoiceFieldValue(doc.file_type)}
                  </h5>
                  <small className="text-muted">
                    Updated {formatDateToDMYAndTime(doc.updated_at)}
                  </small>
                </Col>
                <Col xs="auto">
                  <a href={doc.file} target="_blank" rel="noopener noreferrer">
                    <Button color="info" size="sm">
                      <FaDownload />
                    </Button>
                  </a>
                </Col>
              </Row>
            )
          )
        )}
      </CardBody>
    </Card>
  );
};

export default DocumentStatus;
