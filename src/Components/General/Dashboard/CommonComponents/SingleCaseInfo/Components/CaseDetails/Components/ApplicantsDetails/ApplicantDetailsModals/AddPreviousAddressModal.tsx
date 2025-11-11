import { useAddPreviousAddressMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetails/ApplicantPreviousAddressApi";
import { AddPreviousAddressModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ApplicantsDetailsTypes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const AddPreviousAddressModal: React.FC<AddPreviousAddressModalProps> = ({
  isOpen,
  toggle,
  applicantAlias,
  effectiveFromDate,
  lastEffectiveFromDate,
  applicantDetailsAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [timeAtAddress, setTimeAtAddress] = useState({ years: 0, months: 0 });

  // RTK Hooks
  const [addPreviousAddress, { isLoading: isSaving }] =
    useAddPreviousAddressMutation();

  useEffect(() => {
    const effectiveFromInput = document.getElementById(
      "pre_effective_from"
    ) as HTMLInputElement;
    const effectiveToInput = document.getElementById(
      "pre_effective_to"
    ) as HTMLInputElement;

    const calculateTimeAtAddress = () => {
      const effectiveFrom = effectiveFromInput?.value;
      const effectiveTo = effectiveToInput?.value;

      if (effectiveFrom && effectiveTo) {
        const fromDate = new Date(effectiveFrom);
        const toDate = new Date(effectiveTo);

        if (fromDate <= toDate) {
          const totalMonths =
            (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
            (toDate.getMonth() - fromDate.getMonth());

          const years = Math.floor(totalMonths / 12);
          const months = totalMonths % 12;

          setTimeAtAddress({ years, months });
        } else {
          setTimeAtAddress({ years: 0, months: 0 });
          toast.error(
            "Effective From date cannot be later than Effective To date."
          );
        }
      } else {
        setTimeAtAddress({ years: 0, months: 0 });
      }
    };

    effectiveFromInput?.addEventListener("change", calculateTimeAtAddress);
    effectiveToInput?.addEventListener("change", calculateTimeAtAddress);

    // Trigger calculation on initial render
    calculateTimeAtAddress();

    return () => {
      effectiveFromInput?.removeEventListener("change", calculateTimeAtAddress);
      effectiveToInput?.removeEventListener("change", calculateTimeAtAddress);
    };
  }, [timeAtAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get form data from the form elements
    const form = e.target as HTMLFormElement;
    const formDataFromForm = new FormData(form);

    const previousAddressInfo = {
      postcode: formDataFromForm.get("postcode") as string,
      house_name_or_number: formDataFromForm.get(
        "house_name_or_number"
      ) as string,
      address_line1: formDataFromForm.get("address_line1") as string,
      city: formDataFromForm.get("city") as string,
      county: formDataFromForm.get("county") as string,
      country: formDataFromForm.get("country") as string,
      pre_effective_from: formDataFromForm.get("pre_effective_from") as string,
      pre_effective_to: formDataFromForm.get("pre_effective_to") as string,
      time_at_address_years: timeAtAddress.years,
      time_at_address_months: timeAtAddress.months,
      residential_status: formDataFromForm.get("residential_status") as string,
      notes: formDataFromForm.get("notes") as string,
    };

    try {
      const res = await addPreviousAddress({
        case_alias: casealias,
        applicantDetails_alias: applicantAlias || applicantDetailsAlias,
        previousAddressInfo,
      });
      if (res.data) {
        toast.success("Previous address added successfully");
        toggle();
      } else {
        toast.error("Failed to add previous address");
      }
    } catch (error) {
      toast.error("Failed to add previous address");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Add Previous Address</h3>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="postcode">Postcode*</Label>
                <Input
                  id="postcode"
                  name="postcode"
                  className="border-primary"
                  type="text"
                  placeholder="Enter postcode"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="house_name_or_number">House Name or Number*</Label>
                <Input
                  id="house_name_or_number"
                  name="house_name_or_number"
                  type="text"
                  placeholder="Enter house name or number"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="address_line1">Address Line 1*</Label>
                <Input
                  id="address_line1"
                  name="address_line1"
                  type="text"
                  placeholder="Enter address line 1"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="city">City*</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter city"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="county">County</Label>
                <Input
                  id="county"
                  name="county"
                  type="text"
                  placeholder="Enter county"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="country">Country*</Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Enter country"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="pre_effective_from">Effective From*</Label>
                <Input
                  id="pre_effective_from"
                  name="pre_effective_from"
                  type="date"
                  max={
                    effectiveFromDate
                      ? new Date(
                          new Date(effectiveFromDate).getTime() -
                            24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .split("T")[0]
                      : lastEffectiveFromDate
                      ? new Date(
                          new Date(lastEffectiveFromDate).getTime() -
                            24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="pre_effective_to">Effective To*</Label>
                <Input
                  id="pre_effective_to"
                  name="pre_effective_to"
                  type="date"
                  readOnly={!!effectiveFromDate}
                  value={effectiveFromDate || lastEffectiveFromDate || ""}
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="time_at_address_years">Time at this Address</Label>
                <div className="d-flex gap-3">
                  <FormGroup className="d-flex align-items-center mb-0">
                    <Input
                      id="time_at_address_years"
                      type="number"
                      value={timeAtAddress.years}
                      readOnly
                      className="rounded-end-0"
                    />
                    <InputGroupText className="border-start-0 rounded-start-0">
                      Years
                    </InputGroupText>
                  </FormGroup>
                  <FormGroup className="d-flex align-items-center mb-0">
                    <Input
                      id="time_at_address_months"
                      type="number"
                      value={timeAtAddress.months}
                      readOnly
                      className="rounded-end-0"
                    />
                    <InputGroupText className="border-start-0 rounded-start-0">
                      Months
                    </InputGroupText>
                  </FormGroup>
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="residential_status">Residential Status*</Label>
                <Input
                  id="residential_status"
                  name="residential_status"
                  type="select"
                  required
                >
                  <option value="">Select...</option>
                  <option value="OWNER">Owner</option>
                  <option value="RENTING_PRIVATE">Renting - Private</option>
                  <option value="RENTING_LOCAL_AUTHORITY">
                    Renting - Local Authority
                  </option>
                  <option value="TIED_ACCOMMODATION">Tied Accommodation</option>
                  <option value="LIVING_WITH_PARENTS">
                    Living with Parents
                  </option>
                  <option value="LIVING_WITH_FRIENDS_FAMILY">
                    Living with Friends/Family
                  </option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  type="textarea"
                  placeholder="Enter any additional notes"
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            {isSaving ? " Saving..." : "Save Address"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddPreviousAddressModal;
