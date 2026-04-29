import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import {
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
} from "@/Redux/Reducers/UserProfileAndSettings/UserProfileApi";
import { UserProfileData } from "@/Types/Common/UserProfile/UserProfileType";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { FaCamera, FaUserEdit, FaUserLock } from "react-icons/fa";
import { TbCalendar, TbMail, TbMapPin, TbPhone, TbUser } from "react-icons/tb";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Row, Spinner } from "reactstrap";
import RoleSwitching from "../RoleSwitching/RoleSwitching";
import EditProfileModal from "./Modals/EditProfileModal";
import SendEmailForResetPasswordModal from "./Modals/SendEmailForResetPasswordModal";

const ProfileInfo: React.FC = () => {
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { update: updateSession } = useSession();

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };
  const handleOpenResetPasswordModal = () => {
    setIsResetPasswordModalOpen(true);
  };

  // RTK Hooks
  const { data: userProfileData, isLoading } =
    useGetUserDetailsQuery(undefined);
  const [updateUserDetails] = useUpdateUserDetailsMutation();

  const userData = userProfileData as UserProfileData;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get user initials
  const getInitials = () => {
    if (!userData) return "U";
    return `${userData.first_name?.[0] || ""}${
      userData.last_name?.[0] || ""
    }`.toUpperCase();
  };

  // Get full name
  const getFullName = () => {
    if (!userData) return "";
    return `${formatChoiceFieldValue(userData.title) || ""} ${
      userData.first_name || ""
    } ${userData.middle_name || ""} ${userData.last_name || ""}`.trim();
  };

  // Get full address
  const getFullAddress = () => {
    if (!userData) return "Not provided";
    const parts = [
      userData.address,
      userData.city,
      userData.state,
      userData.country,
      userData.post_code,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <LoadingGrow />
      </div>
    );
  }

  const triggerFileDialog = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation: images only, max ~5MB
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profile_image", file);
      const resp: any = await updateUserDetails({ payload: formData }).unwrap();
      toast.success("Profile image updated successfully!");

      const newUrl = resp?.profile_image || resp?.data?.profile_image;
      if (newUrl) {
        try {
          await updateSession({ profile_image: newUrl });
        } catch (err) {
          // ignore session update errors
          console.error("Failed to update session profile image", err);
        }
      }
    } catch (err) {
      // no-op: error surfaces via toast layer if configured
      console.error("Failed to upload profile image", err);
      toast.error("Failed to upload profile image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Row className="g-4">
      {/* Profile Header Card */}
      <Col xs="12">
        <Card className="border-0 shadow-sm overflow-hidden">
          {/* Cover Background */}
          <div className="position-relative profile-cover-bg">
            <div className="position-absolute bottom-0 start-0 w-100 p-4">
              <div className="d-flex align-items-end gap-3">
                {/* Profile Image / Avatar */}
                <div
                  className="position-relative avatar-wrapper bg-white rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                  style={{
                    width: "120px",
                    height: "120px",
                    border: "5px solid white",
                    marginBottom: "-60px",
                    overflow: "hidden",
                  }}
                >
                  {userData?.profile_image ? (
                    <img
                      src={userData.profile_image}
                      alt="Profile"
                      className="rounded-circle"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(135deg, var(--theme-default) 0%, var(--theme-default) 30%, var(--theme-default) 60%, var(--theme-default) 100%)",
                        fontSize: "2.5rem",
                        borderRadius: "50%",
                      }}
                    >
                      {getInitials()}
                    </div>
                  )}

                  {/* Upload overlay: camera on hover */}
                  <button
                    type="button"
                    aria-label="Change profile image"
                    className="camera-btn position-absolute d-flex align-items-center justify-content-center rounded-circle border-0"
                    style={{
                      right: "6px",
                      bottom: "6px",
                      width: "40px",
                      height: "40px",
                      background: "rgba(0,0,0,0.65)",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={triggerFileDialog}
                  >
                    {isUploading ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      <FaCamera size={14} />
                    )}
                  </button>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <CardBody className="pt-5 mt-4">
            <Row className="align-items-center">
              <Col lg="8">
                <div className="mb-3">
                  <h2 className="mb-1 fw-bold text-dark">{getFullName()}</h2>
                  <p className="text-muted mb-0">
                    <TbMail className="me-2" />
                    {userData?.email || "N/A"}
                  </p>
                </div>
              </Col>
              <Col
                lg="4"
                className="d-flex justify-content-end align-items-center gap-1"
              >
                <Button
                  color="primary"
                  size="sm"
                  outline
                  className="d-flex justify-content-center align-items-center gap-1"
                  onClick={handleOpenEditModal}
                >
                  <FaUserEdit size={15} />
                  Edit Profile
                </Button>
                <Button
                  color="secondary"
                  size="sm"
                  outline
                  className="d-flex justify-content-center align-items-center gap-1"
                  onClick={handleOpenResetPasswordModal}
                >
                  <FaUserLock size={15} />
                  <span>Change Password</span>
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>

      {session?.user?.role === "APPLICANT" ? null : (
        <Col xs="12">
          <RoleSwitching />
        </Col>
      )}

      {/* Contact Information Card */}
      <Col lg="6">
        <Card className="border-0 shadow-sm h-100">
          <CardBody className="p-4">
            <h5 className="fw-bold mb-4 pb-2 border-bottom">
              <TbUser className="me-2 text-primary" />
              Contact Information
            </h5>

            <div className="mb-4">
              <div className="d-flex align-items-start mb-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-light-primary me-3"
                  style={{ width: "40px", height: "40px", minWidth: "40px" }}
                >
                  <TbMail className="text-primary" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block mb-1">
                    Email Address
                  </small>
                  <p className="mb-0 text-dark fw-medium">
                    {userData?.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-light-success me-3"
                  style={{ width: "40px", height: "40px", minWidth: "40px" }}
                >
                  <TbPhone className="text-success" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block mb-1">
                    Phone Number
                  </small>
                  <p className="mb-0 text-dark fw-medium">
                    {userData?.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-light-warning me-3"
                  style={{ width: "40px", height: "40px", minWidth: "40px" }}
                >
                  <TbMapPin className="text-warning" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block mb-1">Address</small>
                  <p className="mb-0 text-dark fw-medium">{getFullAddress()}</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Personal Details Card */}
      <Col lg="6">
        <Card className="border-0 shadow-sm h-100">
          <CardBody className="p-4">
            <h5 className="fw-bold mb-4 pb-2 border-bottom">
              <TbUser className="me-2 text-primary" />
              Personal Details
            </h5>

            <div className="mb-3">
              <Row className="mb-3">
                <Col xs="5">
                  <small className="text-muted">Title</small>
                </Col>
                <Col xs="7">
                  <p className="mb-0 text-dark fw-medium">
                    {userData?.title ? (
                      formatChoiceFieldValue(userData.title)
                    ) : (
                      <small className="text-muted">Not Set</small>
                    )}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs="5">
                  <small className="text-muted">First Name</small>
                </Col>
                <Col xs="7">
                  <p className="mb-0 text-dark fw-medium">
                    {userData?.first_name ? (
                      userData.first_name
                    ) : (
                      <small className="text-muted">Not Set</small>
                    )}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs="5">
                  <small className="text-muted">Middle Name</small>
                </Col>
                <Col xs="7">
                  <p className="mb-0 text-dark fw-medium">
                    {userData?.middle_name ? (
                      userData.middle_name
                    ) : (
                      <small className="text-muted">Not Set</small>
                    )}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs="5">
                  <small className="text-muted">Last Name</small>
                </Col>
                <Col xs="7">
                  <p className="mb-0 text-dark fw-medium">
                    {userData?.last_name ? (
                      userData.last_name
                    ) : (
                      <small className="text-muted">Not Set</small>
                    )}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs="5">
                  <small className="text-muted">City</small>
                </Col>
                <Col xs="7">
                  <p className="mb-0 text-dark fw-medium">
                    {userData?.city ? (
                      userData.city
                    ) : (
                      <small className="text-muted">Not Set</small>
                    )}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs="5">
                  <small className="text-muted">State</small>
                </Col>
                <Col xs="7">
                  <p className="mb-0 text-dark fw-medium">
                    {userData?.state ? (
                      userData.state
                    ) : (
                      <small className="text-muted">Not Set</small>
                    )}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs="5">
                  <small className="text-muted">Country</small>
                </Col>
                <Col xs="7">
                  <p className="mb-0 text-dark fw-medium">
                    {userData?.country ? (
                      userData.country
                    ) : (
                      <small className="text-muted">Not Set</small>
                    )}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col xs="5">
                  <small className="text-muted">Zip Code</small>
                </Col>
                <Col xs="7">
                  <p className="mb-0 text-dark fw-medium">
                    {userData?.post_code ? (
                      userData.post_code
                    ) : (
                      <small className="text-muted">Not Set</small>
                    )}
                  </p>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Account Activity Card */}
      <Col xs="12">
        <Card className="border-0 shadow-sm">
          <CardBody className="p-4">
            <h5 className="fw-bold mb-4 pb-2 border-bottom">
              <TbCalendar className="me-2 text-primary" />
              Account Activity
            </h5>

            <Row>
              <Col md="4">
                <div className="d-flex align-items-center p-3 bg-light rounded">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-primary me-3"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <TbCalendar className="text-white" size={24} />
                  </div>
                  <div>
                    <small className="text-muted d-block">
                      Account Created
                    </small>
                    <h6 className="mb-0 fw-bold text-dark">
                      {userData?.created_at
                        ? formatDate(userData.created_at)
                        : "N/A"}
                    </h6>
                  </div>
                </div>
              </Col>

              <Col md="4">
                <div className="d-flex align-items-center p-3 bg-light rounded">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-secondary me-3"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <TbCalendar className="text-white" size={24} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Last Updated</small>
                    <h6 className="mb-0 fw-bold text-dark">
                      {userData?.updated_at
                        ? formatDate(userData.updated_at)
                        : "N/A"}
                    </h6>
                  </div>
                </div>
              </Col>

              <Col md="4" className="mt-3 mt-md-0">
                <div className="d-flex align-items-center p-3 bg-light rounded">
                  <div
                    className={`d-flex align-items-center justify-content-center rounded-circle me-3 ${
                      userData?.is_active === true
                        ? "bg-success"
                        : "bg-light-dark"
                    }`}
                    style={{ width: "50px", height: "50px" }}
                  >
                    <TbUser className="text-white" size={24} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Account Status</small>
                    <h6
                      className={`mb-0 fw-bold ${
                        userData?.is_active === true
                          ? "text-success"
                          : "text-muted"
                      }`}
                    >
                      {userData?.is_active === true ? "Active" : "Inactive"}
                    </h6>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      {/* Modals  */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={userData}
      />
      <SendEmailForResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        initialData={userData}
      />
    </Row>
  );
};

export default ProfileInfo;
