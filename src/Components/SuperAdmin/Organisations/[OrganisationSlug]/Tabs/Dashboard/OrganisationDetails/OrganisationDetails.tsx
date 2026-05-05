import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import {
  useGetSingleOrganisationQuery,
  useUpdateOrganisationMutation,
} from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mail } from "react-feather";
import {
  FaCamera,
  FaCheckCircle,
  FaDownload,
  FaGlobe,
  FaIdCard,
  FaNetworkWired,
  FaPhoneAlt,
  FaRegCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { TbCopy } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Popover,
  PopoverBody,
  PopoverHeader,
  Row,
} from "reactstrap";
import UpdateOrgDirectorInfoModal from "../Modals/UpdateOrgDirectorModal";
import UpdateOrgInfoModal from "../Modals/UpdateOrgInfoModal";

const OrganisationDetails: React.FC = () => {
  const { data: session } = useSession();
  const params = useParams();
  const slug = params?.organisationslug;
  const { data: getOrganisationDetails, isLoading } =
    useGetSingleOrganisationQuery({
      organisationslug: slug,
    });

  const [updateOrganization, { isLoading: isUpdating }] =
    useUpdateOrganisationMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);

  const [directorIsActive, setDirectorIsActive] = useState<boolean>(false);

  const resolveOrganisationSlug = () => {
    const fromParams = Array.isArray(slug) ? slug[0] : slug;
    return (
      (typeof fromParams === "string" && fromParams) ||
      getOrganisationDetails?.organization?.slug ||
      undefined
    );
  };

  const toggleUpdateModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDirectorModal = () => {
    setIsDirectorModalOpen(!isDirectorModalOpen);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfileImageUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const maxSizeInMB = 5;
    if (file.size / 1024 / 1024 > maxSizeInMB) {
      toast.error(`Image must be smaller than ${maxSizeInMB} MB`);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("organization.logo", file);

      if (!slug) {
        toast.error("Organisation identifier missing");
        return;
      }

      await updateOrganization({
        slug,
        payload: formDataToSend,
      }).unwrap();

      toast.success("Organisation logo updated");
    } catch (err: any) {
      console.error("Logo upload error:", err);
      const msg = err?.data?.detail || err?.message || "Upload failed";
      toast.error(msg);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Add another ref for director profile image
  const directorFileInputRef = useRef<HTMLInputElement | null>(null);

  // Handler to trigger director file input
  const handleDirectorProfileImageUpload = () => {
    if (directorFileInputRef.current) directorFileInputRef.current.click();
  };

  // Handler for director profile image file selection
  const handleDirectorFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const maxSizeInMB = 5;
    if (file.size / 1024 / 1024 > maxSizeInMB) {
      toast.error(`Image must be smaller than ${maxSizeInMB} MB`);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("user.profile_image", file);

      if (!slug) {
        toast.error("Organisation identifier missing");
        return;
      }

      await updateOrganization({
        slug,
        payload: formDataToSend,
      }).unwrap();

      toast.success("Director profile image updated");
    } catch (err: any) {
      console.error("Profile upload error:", err);
      const msg = err?.data?.detail || err?.message || "Upload failed";
      toast.error(msg);
    } finally {
      if (directorFileInputRef.current) directorFileInputRef.current.value = "";
    }
  };

  const [licensePopoverOpen, setLicensePopoverOpen] = useState(false);

  const toggleLicensePopover = () => setLicensePopoverOpen(!licensePopoverOpen);

  const handleLicenseImageDownload = async () => {
    const licenseImageUrl = getOrganisationDetails?.organization?.license_image;

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
    const url = `https://${getOrganisationDetails?.organization?.subdomain}${process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? ""}`;
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
    const email = getOrganisationDetails?.organization?.email;
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

  const [isDirectorEmailCopied, setIsDirectorEmailCopied] = useState(false);

  const handleCopyDirectorEmail = () => {
    const email = getOrganisationDetails?.user?.email;
    if (!email) return;
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setIsDirectorEmailCopied(true);
        setTimeout(() => setIsDirectorEmailCopied(false), 2000);
      })
      .catch(() => {
        // fallback for older browsers
        const el = document.createElement("textarea");
        el.value = email;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setIsDirectorEmailCopied(true);
        setTimeout(() => setIsDirectorEmailCopied(false), 2000);
      });
  };

  const formatDirectorRoles = (roles?: string[] | string | null) => {
    if (!roles) return "";
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.map((role) => formatChoiceFieldValue(role)).join(", ");
  };

  const handleToggleDirectorIsActive = async (nextActive: boolean) => {
    const targetSlug = resolveOrganisationSlug();
    if (!targetSlug) {
      toast.error("Organisation identifier missing");
      return;
    }

    const previous = directorIsActive;
    setDirectorIsActive(nextActive);

    try {
      const payload = new FormData();
      payload.append("user.is_active", String(nextActive));

      await updateOrganization({
        slug: targetSlug,
        payload,
      }).unwrap();

      toast.success(nextActive ? "Director activated" : "Director deactivated");
    } catch (err: any) {
      console.error("Director status update error:", err);
      setDirectorIsActive(previous);
      const msg = err?.data?.detail || err?.message || "Update failed";
      toast.error(msg);
    }
  };

  // Sync local UI state with server state when data loads/refetches
  useEffect(() => {
    if (typeof getOrganisationDetails?.user?.is_active === "boolean") {
      setDirectorIsActive(getOrganisationDetails.user.is_active);
    }
  }, [getOrganisationDetails?.user?.is_active]);

  return (
    <>
      <Row>
        {/* Organisation Profile Card */}
        <Col lg="6" className="mb-4">
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
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={
                            getOrganisationDetails?.organization?.logo ||
                            "/assets/images/network/logo.jpg"
                          }
                          alt="Logo"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {/* Camera overlay for logo upload */}
                        <button
                          title="Change organization logo"
                          className="camera-btn position-absolute d-flex align-items-center justify-content-center rounded-circle border-0 bg-secondary"
                          style={{
                            right: "-5px",
                            bottom: "-5px",
                            width: "35px",
                            height: "35px",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                          onClick={handleProfileImageUpload}
                          disabled={isUpdating}
                        >
                          <FaCamera size={14} />
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
                      <h2 className="mb-1 fw-bold">
                        {getOrganisationDetails?.organization?.name}
                      </h2>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {getOrganisationDetails?.organization?.subdomain && (
                          <Badge className="bg-warning text-truncate d-flex gap-2 align-items-center">
                            <span className="d-flex align-items-center">
                              <FaGlobe className="me-1" />
                              <span style={{ paddingTop: "0.175rem" }}>
                                {`${"https://"}${getOrganisationDetails?.organization?.subdomain}${process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? ""}`}
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
                        {(getOrganisationDetails?.organization?.license_no ||
                          getOrganisationDetails?.organization
                            ?.license_image) && (
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
                                  {getOrganisationDetails?.organization
                                    ?.license_no ? (
                                    <strong>
                                      {
                                        getOrganisationDetails.organization
                                          .license_no
                                      }
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
                                  {getOrganisationDetails?.organization
                                    ?.license_image ? (
                                    <div>
                                      <img
                                        src={
                                          getOrganisationDetails.organization
                                            .license_image
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

              {/* Organisation Details Section */}
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
                          {getOrganisationDetails?.organization
                            ?.primary_mobile ? (
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
                              {
                                getOrganisationDetails?.organization
                                  ?.primary_mobile
                              }
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
                          {getOrganisationDetails?.organization?.email ? (
                            <span
                              className="d-flex align-items-center gap-2"
                              style={{ minWidth: 0 }}
                            >
                              <span
                                className="fw-500 text-dark text-decoration-none text-truncate d-block"
                                style={{
                                  transition: "color 0.2s",
                                  minWidth: 0,
                                  maxWidth: "100%",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.color =
                                    "var(--primary-color)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color = "inherit")
                                }
                              >
                                {getOrganisationDetails?.organization?.email}
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

                <Row>
                  <Col sm="6">
                    <Card className="bg-light-primary p-2 d-flex flex-row justify-content-center align-items-center mb-2">
                      <FaNetworkWired
                        className="me-2 bg-primary p-1 rounded-1"
                        size={25}
                      />
                      <a
                        href={getOrganisationDetails?.organization?.network}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-truncate text-decoration-none text-dark"
                        style={{ maxWidth: "200px" }}
                        title={getOrganisationDetails?.organization?.network}
                      >
                        {getOrganisationDetails?.organization?.network ??
                          "Network not available"}
                      </a>
                    </Card>
                  </Col>
                  <Col sm="6">
                    <Card className="bg-light-primary p-2 d-flex flex-row justify-content-center align-items-center mb-2">
                      <FaIdCard
                        className="me-2 bg-primary p-1 rounded-1"
                        size={25}
                      />
                      <div className="text-truncate">
                        {getOrganisationDetails?.organization?.license_no ||
                          "License number not provided"}
                      </div>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col sm="6">
                    <Card className="bg-light-secondary p-2 d-flex align-items-center mb-2">
                      <FaPhoneAlt
                        className="me-2 bg-secondary p-1 rounded-1"
                        size={25}
                      />
                      {getOrganisationDetails?.organization?.other_contact ? (
                        getOrganisationDetails.organization.other_contact
                      ) : (
                        <small className="text-muted text-truncate">
                          Secondary contact not provided
                        </small>
                      )}
                    </Card>
                  </Col>
                  <Col sm="6">
                    <Card className="bg-light-secondary p-2 d-flex align-items-center mb-2">
                      <FaRegCalendarAlt
                        className="me-2 bg-secondary p-1 rounded-1"
                        size={25}
                      />
                      <small className="text-muted">
                        {formatDateAndTime(
                          getOrganisationDetails?.organization?.created_at ??
                            "Not available",
                        )}
                      </small>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}
        </Col>

        {/* Organisation Director Profile Card */}
        <Col lg="6" className="mb-4">
          {isLoading ? (
            <Card
              className=" d-flex justify-content-center align-items-center w-100"
              style={{ minHeight: "450px" }}
            >
              <LoadingGrow />
            </Card>
          ) : (
            <Card className="border-0 overflow-hidden position-relative shadow-lg">
              {/* Gradient header background */}
              <div className="organisation-gradient-header overflow-hidden">
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
              </div>

              <CardBody className="organisation-card-body p-4 position-relative">
                {/* Edit button top-right of the card */}
                <div className="edit_icon">
                  <Button
                    size="sm"
                    outline
                    color="primary"
                    onClick={toggleDirectorModal}
                    title="Edit Organization Director"
                  >
                    <i className="iconly-Edit me-2"></i>Edit
                  </Button>
                </div>
                {/* Avatar section - positioned to overlap gradient */}
                <div className="d-flex justify-content-center organisation-avatar-container">
                  <div className="position-relative">
                    {getOrganisationDetails?.user?.profile_image ? (
                      <div
                        className="position-relative rounded-circle"
                        style={{ width: 90, height: 90, overflow: "hidden" }}
                      >
                        <Image
                          src={getOrganisationDetails.user.profile_image}
                          alt={getOrganisationDetails?.user?.name ?? "Director"}
                          width={90}
                          height={90}
                          className="rounded-circle organisation-avatar-img border border-2 border-secondary"
                        />
                        <button
                          title="Change profile image"
                          className="camera-btn position-absolute d-flex align-items-center justify-content-center border-0 bg-secondary"
                          style={{
                            width: 30,
                            height: 30,
                            right: 0,
                            bottom: 0,
                            // background: "rgba(0, 0, 0, 0.65)",
                            borderRadius: "50%",
                            transform: "translate(-15%, -15%)",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleDirectorProfileImageUpload();
                          }}
                          disabled={isUpdating}
                        >
                          <FaCamera size={12} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="position-relative rounded-circle d-flex justify-content-center align-items-center text-white organisation-initials border border-2 border-secondary"
                        style={{ width: 90, height: 90, overflow: "hidden" }}
                      >
                        {getOrganisationDetails?.user?.name
                          ?.split(" ")
                          .map((n: any) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "ND"}
                        <button
                          title="Change profile image"
                          className="camera-btn position-absolute d-flex align-items-center justify-content-center border-0 bg-secondary"
                          style={{
                            width: 30,
                            height: 30,
                            right: 0,
                            bottom: 0,
                            // background: "rgba(0, 0, 0, 0.65)",
                            borderRadius: "50%",
                            transform: "translate(-15%, -15%)",
                            cursor: "pointer",
                          }}
                          onClick={handleDirectorProfileImageUpload}
                          disabled={isUpdating}
                        >
                          <FaCamera size={12} className="text-white" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Hidden file input for director profile */}
                  <input
                    ref={directorFileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleDirectorFileSelected}
                  />
                </div>

                {/* Name and role */}
                <div className="text-center mt-1 mb-3">
                  <h4 className="mb-2 fw-bold fs-4">
                    {getOrganisationDetails?.user?.name ?? "—"}
                  </h4>
                  <Badge className="px-3 py-2 bg-light-primary fw-semibold rounded-pill">
                    <i className="fa fa-crown me-1" />
                    {formatDirectorRoles(getOrganisationDetails?.user?.roles)}
                  </Badge>
                </div>

                <Row>
                  <Col sm="12">
                    <Card className="bg-light-primary p-2 d-flex flex-row justify-content-center align-items-center mb-2">
                      <Mail
                        className="me-2 bg-primary p-1 rounded-1"
                        size={25}
                      />
                      {getOrganisationDetails?.user?.email ? (
                        <>
                          <span className="me-2 text-truncate">
                            {getOrganisationDetails?.user?.email}
                          </span>
                          <span
                            onClick={handleCopyDirectorEmail}
                            style={{ cursor: "pointer" }}
                          >
                            {isDirectorEmailCopied ? (
                              <FaCheckCircle className="text-success" />
                            ) : (
                              <TbCopy />
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-muted">Not Available</span>
                        </>
                      )}
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col sm="6">
                    <Card className="bg-light-secondary p-2 d-flex align-items-center mb-2">
                      <FaPhoneAlt
                        className="me-2 bg-secondary p-1 rounded-1"
                        size={25}
                      />
                      {getOrganisationDetails?.user?.phone ? (
                        getOrganisationDetails.user.phone
                      ) : (
                        <span className="text-muted">Phone not provided</span>
                      )}
                    </Card>
                  </Col>
                  <Col sm="6">
                    <Card
                      className={`${directorIsActive ? "bg-light-success" : "bg-light-danger"} p-2 d-flex align-items-center mb-2 position-relative`}
                    >
                      <FaShieldAlt
                        className={`me-2 ${directorIsActive ? "bg-success" : "bg-danger"} p-1 rounded-1`}
                        size={25}
                      />
                      <span>
                        {directorIsActive ? "Verified Director" : "Inactive"}
                      </span>

                      {session?.user?.role === "SUPER_ADMIN" && (
                        <FormGroup
                          switch
                          className="mb-0 position-absolute"
                          style={{ top: 0, right: 0 }}
                        >
                          <Input
                            id="director-is-active-switch"
                            type="switch"
                            role="switch"
                            checked={directorIsActive}
                            disabled={isUpdating || !resolveOrganisationSlug()}
                            onChange={(e) =>
                              handleToggleDirectorIsActive(e.target.checked)
                            }
                            style={{
                              cursor: isUpdating ? "not-allowed" : "pointer",
                            }}
                          />
                        </FormGroup>
                      )}
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>

      <UpdateOrgInfoModal
        isOpen={isModalOpen}
        toggle={toggleUpdateModal}
        slug={getOrganisationDetails?.organization?.slug}
        organisationData={getOrganisationDetails}
      />

      <UpdateOrgDirectorInfoModal
        isOpen={isDirectorModalOpen}
        toggle={toggleDirectorModal}
        slug={getOrganisationDetails?.organization?.slug}
        organisationData={getOrganisationDetails}
      />
    </>
  );
};

export default OrganisationDetails;
