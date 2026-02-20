import {
  useGetSingleOrganisationQuery,
  useUpdateOrganisationMutation,
} from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { Mail } from "react-feather";
import {
  FaCamera,
  FaGlobe,
  FaIdCard,
  FaNetworkWired,
  FaPhoneAlt,
  FaRegCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import DeleteOrgModal from "./Modals/DeleteOrgModal";
import UpdateOrgDirectorInfoModal from "./Modals/UpdateOrgDirectorModal";
import UpdateOrgInfoModal from "./Modals/UpdateOrgInfoModal";

const OrganisationDetails: React.FC = () => {
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleUpdateModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDirectorModal = () => {
    setIsDirectorModalOpen(!isDirectorModalOpen);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
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
              <Spinner color="primary" />
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
                        className="position-relative mb-3"
                        style={{ width: 150, height: 100 }}
                      >
                        <Image
                          width={150}
                          height={100}
                          src={
                            getOrganisationDetails?.organization?.logo ||
                            "/assets/images/network/logo.jpg"
                          }
                          alt="Logo"
                          className="rounded-3 object-fit-cover bg-white p-1"
                        />
                        {/* Camera overlay for logo upload */}
                        <button
                          title="Change organization logo"
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
                      <h2 className="mb-1 fw-bold">
                        {getOrganisationDetails?.organization?.name}
                      </h2>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {getOrganisationDetails?.organization?.subdomain && (
                          <Badge className="bg-warning">
                            <FaGlobe className="me-1" />
                            {`${"https://"}${getOrganisationDetails?.organization?.subdomain}${process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? ""}`}{" "}
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
                        {getOrganisationDetails?.organization?.license_no ??
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
                            "",
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
              <Spinner className="primary" />
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
                      <div className="position-relative">
                        <Image
                          src={getOrganisationDetails.user.profile_image}
                          alt={getOrganisationDetails?.user?.name ?? "Director"}
                          width={90}
                          height={90}
                          className="rounded-circle organisation-avatar-img"
                        />
                        <button
                          title="Change profile image"
                          className="position-absolute d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm border-0"
                          style={{
                            width: 30,
                            height: 30,
                            right: 3,
                            bottom: 3,
                            zIndex: 10,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleDirectorProfileImageUpload();
                          }}
                          disabled={isUpdating}
                        >
                          <FaCamera size={12} className="text-primary" />
                        </button>
                      </div>
                    ) : (
                      <div className="position-relative">
                        <div className="rounded-circle d-flex justify-content-center align-items-center text-white organisation-initials">
                          {getOrganisationDetails?.user?.name
                            ?.split(" ")
                            .map((n: any) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "ND"}
                        </div>
                        <button
                          title="Change profile image"
                          className="position-absolute d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm border-0"
                          style={{
                            width: 30,
                            height: 30,
                            right: 3,
                            bottom: 3,
                            zIndex: 10,
                            cursor: "pointer",
                          }}
                          onClick={handleDirectorProfileImageUpload}
                          disabled={isUpdating}
                        >
                          <FaCamera size={12} className="text-primary" />
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
                    {formatChoiceFieldValue(
                      getOrganisationDetails?.user?.user_type,
                    )}
                  </Badge>
                </div>

                <Row>
                  <Col sm="12">
                    <Card className="bg-light-primary p-2 d-flex flex-row justify-content-center align-items-center mb-2">
                      <Mail
                        className="me-2 bg-primary p-1 rounded-1"
                        size={25}
                      />
                      {getOrganisationDetails?.user?.email ??
                        "Email not provided"}
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
                        <small className="text-muted">Phone not provided</small>
                      )}
                    </Card>
                  </Col>
                  <Col sm="6">
                    {getOrganisationDetails?.user?.is_active ? (
                      <Card className="bg-light-success p-2 d-flex align-items-center mb-2">
                        <FaShieldAlt
                          className="me-2 bg-success p-1 rounded-1"
                          size={25}
                        />
                        Verified Director
                      </Card>
                    ) : (
                      <Card className="bg-light-danger p-2 d-flex align-items-center mb-2">
                        <FaShieldAlt
                          className="me-2 bg-danger p-1 rounded-1"
                          size={25}
                        />
                        Inactive
                      </Card>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>

      <Row>
        <Card className="shadow p-2">
          <CardHeader className="h3 text-danger">Danger Zone</CardHeader>
          <CardBody className="border-danger rounded-2 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold">Delete this Organization</h5>
                <p className="mb-0 opacity-75 text-danger">
                  Once you delete an organization, there is no going back.
                  Please be certain.
                </p>
              </div>
              <Button color="danger" onClick={toggleDeleteModal}>
                Delete this Organization
              </Button>
            </div>
          </CardBody>
        </Card>
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

      <DeleteOrgModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        organisationInfo={getOrganisationDetails}
      />
    </>
  );
};

export default OrganisationDetails;
