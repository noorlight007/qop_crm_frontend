import { FC, useState } from "react";
import {
  TbBell,
  TbCheck,
  TbDownload,
  TbEye,
  TbFileDescription,
  TbFlag,
  TbX,
} from "react-icons/tb";
import {
  Badge,
  Card,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

interface Document {
  id: string;
  name: string;
  company: string;
  submitter: string;
  type: string;
  size: string;
  uploadDate: string;
  expiryDate?: string;
  status: "Pending" | "Approved" | "Expired";
  notes?: string;
}

const documents: Document[] = [
  {
    id: "1",
    name: "Proof of Income - P60.pdf",
    company: "Tech Solutions Ltd",
    submitter: "Sarah Johnson",
    type: "Income",
    size: "2.4 MB",
    uploadDate: "1/15/2024",
    status: "Pending",
    notes: "Statements older than 3 months - need updated versions",
  },
  {
    id: "2",
    name: "Property Valuation Report.pdf",
    company: "Global Investments",
    submitter: "Michael Chen",
    type: "Valuation",
    size: "5.1 MB",
    uploadDate: "1/14/2024",
    status: "Approved",
  },
  {
    id: "3",
    name: "Bank Statements - 3 months.pdf",
    company: "Innovation Corp",
    submitter: "Emma Williams",
    type: "Bank Statements",
    size: "1.8 MB",
    uploadDate: "1/10/2024",
    expiryDate: "1/20/2024",
    status: "Expired",
    notes: "Statements older than 3 months - need updated versions",
  },
];

const DocumentsLists: FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleViewDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "info";
      case "Approved":
        return "success";
      case "Expired":
        return "danger";
      default:
        return "secondary";
    }
  };

  const renderDocumentCard = (doc: Document) => (
    <Card
      key={doc.id}
      className="d-flex flex-row justify-content-between align-items-center shadow bg-light-dark p-3 mb-3"
    >
      <div className="d-flex align-items-center gap-4">
        <div>
          <TbFileDescription size={25} className="text-info" />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2">
            <p className="mb-0">{doc.name}</p>
            <Badge
              color={getStatusColor(doc.status)}
              className="rounded-pill px-2 py-1"
            >
              <small>{doc.status}</small>
            </Badge>
          </div>
          <p className="mb-0">
            <small>
              {doc.company} •{doc.submitter} •{doc.type} •{doc.size}
            </small>
          </p>
          <div className="d-flex align-items-center gap-3">
            <p className="mb-0">
              <small>Uploaded: {doc.uploadDate}</small>
            </p>
            {doc.expiryDate && (
              <p className="mb-0 text-danger">
                <small>Expired: {doc.expiryDate}</small>
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center gap-4">
        <button
          className="btn btn-ghost p-0"
          onClick={() => handleViewDocument(doc)}
        >
          <TbEye size={20} />
        </button>
        <button className="btn btn-ghost p-0">
          <TbDownload size={20} />
        </button>
        <button className="btn btn-ghost p-0">
          <TbFlag size={20} />
        </button>
        <button className="btn btn-ghost p-0">
          <TbBell size={20} />
        </button>
        {doc.status === "Pending" && (
          <>
            <button className="btn btn-ghost p-0 text-success">
              <TbCheck size={20} />
            </button>
            <button className="btn btn-ghost p-0 text-danger">
              <TbX size={20} />
            </button>
          </>
        )}
      </div>
    </Card>
  );

  return (
    <>
      <Card className="border-0 shadow-sm p-3">
        <p className="fs-5 fw-semibold">
          Documents (<span>{documents.length}</span>)
        </p>
        {documents.map(renderDocumentCard)}
      </Card>

      <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Document Details</ModalHeader>
        <ModalBody>
          {selectedDoc && (
            <Row>
              <Col md={6}>
                <p className="fw-bold mb-1">Document Name</p>
                <p className="text-muted">{selectedDoc.name}</p>

                <p className="fw-bold mb-1">Category</p>
                <p className="text-muted">{selectedDoc.type}</p>

                <p className="fw-bold mb-1">Client</p>
                <p className="text-muted">{selectedDoc.company}</p>
              </Col>
              <Col md={6}>
                <p className="fw-bold mb-1">Adviser</p>
                <p className="text-muted">{selectedDoc.submitter}</p>

                <p className="fw-bold mb-1">Status</p>
                <Badge
                  color={getStatusColor(selectedDoc.status)}
                  className="rounded-pill px-2 py-1"
                >
                  {selectedDoc.status}
                </Badge>

                {selectedDoc.notes && (
                  <>
                    <p className="fw-bold mb-1 mt-3">Notes</p>
                    <p className="text-muted">{selectedDoc.notes}</p>
                  </>
                )}
              </Col>
            </Row>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default DocumentsLists;
