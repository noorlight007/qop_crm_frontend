import { FetchSingleOrganisationProps } from "@/Types/Network/Director/OrganisationsTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { Mail } from "react-feather";
import { FaPhoneAlt, FaShieldAlt } from "react-icons/fa";
import { Badge, Card, CardBody, Col, Row, Spinner } from "reactstrap";

const OrganisationDirectorInfo: React.FC<FetchSingleOrganisationProps> = ({
  singleOrgInfo,
  isLoading,
}) => {
  // Find the organisation director user if present
  const directorUser =
    singleOrgInfo?.users?.find(
      (u: any) => u?.user?.user_type === "ORGANISATION_DIRECTOR",
    )?.user ?? singleOrgInfo?.users?.[0]?.user;

  const initials = (name?: string) =>
    (name || "")
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <>
      {isLoading ? (
        <Card
          className="d-flex justify-content-center align-items-center w-100 border-0 shadow-lg"
          style={{
            height: 450,
            borderRadius: "20px",
            background: "var(--bs-secondary)",
          }}
        >
          <Spinner style={{ width: "3rem", height: "3rem", color: "white" }} />
        </Card>
      ) : (
        <Card
          className="border-0 overflow-hidden position-relative shadow-lg"
          style={{
            height: "450px",
          }}
        >
          {/* Gradient header background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "190px",
              background: "var(--bs-secondary)",
              zIndex: 0,
            }}
          ></div>

          <CardBody className="p-4 position-relative" style={{ zIndex: 1 }}>
            {/* Avatar section - positioned to overlap gradient */}
            <div
              className="d-flex justify-content-center"
              style={{ marginTop: "120px" }}
            >
              <div className="position-relative">
                {directorUser?.profile_image ? (
                  <div className="position-relative">
                    <Image
                      src={directorUser.profile_image}
                      alt={directorUser?.name ?? "Director"}
                      width={90}
                      height={90}
                      className="rounded-circle"
                      style={{
                        border: "2px solid white",
                        objectFit: "cover",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                      }}
                    />
                    {directorUser?.is_active && (
                      <div
                        className="position-absolute bg-success rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          bottom: "4px",
                          right: "4px",
                          border: "2px solid white",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        <i
                          className="fa fa-check"
                          style={{ fontSize: "10px", color: "white" }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="position-relative">
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center text-white"
                      style={{
                        width: 90,
                        height: 90,
                        fontSize: 28,
                        fontWeight: 700,
                        background: "var(--bs-secondary)",
                        border: "2px solid white",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {initials(directorUser?.name)}
                    </div>
                    {directorUser?.is_active && (
                      <div
                        className="position-absolute bg-success rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          bottom: "4px",
                          right: "4px",
                          border: "2px solid white",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        <i
                          className="fa fa-check"
                          style={{ fontSize: "10px", color: "white" }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Name and role */}
            <div className="text-center mt-1 mb-3">
              <h4 className="mb-2 fw-bold fs-4">{directorUser?.name ?? "—"}</h4>
              <Badge className="px-3 py-2 bg-light-primary fw-semibold rounded-pill">
                <i className="fa fa-crown me-1" />
                {formatChoiceFieldValue(directorUser?.user_type) ?? "User"}
              </Badge>
            </div>

            <Row>
              <Col sm="12">
                <Card className="bg-light-primary p-2 d-flex flex-row justify-content-center align-items-center mb-2">
                  <Mail className="me-2 bg-primary p-1 rounded-1" size={25} />
                  {directorUser?.email ?? "Email not provided"}
                </Card>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <Card className="bg-light-secondary p-2 d-flex align-items-center">
                  <FaPhoneAlt
                    className="me-2 bg-secondary p-1 rounded-1"
                    size={25}
                  />
                  {directorUser?.phone ? (
                    directorUser.phone
                  ) : (
                    <small className="text-muted">Phone not provided</small>
                  )}
                </Card>
              </Col>
              <Col sm="6">
                {directorUser?.is_active ? (
                  <Card className="bg-light-success p-2 d-flex align-items-center">
                    <FaShieldAlt
                      className="me-2 bg-success p-1 rounded-1"
                      size={25}
                    />
                    Verified Director
                  </Card>
                ) : (
                  <Card className="bg-light-danger p-2 d-flex align-items-center">
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
    </>
  );
};

export default OrganisationDirectorInfo;
