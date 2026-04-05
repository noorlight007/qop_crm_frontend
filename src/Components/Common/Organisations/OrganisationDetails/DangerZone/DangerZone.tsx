import { FetchSingleOrganisationProps } from "@/Types/Common/Organisations/OrganisationsTypes";
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
          {/** Delete organisation Section **/}
          {session?.user?.is_network &&
            (session?.user?.role === "DIRECTOR" ||
              session?.user?.role === "COMPLIANCE") && (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold">Delete this organisation</h5>
                  <p className="mb-0 opacity-75 text-danger">
                    Once you delete a organisation, there is no going back.
                    Please be certain.
                  </p>
                </div>
                <Button color="danger" onClick={toggleModal}>
                  Delete this organisation
                </Button>
              </div>
            )}
          {/* Delete modal  */}
          {singleOrgInfo?.organization?.slug && (
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
