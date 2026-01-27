import { FetchSingleOrganisationProps } from "@/Types/Network/Director/OrganisationsTypes";
import Image from "next/image";
import { Badge, Card, CardBody, Spinner } from "reactstrap";

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
            height: 280,
            borderRadius: "15px",
          }}
        >
          <Spinner color="primary" size="lg" />
        </Card>
      ) : (
        <Card
          className="border-0 shadow-lg"
          style={{
            borderRadius: "15px",
            height: "280px",
            background: "#fff",
          }}
        >
          <CardBody className="p-4 d-flex flex-column h-100">
            {/* Header section with avatar and basic info */}
            <div className="d-flex align-items-center mb-3">
              <div className="position-relative me-3">
                {directorUser?.profile_image ? (
                  <div className="position-relative">
                    <Image
                      src={directorUser.profile_image}
                      alt={directorUser?.name ?? "Director"}
                      width={60}
                      height={60}
                      className="rounded-circle"
                      style={{
                        border: "2px solid var(--bs-primary)",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      className="position-absolute bg-success rounded-circle"
                      style={{
                        width: "12px",
                        height: "12px",
                        bottom: "2px",
                        right: "2px",
                        border: "2px solid white",
                      }}
                    />
                  </div>
                ) : (
                  <div className="position-relative">
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center text-white"
                      style={{
                        width: 60,
                        height: 60,
                        fontSize: 18,
                        fontWeight: 600,
                        backgroundColor: "var(--bs-primary)",
                      }}
                    >
                      {initials(directorUser?.name)}
                    </div>
                    <div
                      className="position-absolute bg-success rounded-circle"
                      style={{
                        width: "12px",
                        height: "12px",
                        bottom: "2px",
                        right: "2px",
                        border: "2px solid white",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex-grow-1">
                <h5
                  className="mb-1 fw-bold text-dark"
                  style={{ fontSize: "1.1rem" }}
                >
                  {directorUser?.name ?? "—"}
                </h5>
                <Badge
                  color="primary"
                  className="px-2 py-1"
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "capitalize",
                    fontWeight: 500,
                  }}
                >
                  <i className="fa fa-crown me-1" />
                  {directorUser?.user_type?.replace("_", " ").toLowerCase() ??
                    "User"}
                </Badge>
              </div>
            </div>

            {/* Contact information */}
            <div className="flex-grow-1">
              <div className="mb-2">
                <div className="d-flex align-items-center text-muted">
                  <i
                    className="fa fa-envelope me-2 text-primary"
                    style={{ width: "16px" }}
                  />
                  <a
                    href={`mailto:${directorUser?.email ?? ""}`}
                    className="text-decoration-none text-dark"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {directorUser?.email ?? "Email not provided"}
                  </a>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex align-items-center text-muted">
                  <i
                    className="fa fa-phone me-2 text-secondary"
                    style={{ width: "16px" }}
                  />
                  <span style={{ fontSize: "0.85rem" }}>
                    {directorUser?.phone ?? "Phone not provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer section */}

            <div className="mt-auto pt-2">
              <div className="text-center">
                <small className="text-muted">
                  <i className="fa fa-shield-alt me-1 text-success" />
                  Verified Director
                </small>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default OrganisationDirectorInfo;
