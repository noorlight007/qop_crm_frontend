import {
  CommonAdviserDocumentProps,
  DocumentData,
} from "@/Types/Network/Adviser/DashboardTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import React from "react";
import { FileText } from "react-feather";
import { FaDownload } from "react-icons/fa";
import { Button, Card, CardBody, Col, Row } from "reactstrap";

const DocumentStatus: React.FC<CommonAdviserDocumentProps> = ({
  isLoading,
  adviserDocumentData,
}) => {
  const isImageFile = (url: string) => {
    return /\.(jpe?g|png|gif|bmp|webp|svg)(\?.*)?$/i.test(url);
  };

  return (
    <Card className="border-0 shadow-sm px-3">
      <h4 className="p-3 pb-0">Document Upload & Status</h4>
      <CardBody style={{ height: "500px", overflowY: "auto" }}>
        {isLoading ? (
          // Skeleton placeholders for documents list
          <div style={{ minHeight: 120 }}>
            {[...Array(3)].map((_, i) => (
              <Row key={i} className="mb-3 p-3 rounded align-items-center">
                <Col xs="auto">
                  <div
                    className="skeleton-loading rounded-circle"
                    style={{ width: 36, height: 36 }}
                  />
                </Col>
                <Col>
                  <div
                    className="skeleton-loading mb-2"
                    style={{ width: "30%", height: 12 }}
                  />
                  <div
                    className="skeleton-loading"
                    style={{ width: "20%", height: 10 }}
                  />
                </Col>
                <Col xs="auto">
                  <div
                    className="skeleton-loading rounded"
                    style={{ width: 36, height: 30 }}
                  />
                </Col>
              </Row>
            ))}
          </div>
        ) : !adviserDocumentData ||
          !Array.isArray(adviserDocumentData) ||
          adviserDocumentData?.length === 0 ? (
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
          adviserDocumentData?.map((doc: DocumentData, index: number) => (
            <Row
              key={index}
              className="mb-3 p-3 bg-light-dark rounded align-items-center "
            >
              <Col xs="auto">
                {isImageFile(doc.file) ? (
                  <div
                    className="bg-white rounded-circle p-0 overflow-hidden"
                    style={{ width: 36, height: 36 }}
                  >
                    <img
                      src={doc.file}
                      alt={doc.file_type}
                      style={{ width: 36, height: 36, objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-circle p-2 d-flex align-items-center justify-content-center">
                    <FileText size={20} className="text-primary" />
                  </div>
                )}
              </Col>
              <Col>
                <h5 className="mb-1 text-dark">
                  {formatChoiceFieldValue(doc.file_type)}
                </h5>
                <small className="text-muted">
                  Updated {formatDateAndTime(doc.updated_at)}
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
          ))
        )}
      </CardBody>
    </Card>
  );
};

export default DocumentStatus;
