import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import { FetchSingleOrganisationProps } from "@/Types/Common/Organisations/OrganisationsTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { useRef, useState } from "react";
import { Mail } from "react-feather";
import {
  FaCamera,
  FaCheckCircle,
  FaPhoneAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { TbCopy } from "react-icons/tb";
import { toast } from "react-toastify";
import { Badge, Button, Card, CardBody, Col, Row, Spinner } from "reactstrap";
import UpdateOrgDirectorInfoModal from "../Modals/UpdateOrgDirectorInfoModal";

const OrganisationDirectorInfo: React.FC<FetchSingleOrganisationProps> = ({
  singleOrgInfo,
  isLoading,
}) => {
  const [isOrgDirectorUpdateModalOpen, setIsOrgDirectorUpdateModalOpen] =
    useState(false);
  // Rtk hooks
  const [updateOrganisation, { isLoading: isUpdating }] =
    useUpdateOrganisationMutation();

  const toggleOrgDirectorUpdateModal = () => {
    setIsOrgDirectorUpdateModalOpen(!isOrgDirectorUpdateModalOpen);
  };

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
      formDataToSend.append("user.profile_image", file);

      if (!singleOrgInfo?.organization?.slug) {
        toast.error("Organisation identifier missing");
        return;
      }

      await updateOrganisation({
        slug: singleOrgInfo.organization.slug,
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

  const initials = (name?: string) =>
    (name || "")
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const [isDirectorEmailCopied, setIsDirectorEmailCopied] = useState(false);

  const handleCopyDirectorEmail = () => {
    const email = singleOrgInfo?.user?.email;
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
      {isLoading ? (
        <Card className="organisation-director-loading d-flex justify-content-center align-items-center w-100 border-0 shadow-lg">
          <Spinner className="organisation-spinner" />
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
                onClick={toggleOrgDirectorUpdateModal}
                title="Edit Organisation"
              >
                <i className="iconly-Edit me-2"></i>Edit
              </Button>
            </div>
            {/* Avatar section - positioned to overlap gradient */}
            <div className="d-flex justify-content-center organisation-avatar-container">
              <div className="position-relative">
                {singleOrgInfo?.user?.profile_image ? (
                  <div
                    className="position-relative rounded-circle"
                    style={{ width: 90, height: 90, overflow: "hidden" }}
                  >
                    <Image
                      src={singleOrgInfo.user.profile_image}
                      alt={singleOrgInfo?.user?.name ?? "Director"}
                      width={90}
                      height={90}
                      className="rounded-circle organisation-avatar-img border-2 border-secondary"
                    />
                    {/* Camera overlay — clipped by parent overflow: hidden */}
                    <button
                      title="Change profile image"
                      className="position-absolute d-flex align-items-center justify-content-center border-0 bg-secondary"
                      style={{
                        width: 30,
                        height: 30,
                        right: 0,
                        bottom: 0,
                        borderRadius: "50%",
                        transform: "translate(-15%, -15%)",
                      }}
                      onClick={handleProfileImageUpload}
                      disabled={isUpdating}
                    >
                      <FaCamera size={12} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="position-relative rounded-circle d-flex justify-content-center align-items-center text-white organisation-initials border-2 border-secondary"
                    style={{ width: 90, height: 90, overflow: "hidden" }}
                  >
                    {initials(singleOrgInfo?.user?.name)}
                    {/* Same camera overlay for initials */}
                    <button
                      title="Change profile image"
                      className="position-absolute d-flex align-items-center justify-content-center border-0 bg-secondary"
                      style={{
                        width: 30,
                        height: 30,
                        right: 0,
                        bottom: 0,
                        // background: "rgba(0, 0, 0, 0.65)",
                        borderRadius: "50%",
                        transform: "translate(-15%, -15%)",
                      }}
                      onClick={handleProfileImageUpload}
                      disabled={isUpdating}
                    >
                      <FaCamera size={12} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Hidden file input used by camera button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileSelected}
            />

            {/* Name and role */}
            <div className="text-center mt-1 mb-3">
              <h4 className="mb-2 fw-bold fs-4">
                {singleOrgInfo?.user?.name ?? "—"}
              </h4>
              <Badge className="px-3 py-2 bg-light-primary fw-semibold rounded-pill">
                <i className="fa fa-crown me-1" />
                {formatChoiceFieldValue(singleOrgInfo?.user?.user_type) ??
                  "User"}
              </Badge>
            </div>

            <Row>
              <Col sm="12">
                <Card className="bg-light-primary p-2 d-flex flex-row justify-content-center align-items-center mb-2">
                  <Mail className="me-2 bg-primary p-1 rounded-1" size={25} />
                  {singleOrgInfo?.user?.email ? (
                    <>
                      <span className="me-2 text-truncate">
                        {singleOrgInfo?.user?.email}
                      </span>
                      <span
                        onClick={handleCopyDirectorEmail}
                        style={{ cursor: "pointer" }}
                      >
                        {isDirectorEmailCopied ? <FaCheckCircle className="text-success"/> : <TbCopy />}
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
                  {singleOrgInfo?.user?.phone ? (
                    singleOrgInfo.user.phone
                  ) : (
                    <small className="text-muted">Phone not provided</small>
                  )}
                </Card>
              </Col>
              <Col sm="6">
                {singleOrgInfo?.user?.is_active ? (
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
      <UpdateOrgDirectorInfoModal
        isOpen={isOrgDirectorUpdateModalOpen}
        toggle={toggleOrgDirectorUpdateModal}
        organisationData={singleOrgInfo}
      />
    </>
  );
};

export default OrganisationDirectorInfo;
