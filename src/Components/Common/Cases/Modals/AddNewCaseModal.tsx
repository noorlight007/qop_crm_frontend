import { useAddCaseMutation } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { useGetUserListQuery } from "@/Redux/Reducers/Common/Cases/UserListApi";
import {
  AddNewCaseModalProps,
  LeadOptionType,
} from "@/Types/Common/Cases/CaseTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { getCaseUrl } from "@/utils/RedirectPaths";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { User } from "react-feather";
import { TbCirclePlus } from "react-icons/tb";
import Select, { components } from "react-select";
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
  leadName,
  onCaseCreated,
}) => {
  const [leads, setLeads] = useState<any[]>([]);
  const { data: userLEADListData, refetch: refetchLeads } = useGetUserListQuery(
    {
      role: ["LEAD", "CLIENT"],
    },
  );
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
  const handleLeadCreated = (createdLead: any) => {
    if (!createdLead) {
      handleCloseAddLead();
      return;
    }

    // Created lead from /leads will have shape matching LeadsInfo
    // i.e., { alias, user: { id, title, first_name, ... }, ... }
    const user = createdLead.user || createdLead;
    const newLeadId = user?.id;

    if (!newLeadId) {
      handleCloseAddLead();
      return;
    }

    // Optimistically add this user into the local leads list so the
    // dropdown can show it immediately, even before refetch completes.
    setLeads((prev) => {
      const exists = prev?.some((l: any) => {
        const existingId = l?.id ?? l?.user?.id;
        return existingId === newLeadId;
      });

      if (exists) return prev;

      return [...(prev || []), user];
    });

    // Set the form's selected lead to the newly created one.
    setFormData((prev) => ({
      ...prev,
      lead: newLeadId,
    }));

    handleCloseAddLead();
  };

  // Update formData.lead if leadId changes
  useEffect(() => {
    if (leadId) {
      setFormData((prev) => ({ ...prev, lead: leadId }));
    }
  }, [leadId]);

  // If a specific leadId/leadName is provided (e.g. from AddLeadModal),
  // ensure the local leads list contains it so the select can display
  // the real lead name immediately.
  useEffect(() => {
    if (!leadId) return;

    setLeads((prev) => {
      const exists = prev?.some((lead: any) => {
        const existingId = lead?.id ?? lead?.user?.id;
        return existingId === leadId;
      });

      if (exists) return prev;

      const displayName = leadName || "Selected Lead";

      const syntheticLead = {
        id: leadId,
        name: displayName,
        email: null,
        user_type: null,
        profile_image: null,
      };

      return [...(prev || []), syntheticLead];
    });
  }, [leadId, leadName]);

  // Fetch leads data from backend (handle array, `leads` or paginated `results`)
  useEffect(() => {
    if (userLEADListData) {
      if (Array.isArray(userLEADListData)) {
        setLeads(userLEADListData || []);
      } else if ((userLEADListData as any).results) {
        setLeads((userLEADListData as any).results || []);
      } else if ((userLEADListData as any).leads) {
        setLeads((userLEADListData as any).leads || []);
      } else {
        setLeads([]);
      }
    }
  }, [userLEADListData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "lead" ? Number(value) : value,
    });
  };

  // Custom Option Component for beautiful display
  const CustomOption = (props: any) => {
    const { data } = props;
    return (
      <components.Option {...props}>
        <div className="d-flex align-items-center gap-2">
          <div
            className="flex-shrink-0"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#e9ecef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {data.profile_image ? (
              <img
                src={data.profile_image}
                alt={data.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <User size={20} color="#6c757d" />
            )}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between">
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#2c3e50",
                  marginBottom: "2px",
                }}
              >
                {data.name}
              </div>
              {data.user_type && (
                <span
                  style={{
                    backgroundColor:
                      data.user_type === "CLIENT" ? "#d1ecf1" : "#fff3cd",
                    color: data.user_type === "CLIENT" ? "#0c5460" : "#856404",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {formatChoiceFieldValue(data.user_type) || ""}
                </span>
              )}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#6c757d",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {data.email && <span>📧 {data.email}</span>}
            </div>
          </div>
        </div>
      </components.Option>
    );
  };

  // Custom SingleValue Component for selected value
  const CustomSingleValue = (props: any) => {
    const { data } = props;
    return (
      <components.SingleValue {...props}>
        <div className="d-flex align-items-center gap-2">
          <div
            className="flex-shrink-0"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#e9ecef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {data.profile_image ? (
              <img
                src={data.profile_image}
                alt={data.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <User size={16} color="#6c757d" />
            )}
          </div>
          <div>
            <div
              style={{ fontWeight: 600, fontSize: "14px" }}
              className="d-flex gap-2"
            >
              <div>{data.name}</div>
              {data.user_type && (
                <span
                  style={{
                    backgroundColor:
                      data.user_type === "CLIENT" ? "#d1ecf1" : "#fff3cd",
                    color: data.user_type === "CLIENT" ? "#0c5460" : "#856404",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {formatChoiceFieldValue(data.user_type) || ""}
                </span>
              )}
            </div>
            {data.email && (
              <div style={{ fontSize: "11px", color: "#6c757d" }}>
                {data.email}
              </div>
            )}
          </div>
        </div>
      </components.SingleValue>
    );
  };

  const leadOptions: LeadOptionType[] = (leads || [])
    .map((lead: any) => {
      const user = lead?.user ?? lead;
      const id = user?.id ?? lead?.id;
      if (!id) return null;

      const name = user?.name || lead?.name || "Unnamed Lead";
      const email = user?.email || lead?.email;
      const userType = user?.user_type || lead?.user_type;
      const profileImage = user?.profile_image || lead?.profile_image;

      return {
        value: Number(id),
        label: name,
        name: name,
        email: email,
        user_type: userType,
        profile_image: profileImage,
      };
    })
    .filter(Boolean) as LeadOptionType[];

  const selectedLeadOption =
    leadOptions.find((opt) => opt.value === Number(formData.lead)) || null;

  const handleSubmit = async (submitType: "save" | "save_view") => {
    if (!formData.lead) {
      toast.error("Please select a Lead/Client.");
      return;
    }
    if (!formData.case_category) {
      toast.error("Please select a Case Category.");
      return;
    }
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
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("save");
        }}
      >
        <ModalBody>
          <FormGroup>
            <Label for="lead">
              Lead/Client<span className="text-danger">*</span>
            </Label>
            <Select<LeadOptionType>
              inputId="lead"
              name="lead"
              placeholder="Search by name, email or phone..."
              isClearable
              isSearchable
              isDisabled={!!leadId}
              options={leadOptions}
              value={selectedLeadOption}
              onChange={(opt) => {
                const selectedValue = opt?.value ? Number(opt.value) : 0;
                setFormData((prev) => ({
                  ...prev,
                  lead: selectedValue,
                }));
              }}
              components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
              }}
              classNamePrefix="lead-select"
              className="lead-select"
              noOptionsMessage={() =>
                leadOptions.length ? "No matches found" : "No leads available"
              }
            />
            <div className="mt-2">
              <Button size="sm" color="primary" onClick={handleOpenAddLead}>
                <TbCirclePlus size={16} className="me-1" />
                Add Lead
              </Button>
            </div>
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
            session?.user?.user_type === "NETWORK_COMPLIANCE") && (
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
              type="button"
              color="primary"
              disabled={addCaseLoading}
              onClick={() => handleSubmit("save")}
            >
              {addCaseLoading ? "Saving..." : "Save Case"}
            </Button>
          )}
          <Button
            type="button"
            color="secondary"
            disabled={addCaseLoading}
            onClick={() => handleSubmit("save_view")}
          >
            {addCaseLoading ? "Saving..." : "Save and View Case"}
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
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        toggle={handleCloseAddLead}
        onLeadCreated={handleLeadCreated}
      />
    </Modal>
  );
};

export default AddNewCaseModal;
