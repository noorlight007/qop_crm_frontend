import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import { FetchSingleOrganisationProps } from "@/Types/Common/Organisations/OrganisationsTypes";
import { useRef, useState } from "react";
import { Mail } from "react-feather";
import {
  FaCamera,
  FaCheckCircle,
  FaDownload,
  FaGlobe,
  FaIdCard,
  FaNetworkWired,
  FaPhoneAlt,
} from "react-icons/fa";
import { TbCopy } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Popover,
  PopoverBody,
  PopoverHeader,
  Row,
  Spinner,
} from "reactstrap";
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
      formDataToSend.append("organization.logo", file);

      if (!singleOrgInfo?.organization?.slug) {
        toast.error("Organisation identifier missing");
        return;
      }

      await updateOrganisation({
        slug: singleOrgInfo?.organization?.slug,
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

  const [licensePopoverOpen, setLicensePopoverOpen] = useState(false);

  const toggleLicensePopover = () => setLicensePopoverOpen(!licensePopoverOpen);

  const handleLicenseImageDownload = async () => {
    const licenseImageUrl = singleOrgInfo?.organization?.license_image;

    if (!licenseImageUrl) return;

    try {
      // Fetch the image as a blob
      const response = await fetch(licenseImageUrl);
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = blobUrl;

      // Extract filename from URL or use a default name
      const fileName = licenseImageUrl.split("/").pop() || "license-image.jpg";
      link.download = fileName;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab if download fails
      window.open(licenseImageUrl, "_blank");
    }
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyDomain = () => {
    const url = `https://${singleOrgInfo?.organization?.subdomain}${process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? ""}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        // fallback for older browsers
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
  };

  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    const email = singleOrgInfo?.organization?.email;
    if (!email) return;
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setIsEmailCopied(true);
        setTimeout(() => setIsEmailCopied(false), 2000);
      })
      .catch(() => {
        // fallback for older browsers
        const el = document.createElement("textarea");
        el.value = email;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setIsEmailCopied(true);
        setTimeout(() => setIsEmailCopied(false), 2000);
      });
  };

  return (
    <>
      {isLoading ? (
        <Card
          className="d-flex justify-content-center align-items-center w-100"
          style={{ minHeight: "450px" }}
        >
          <LoadingGrow />
        </Card>
      ) : (
        <Card className="shadow-lg">
          {/* Header Section with Logo and Basic Info */}
          <div
            className="bg-gradient-primary position-relative overflow-hidden rounded-top-3"
            style={{
              background: `linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%)`,
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
                    className="position-relative avatar-wrapper rounded bg-white shadow-lg d-flex align-items-center justify-content-center border border-5 border-secondary"
                    style={{
                      width: "150px",
                      height: "100px",
                      // border: "5px solid white",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        singleOrgInfo?.organization?.logo ||
                        "/assets/images/network/logo.jpg"
                      }
                      alt="Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    {/* Upload overlay: camera on hover */}
                    <button
                      type="button"
                      aria-label="Change Organization Logo"
                      className="camera-btn position-absolute bg-secondary d-flex align-items-center justify-content-center rounded-circle border-0"
                      style={{
                        right: "-6px",
                        bottom: "-6px",
                        width: "35px",
                        height: "35px",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                      onClick={handleProfileImageUpload}
                    >
                      {isUpdating ? (
                        <Spinner size="sm" color="light" />
                      ) : (
                        <FaCamera size={12} />
                      )}
                    </button>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleFileSelected}
                    />
                  </div>
                </Col>
                <Col className="text-white">
                  <h2 className="mb-1 fw-bold">
                    {singleOrgInfo?.organization?.name}
                  </h2>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    {singleOrgInfo?.organization?.network && (
                      <Badge className="bg-success">
                        <FaNetworkWired className="me-1" />
                        {singleOrgInfo?.organization?.network}
                      </Badge>
                    )}
                    {singleOrgInfo?.organization?.subdomain && (
                      <Badge className="bg-warning text-truncate d-flex gap-2 align-items-center">
                        <span className="d-flex align-items-center">
                          <FaGlobe className="me-1" />
                          <span style={{ paddingTop: "0.15rem" }}>
                            {`https://${singleOrgInfo?.organization?.subdomain}${process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? ""}`}
                          </span>
                        </span>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={handleCopyDomain}
                        >
                          {isCopied ? (
                            <FaCheckCircle className="text-success" />
                          ) : (
                            <TbCopy />
                          )}
                        </span>
                      </Badge>
                    )}
                    {(singleOrgInfo?.organization?.license_no ||
                      singleOrgInfo?.organization?.license_image) && (
                      <>
                        <Badge
                          id="licensePopover"
                          color="secondary"
                          onClick={toggleLicensePopover}
                          style={{ cursor: "pointer", padding: "0.3rem" }}
                        >
                          <FaIdCard />
                        </Badge>

                        <Popover
                          placement="bottom"
                          isOpen={licensePopoverOpen}
                          target="licensePopover"
                          toggle={toggleLicensePopover}
                          trigger="legacy"
                        >
                          <PopoverHeader className="bg-primary text-light">
                            <FaIdCard className="me-2" />
                            License Information
                          </PopoverHeader>
                          <PopoverBody>
                            <div className="mb-3">
                              <small className="text-muted d-block mb-1">
                                License Number
                              </small>
                              {singleOrgInfo?.organization?.license_no ? (
                                <strong>
                                  {singleOrgInfo.organization.license_no}
                                </strong>
                              ) : (
                                <small className="text-danger fst-italic">
                                  Not added yet
                                </small>
                              )}
                            </div>

                            <div>
                              <small className="text-muted d-block mb-1">
                                License Image
                              </small>
                              {singleOrgInfo?.organization?.license_image ? (
                                <div>
                                  <img
                                    src={
                                      singleOrgInfo.organization.license_image
                                    }
                                    alt="License"
                                    className="img-fluid rounded border mb-2"
                                    style={{
                                      maxHeight: "200px",
                                      width: "100%",
                                      maxWidth: "100%",
                                      objectFit: "contain",
                                    }}
                                  />
                                  <Button
                                    color="primary"
                                    size="sm"
                                    onClick={handleLicenseImageDownload}
                                    style={{ width: "100%" }}
                                  >
                                    <FaDownload className="me-1" />
                                    Download
                                  </Button>
                                </div>
                              ) : (
                                <small className="text-danger fst-italic">
                                  Not added yet
                                </small>
                              )}
                            </div>
                          </PopoverBody>
                        </Popover>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </div>
          <div className="edit_icon">
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
                      className="flex-shrink-0 d-flex align-items-center justify-content-center"
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--primary-color)",
                        color: "#fff",
                        borderRadius: 6,
                        marginTop: 2,
                      }}
                    >
                      <FaPhoneAlt size={18} />
                    </div>
                    <div className="flex-grow-1">
                      <p className="small text-muted mb-1">Phone</p>
                      {singleOrgInfo?.organization?.primary_mobile ? (
                        <span
                          className="fw-500 text-dark text-decoration-none text-break"
                          style={{
                            transition: "color 0.2s",
                            wordBreak: "break-word",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color =
                              "var(--primary-color)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "inherit")
                          }
                        >
                          {singleOrgInfo?.organization?.primary_mobile}
                        </span>
                      ) : (
                        <span className="text-muted">Not Available</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md="6" className="mb-3">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="flex-shrink-0 d-flex align-items-center justify-content-center"
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--primary-color)",
                        color: "#fff",
                        borderRadius: 6,
                        marginTop: 2,
                      }}
                    >
                      <Mail size={18} />
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <p className="small text-muted mb-1">Email</p>
                      {singleOrgInfo?.organization?.email ? (
                        <span
                          className="d-flex align-items-center gap-2"
                          style={{ minWidth: 0 }}
                        >
                          <span
                            className="fw-500 text-dark text-truncate d-block"
                            style={{
                              transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color =
                                "var(--primary-color)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = "inherit")
                            }
                          >
                            {singleOrgInfo?.organization?.email}
                          </span>
                          <span
                            className=""
                            style={{ cursor: "pointer", flexShrink: 0 }}
                            onClick={handleCopyEmail}
                          >
                            {isEmailCopied ? (
                              <FaCheckCircle className="text-success" />
                            ) : (
                              <TbCopy />
                            )}
                          </span>
                        </span>
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
                    <p className="small text-muted mb-0">Applicants</p>
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
        slug={singleOrgInfo?.organization?.slug}
        organisationData={singleOrgInfo}
      />
    </>
  );
};

export default OrganisationProfile;
