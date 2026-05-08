import {
  useGetAppranceQuery,
  useUpdateAppearanceMutation,
} from "@/Redux/Reducers/Appearance/AppearanceApi";
import { useEffect, useState } from "react";
import { Edit } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const About: React.FC = () => {
  const { data: appearanceData } = useGetAppranceQuery(undefined);
  const [updateAbout, { isLoading: isUpdatingAbout }] =
    useUpdateAppearanceMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aboutValue, setAboutValue] = useState("");

  useEffect(() => {
    if (appearanceData?.about) {
      setAboutValue(appearanceData.about);
    }
  }, [appearanceData]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleUpdateAbout = async () => {
    await updateAbout({
      payload: { about: aboutValue },
    });
    setIsModalOpen(false);
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h3>About</h3>
        <Button
          color="primary"
          size="sm"
          disabled={isUpdatingAbout}
          onClick={toggleModal}
        >
          <Edit className="me-1" size={14} />
          Edit
        </Button>
      </CardHeader>
      <CardBody>
        {appearanceData?.about ? (
          appearanceData.about
        ) : (
          <p className="text-muted text-center">No about information available.</p>
        )}
      </CardBody>

      <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg" centered>
        <ModalHeader toggle={toggleModal}>
          <h2 className="text-primary">Update About Information</h2>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="aboutInput" className="fw-semibold">
                About
              </Label>
              <Input
                id="aboutInput"
                type="textarea"
                value={aboutValue}
                onChange={(e) => setAboutValue(e.target.value)}
                placeholder="Enter about information"
                rows={10}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleUpdateAbout}
            disabled={isUpdatingAbout}
          >
            {isUpdatingAbout ? "Updating..." : "Update"}
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default About;
