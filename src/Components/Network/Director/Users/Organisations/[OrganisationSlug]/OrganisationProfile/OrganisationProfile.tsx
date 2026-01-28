import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/SingleOrganisationApi";
import { FetchSingleOrganisationProps } from "@/Types/Network/Director/OrganisationsTypes";
import Image from "next/image";
import { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
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
          style={{ height: "450px" }}
        >
          <Spinner color="primary" />
        </Card>
      ) : (
        <Card className="shadow-lg position-relative mt-0 mx-0 pt-0 px-0">
          {/* Card Body with User Details */}
          <CardBody className="text-center mt-0 mx-0 pt-0 px-0">
            {/* Banner Image inside the Card */}
            <div>
              <Image
                width={300}
                height={190}
                className="rounded-top-3 w-100 object-fit-cover"
                src={
                  singleOrgInfo?.profile_image ||
                  "/assets/images/network/bg-profile.jpg"
                }
                alt="Banner"
              />
            </div>
            {/* Edit button top-right of the card */}
            <div className="edit_icon position-absolute">
              <Button
                size="sm"
                color="primary"
                onClick={toggleUpdateModal}
                title="Edit Organisation"
              >
                <i className="iconly-Edit icli"></i>
              </Button>
            </div>
            {/* Profile Image Positioned Over Banner */}
            <div className="org-profile-container">
              <Image
                width={120}
                height={120}
                src={singleOrgInfo?.logo || "/assets/images/network/logo.jpg"}
                alt="Logo"
                className="profile-pic object-fit-cover"
              />
              {/* Camera overlay badge (bottom-right) for initials avatar */}
              <button
                title="Change profile image"
                className="position-absolute d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm border-0"
                style={{ width: 30, height: 30, right: 8, bottom: 8 }}
                onClick={handleProfileImageUpload}
                disabled={isUpdating}
              >
                <FaCamera size={12} className="text-dark" />
              </button>
              {/* Hidden file input used by camera button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileSelected}
              />
            </div>
            <CardTitle
              tag="h3"
              className="text-primary"
              style={{ marginTop: "70px" }}
            >
              {singleOrgInfo?.name}
            </CardTitle>
            <CardText>
              <span className="text-muted">Network:</span>{" "}
              <strong>
                {singleOrgInfo?.network?.name ? (
                  singleOrgInfo?.network?.name
                ) : (
                  <strong className="text-muted">Not Available</strong>
                )}
              </strong>
            </CardText>
            {/* Contact Details */}
            <div className="mt-2 px-4">
              <div>
                <span className="text-muted">Phone:</span>{" "}
                {singleOrgInfo?.primary_mobile ? (
                  <strong>
                    <a
                      className="text-dark text_decoration_hover"
                      href={`tel:${singleOrgInfo?.primary_mobile}`}
                    >
                      {singleOrgInfo?.primary_mobile}
                    </a>
                  </strong>
                ) : (
                  <strong className="text-muted">Not Available</strong>
                )}
              </div>
              <div>
                <span className="text-muted">Email:</span>{" "}
                {singleOrgInfo?.email ? (
                  <strong>{singleOrgInfo?.email}</strong>
                ) : (
                  <strong className="text-muted">Not Available</strong>
                )}
              </div>
            </div>
            {/* Follower Count */}
            <Row className="mt-4 px-2">
              <Col>
                <h6 className="fw-bold">
                  {Number(
                    singleOrgDashboardData?.counters?.total_cases,
                  ).toLocaleString() || 0}
                </h6>
                <strong className="small opacity-50">Cases</strong>
              </Col>
              <Col>
                <h6 className="fw-bold">
                  {Number(
                    singleOrgDashboardData?.counters?.total_leads,
                  ).toLocaleString() || 0}
                </h6>
                <strong className="small opacity-50">Leads</strong>
              </Col>
              <Col>
                <h6 className="fw-bold">
                  {Number(
                    singleOrgDashboardData?.counters?.total_clients,
                  ).toLocaleString() || 0}
                </h6>
                <strong className="small opacity-50">Clients</strong>
              </Col>
              <Col>
                <h6 className="fw-bold">
                  {Number(
                    singleOrgDashboardData?.counters?.total_advisers,
                  ).toLocaleString() || 0}
                </h6>
                <strong className="small opacity-50">Advisers</strong>
              </Col>
              <Col>
                <h6 className="fw-bold">
                  {Number(
                    singleOrgDashboardData?.counters?.total_introducers,
                  ).toLocaleString() || 0}
                </h6>
                <strong className="small opacity-50">Introducers</strong>
              </Col>
            </Row>
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
