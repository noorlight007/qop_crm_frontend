import { useGetNetworkDetailsQuery } from "@/Redux/Reducers/SuperAdmin/Networks/NetworksApi";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Row } from "reactstrap";
import DeleteNetworkModal from "../Modals/DeleteNetworkModal";

const NetworkDelete: React.FC = () => {
  const params = useParams();
  const slug = params?.networkslug;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: getNetworkDetails } = useGetNetworkDetailsQuery({
    network_slug: slug,
  });
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
                <h5 className="fw-bold">Delete this Network</h5>
                <p className="mb-0 opacity-75 text-danger">
                  Once you delete a network, there is no going back. Please be
                  certain.
                </p>
              </div>
              <Button color="danger" onClick={toggleDeleteModal}>
                Delete this Network
              </Button>
            </div>
          </CardBody>
        </Card>
      </Row>
      <DeleteNetworkModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        networkInfo={getNetworkDetails}
      />
    </div>
  );
};

export default NetworkDelete;
