import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useUpdateNetworkMutation } from "@/Redux/Reducers/SuperAdmin/Networks/NetworksApi";
import { NetworkDetailsProps } from "@/Types/SuperAdmin/Networks/NetworkTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Mail } from "react-feather";
import {
  FaCamera,
  FaCheckCircle,
  FaGlobe,
  FaIdCard,
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
  Row,
} from "reactstrap";
import UpdateNetworkDirectorInfoModal from "../Modals/UpdateNetworkDirectorInfoModal";
import UpdateNetworkInfoModal from "../Modals/UpdateNetworkInfoModal";

const NetworkDetails: React.FC<NetworkDetailsProps> = ({
  networkData,
  isLoading,
  slug,
}) => {
  const [updateNetwork, { isLoading: isUpdating }] = useUpdateNetworkMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);

  const [directorIsActive, setDirectorIsActive] = useState<boolean>(
    Boolean(networkData?.user?.is_active),
  );

  const handleToggleDirectorIsActive = async (nextActive: boolean) => {
    if (!slug) {
      toast.error("Network identifier missing");
      return;
    }

    const previous = directorIsActive;
    setDirectorIsActive(nextActive);

    try {
      const payload = new FormData();
      payload.append("user.is_active", String(nextActive));

      await updateNetwork({
        network_slug: slug,
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
    if (typeof networkData?.user?.is_active === "boolean") {
      setDirectorIsActive(networkData.user.is_active);
    }
  }, [networkData?.user?.is_active]);

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
      formDataToSend.append("network.logo", file);

      if (!slug) {
        toast.error("Network identifier missing");
        return;
      }

      await updateNetwork({
        network_slug: slug,
        payload: formDataToSend,
      }).unwrap();

      toast.success("Network logo updated");
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
        toast.error("Network identifier missing");
        return;
      }

      await updateNetwork({
        network_slug: slug,
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

  const toggleUpdateModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDirectorModal = () => {
    setIsDirectorModalOpen(!isDirectorModalOpen);
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyDomain = () => {
    const url = `https://${networkData?.network?.subdomain}${process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? ""}`;
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
    const email = networkData?.network?.email;
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
    const email = networkData?.user?.email;
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

  return (
    <>
      <Row>
        {/* Network Profile Card */}
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
                      {/* Network Logo */}
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
                            networkData?.network?.logo ||
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
                          title="Change network logo"
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
                        {networkData?.network?.name}
                      </h2>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {networkData?.network?.subdomain && (
                          <Badge className="bg-warning text-truncate d-flex gap-2 align-items-center">
                            <span className="d-flex align-items-center">
                              <FaGlobe className="me-1" />
                              <span style={{ paddingTop: "0.175rem" }}>
                                {`${"https://"}${networkData?.network?.subdomain}${process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? ""}`}
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
                  title="Edit Network"
                  className="fw-500"
                >
                  <i className="iconly-Edit me-2"></i>Edit
                </Button>
              </div>

              {/* Network Details Section */}
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
                          {networkData?.network?.primary_mobile ? (
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
                              {networkData?.network?.primary_mobile}
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
                          {networkData?.network?.email ? (
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
                                {networkData?.network?.email}
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
                      <FaGlobe
                        className="me-2 bg-primary p-1 rounded-1"
                        size={25}
                      />
                      <a
                        href={networkData?.network?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-truncate text-decoration-none text-dark"
                        style={{ maxWidth: "200px" }}
                        title={networkData?.network?.website}
                      >
                        {networkData?.network?.website ??
                          "Website not provided"}
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
                        {networkData?.network?.license_no ??
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
                      {networkData?.network?.other_contact ? (
                        networkData.network.other_contact
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
                          networkData?.network?.created_at ?? "",
                        )}
                      </small>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}
        </Col>

        {/* Network Director Profile Card */}
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
                    title="Edit Network Director"
                  >
                    <i className="iconly-Edit me-2"></i>Edit
                  </Button>
                </div>
                {/* Avatar section - positioned to overlap gradient */}
                <div className="d-flex justify-content-center organisation-avatar-container">
                  <div className="position-relative">
                    {networkData?.user?.profile_image ? (
                      <div
                        className="position-relative rounded-circle"
                        style={{ width: 90, height: 90, overflow: "hidden" }}
                      >
                        <Image
                          src={networkData.user.profile_image}
                          alt={networkData?.user?.name ?? "Director"}
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
                          onClick={handleDirectorProfileImageUpload}
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
                        {networkData?.user?.name
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
                    {networkData?.user?.name ?? "—"}
                  </h4>
                  <Badge className="px-3 py-2 bg-light-primary fw-semibold rounded-pill">
                    <i className="fa fa-crown me-1" />
                    Director
                  </Badge>
                </div>

                <Row>
                  <Col sm="12">
                    <Card className="bg-light-primary p-2 d-flex flex-row justify-content-center align-items-center mb-2">
                      <Mail
                        className="me-2 bg-primary p-1 rounded-1"
                        size={25}
                      />
                      {networkData?.user?.email ? (
                        <>
                          <span className="me-2 text-truncate">
                            {networkData?.user?.email ?? "Email not provided"}
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
                        <span className="text-muted">Email not provided</span>
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
                      {networkData?.user?.phone ? (
                        networkData.user.phone
                      ) : (
                        <small className="text-muted">Phone not provided</small>
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
                          disabled={isUpdating || !slug}
                          onChange={(e) =>
                            handleToggleDirectorIsActive(e.target.checked)
                          }
                          style={{
                            cursor: isUpdating ? "not-allowed" : "pointer",
                          }}
                        />
                      </FormGroup>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>

      <UpdateNetworkInfoModal
        isOpen={isModalOpen}
        toggle={toggleUpdateModal}
        slug={slug}
        networkData={networkData}
      />

      <UpdateNetworkDirectorInfoModal
        isOpen={isDirectorModalOpen}
        toggle={toggleDirectorModal}
        slug={slug}
        networkData={networkData}
      />
    </>
  );
};

export default NetworkDetails;
