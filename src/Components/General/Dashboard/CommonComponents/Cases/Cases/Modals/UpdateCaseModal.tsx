import { useUpdateCaseMutation } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { useGetAdviserDetailsQuery } from "@/Redux/Reducers/CommonComponents/Directors/AdviserDetailsApi";
import {
  CaseInfoPrpos,
  UpdateCaseModalProps,
} from "@/Types/CommonComponents/Cases/CaseTypes";
import { AdviserInfoProps } from "@/Types/CommonComponents/Directors/AdviserTypes";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const UpdateCaseModal: React.FC<UpdateCaseModalProps> = ({
  isOpen,
  toggle,
  caseData,
}) => {
  const { data: session } = useSession();
  // Initialize formData with proper assigned_to mapping
  const getInitialFormData = (data: CaseInfoPrpos | null) => {
    if (!data) return null;
    return {
      ...data,
      assigned_to: data.assigned_user?.id?.toString() || data.assigned_to || "",
    };
  };

  const [formData, setFormData] = useState<CaseInfoPrpos | null>(
    getInitialFormData(caseData)
  );
  const [advisers, setAdvisers] = useState<AdviserInfoProps[]>([]);

  const [updateCaseDetails, { isLoading: isUpdating }] =
    useUpdateCaseMutation();
  const { data: adviserData } = useGetAdviserDetailsQuery(undefined);

  // Compare current data with the original data
  const hasChanges =
    formData && caseData
      ? JSON.stringify(formData) !== JSON.stringify(caseData)
      : false;

  useEffect(() => {
    if (caseData) {
      // Set formData and ensure assigned_to reflects the current assigned_user
      setFormData(getInitialFormData(caseData));
    }
  }, [caseData]);

  // Fetch adviser data from backend
  useEffect(() => {
    if (adviserData) {
      const advisersList = Array.isArray(adviserData)
        ? adviserData
        : adviserData.advisers;
      setAdvisers(advisersList || []);
    }
  }, [adviserData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await updateCaseDetails({
        caseAlias: caseData?.alias,
        payload: formData,
      });
      if (res.data) {
        toast.success("Case updated successfully.");
        toggle();
      } else if (res.error) {
        const errorMessage =
          (res.error as any)?.data?.detail ||
          "Failed to update the case. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error updating case:", error);
      toast.error("Failed to update the case. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Update Case</ModalHeader>
      <ModalBody>
        {formData ? (
          <Form>
            <FormGroup>
              <Label for="case_category">Case Category</Label>
              <Input
                type="select"
                name="case_category"
                id="case_category"
                value={formData?.case_category || ""}
                onChange={handleInputChange}
              >
                <option value="">Select...</option>
                <option value="MORTGAGE">Mortgage</option>
                <option value="PROTECTION">Protection</option>
                <option value="GENERAL_INSURANCE">General Insurance</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="case_stage">Case Stage</Label>
              <Input
                type="select"
                name="case_stage"
                id="case_stage"
                value={formData?.case_stage || ""}
                onChange={handleInputChange}
              >
                <option value="">Select...</option>
                <option value="ENQUIRY">Enquiry</option>
                <option value="FACT_FIND">Fact Find</option>
                <option value="RESEARCH_COMPLIANCE_CHECK">
                  Research and Compliance Check
                </option>
                <option value="DECISION_IN_PRINCIPLE">
                  Decision in Principle
                </option>
                <option value="FULL_MORTGAGE_APPLICATION">
                  Full Mortgage Application
                </option>
                <option value="OFFER_FROM_BANK">Offer From Bank</option>
                <option value="LEGAL">Legal</option>
                <option value="COMPLETION">Completion</option>
                <option value="FUTURE_OPPORTUNITY">Future Opportunity</option>
                <option value="NOT_PROCEED">Not Proceed</option>
              </Input>
            </FormGroup>
            {(session?.user?.user_type === "ORGANIZATION_ADMIN" ||
              session?.user?.user_type === "NETWORK_ADMIN") && (
              <FormGroup>
                <Label for="adviser">Assign Adviser</Label>
                <Input
                  id="adviser"
                  name="assigned_to"
                  type="select"
                  value={formData?.assigned_to || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  {advisers.length > 0 ? (
                    advisers.map((adviser) => (
                      <option key={adviser.user.id} value={adviser.user.id}>
                        {`${
                          adviser.user?.title
                            ? adviser.user.title.charAt(0).toUpperCase() +
                              adviser.user.title.slice(1).toLowerCase() +
                              ". "
                            : ""
                        }${adviser.user?.first_name}${
                          adviser.user?.middle_name
                            ? " " + adviser.user.middle_name
                            : ""
                        } ${adviser.user?.last_name}`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No advisers available
                    </option>
                  )}
                </Input>
              </FormGroup>
            )}
            <FormGroup>
              <Label for="notes">Notes</Label>
              <Input
                type="textarea"
                name="notes"
                id="notes"
                value={formData?.notes || ""}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Form>
        ) : (
          <div className="text-center p-3">
            <p>Loading case data...</p>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={!hasChanges || isUpdating || !formData}
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={isUpdating}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateCaseModal;
