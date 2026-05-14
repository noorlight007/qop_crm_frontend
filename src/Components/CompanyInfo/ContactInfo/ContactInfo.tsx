import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { ContactInfoProps } from "@/Types/CompanyInfo/CompanyInfoTypes";
import { useState } from "react";
import { Edit } from "react-feather";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import UpdateContactInfoModal from "./Modals/UpdateContactInfoModal";

const ContactInfo: React.FC<ContactInfoProps> = ({
  companyInfo,
  isLoading,
}) => {
  const [isUpdateContactInfoModalOpen, setIsUpdateContactInfoModalOpen] =
    useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="card-title">Contact Info</h4>
        <Button
          color="primary"
          size="sm"
          onClick={() => setIsUpdateContactInfoModalOpen(true)}
        >
          <Edit size={14} className="me-1" />
          Edit
        </Button>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="text-center py-5">
            <LoadingGrow />
          </div>
        ) : companyInfo ? (
          <Row className="gx-4 gy-3">
            <Col md="4">
              <div>
                <h6 className="mb-1 fw-semibold">Company Name</h6>
                <p className="mb-0 text-muted">{companyInfo.name || "-"}</p>
              </div>
            </Col>
            <Col md="4">
              <div>
                <h6 className="mb-1 fw-semibold">Subdomain</h6>
                <p className="mb-0 text-muted">
                  {companyInfo.subdomain || "-"}
                </p>
              </div>
            </Col>
            <Col md="4">
              <div>
                <h6 className="mb-1 fw-semibold">Email</h6>
                <p className="mb-0 text-muted">{companyInfo.email || "-"}</p>
              </div>
            </Col>
            <Col md="4">
              <div>
                <h6 className="mb-1 fw-semibold">Primary Mobile</h6>
                <p className="mb-0 text-muted">
                  {companyInfo.primary_mobile || "-"}
                </p>
              </div>
            </Col>
            <Col md="4">
              <div>
                <h6 className="mb-1 fw-semibold">Other Contact</h6>
                <p className="mb-0 text-muted">
                  {companyInfo.other_contact || "-"}
                </p>
              </div>
            </Col>
            <Col md="4">
              <div>
                <h6 className="mb-1 fw-semibold">Contact Person</h6>
                <p className="mb-0 text-muted">
                  {companyInfo.contact_person || "-"}
                </p>
              </div>
            </Col>
            <Col md="4">
              <div>
                <h6 className="mb-1 fw-semibold">Designation</h6>
                <p className="mb-0 text-muted">
                  {companyInfo.contact_person_designation || "-"}
                </p>
              </div>
            </Col>
            <Col md="4">
              <div>
                <h6 className="mb-1 fw-semibold">Website</h6>
                <p className="mb-0 text-muted">{companyInfo.website || "-"}</p>
              </div>
            </Col>
            <Col md="4">
              <div>
                <h6 className="mb-1 fw-semibold">License No</h6>
                <p className="mb-0 text-muted">
                  {companyInfo.license_no || "-"}
                </p>
              </div>
            </Col>
            <Col md="12">
              <div>
                <h6 className="mb-1 fw-semibold">License Image</h6>
                {companyInfo.license_image ? (
                  <img
                    src={companyInfo.license_image}
                    alt="License"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: 100,
                      objectFit: "contain",
                      cursor: "zoom-in",
                    }}
                    onClick={() =>
                      setFullscreenImage(companyInfo.license_image!)
                    }
                  />
                ) : (
                  <p className="mb-0 text-muted">No license image available.</p>
                )}
              </div>
            </Col>
          </Row>
        ) : (
          <p className="text-center text-muted mb-0">
            No contact information available.
          </p>
        )}
      </CardBody>
      <UpdateContactInfoModal
        isOpen={isUpdateContactInfoModalOpen}
        toggle={() => setIsUpdateContactInfoModalOpen(false)}
        companyInfo={companyInfo}
      />

      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1050,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            style={{
              position: "absolute",
              top: 16,
              right: 20,
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 32,
              lineHeight: 1,
              cursor: "pointer",
              zIndex: 1060,
            }}
            aria-label="Close"
          >
            &times;
          </button>
          <img
            src={fullscreenImage}
            alt="License full screen"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default ContactInfo;
