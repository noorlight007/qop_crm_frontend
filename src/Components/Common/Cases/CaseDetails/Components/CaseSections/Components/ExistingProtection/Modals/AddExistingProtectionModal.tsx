import LoadingSpinner from "@/app/loading";
import { useAddExistingProtectionDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ExistingProtection/ExistingProtectionDetailsApi";
import { AddExistingProtectionModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/ExistingProtectionTypes";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const AddExistingProtectionModal: React.FC<AddExistingProtectionModalProps> = ({
  isOpen,
  toggle,
  existingProtectionData,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [hasNonStandardTerms, setHasNonStandardTerms] =
    useState<boolean>(false);
  const [willBeCancelled, setWillBeCancelled] = useState<boolean>(false);
  const [addExistingProtectionDetails, { isLoading }] =
    useAddExistingProtectionDetailsMutation();

  const [formData, setFormData] = useState({
    have_any_existing_Protection_policies_in_place: true,
    policy_type: "",
    policy_provider: "",
    insurers_reference: "",
    sum_assured: null,
    premium: null,
    premium_payment_type: "",
    person_assured: "",
    in_trust: "",
    guaranteed_reviewable: "",
    remaining_policy_term: "",
    cancelled_lapsed_date: null,
    renewal_date: null,
    date_policy_started: null,
    waiver_of_premium: false,
    indexation: false,
    death_in_service_provision: false,
    have_non_standard_terms_been_issued: false,
    copy_and_paste_non_standard_terms_from_lender: "",
    will_be_cancelled: false,
    reason_for_policy_cancellation: "",
    policy_cancellation_notes: "",
    why_did_you_take_out_this_policy: "",
  });

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle radio button changes
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const booleanValue = value === "yes"; // Convert "yes" to true, "no" to false

    setFormData((prevData) => ({
      ...prevData,
      [name]: booleanValue,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await addExistingProtectionDetails({
        case_alias: casealias,
        existingProtection_id: existingProtectionData?.user?.id,
        existingProtectionDetailsPayload: formData,
      }).unwrap();
      console.log(res);

      if (res) {
        toast.success("Security Property Added Successfully!");
        toggle(); // Close the modal
        // Reset form data to initial values
        setFormData({
          have_any_existing_Protection_policies_in_place: true,
          policy_type: "",
          policy_provider: "",
          insurers_reference: "",
          sum_assured: null,
          premium: null,
          premium_payment_type: "",
          person_assured: "",
          in_trust: "",
          guaranteed_reviewable: "",
          remaining_policy_term: "",
          cancelled_lapsed_date: null,
          renewal_date: null,
          date_policy_started: null,
          waiver_of_premium: false,
          indexation: false,
          death_in_service_provision: false,
          have_non_standard_terms_been_issued: false,
          copy_and_paste_non_standard_terms_from_lender: "",
          will_be_cancelled: false,
          reason_for_policy_cancellation: "",
          policy_cancellation_notes: "",
          why_did_you_take_out_this_policy: "",
        });

        // Reset additional state variables
        setHasNonStandardTerms(false);
        setWillBeCancelled(false);
      }
    } catch (error) {
      toast.error("Error Adding Security Property!");
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add New Existing Protection</span>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody className="px-4">
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="policyType">Policy Type</Label>
                <Input
                  type="select"
                  id="policyType"
                  name="policy_type"
                  value={formData.policy_type}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="LIFE_ASSURANCE_LEVEL">
                    Life Assurance (Level)
                  </option>
                  <option value="LIFE_ASSURANCE_DECREASING">
                    Life Assurance (Decreasing)
                  </option>
                  <option value="CRITICAL_ILLNESS_COVER_LEVEL">
                    Critical Illness Cover (Level)
                  </option>
                  <option value="CRITICAL_ILLNESS_COVER_DECREASING">
                    Critical Illness Cover (Decreasing)
                  </option>
                  <option value="MORTGAGE_PAYMENT_PROTECTION">
                    Mortgage Payment Security
                  </option>
                  <option value="BUILDINGS_AND_CONTENTS">
                    Buildings and Contents
                  </option>
                  <option value="PRIVATE_PENSION">Private Pension</option>
                  <option value="DEATH_IN_SERVICE_BENEFIT">
                    Death in Service Benefit
                  </option>
                  <option value="OTHER">Other</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="policyProvider">Policy Provider</Label>
                <Input
                  type="text"
                  id="policyProvider"
                  name="policy_provider"
                  value={formData.policy_provider}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="insurersReference">Insurer's Reference</Label>
                <Input
                  type="text"
                  id="insurersReference"
                  name="insurers_reference"
                  value={formData.insurers_reference}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="sumAssured">Sum Assured</Label>
                <Input
                  type="number"
                  id="sumAssured"
                  name="sum_assured"
                  value={formData.sum_assured || ""}
                  onChange={handleInputChange}
                  placeholder="£"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="premium">Premium</Label>
                <Input
                  type="number"
                  id="premium"
                  name="premium"
                  value={formData.premium || ""}
                  onChange={handleInputChange}
                  placeholder="£"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="premiumPaymentType">Premium Payment Type</Label>
                <Input
                  type="select"
                  id="premiumPaymentType"
                  name="premium_payment_type"
                  value={formData.premium_payment_type}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="ANNUALLY">Annually</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="personAssured">Person(s) Assured</Label>
                <Input
                  type="text"
                  id="personAssured"
                  name="person_assured"
                  value={formData.person_assured}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="inTrust">In Trust?</Label>
                <Input
                  type="select"
                  id="inTrust"
                  name="in_trust"
                  value={formData.in_trust}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="NA">N/A</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="CLIENT_TO_ASCERTAIN">
                    Client to Ascertain
                  </option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="guaranteedReviewable">
                  Guaranteed / Reviewable
                </Label>
                <Input
                  type="select"
                  id="guaranteedReviewable"
                  name="guaranteed_reviewable"
                  value={formData.guaranteed_reviewable}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="NA">N/A</option>
                  <option value="GUARANTEED">Guaranteed</option>
                  <option value="REVIEWABLE">Reviewable</option>
                  <option value="CLIENT_TO_ASCERTAIN">
                    Client to Ascertain
                  </option>
                  <option value="AGE_COSTED">Age Costed</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="remainingPolicyTerm">Remaining Policy Term</Label>
                <Input
                  type="text"
                  id="remainingPolicyTerm"
                  name="remaining_policy_term"
                  value={formData.remaining_policy_term}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="cancelledLapsedDate">Cancelled / Lapsed Date</Label>
                <Input
                  type="date"
                  id="cancelledLapsedDate"
                  name="cancelled_lapsed_date"
                  value={formData.cancelled_lapsed_date || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="datePolicyStarted">Date Policy Started</Label>
                <Input
                  type="date"
                  id="datePolicyStarted"
                  name="date_policy_started"
                  value={formData.date_policy_started || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>Waiver Of Premium</Label>
                <div className="d-flex gap-4">
                  {["yes", "no"].map((option) => (
                    <FormGroup key={option} check inline>
                      <Input
                        type="radio"
                        name="waiver_of_premium"
                        id={`waiver-${option}`}
                        value={option}
                        checked={
                          formData.waiver_of_premium === (option === "yes")
                        }
                        onChange={handleRadioChange}
                      />
                      <Label check for={`waiver-${option}`}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Indexation</Label>
                <div className="d-flex gap-4">
                  {["yes", "no"].map((option) => (
                    <FormGroup key={option} check inline>
                      <Input
                        type="radio"
                        name="indexation"
                        id={`indexation-${option}`}
                        value={option}
                        checked={formData.indexation === (option === "yes")}
                        onChange={handleRadioChange}
                      />
                      <Label check for={`indexation-${option}`}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Death In Service Provision</Label>
                <div className="d-flex gap-4">
                  {["yes", "no"].map((option) => (
                    <FormGroup key={option} check inline>
                      <Input
                        type="radio"
                        name="death_in_service_provision"
                        id={`deathInService-${option}`}
                        value={option}
                        checked={
                          formData.death_in_service_provision ===
                          (option === "yes")
                        }
                        onChange={handleRadioChange}
                      />
                      <Label check for={`deathInService-${option}`}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Have non-standard terms been issued?</Label>
                <div className="d-flex gap-4">
                  {["yes", "no"].map((option) => (
                    <FormGroup key={option} check inline>
                      <Input
                        type="radio"
                        name="have_non_standard_terms_been_issued"
                        id={`nonStandardTerms-${option}`}
                        value={option}
                        checked={
                          formData.have_non_standard_terms_been_issued ===
                          (option === "yes")
                        }
                        onChange={(e) => {
                          handleRadioChange(e);
                          setHasNonStandardTerms(option === "yes");
                        }}
                      />
                      <Label check for={`nonStandardTerms-${option}`}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              {hasNonStandardTerms && (
                <FormGroup>
                  <Label for="nonStandardTermsDetails">
                    Copy and paste Non-standard terms from lender
                  </Label>
                  <Input
                    type="textarea"
                    id="nonStandardTermsDetails"
                    name="copy_and_paste_non_standard_terms_from_lender"
                    value={
                      formData.copy_and_paste_non_standard_terms_from_lender
                    }
                    onChange={handleInputChange}
                    rows={3}
                  />
                </FormGroup>
              )}
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Will this policy be cancelled?</Label>
                <div className="d-flex gap-4">
                  {["yes", "no"].map((option) => (
                    <FormGroup key={option} check inline>
                      <Input
                        type="radio"
                        name="will_be_cancelled"
                        id={`willBeCancelled-${option}`}
                        value={option}
                        checked={
                          formData.will_be_cancelled === (option === "yes")
                        }
                        onChange={(e) => {
                          handleRadioChange(e);
                          setWillBeCancelled(option === "yes");
                        }}
                      />
                      <Label check for={`willBeCancelled-${option}`}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              {willBeCancelled && (
                <FormGroup>
                  <Label for="reasonForPolicyCancellation">
                    Reason For Policy Cancellation
                  </Label>
                  <Input
                    type="select"
                    id="reasonForPolicyCancellation"
                    name="reason_for_policy_cancellation"
                    value={formData.reason_for_policy_cancellation}
                    onChange={handleInputChange}
                  >
                    <option value="">Select...</option>
                    <option value="NOT_VALUES_YET">Not Values Yet</option>
                  </Input>
                </FormGroup>
              )}
            </Col>
          </Row>

          {willBeCancelled && (
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label for="policyCancellationNotes">
                    Policy Cancellation Notes
                  </Label>
                  <Input
                    type="textarea"
                    id="policyCancellationNotes"
                    name="policy_cancellation_notes"
                    value={formData.policy_cancellation_notes}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </FormGroup>
              </Col>
            </Row>
          )}

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="whyTakeOutPolicy">
                  Why did you take out this policy?
                </Label>
                <Input
                  type="textarea"
                  id="whyTakeOutPolicy"
                  name="why_did_you_take_out_this_policy"
                  value={formData.why_did_you_take_out_this_policy}
                  onChange={handleInputChange}
                  rows={4}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Protection"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddExistingProtectionModal;
