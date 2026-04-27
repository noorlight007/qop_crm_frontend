import { useAddCaseMutation } from "@/Redux/Reducers/Common/Cases/CasesApi";
import {
  useGetUserListQuery,
  useLeadOrClientFilterListQuery,
} from "@/Redux/Reducers/Common/Cases/UserFiltersListApi";
import {
  AddNewCaseModalProps,
  LeadOptionType,
} from "@/Types/Common/Cases/CaseTypes";
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
import AddOrgLeadModal from "../../Leads/Modals/AddOrgLeadModal";


const AddOrgNewCaseModal: React.FC<AddNewCaseModalProps> = ({
  isOpen,
  toggle,
  leadId,
  leadName,
  leadData,
  onCaseCreated,
}) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [leadSearchInput, setLeadSearchInput] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const {
    data: leadOrClientListData,
    refetch: refetchLeads,
    isFetching: isFetchingLeads,
  } = useLeadOrClientFilterListQuery({
    search: leadSearch || undefined,
  });
  const { data: adviserListData } = useGetUserListQuery({
    role: "ADVISER",
  });
  const { data: adminListData } = useGetUserListQuery({
    role: "ADMIN",
  });
  const [addCaseDetails, { isLoading: addCaseLoading }] = useAddCaseMutation();

  const [formData, setFormData] = useState({
    customer_id: leadId || 0,
    case_category: "",
    assigned_to: "",
    assigned_to_admin: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<"save" | "save_view" | null>(
    null,
  );
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const isNetwork = session?.user?.is_network;
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
      customer_id: newLeadId,
    }));

    handleCloseAddLead();
  };

  // Update formData.customer_id if leadId changes
  useEffect(() => {
    if (leadId) {
      setFormData((prev) => ({ ...prev, customer_id: leadId }));
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

      // Prefer using leadData (returned from create lead) when present so
      // the select shows email, user_type and profile_image immediately.
      let leadToAdd: any;
      if (leadData) {
        leadToAdd = leadData.user || leadData;
        // Ensure name exists (compose from parts if necessary)
        if (!leadToAdd.name) {
          const parts = [
            leadToAdd.title,
            leadToAdd.first_name,
            leadToAdd.middle_name,
            leadToAdd.last_name,
          ].filter(Boolean);
          leadToAdd = { ...leadToAdd, name: parts.join(" ") };
        }
      } else {
        const displayName = leadName || "Selected Lead";
        leadToAdd = {
          id: leadId,
          name: displayName,
          email: null,
          user_type: null,
          profile_image: null,
        };
      }

      return [...(prev || []), leadToAdd];
    });

    // also ensure the form selects the created lead
    setFormData((prev) => ({ ...prev, customer_id: leadId }));
  }, [leadId, leadName, leadData]);

  // Fetch leads data from backend (handle array, `leads` or paginated `results`)
  useEffect(() => {
    if (leadOrClientListData) {
      if (Array.isArray(leadOrClientListData)) {
        setLeads(leadOrClientListData || []);
      } else if ((leadOrClientListData as any).results) {
        setLeads((leadOrClientListData as any).results || []);
      } else if ((leadOrClientListData as any).leads) {
        setLeads((leadOrClientListData as any).leads || []);
      } else {
        setLeads([]);
      }
    }
  }, [leadOrClientListData]);

  useEffect(() => {
    if (!isOpen) {
      setFormErrors({});
    }
  }, [isOpen]);

  // Debounce Lead/Client search to avoid triggering an API call per keystroke.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLeadSearch(leadSearchInput.trim());
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [leadSearchInput]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "customer_id" ? Number(value) : value,
    });
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev } as Record<string, string>;
        delete (copy as any)[name];
        return copy;
      });
    }
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
              /* theme-aware avatar background */
              backgroundColor: "var(--light-color)",
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
              <User size={20} color="var(--font-color)" />
            )}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between">
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--body-font-color)",
                  marginBottom: "2px",
                }}
              >
                {data.name}
              </div>
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "var(--font-color)",
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
              backgroundColor: "var(--light-color)",
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
              <User size={16} color="var(--font-color)" />
            )}
          </div>
          <div>
            <div
              style={{ fontWeight: 600, fontSize: "14px" }}
              className="d-flex gap-2"
            >
              <div>{data.name}</div>
            </div>
            {data.email && (
              <div style={{ fontSize: "11px", color: "var(--font-color)" }}>
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

      const name = user?.name || lead?.name || "Loading...";
      const email = user?.email || lead?.email;
      const phone =
        user?.phone ||
        lead?.phone ||
        user?.mobile ||
        lead?.mobile ||
        user?.mobile_number ||
        lead?.mobile_number ||
        user?.phone_number ||
        lead?.phone_number ||
        null;
      const userType = user?.user_type || lead?.user_type;
      const role = user?.role || lead?.role || userType;
      const profileImage = user?.profile_image || lead?.profile_image;

      return {
        value: Number(id),
        label: name,
        name: name,
        email: email,
        phone: phone,
        role: role,
        user_type: userType,
        profile_image: profileImage,
      };
    })
    .filter(Boolean) as LeadOptionType[];

  const selectedLeadOption =
    leadOptions.find((opt) => opt.value === Number(formData.customer_id)) ||
    null;

  const handleSubmit = async (submitType: "save" | "save_view") => {
    // Reset previous errors and perform client-side validation
    setFormErrors({});
    const errors: Record<string, string> = {};
    if (!formData.customer_id)
      errors.customer_id = "Please select a Lead/Client.";
    if (!formData.case_category)
      errors.case_category = "Please select a Case Category.";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(submitType);

    try {
      const result = await addCaseDetails({ payload: formData });
      if ((result as any).data) {
        setFormErrors({});
        toast.success("Case added successfully!");
        const alias = (result as any).data.alias;
        if (submitType === "save_view" && alias) {
          toggle();
          handleCaseCreated(alias);
          return;
        }
        setFormData({
          customer_id: leadId || 0,
          case_category: "",
          assigned_to: "",
          assigned_to_admin: "",
          notes: "",
        });
        toggle();
        if (onCaseCreated && alias) {
          handleCaseCreated(alias);
        }
      } else if ((result as any).error) {
        const apiError: any = (result as any).error;
        const fieldErrors: Record<string, string> = {};
        const data = apiError?.data || apiError || {};
        if (data?.errors && typeof data.errors === "object") {
          Object.keys(data.errors).forEach((k) => {
            const v = data.errors[k];
            fieldErrors[k] = Array.isArray(v) ? v.join(" ") : String(v);
          });
        } else if (data && typeof data === "object") {
          Object.keys(data).forEach((k) => {
            const v = (data as any)[k];
            if (Array.isArray(v)) {
              fieldErrors[k] = v.join(" ");
            } else if (typeof v === "string") {
              fieldErrors[k] = v;
            }
          });
        }
        if (Object.keys(fieldErrors).length > 0) {
          setFormErrors(fieldErrors);
        } else {
          const msg =
            data?.detail ||
            data?.message ||
            apiError?.message ||
            "Invalid Request";
          toast.error(typeof msg === "string" ? msg : "Invalid Request");
        }
      } else {
        toast.error("Invalid Request...");
      }
    } catch (error: any) {
      console.error("Error during request setup:", error);
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setSubmitting(null);
    }
  };

  const handleCaseCreated = (caseAlias: string) => {
    toggle();
    // Redirect to the new case page
    router.push(getCaseUrl(caseAlias, userRole as string, isNetwork));
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
              Applicant<span className="text-danger">*</span>
            </Label>
            <Select<LeadOptionType>
              inputId="lead"
              name="customer_id"
              placeholder="Search by name, email or phone..."
              isClearable
              isSearchable
              isDisabled={!!leadId}
              isLoading={isFetchingLeads}
              options={leadOptions}
              value={selectedLeadOption}
              filterOption={() => true}
              onChange={(opt) => {
                const selectedValue = opt?.value ? Number(opt.value) : 0;

                if (opt?.value) {
                  setLeads((prev) => {
                    const exists = (prev || []).some((l: any) => {
                      const existingId = l?.id ?? l?.user?.id;
                      return Number(existingId) === Number(opt.value);
                    });
                    if (exists) return prev;

                    return [
                      ...(prev || []),
                      {
                        id: Number(opt.value),
                        name: opt.name,
                        email: opt.email,
                        phone: (opt as any).phone,
                        user_type: opt.user_type,
                        profile_image: opt.profile_image,
                      },
                    ];
                  });
                }

                setFormData((prev) => ({
                  ...prev,
                  customer_id: selectedValue,
                }));

                setLeadSearchInput("");
                setLeadSearch("");

                setFormErrors((prev) => {
                  const copy = { ...prev } as Record<string, string>;
                  delete copy.customer_id;
                  return copy;
                });
              }}
              onInputChange={(inputValue, { action }) => {
                if (action === "input-change") {
                  setLeadSearchInput(inputValue || "");
                }

                // Clear stale search on any non-typing action
                if (
                  action === "set-value" ||
                  action === "menu-close" ||
                  action === "input-blur"
                ) {
                  setLeadSearchInput("");
                  setLeadSearch("");
                }
              }}
              // ✅ This is the key fix: clear search when menu closes without a selection
              onMenuClose={() => {
                setLeadSearchInput("");
                setLeadSearch("");
              }}
              components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
              }}
              classNamePrefix="lead-select"
              className="lead-select"
              noOptionsMessage={() =>
                isFetchingLeads
                  ? "Loading..."
                  : leadSearchInput
                    ? "No matches found"
                    : "No leads available"
              }
            />
            {formErrors.customer_id && (
              <div className="text-danger small mt-1">
                {formErrors.customer_id}
              </div>
            )}
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
            {formErrors.case_category && (
              <div className="text-danger small mt-1">
                {formErrors.case_category}
              </div>
            )}
          </FormGroup>
          {(session?.user?.role === "DIRECTOR" ||
            session?.user?.role === "ADVISER" ||
            session?.user?.role === "COMPLIANCE") && (
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
                {adviserListData?.length > 0 ? (
                  adviserListData?.map((user: any) => (
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
              {formErrors.assigned_to && (
                <div className="text-danger small mt-1">
                  {formErrors.assigned_to}
                </div>
              )}
            </FormGroup>
          )}

          {!session?.user?.is_network &&
            (session?.user?.role === "DIRECTOR" ||
              session?.user?.role === "ADVISER" ||
              session?.user?.role === "ADMIN") && (
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
                  {adminListData?.length > 0 ? (
                    adminListData?.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No admins available
                    </option>
                  )}
                </Input>
                {formErrors.assigned_to_admin && (
                  <div className="text-danger small mt-1">
                    {formErrors.assigned_to_admin}
                  </div>
                )}
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
            {formErrors.notes && (
              <div className="text-danger small mt-1">{formErrors.notes}</div>
            )}
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
              {addCaseLoading && submitting === "save"
                ? "Saving..."
                : "Save Case"}
            </Button>
          )}
          <Button
            type="button"
            color="secondary"
            disabled={addCaseLoading}
            onClick={() => handleSubmit("save_view")}
          >
            {addCaseLoading && submitting === "save_view"
              ? "Saving..."
              : "Save and View Case"}
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
      <AddOrgLeadModal
        isOpen={isAddLeadModalOpen}
        toggle={handleCloseAddLead}
        onLeadCreated={handleLeadCreated}
        header="Lead"
      />
    </Modal>
  );
};

export default AddOrgNewCaseModal;
