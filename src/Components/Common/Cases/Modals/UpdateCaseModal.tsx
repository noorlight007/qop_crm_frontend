import { useUpdateCaseMutation } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { useGetUserListQuery } from "@/Redux/Reducers/CommonComponents/Cases/UserListApi";
import {
  CaseInfoPrpos,
  UpdateCaseModalProps,
} from "@/Types/CommonComponents/Cases/CaseTypes";
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
      assigned_to_admin:
        data.assigned_admin?.id?.toString() || data.assigned_to_admin || "",
    };
  };

  const [formData, setFormData] = useState<CaseInfoPrpos | null>(
    getInitialFormData(caseData),
  );

  const [updateCaseDetails, { isLoading: isUpdating }] =
    useUpdateCaseMutation();

  const { data: userNetAdviserListData } = useGetUserListQuery({
    role: "NETWORK_ADVISER",
  });
  const { data: userOrgAdviserListData } = useGetUserListQuery({
    role: "ORGANISATION_ADVISER",
  });
  const { data: userOrgAdminListData } = useGetUserListQuery({
    role: "ORGANISATION_ADMIN",
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Update Case</h3>
      </ModalHeader>
      <ModalBody>
        {formData ? (
          <Form>
            <FormGroup>
              <Label for="case_stage">Case Stage</Label>
              <Input
                type="select"
                name="case_stage"
                id="case_stage"
                value={formData?.case_stage || ""}
                onChange={handleInputChange}
              >
                {formData?.case_category === "MORTGAGE" ? (
                  <>
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
                    <option value="SUBMISSION">Submission</option>
                    <option value="OFFER_FROM_BANK">Offer From Bank</option>
                    <option value="LEGAL">Legal</option>
                    <option value="COMPLETION">Completion</option>
                    <option value="FUTURE_OPPORTUNITY">
                      Future Opportunity
                    </option>
                    <option value="NOT_PROCEED">Not Proceed</option>
                  </>
                ) : (
                  <>
                    <option value="">Select...</option>
                    <option value="ENQUIRY">Enquiry</option>
                    <option value="FACT_FIND">Fact Find</option>
                    <option value="SUBMISSION">Submission</option>
                    <option value="ACCEPT_WAITING_START_DATE">
                      Accept Awaiting Start Date
                    </option>
                    <option value="ACCEPTED_ON_RISK">Accepted on Risk</option>
                    <option value="FURTHER_MEDICAL_REQUIRED">
                      Further Medical Required
                    </option>
                    <option value="NOT_PROCEED">Not Proceed</option>
                  </>
                )}
              </Input>
            </FormGroup>

            {(session?.user?.user_type === "NETWORK_DIRECTOR" ||
              session?.user?.user_type === "NETWORK_ADVISER" ||
              session?.user?.user_type === "NETWORK_COMPLIANCE_ASSISTANT") && (
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
                  {userNetAdviserListData?.length > 0 ? (
                    userNetAdviserListData?.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user?.name}
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

            {(session?.user?.user_type === "ORGANISATION_DIRECTOR" ||
              session?.user?.user_type === "ORGANISATION_ADVISER" ||
              session?.user?.user_type === "ORGANISATION_ADMIN") && (
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
                  {userOrgAdviserListData?.length > 0 ? (
                    userOrgAdviserListData?.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
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

            {(session?.user?.user_type === "ORGANISATION_DIRECTOR" ||
              session?.user?.user_type === "ORGANISATION_ADVISER" ||
              session?.user?.user_type === "ORGANISATION_ADMIN") && (
              <FormGroup>
                <Label for="adviser">Assign Admin</Label>
                <Input
                  id="admin"
                  name="assigned_to_admin"
                  type="select"
                  value={formData?.assigned_to_admin || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  {userOrgAdminListData?.length > 0 ? (
                    userOrgAdminListData?.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
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
