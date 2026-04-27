import { FetchSingleOrganisationProps } from "@/Types/Common/Organisations/OrganisationsTypes";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import DeleteOrganisationModal from "../../../Modals/DeleteOrganisationModal";

const DangerZone: React.FC<FetchSingleOrganisationProps> = ({
  singleOrgInfo,
}) => {
  const { data: session } = useSession();
  const canDeleteOrganisation =
    session?.user?.is_network &&
    (session?.user?.role === "DIRECTOR" ||
      session?.user?.role === "COMPLIANCE");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const irreversibleLossItems = [
    "Organisation profile and core settings",
    "Linked users, roles, and permissions",
    "Leads, introducers, and related activity history",
    "Case links, workflow mapping, and internal notes",
    "Audit references tied to this organisation",
  ];

  // Toggle modal state
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Card className="border-danger shadow-sm overflow-hidden">
      <CardHeader className="bg-danger text-white border-0 py-3 px-4">
        <h4 className="mb-1 fw-bold">Danger Zone</h4>
        <p className="mb-0 small text-white">
          High-risk actions for this organisation. Please review carefully
          before proceeding.
        </p>
      </CardHeader>

      <CardBody className="p-4">
        <div className="border border-danger rounded-3 p-3 p-md-4 bg-light">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
            <div className="flex-grow-1">
              <h5 className="fw-bold text-danger mb-2">
                Delete this organisation
              </h5>
              <p className="mb-3 text-danger-emphasis">
                This action is permanent. If you delete this organisation, all
                associated records listed below will be lost and cannot be
                recovered.
              </p>

              <div className="rounded-3 border border-danger-subtle bg-white p-3">
                <p className="fw-semibold mb-2 text-danger">
                  <i
                    className="fa fa-exclamation-triangle me-2"
                    aria-hidden="true"
                  />
                  What will be lost:
                </p>
                <ul className="mb-0 ps-3">
                  {irreversibleLossItems.map((item) => (
                    <li
                      key={item}
                      className="mb-1 text-muted d-flex align-items-start gap-2"
                    >
                      <i
                        className="fa fa-exclamation-circle text-danger mt-1"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {!canDeleteOrganisation && (
                <p className="mt-3 mb-0 text-muted">
                  Only users with Director or Compliance role can delete an
                  organisation.
                </p>
              )}
            </div>

            <div className="d-flex align-items-start align-items-lg-center">
              <Button
                color="danger"
                onClick={toggleModal}
                disabled={!canDeleteOrganisation}
                className="px-4 py-2 fw-semibold"
              >
                Delete Organisation Permanently
              </Button>
            </div>
          </div>
        </div>

        {/* Delete modal */}
        {singleOrgInfo?.organization?.slug && (
          <DeleteOrganisationModal
            isOpen={isModalOpen}
            toggle={toggleModal}
            organisationInfo={singleOrgInfo}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default DangerZone;
