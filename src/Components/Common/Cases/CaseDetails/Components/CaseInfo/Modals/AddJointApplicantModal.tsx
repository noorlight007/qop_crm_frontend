import AddLeadModal from "@/Components/Common/CommonUsers/LeadsOrClients/Modals/AddLeadModal";
import { useAddJointApplicantInfoMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/JointApplicant/JointApplicantApi";
import { useLeadOrClientFilterListQuery } from "@/Redux/Reducers/Common/Cases/UserFiltersListApi";
import { AddJointApplicantModalProps } from "@/Types/Common/Cases/CaseDetails/JointApplicant/JointApplicantTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "react-feather";
import { TbCirclePlus } from "react-icons/tb";
import Select, { components } from "react-select";
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

// ─── Local option type (value = alias string) ────────────────────────────────
type JointLeadOption = {
  value: string; // alias
  label: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  user_type?: string | null;
  profile_image?: string | null;
};

// ─── Default (empty) form state ───────────────────────────────────────────────
const DEFAULT_FORM = {
  customer_alias: "",
  relationship: "",
  other_relationship: "",
  notes: "",
};

// ─── Component ────────────────────────────────────────────────────────────────
const AddJointApplicantModal: React.FC<AddJointApplicantModalProps> = ({
  isOpen,
  toggle,
}) => {
  const params = useParams();
  const { casealias } = params;

  // ── Lead search state ──────────────────────────────────────────────────────
  const [leads, setLeads] = useState<any[]>([]);
  const [leadSearchInput, setLeadSearchInput] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  const handleOpenAddLead = () => setIsAddLeadModalOpen(true);

  const {
    data: leadOrClientListData,
    isFetching: isFetchingLeads,
    refetch: refetchLeads,
  } = useLeadOrClientFilterListQuery({
    search: leadSearch || undefined,
    case_alias: casealias,
  });

  // ── API mutation ───────────────────────────────────────────────────────────
  const [addJointApplicantInfo, { isLoading: isAddingJointApplicant }] =
    useAddJointApplicantInfoMutation(undefined);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Sync leads list from API response ─────────────────────────────────────
  useEffect(() => {
    if (!leadOrClientListData) return;

    if (Array.isArray(leadOrClientListData)) {
      setLeads(leadOrClientListData);
    } else if ((leadOrClientListData as any).results) {
      setLeads((leadOrClientListData as any).results);
    } else if ((leadOrClientListData as any).leads) {
      setLeads((leadOrClientListData as any).leads);
    } else {
      setLeads([]);
    }
  }, [leadOrClientListData]);

  // ── Clear errors when modal closes ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) setErrors({});
  }, [isOpen]);

  // ── Debounce lead search input ─────────────────────────────────────────────
  useEffect(() => {
    const id = setTimeout(() => {
      setLeadSearch(leadSearchInput.trim());
    }, 350);
    return () => clearTimeout(id);
  }, [leadSearchInput]);

  // ── Build select options (value = alias) ──────────────────────────────────
  const leadOptions: JointLeadOption[] = (leads || [])
    .map((lead: any) => {
      const user = lead?.user ?? lead;
      const alias = user?.alias ?? lead?.alias;
      if (!alias) return null;

      return {
        value: String(alias),
        label: user?.name || lead?.name || "—",
        name: user?.name || lead?.name || "—",
        email: user?.email || lead?.email || null,
        phone:
          user?.phone ||
          lead?.phone ||
          user?.mobile ||
          lead?.mobile ||
          user?.mobile_number ||
          lead?.mobile_number ||
          null,
        role:
          user?.role ||
          lead?.role ||
          user?.user_type ||
          lead?.user_type ||
          null,
        user_type: user?.user_type || lead?.user_type || null,
        profile_image: user?.profile_image || lead?.profile_image || null,
      };
    })
    .filter(Boolean) as JointLeadOption[];

  const selectedLeadOption =
    leadOptions.find((opt) => opt.value === formData.customer_alias) || null;

  // ── Custom dropdown option (avatar + name + role + email) ─────────────────
  const CustomOption = (props: any) => {
    const { data } = props;
    const displayRole = data?.role || data?.user_type;
    return (
      <components.Option {...props}>
        <div className="d-flex align-items-center gap-2">
          <div
            className="flex-shrink-0"
            style={{
              width: 40,
              height: 40,
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
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                  fontSize: 14,
                  color: "var(--body-font-color)",
                  marginBottom: 2,
                }}
              >
                {data.name}
              </div>
              {displayRole && (
                <span
                  style={{
                    backgroundColor:
                      displayRole === "CLIENT"
                        ? "var(--bg-light-primary)"
                        : "var(--bg-light-secondary)",
                    color:
                      displayRole === "CLIENT"
                        ? "var(--info-color)"
                        : "var(--warning-color)",
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {formatChoiceFieldValue(displayRole) || ""}
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--font-color)",
                display: "flex",
                gap: 8,
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

  // ── Custom selected-value display ─────────────────────────────────────────
  const CustomSingleValue = (props: any) => {
    const { data } = props;
    const displayRole = data?.role || data?.user_type;
    return (
      <components.SingleValue {...props}>
        <div className="d-flex align-items-center gap-2">
          <div
            className="flex-shrink-0"
            style={{
              width: 32,
              height: 32,
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
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <User size={16} color="var(--font-color)" />
            )}
          </div>
          <div>
            <div
              style={{ fontWeight: 600, fontSize: 14 }}
              className="d-flex gap-2"
            >
              <div>{data.name}</div>
              {displayRole && (
                <span
                  style={{
                    backgroundColor:
                      displayRole === "CLIENT"
                        ? "var(--bg-light-primary)"
                        : "var(--bg-light-secondary)",
                    color:
                      displayRole === "CLIENT"
                        ? "var(--info-color)"
                        : "var(--warning-color)",
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {formatChoiceFieldValue(displayRole) || ""}
                </span>
              )}
            </div>
            {data.email && (
              <div style={{ fontSize: 11, color: "var(--font-color)" }}>
                {data.email}
              </div>
            )}
          </div>
        </div>
      </components.SingleValue>
    );
  };

  // ── Generic input change handler ───────────────────────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  // ── Error helpers (mirrors AddNewCaseModal pattern) ────────────────────────
  const sanitize = (s: string) => (s || "").replace(/^\s*\d+,\s*/g, "").trim();

  const toCamel = (key: string) =>
    key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

  const flattenErrors = (value: any, path = ""): Record<string, string> => {
    const out: Record<string, string> = {};
    if (value == null) return out;
    if (typeof value === "string") {
      out[path || ""] = sanitize(value);
      return out;
    }
    if (Array.isArray(value)) {
      out[path || ""] = sanitize(
        value
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .join(", "),
      );
      return out;
    }
    if (typeof value === "object") {
      for (const k of Object.keys(value)) {
        const v = value[k];
        const newPath = path ? `${path}.${k}` : k;
        if (typeof v === "string" || Array.isArray(v)) {
          out[newPath] = sanitize(
            Array.isArray(v)
              ? v
                  .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
                  .join(", ")
              : v,
          );
        } else {
          Object.assign(out, flattenErrors(v, newPath));
        }
      }
    }
    return out;
  };

  const getErrorMessage = (err: any): string => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (typeof err?.data === "string") return err.data;
    try {
      if (err?.data?.message) return String(err.data.message);
      if (err?.message) return String(err.message);
    } catch {}
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const clientErrors: Record<string, string> = {};
    if (!formData.customer_alias)
      clientErrors.customer_alias = "Please select an applicant.";
    if (!formData.relationship)
      clientErrors.relationship = "Please select a relationship.";
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    const payload = {
      customer_alias: formData.customer_alias,
      relationship: formData.relationship,
      other_relationship: formData.other_relationship,
      notes: formData.notes,
    };

    const res = await addJointApplicantInfo({
      case_alias: casealias,
      jointuserInfo: payload,
    });

    if (res.data) {
      setErrors({});
      toast.success("Joint applicant added successfully!");
      setFormData(DEFAULT_FORM);
      setLeadSearchInput("");
      setLeadSearch("");
      toggle();
    } else if ("error" in res) {
      const apiErr: any = (res as any).error;
      const dataErrors = apiErr?.data?.errors ?? apiErr?.data ?? apiErr;

      try {
        const flat = flattenErrors(dataErrors);
        const normalized: Record<string, string> = {};
        Object.entries(flat).forEach(([k, v]) => {
          const parts = k.split(".").filter(Boolean);
          const last = parts[parts.length - 1];
          normalized[toCamel(last)] = v;
        });
        if (Object.keys(normalized).length) {
          setErrors(normalized);
          toast.error(Object.values(normalized)[0]);
          return;
        }
      } catch (parseErr) {
        console.error("Error parsing validation errors", parseErr);
      }

      toast.error(
        getErrorMessage(res.error) || "Failed to add joint applicant.",
      );
    }
  };

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

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add Joint Applicant</span>
      </ModalHeader>

      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            {/* ── Applicant search-select ── */}

            <FormGroup>
              <Label for="lead">
                Applicant<span className="text-danger">*</span>
              </Label>
              <Select<JointLeadOption>
                inputId="lead"
                name="customer_alias"
                placeholder="Search by name, email or phone..."
                isClearable
                isSearchable
                isLoading={isFetchingLeads}
                options={leadOptions}
                value={selectedLeadOption}
                filterOption={() => true} // filtering is done server-side
                onChange={(opt) => {
                  // Keep the selected lead in the local list so it stays
                  // visible even when the search term changes.
                  if (opt) {
                    setLeads((prev) => {
                      const exists = (prev || []).some((l: any) => {
                        const a = l?.alias ?? l?.user?.alias;
                        return String(a) === String(opt.value);
                      });
                      if (exists) return prev;
                      return [
                        ...(prev || []),
                        {
                          alias: opt.value,
                          name: opt.name,
                          email: opt.email,
                          phone: opt.phone,
                          user_type: opt.user_type,
                          profile_image: opt.profile_image,
                        },
                      ];
                    });
                  }

                  setFormData((prev) => ({
                    ...prev,
                    customer_alias: opt?.value ?? "",
                  }));

                  // Reset search so the selected label renders cleanly.
                  setLeadSearchInput("");
                  setLeadSearch("");

                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.customer_alias;
                    return copy;
                  });
                }}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change") {
                    setLeadSearchInput(inputValue || "");
                  }
                  if (
                    action === "set-value" ||
                    action === "menu-close" ||
                    action === "input-blur"
                  ) {
                    setLeadSearchInput("");
                    setLeadSearch("");
                  }
                }}
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
              {errors.customer_alias && (
                <div className="text-danger small mt-1">
                  {errors.customer_alias}
                </div>
              )}
              <div className="mt-2">
                <Button size="sm" color="primary" onClick={handleOpenAddLead}>
                  <TbCirclePlus size={16} className="me-1" />
                  Add Applicant
                </Button>
              </div>
            </FormGroup>

            {/* ── Relationship ── */}

            <FormGroup>
              <Label for="relationship">
                Relationship<span className="text-danger">*</span>
              </Label>
              <Input
                type="select"
                name="relationship"
                id="relationship"
                value={formData.relationship}
                onChange={handleInputChange}
              >
                <option value="">Select...</option>
                <option value="SPOUSE">Spouse</option>
                <option value="SIBLING">Sibling</option>
                <option value="OTHER">Other</option>
              </Input>
              {errors.relationship && (
                <div className="text-danger small mt-1">
                  {errors.relationship}
                </div>
              )}
            </FormGroup>

            {/* ── Other relationship (conditional) ── */}
            {formData.relationship === "OTHER" && (
              <FormGroup>
                <Label for="other_relationship">Other Relationship</Label>
                <Input
                  type="text"
                  name="other_relationship"
                  id="other_relationship"
                  value={formData.other_relationship}
                  onChange={handleInputChange}
                  placeholder="Specify other relationship"
                />
                {errors.other_relationship && (
                  <div className="text-danger small mt-1">
                    {errors.other_relationship}
                  </div>
                )}
              </FormGroup>
            )}

            {/* ── Notes ── */}
            <Col>
              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input
                  type="textarea"
                  id="notes"
                  name="notes"
                  placeholder="Enter notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
                {errors.notes && (
                  <div className="text-danger small mt-1">{errors.notes}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            color="warning"
            onClick={toggle}
            disabled={isAddingJointApplicant}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={isAddingJointApplicant}
          >
            {isAddingJointApplicant ? "Saving..." : "Save Joint Applicant"}
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

export default AddJointApplicantModal;
