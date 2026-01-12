import { useAddCaseMutation } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { useGetUserListQuery } from "@/Redux/Reducers/CommonComponents/Cases/UserListApi";
import { useGetLeadDetailsQuery } from "@/Redux/Reducers/CommonComponents/CommonUsers/LeadsApi";
import { AddNewCaseModalProps } from "@/Types/CommonComponents/Cases/CaseTypes";
import { AdviserInfoProps } from "@/Types/CommonComponents/CommonUsers/AdviserTypes";
import { LeadsInfo } from "@/Types/CommonComponents/CommonUsers/LeadTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { getCaseUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
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
import AddLeadModal from "../../CommonUsers/Leads/Modals/AddLeadModal";

const AddNewCaseModal: React.FC<AddNewCaseModalProps> = ({
  isOpen,
  toggle,
  leadId,
  onCaseCreated,
}) => {
  const [leads, setLeads] = useState<LeadsInfo[]>([]);
  const [advisers, setAdvisers] = useState<AdviserInfoProps[]>([]);
  // Rtk query - request a large page_size so the select can show many leads
  const { data: leadData, refetch: refetchLeads } = useGetLeadDetailsQuery({
    page: 1,
    page_size: 1000,
  });
  const { data: userNetAdviserListData } = useGetUserListQuery({
    role: "NETWORK_ADVISER",
  });
  const { data: userOrgAdviserListData } = useGetUserListQuery({
    role: "ORGANISATION_ADVISER",
  });
  const { data: userOrgAdminListData } = useGetUserListQuery({
    role: "ORGANISATION_ADMIN",
  });
  const [addCaseDetails, { isLoading: addCaseLoading }] = useAddCaseMutation();

  const [formData, setFormData] = useState({
    lead: leadId || 0,
    case_category: "",
    assigned_to: "",
    assigned_to_admin: "",
    notes: "",
  });
  const [submitType, setSubmitType] = useState<"save" | "save_view">("save");

  const { data: session } = useSession();
  const userType = session?.user?.user_type;
  const router = useRouter();

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  const handleOpenAddLead = () => setIsAddLeadModalOpen(true);
  const handleCloseAddLead = () => {
    setIsAddLeadModalOpen(false);
    // Refetch leads after closing the add-lead modal to refresh the list
    try {
      refetchLeads();
    } catch (err) {
      console.error("Error refetching leads:", err);
    }
  };

  // Update formData.lead if leadId changes
  useEffect(() => {
    if (leadId) {
      setFormData((prev) => ({ ...prev, lead: leadId }));
    }
  }, [leadId]);

  // Fetch leads data from backend (handle array, `leads` or paginated `results`)
  useEffect(() => {
    if (leadData) {
      if (Array.isArray(leadData)) {
        setLeads(leadData || []);
      } else if ((leadData as any).results) {
        setLeads((leadData as any).results || []);
      } else if ((leadData as any).leads) {
        setLeads((leadData as any).leads || []);
      } else {
        setLeads([]);
      }
    }
  }, [leadData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "lead" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addCaseDetails({
        payload: formData,
      });
      if (result.data) {
        toast.success("Case added successfully!");
        const alias = result.data.alias;
        // If user chose Save and Add View, navigate to the case page
        if (submitType === "save_view" && alias) {
          // Close modal then navigate
          toggle();
          handleCaseCreated(alias);
          return;
        }
        // Default: reset form and close
        setFormData({
          lead: leadId || 0,
          case_category: "",
          assigned_to: "",
          assigned_to_admin: "",
          notes: "",
        });
        toggle();
        if (onCaseCreated && alias) {
          handleCaseCreated(alias);
        }
      } else {
        toast.error("Invalid Request...");
      }
    } catch (error) {
      console.error("Error during request setup:", error);
    }
  };

  const handleCaseCreated = (caseAlias: string) => {
    toggle();
    // Redirect to the new case page
    router.push(getCaseUrl(caseAlias, userType as string));
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">
          {!!leadId ? "Continue to Case" : "Create New Case"}
        </h3>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="lead">
              Lead<span className="text-danger">*</span>
            </Label>
            <Input
              id="lead"
              name="lead"
              type="select"
              required
              value={formData.lead}
              onChange={handleChange}
              disabled={!!leadId}
            >
              <option value="">Select...</option>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <option key={lead.user.id} value={lead.user.id}>
                    {`${
                      lead.user?.title
                        ? formatChoiceFieldValue(lead.user.title) + " "
                        : ""
                    }${lead.user?.first_name}${
                      lead.user?.middle_name ? " " + lead.user.middle_name : ""
                    } ${lead.user?.last_name}`}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No leads available
                </option>
              )}
            </Input>
            {/* {leads.length === 0 && ( */}
            <div className="mt-2">
              <Button
                size="sm"
                color="primary"
                onClick={handleOpenAddLead}
                toggle={toggle}
              >
                <TbCirclePlus size={16} className="me-1" />
                Add Lead
              </Button>
            </div>
            {/* )} */}
          </FormGroup>
          <FormGroup>
            <Label for="case_category">
              Case Category<span className="text-danger">*</span>
            </Label>
            <Input
              id="case_category"
              name="case_category"
              type="select"
              required
              value={formData.case_category}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="MORTGAGE">Mortgage</option>
              <option value="PROTECTION">Protection</option>
              <option value="GENERAL_INSURANCE">General Insurance</option>
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
                onChange={handleChange}
              >
                <option value="">Select...</option>
                {userNetAdviserListData?.length > 0 ? (
                  userNetAdviserListData?.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {`${
                        user?.title
                          ? formatChoiceFieldValue(user.title) + " "
                          : ""
                      }${user?.first_name}${
                        user?.middle_name ? " " + user.middle_name : ""
                      } ${user?.last_name}`}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
              id="notes"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {!leadId && (
            <Button
              type="submit"
              color="primary"
              disabled={addCaseLoading}
              onClick={() => setSubmitType("save")}
            >
              {addCaseLoading ? "Saving..." : "Save Case"}
            </Button>
          )}
          <Button
            type="submit"
            color="secondary"
            disabled={addCaseLoading}
            onClick={() => setSubmitType("save_view")}
          >
            {addCaseLoading ? "Saving..." : "Save and Case View"}
          </Button>
          <Button
            type="button"
            color="warning"
            onClick={toggle}
            disabled={addCaseLoading}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Form>
      <AddLeadModal isOpen={isAddLeadModalOpen} toggle={handleCloseAddLead} />
    </Modal>
  );
};

export default AddNewCaseModal;
