import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import { useUpdateExistingProtectionDetailsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ExistingProtection/ExistingProtectionDetailsApi";
import {
  ExistingProtectionDetailsProps,
  ExistingProtectionTabContentProps,
} from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/ExistingProtectionTypes";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  Row,
} from "reactstrap";
import AddExistingProtectionModal from "./Modals/AddExistingProtectionModal";

const ExistingProtectionContent: React.FC<
  ExistingProtectionTabContentProps
> = ({ activeTab, activeUser, groupedData }) => {
  const params = useParams();
  const { casealias } = params;
  const { data: session } = useSession();

  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
  );

  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(caseData?.case_stage, currentTab!);
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  const [formValues, setFormValues] =
    useState<ExistingProtectionDetailsProps | null>(null);

  // Add this state for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //fetch api
  const [updatePropertyDetails, { isLoading: isUpdateLoading }] =
    useUpdateExistingProtectionDetailsMutation();

  // Add toggle function
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // `useEffect` to reset `formValues` when `activeTab` or `activeUser` changes
  useEffect(() => {
    if (activeTab && activeUser !== null) {
      const userExistingProtectionRecords = groupedData[activeUser];
      const activeExistingProtectionRecord =
        userExistingProtectionRecords?.find(
          (existingProtection) => existingProtection.alias === activeTab
        );
      setFormValues(activeExistingProtectionRecord || null);
    }
  }, [activeTab, activeUser, groupedData]);

  if (!activeTab || activeUser === null) {
    return <div>No existingProtection data available.</div>;
  }

  const userExistingProtectionRecords = groupedData[activeUser];
  const activeExistingProtectionRecord = userExistingProtectionRecords?.find(
    (existingProtection) => existingProtection.alias === activeTab
  );

  if (!activeExistingProtectionRecord) {
    return <div>No matching existingProtection record found.</div>;
  }

  const handleInputChange = (
    name: keyof ExistingProtectionDetailsProps, // Use your type instead of `Applicant`
    value: string | number | boolean | string[] | null
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues!,
      [name]: value,
    }));
  };

  // Add save handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updatePropertyDetails({
      case_alias: casealias,
      existingProtection_alias: formValues?.alias,
      existingProtectionUpdatePayload: formValues,
    });
    if (res.data) {
      toast.success("Updated Successfully!");
    } else if (res.error) {
      const errorMessage =
        (res.error as any)?.data?.detail ||
        "Failed to update Property details!";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to update Property details!");
    }
  };

  return (
    <div>
      <>
        <Form onSubmit={handleUpdate}>
          <Card className="mb-3 mt-2 border-primary">
            <CardBody>
              <div className="px-3">
                <Label className="mb-3">
                  Do you have any existing "Protection" policies in place? (such
                  as income security, life assurance etc.)
                </Label>
                <div className="d-flex gap-2 mb-4">
                  {["yes", "no"].map((option) => (
                    <FormGroup key={option} check inline>
                      <Input
                        type="radio"
                        id={`security-${option}`}
                        name="have_any_existing_Protection_policies_in_place"
                        value={option}
                        checked={
                          formValues?.have_any_existing_Protection_policies_in_place ===
                          (option === "yes")
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "have_any_existing_Protection_policies_in_place",
                            e.target.value === "yes"
                          )
                        }
                      />
                      <Label check for={`security-${option}`}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              </div>

              {formValues?.have_any_existing_Protection_policies_in_place && (
                <div className="p-3">
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="policy_type">Policy Type</Label>
                        <Input
                          type="select"
                          id="policy_type"
                          value={formValues?.policy_type || ""}
                          onChange={(e) =>
                            handleInputChange("policy_type", e.target.value)
                          }
                        >
                          <option value="">Select Policy...</option>
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
                          <option value="PRIVATE_PENSION">
                            Private Pension
                          </option>
                          <option value="DEATH_IN_SERVICE_BENEFIT">
                            Death in Service Benefit
                          </option>
                          <option value="OTHER">Other</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="policy_provider">Policy Provider</Label>
                        <Input
                          type="text"
                          id="policy_provider"
                          value={formValues?.policy_provider || ""}
                          onChange={(e) =>
                            handleInputChange("policy_provider", e.target.value)
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="insurers_reference">
                          Insurer's Reference
                        </Label>
                        <Input
                          type="text"
                          id="insurers_reference"
                          value={formValues?.insurers_reference || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "insurers_reference",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="sum_assured">Sum Assured(£)</Label>
                        <Input
                          type="number"
                          id="sum_assured"
                          placeholder="£"
                          value={formValues?.sum_assured || ""}
                          onChange={(e) =>
                            handleInputChange("sum_assured", e.target.value)
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="premium">Premium(£)</Label>
                        <Input
                          type="number"
                          id="premium"
                          placeholder="£"
                          value={formValues?.premium || ""}
                          onChange={(e) =>
                            handleInputChange("premium", e.target.value)
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="premium_payment_type">
                          Premium Payment Type
                        </Label>
                        <Input
                          type="select"
                          id="premium_payment_type"
                          value={formValues?.premium_payment_type}
                          onChange={(e) =>
                            handleInputChange(
                              "premium_payment_type",
                              e.target.value
                            )
                          }
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
                        <Label for="person_assured">Person(s) Assured</Label>
                        <Input
                          type="text"
                          id="person_assured"
                          value={formValues?.person_assured || ""}
                          onChange={(e) =>
                            handleInputChange("person_assured", e.target.value)
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="in_trust">In Trust?</Label>
                        <Input
                          type="select"
                          id="in_trust"
                          value={formValues?.in_trust}
                          onChange={(e) =>
                            handleInputChange("in_trust", e.target.value)
                          }
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
                        <Label for="guaranteed_reviewable">
                          Guaranteed / Reviewable
                        </Label>
                        <Input
                          type="select"
                          id="guaranteed_reviewable"
                          value={formValues?.guaranteed_reviewable}
                          onChange={(e) =>
                            handleInputChange(
                              "guaranteed_reviewable",
                              e.target.value
                            )
                          }
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
                        <Label for="remaining_policy_term">
                          Remaining Policy Term
                        </Label>
                        <Input
                          type="text"
                          id="remaining_policy_term"
                          value={formValues?.remaining_policy_term || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "remaining_policy_term",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="cancelled_lapsed_date">
                          Cancelled / Lapsed Date
                        </Label>
                        <Input
                          type="date"
                          id="cancelled_lapsed_date"
                          value={formValues?.cancelled_lapsed_date || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "cancelled_lapsed_date",
                              e.target.value
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="date_policy_started">
                          Date Policy Started
                        </Label>
                        <Input
                          type="date"
                          id="date_policy_started"
                          value={formValues?.date_policy_started || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "date_policy_started",
                              e.target.value
                            )
                          }
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
                                name="waiver"
                                id={`waiver-${option}`}
                                value={option}
                                checked={
                                  formValues?.waiver_of_premium ===
                                  (option === "yes")
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "waiver_of_premium",
                                    e.target.value === "yes"
                                  )
                                }
                              />
                              <Label check for={`waiver-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
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
                                checked={
                                  formValues?.indexation === (option === "yes")
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "indexation",
                                    e.target.value === "yes"
                                  )
                                }
                              />
                              <Label check for={`indexation-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
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
                                name="deathInService"
                                id={`deathInService-${option}`}
                                value={option}
                                checked={
                                  formValues?.death_in_service_provision ===
                                  (option === "yes")
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "death_in_service_provision",
                                    e.target.value === "yes"
                                  )
                                }
                              />
                              <Label check for={`deathInService-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
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
                                name="nonStandardTerms"
                                id={`nonStandardTerms-${option}`}
                                value={option}
                                checked={
                                  formValues?.have_non_standard_terms_been_issued ===
                                  (option === "yes")
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "have_non_standard_terms_been_issued",
                                    e.target.value === "yes"
                                  )
                                }
                              />
                              <Label check for={`nonStandardTerms-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      {formValues?.have_non_standard_terms_been_issued && (
                        <FormGroup>
                          <Label for="copy_and_paste_non_standard_terms_from_lender">
                            Copy and paste Non-standard terms from lender
                          </Label>
                          <Input
                            type="textarea"
                            id="copy_and_paste_non_standard_terms_from_lender"
                            placeholder="Copy and paste Non-standard terms from lender"
                            value={
                              formValues?.copy_and_paste_non_standard_terms_from_lender ||
                              ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "copy_and_paste_non_standard_terms_from_lender",
                                e.target.value
                              )
                            }
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
                                name="willBeCancelled"
                                id={`willBeCancelled-${option}`}
                                value={option}
                                checked={
                                  formValues?.will_this_policy_be_cancelled ===
                                  (option === "yes")
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "will_this_policy_be_cancelled",
                                    e.target.value === "yes"
                                  )
                                }
                              />
                              <Label check for={`willBeCancelled-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      {formValues?.will_this_policy_be_cancelled && (
                        <FormGroup>
                          <Label for="reason_for_policy_cancellation">
                            Reason For Policy Cancellation
                          </Label>
                          <Input
                            type="select"
                            id="reason_for_policy_cancellation"
                            value={formValues?.reason_for_policy_cancellation}
                            onChange={(e) =>
                              handleInputChange(
                                "reason_for_policy_cancellation",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select...</option>
                            <option value="NOT_VALUES_YET">
                              Not Values Yet
                            </option>
                          </Input>
                        </FormGroup>
                      )}
                    </Col>
                  </Row>

                  {formValues?.will_this_policy_be_cancelled && (
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="policy_cancellation_notes">
                            Policy Cancellation Notes
                          </Label>
                          <Input
                            type="textarea"
                            id="policy_cancellation_notes"
                            value={formValues?.policy_cancellation_notes || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "policy_cancellation_notes",
                                e.target.value
                              )
                            }
                            rows={4}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label for="why_did_you_take_out_this_policy">
                          Why did you take out this policy?
                        </Label>
                        <Input
                          type="textarea"
                          id="why_did_you_take_out_this_policy"
                          placeholder="Why did you take out this policy?"
                          value={formValues?.why_did_you_take_out_this_policy}
                          onChange={(e) =>
                            handleInputChange(
                              "why_did_you_take_out_this_policy",
                              e.target.value
                            )
                          }
                          rows={4}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              )}
            </CardBody>
          </Card>
          <div className="d-flex justify-content-between gap-2">
            <div>
              {formValues?.have_any_existing_Protection_policies_in_place && (
                <Button
                  color="success"
                  className="border-success"
                  onClick={toggleModal}
                  disabled={session?.user?.user_type === "CLIENT"}
                >
                  Add new
                </Button>
              )}
            </div>
            <div className="d-flex gap-2">
              <Button
                color="primary"
                type="submit"
                disabled={session?.user?.user_type === "CLIENT"}
              >
                {isUpdateLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                color="secondary"
                onClick={async (e) => {
                  if (session?.user?.user_type === "CLIENT") {
                    handleNextTab();
                  } else {
                    await handleUpdate(e);
                    handleNextTab();
                  }
                }}
              >
                {session?.user?.user_type === "CLIENT"
                  ? "Go To Next"
                  : "Save & Next"}
              </Button>
            </div>
          </div>
        </Form>
        <AddExistingProtectionModal
          isOpen={isModalOpen}
          toggle={toggleModal}
          existingProtectionData={formValues}
        />
      </>
    </div>
  );
};

export default ExistingProtectionContent;
