import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/SingleOrganisationApi";
import { FetchSingleOrganisationProps } from "@/Types/Network/Director/OrganisationsTypes";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  FaCamera,
  FaEnvelope,
  FaGlobeAmericas,
  FaNetworkWired,
  FaPhone,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Badge, Button, Card, CardBody, Col, Row, Spinner } from "reactstrap";
import UpdateOrganisationModal from "../Modals/UpdateOrganisationModal";

const OrganisationProfile: React.FC<FetchSingleOrganisationProps> = ({
  singleOrgInfo,
  isLoading,
  singleOrgDashboardData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Rtk hooks
  const [updateOrganisation, { isLoading: isUpdating }] =
    useUpdateOrganisationMutation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfileImageUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Basic client-side validation (optional)
    const maxSizeInMB = 5;
    if (file.size / 1024 / 1024 > maxSizeInMB) {
      toast.error(`Image must be smaller than ${maxSizeInMB} MB`);
      return;
    }

    try {
      const formDataToSend = new FormData();
      // Place file inside user_data so backend updates the user profile image
      formDataToSend.append("logo", file);

      if (!singleOrgInfo?.slug) {
        toast.error("Organisation identifier missing");
        return;
      }

      await updateOrganisation({
        slug: singleOrgInfo.slug,
        payload: formDataToSend,
      }).unwrap();

      toast.success("Profile image updated");
    } catch (err: any) {
      console.error("Profile upload error:", err);
      const msg = err?.data?.detail || err?.message || "Upload failed";
      toast.error(msg);
    } finally {
      // Reset input so same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleUpdateModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {isLoading ? (
        <Card
          className="d-flex justify-content-center align-items-center w-100"
          style={{ minHeight: "450px" }}
        >
          <Spinner color="primary" />
        </Card>
      ) : (
        <Card className="shadow-lg border-0 org-profile-card">
          {/* Header Section with Logo and Basic Info */}
          <div
            className="bg-gradient-primary position-relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              minHeight: "140px",
            }}
          >
            {/* Decorative elements */}
            <div
              className="position-absolute"
              style={{
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
              }}
            ></div>
            <div
              className="position-absolute"
              style={{
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                background: "rgba(255,255,255,0.05)",
                borderRadius: "50%",
              }}
            ></div>

            <CardBody className="position-relative pt-3 pb-0">
              <Row className="align-items-end">
                <Col md="auto">
                  {/* Organisation Logo */}
                  <div
                    className="position-relative mb-3"
                    style={{ width: 150, height: 100 }}
                  >
                    <Image
                      width={150}
                      height={100}
                      src={
                        singleOrgInfo?.logo || "/assets/images/network/logo.jpg"
                      }
                      alt="Logo"
                      className="rounded-3 object-fit-cover bg-white p-1"
                    />
                    {/* Camera overlay for logo upload */}
                    <button
                      title="Change organisation logo"
                      className="position-absolute d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm border-0"
                      style={{
                        width: 32,
                        height: 32,
                        right: 0,
                        bottom: 0,
                        cursor: "pointer",
                      }}
                      onClick={handleProfileImageUpload}
                      disabled={isUpdating}
                    >
                      <FaCamera size={14} className="text-primary" />
                    </button>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileSelected}
                    />
                  </div>
                </Col>
                <Col className="text-white">
                  <h2 className="mb-1 fw-bold">{singleOrgInfo?.name}</h2>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Badge color="dark" className="text-dark fw-500">
                      <FaGlobeAmericas className="me-1" />
                      Organisation
                    </Badge>
                    {singleOrgInfo?.network?.name && (
                      <Badge color="dark" className="text-dark">
                        <FaNetworkWired className="me-1" />
                        {singleOrgInfo?.network?.name}
                      </Badge>
                    )}
                  </div>
                </Col>
                {/* Edit Button */}
                <Col md="auto">
                  <Button
                    size="sm"
                    outline
                    color="primary"
                    onClick={toggleUpdateModal}
                    title="Edit Organisation"
                    className="fw-500"
                  >
                    <i className="iconly-Edit me-2"></i>Edit
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </div>

          {/* Organization Details Section */}
          <CardBody className="pb-2">
            {/* Contact Information */}
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase text-muted small mb-3">
                Contact Information
              </h6>
              <Row>
                <Col md="6" className="mb-3">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="flex-shrink-0"
                      style={{ color: "#667eea", marginTop: "2px" }}
                    >
                      <FaPhone size={16} />
                    </div>
                    <div className="flex-grow-1">
                      <p className="small text-muted mb-1">Phone</p>
                      {singleOrgInfo?.primary_mobile ? (
                        <a
                          href={`tel:${singleOrgInfo?.primary_mobile}`}
                          className="fw-500 text-dark text-decoration-none"
                          style={{ transition: "color 0.2s" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#667eea")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "inherit")
                          }
                        >
                          {singleOrgInfo?.primary_mobile}
                        </a>
                      ) : (
                        <span className="text-muted">Not Available</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md="6" className="mb-3">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="flex-shrink-0"
                      style={{ color: "#667eea", marginTop: "2px" }}
                    >
                      <FaEnvelope size={16} />
                    </div>
                    <div className="flex-grow-1">
                      <p className="small text-muted mb-1">Email</p>
                      {singleOrgInfo?.email ? (
                        <a
                          href={`mailto:${singleOrgInfo?.email}`}
                          className="fw-500 text-dark text-decoration-none"
                          style={{ transition: "color 0.2s" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#667eea")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "inherit")
                          }
                        >
                          {singleOrgInfo?.email}
                        </a>
                      ) : (
                        <span className="text-muted">Not Available</span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Divider */}
            <hr className="my-3" />

            {/* Statistics Section */}
            <div>
              <h6 className="fw-bold text-uppercase text-muted small mb-3">
                Organization Statistics
              </h6>
              <Row>
                <Col className="mb-3">
                  <div className="text-center p-3 rounded-3 bg-light-primary">
                    <h4 className="fw-bold text-primary mb-1">
                      {Number(
                        singleOrgDashboardData?.counters?.total_cases || 0,
                      ).toLocaleString()}
                    </h4>
                    <p className="small text-muted mb-0">Cases</p>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="text-center p-3 rounded-3 bg-light-primary">
                    <h4 className="fw-bold text-primary mb-1">
                      {Number(
                        singleOrgDashboardData?.counters?.total_leads || 0,
                      ).toLocaleString()}
                    </h4>
                    <p className="small text-muted mb-0">Leads</p>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="text-center p-3 rounded-3 bg-light-primary">
                    <h4 className="fw-bold text-primary mb-1">
                      {Number(
                        singleOrgDashboardData?.counters?.total_clients || 0,
                      ).toLocaleString()}
                    </h4>
                    <p className="small text-muted mb-0">Clients</p>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="text-center p-3 rounded-3 bg-light-primary">
                    <h4 className="fw-bold text-primary mb-1">
                      {Number(
                        singleOrgDashboardData?.counters?.total_advisers || 0,
                      ).toLocaleString()}
                    </h4>
                    <p className="small text-muted mb-0">Advisers</p>
                  </div>
                </Col>
                <Col className="mb-3">
                  <div className="text-center p-3 rounded-3 bg-light-primary">
                    <h4 className="fw-bold text-primary mb-1">
                      {Number(
                        singleOrgDashboardData?.counters?.total_introducers ||
                          0,
                      ).toLocaleString()}
                    </h4>
                    <p className="small text-muted mb-0">Introducers</p>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      )}
      {/* update modal  */}
      <UpdateOrganisationModal
        isOpen={isModalOpen}
        toggle={toggleUpdateModal}
        slug={singleOrgInfo?.slug}
        organisationData={singleOrgInfo}
      />
    </>
  );
};

export default OrganisationProfile;
