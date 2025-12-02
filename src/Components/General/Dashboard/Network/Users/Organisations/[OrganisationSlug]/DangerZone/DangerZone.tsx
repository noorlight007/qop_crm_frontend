import { FetchSingleOrganisationProps } from "@/Types/Network/OrganisationsTypes";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import DeleteOrganisationModal from "../Modals/DeleteOrganisationModal";

const DangerZone: React.FC<FetchSingleOrganisationProps> = ({
  singleOrgInfo,
}) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Toggle modal state
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
      <Card className="shadow p-2">
        <CardHeader className="h3 text-danger">Danger Zone</CardHeader>
        <CardBody className="border-danger rounded-2 mb-4">
          {/** Disable Organisation Protection Rules Section **/}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold">Disable organisation protection rules</h5>
              <p className="mb-0 opacity-75">
                Disable organisation protection rules enforcement and APIs.
              </p>
            </div>
            <Button color="danger" disabled>
              Disable organisation protection rules
            </Button>
          </div>
          <hr />
          {/** Transfer Ownership Section **/}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold">Transfer ownership</h5>
              <p className="mb-0 opacity-75">
                Transfer this organisation to another user or an organisation
                where you have the ability to create repositories.
              </p>
            </div>
            <Button color="danger" disabled>
              Transfer
            </Button>
          </div>
          <hr />

          {/** Delete organisation Section **/}
          {session?.user.user_type === "NETWORK_ADMIN" && (
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold">Delete this organisation</h5>
                <p className="mb-0 opacity-75">
                  Once you delete a organisation, there is no going back. Please
                  be certain.
                </p>
              </div>
              <Button color="danger" onClick={toggleModal}>
                Delete this organisation
              </Button>
            </div>
          )}
          {/* Delete modal  */}
          {singleOrgInfo?.slug && (
            <DeleteOrganisationModal
              isOpen={isModalOpen}
              toggle={toggleModal}
              organisationInfo={singleOrgInfo}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default DangerZone;
