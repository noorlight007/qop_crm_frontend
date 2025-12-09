import { FetchSingleOrganisationProps } from "@/Types/Network/Director/OrganisationsTypes";
import Image from "next/image";
import { useState } from "react";
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
import "../../Organisations.css"; // Import external CSS for styling
import UpdateOrganisationModal from "../Modals/UpdateOrganisationModal";

const OrganisationProfile: React.FC<FetchSingleOrganisationProps> = ({
  singleOrgInfo,
  isLoading,
  singleOrgDashboardData,
  isDashboardLoading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleUpdateModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {isLoading ? (
        <Card
          className="d-flex justify-content-center align-items-center w-100"
          style={{ height: "400px" }}
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
            {/* Profile Image Positioned Over Banner */}
            <div className="profile-container">
              <Image
                width={120}
                height={120}
                src={singleOrgInfo?.logo || "/assets/images/network/logo.jpg"}
                alt="Logo"
                className="profile-pic object-fit-cover"
              />
              <div className="edit_icon">
                <Button onClick={toggleUpdateModal}>
                  <i className="iconly-Edit icli"></i>
                </Button>
              </div>
            </div>
            <CardTitle
              tag="h3"
              className="text-success"
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
            <Row className="mt-4 px-4">
              <Col>
                <h6 className="fw-bold">
                  {Number(
                    singleOrgDashboardData?.counters?.total_cases
                  ).toLocaleString() || 0}
                </h6>
                <strong className="small opacity-50">Cases</strong>
              </Col>
              <Col>
                <h6 className="fw-bold">
                  {Number(
                    singleOrgDashboardData?.counters?.total_leads
                  ).toLocaleString() || 0}
                </h6>
                <strong className="small opacity-50">Leads</strong>
              </Col>
              <Col>
                <h6 className="fw-bold">
                  {Number(
                    singleOrgDashboardData?.counters?.total_clients
                  ).toLocaleString() || 0}
                </h6>
                <strong className="small opacity-50">Clients</strong>
              </Col>
              <Col>
                <h6 className="fw-bold">
                  {Number(
                    singleOrgDashboardData?.counters?.total_advisers
                  ).toLocaleString() || 0}
                </h6>
                <strong className="small opacity-50">Advisers</strong>
              </Col>
              <Col>
                <h6 className="fw-bold">
                  {Number(
                    singleOrgDashboardData?.counters?.total_introducers
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
