import { useGetSingleOrganisationQuery } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Row } from "reactstrap";
import DeleteOrgModal from "../Modals/DeleteOrgModal";

const OrganisationDelete: React.FC = () => {
  const params = useParams();
  const slug = params?.organisationslug;
  const { data: getOrganisationDetails } = useGetSingleOrganisationQuery({
    organisationslug: slug,
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  return (
    <div>
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
      <DeleteOrgModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        organisationInfo={getOrganisationDetails}
      />
    </div>
  );
};

export default OrganisationDelete;
