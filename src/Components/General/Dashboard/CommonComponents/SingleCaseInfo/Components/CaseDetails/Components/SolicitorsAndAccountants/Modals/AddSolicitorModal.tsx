import { useAddSolicitorDetailsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SolicitorAndAccountant/SolicitorAndAccountantApi";
import { AddSolicitorModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/SolicitorAndAccountantTypes";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

const AddSolicitorModal: React.FC<AddSolicitorModalProps> = ({
  isOpen,
  toggle,
}) => {
  const [addSolicitorDetails, { isLoading }] = useAddSolicitorDetailsMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const payload = {
        name: formData.get("solicitorName"),
        user_type: "SOLICITOR",
        sra_number: formData.get("sraNumber") || "",
        postcode: formData.get("postcode"),
        building_name_or_number: formData.get("buildingName") || "",
        street: formData.get("street"),
        city: formData.get("city"),
        county: formData.get("county") || "",
        country: formData.get("country"),
        phone_number: formData.get("phoneNumber"),
        fax_number: formData.get("faxNumber"),
        dx_number: formData.get("dxNumber"),
        contact_name: formData.get("contactName"),
        email_address: formData.get("emailAddress") || "",
        number_of_partners_in_firm: formData.get("numberOfPartners") || null,
        qualifications: formData.get("qualifications"),
      };

      const response = await addSolicitorDetails({
        solicitorDetails: payload,
      });

      if (response.data) {
        toast.success("Solicitor added successfully!");
        toggle();
      } else if (response.error) {
        const errorMessage =
          (response.error as any)?.data?.detail || "Failed to add solicitor";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to add solicitor. Please try again!");
      }
    } catch (error) {
      console.error("Failed to add solicitor:", error);
      toast.error("Failed to add solicitor. Please try again!");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add Solicitor</span>
      </ModalHeader>
      <ModalBody className="px-4 py-4">
        <Form onSubmit={handleSubmit}>
          <Card>
            <CardBody>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="solicitorName">Solicitor Full Name*</Label>
                    <Input
                      id="solicitorName"
                      name="solicitorName"
                      type="text"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="sraNumber">SRA Number</Label>
                    <Input id="sraNumber" name="sraNumber" type="text" />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="qualifications">Qualification</Label>
                    <Input
                      id="qualifications"
                      name="qualifications"
                      type="text"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="postcode">Postcode*</Label>
                    <Input id="postcode" name="postcode" type="text" required />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="buildingName">Building Name or Number</Label>
                    <Input id="buildingName" name="buildingName" type="text" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="street">Street</Label>
                    <Input id="street" name="street" type="text" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="city">City</Label>
                    <Input id="city" name="city" type="text" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="county">County</Label>
                    <Input id="county" name="county" type="text" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="country">Country</Label>
                    <Input id="country" name="country" type="text" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="faxNumber">Fax Number</Label>
                    <Input id="faxNumber" name="faxNumber" type="tel" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dxNumber">DX Number</Label>
                    <Input id="dxNumber" name="dxNumber" type="text" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="contactName">Contact Name</Label>
                    <Input id="contactName" name="contactName" type="text" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="emailAddress">Email Address</Label>
                    <Input id="emailAddress" name="emailAddress" type="email" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="numberOfPartners">
                      Number of Partners in firm
                    </Label>
                    <Input
                      id="numberOfPartners"
                      name="numberOfPartners"
                      type="number"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12} className="d-flex justify-content-between">
                  <Button type="button" color="secondary" onClick={toggle}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    {isLoading ? "Saving..." : "Save Solicitor"}
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddSolicitorModal;
