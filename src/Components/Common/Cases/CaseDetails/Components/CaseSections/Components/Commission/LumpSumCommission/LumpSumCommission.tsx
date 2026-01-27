import LoadingSpinner from "@/app/loading";
import {
  useGetLumpSumCommissionQuery,
  useUpdateLumpSumCommissionMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Commission/CommissionApi";
import {
  useGetInsuranceOverviewQuery,
  useGetInsurancePoliciesQuery,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/InsuranceOverview/InsuranceOverviewApi";
import {
  CommissionProps,
  LumpSumProps,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/CommissionTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { ArrowUpCircle } from "react-feather";
import { FaTrash } from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroupText,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import AddLumpSumCommissionModal from "./Modals/AddLumpSumCommissionModal";
import DeleteLumpSumCommissionModal from "./Modals/DeleteLumpSumCommissionModal";

const LumpSumCommission: React.FC<CommissionProps> = ({
  caseAlias,
  commissionAlias,
}) => {
  const { data: session } = useSession();
  const [isAddLumpSumCommissionModalOpen, setIsAddLumpSumCommissionModalOpen] =
    useState(false);

  const [lumps, setLumps] = useState<LumpSumProps[]>([]);
  const [activeTab, setActiveTab] = useState<string>("0");

  const case_alias = Array.isArray(caseAlias) ? caseAlias[0] : caseAlias;
  const commission_alias = commissionAlias ?? undefined;

  const {
    data: lumpSumCommissionData,
    isLoading,
    isError,
  } = useGetLumpSumCommissionQuery(
    { case_alias, commission_alias },
    { skip: !case_alias || !commission_alias },
  );

  const [updateLumpSumCommission, { isLoading: isUpdatingLump }] =
    useUpdateLumpSumCommissionMutation();

  const { data: insuranceOverviewData, isLoading: isLoadingOverview } =
    useGetInsuranceOverviewQuery({ case_alias }, { skip: !case_alias });

  // Handle both array and single object responses from API
  const overview = Array.isArray(insuranceOverviewData)
    ? insuranceOverviewData[0]
    : insuranceOverviewData;

  const { data: insurancePoliciesData, isLoading: isPoliciesLoading } =
    useGetInsurancePoliciesQuery(
      {
        case_alias,
        insurance_overview_alias: overview?.alias,
      },
      { skip: !case_alias || !overview?.alias },
    );

  const [policies, setPolicies] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLumpId, setSelectedLumpId] = useState<string | null>(null);
  const [selectedLumpIndex, setSelectedLumpIndex] = useState<number | null>(
    null,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // sanitize server messages like "400, ..."
  const sanitize = (s: string) => (s || "").replace(/^\s*\d+,\s*/g, "").trim();

  const toCamel = (key: string) =>
    key.replace(/_([a-z])/g, (_, c) => (c ? c.toUpperCase() : ""));

  const flattenErrors = (value: any, path = ""): Record<string, string> => {
    const out: Record<string, string> = {};
    if (value == null) return out;
    if (typeof value === "string") {
      out[path || ""] = sanitize(value);
      return out;
    }
    if (Array.isArray(value)) {
      const msgs = value
        .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
        .join(", ");
      out[path || ""] = sanitize(msgs);
      return out;
    }
    if (typeof value === "object") {
      for (const k of Object.keys(value)) {
        const v = value[k];
        const newPath = path ? `${path}.${k}` : k;
        if (typeof v === "string" || Array.isArray(v)) {
          const msgs = Array.isArray(v)
            ? v
                .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
                .join(", ")
            : v;
          out[newPath] = sanitize(msgs as string);
        } else {
          const child = flattenErrors(v, newPath);
          Object.assign(out, child);
        }
      }
    }
    return out;
  };

  const normalizeKeyWithIndex = (rawKey: string, idx: number) => {
    const parts = rawKey.split(".").filter(Boolean);
    // if first part is numeric, replace with current index
    if (/^\d+$/.test(parts[0])) parts[0] = String(idx);
    else parts.unshift(String(idx));
    const norm = parts.map((p) => (/^\d+$/.test(p) ? p : toCamel(p))).join(".");
    return norm;
  };

  const clearRowErrors = (index: number) =>
    setErrors((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(`${index}.`)) delete copy[k];
      });
      return copy;
    });

  const clearFieldError = (index: number, field: string) =>
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[`${index}.${field}`];
      // also try snake_case -> camelCase variant removal
      const snake = field.replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`);
      delete copy[`${index}.${snake}`];
      return copy;
    });

  const getErrorMessage = (err: any) => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (typeof err?.data === "string") return err.data;

    const collect = (value: any): string[] => {
      if (value == null) return [];
      if (typeof value === "string") return [value];
      if (Array.isArray(value))
        return value.map((v) =>
          typeof v === "string" ? v : JSON.stringify(v),
        );
      if (typeof value === "object") {
        try {
          return Object.values(value).flatMap((v) => collect(v));
        } catch {
          return [String(value)];
        }
      }
      return [String(value)];
    };

    if (err && typeof err === "object") {
      const msgs = collect(err);
      if (msgs.length) return msgs.join(", ");
    }

    if (err?.data?.message) return String(err.data.message);

    if (err?.data && typeof err.data === "object") {
      const msgs = collect(err.data);
      if (msgs.length) return msgs.join(", ");
    }

    if (err?.error) return String(err.error);
    if (err?.message) {
      if (/status code/i.test(err.message)) return "Server returned an error";
      return String(err.message);
    }

    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  // Move update logic out of JSX: re-usable handler
  const handleUpdateLump = async (lump: LumpSumProps, idx: number) => {
    try {
      const payload = {
        policy: lump.policy || null,
        commission_amount: parseFloat(lump.commissionAmount) || 0,
        date_received: lump.dateReceived || null,
        clawback_amount: parseFloat(lump.clawbackAmount) || 0,
        clawback_date: lump.clawbackDate || null,
      };

      await updateLumpSumCommission({
        case_alias: case_alias!,
        commission_alias: commission_alias!,
        lump_sum_alias: lump.id,
        lumpSumData: payload,
      }).unwrap();
      // Clear any row errors on success
      clearRowErrors(idx);
      toast.success("Lump sum commission updated successfully");
    } catch (err) {
      console.error("Failed to update lump sum", err);
      // Try to parse structured validation errors
      const e: any = err;
      const dataErrors = e?.data?.errors ?? e?.data ?? e;
      try {
        const flat = flattenErrors(dataErrors);
        const normalized: Record<string, string> = {};
        Object.entries(flat).forEach(([k, v]) => {
          const keyWithIndex = normalizeKeyWithIndex(k, idx);
          normalized[keyWithIndex] = v;
        });
        if (Object.keys(normalized).length) {
          setErrors((prev) => ({ ...prev, ...normalized }));
          const first = Object.values(normalized)[0];
          toast.error(getErrorMessage(first));
          return;
        }
      } catch (e2) {
        console.error("Error parsing validation errors", e2);
      }

      // Fallback general message
      const msg = getErrorMessage(err);
      toast.error(msg || "Failed to update lump sum commission");
    }
  };

  const openDeleteModal = (lumpId: string) => {
    const idx = lumps.findIndex((l) => l.id === lumpId);
    setSelectedLumpId(lumpId);
    setSelectedLumpIndex(idx !== -1 ? idx : null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedLumpId(null);
    setSelectedLumpIndex(null);
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    if (!insurancePoliciesData) return;
    const policyList = Array.isArray(insurancePoliciesData)
      ? insurancePoliciesData
      : [insurancePoliciesData];
    setPolicies(policyList);
  }, [insurancePoliciesData]);

  useEffect(() => {
    if (!lumpSumCommissionData) return;
    // API may return array of lump-sum objects
    const items: any[] = Array.isArray(lumpSumCommissionData)
      ? lumpSumCommissionData
      : [lumpSumCommissionData];
    const mapped: LumpSumProps[] = items.map((it: any) => ({
      id: it.alias ?? String(Date.now()),
      policy: it.policy ?? "",
      commissionAmount: (it.commission_amount ?? 0).toString(),
      dateReceived: it.date_received ?? "",
      clawbackAmount: (it.clawback_amount ?? 0).toString(),
      clawbackDate: it.clawback_date ?? "",
      reconciledAmount:
        typeof it.reconciled_amount === "number"
          ? it.reconciled_amount.toFixed(2)
          : String(it.reconciled_amount ?? "0.00"),
    }));
    // If API returned no items, keep lumps empty so UI shows only Add button
    setLumps(mapped);
  }, [lumpSumCommissionData]);

  useEffect(() => {
    if (isError) {
      console.error("Failed to load lump sum commission data");
      toast.error("Failed to load lump sum commission data");
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="p-2">
        <LoadingSpinner />
      </div>
    );
  }
  // If there are no lump rows (API returned empty) show only the Add button
  if (!isLoading && lumps.length === 0) {
    return (
      <div className="mb-4">
        <div className="bg-primary text-white p-2 mb-3 rounded-1 fs-6">
          Lump Sum Commission
        </div>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary"
            disabled={session?.user?.user_type === "CLIENT"}
            onClick={() => setIsAddLumpSumCommissionModalOpen(true)}
          >
            <TbCirclePlus className="me-1" size={18} />
            Add New Lump Sum
          </button>
        </div>
        <AddLumpSumCommissionModal
          isOpen={isAddLumpSumCommissionModalOpen}
          toggle={() => setIsAddLumpSumCommissionModalOpen(false)}
          caseAlias={case_alias}
          commissionAlias={commission_alias}
          policies={policies}
          onAdded={() => setIsAddLumpSumCommissionModalOpen(false)}
        />
      </div>
    );
  }

  // compute selected policy type to show in modal
  const selectedPolicyType = (() => {
    if (!selectedLumpId) return null;
    const lump = lumps.find((l) => l.id === selectedLumpId);
    if (!lump) return null;
    const policyAlias = lump.policy;
    if (!policyAlias) return null;
    const found = policies.find((p: any) => p.alias === policyAlias);
    return found?.policy_type ?? null;
  })();

  return (
    <>
      <div className="mb-4">
        <div className="bg-primary fs-6 p-2 mb-3 rounded-1">
          Lump Sum Commission
        </div>
        <div>
          <Nav tabs className="mb-3 justify-content-center">
            {lumps.map((lump, idx) => (
              <NavItem key={lump.id}>
                <NavLink
                  className={
                    activeTab === String(idx) ? "active text-secondary" : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab(String(idx))}
                >
                  Lump Sum {idx + 1}{" "}
                  {lump.policy
                    ? `- ${formatChoiceFieldValue(
                        policies.find((p: any) => p.alias === lump.policy)
                          ?.policy_type || "Policy",
                      )}`
                    : ""}
                </NavLink>
              </NavItem>
            ))}
          </Nav>

          <TabContent activeTab={activeTab}>
            {lumps.map((lump, idx) => (
              <TabPane tabId={String(idx)} key={lump.id}>
                <Form className="border border-primary p-3 mb-3 rounded-1">
                  <Row className="g-3 align-items-start">
                    <Col md={4}>
                      <FormGroup>
                        <Label>Policy</Label>
                        <Input
                          type="select"
                          value={lump.policy}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLumps((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], policy: val };
                              return copy;
                            });
                            clearFieldError(idx, "policy");
                          }}
                        >
                          <option value="">Select...</option>
                          {policies.map((policy: any) => (
                            <option key={policy.alias} value={policy.alias}>
                              {formatChoiceFieldValue(policy.policy_type) ||
                                "Policy"}
                            </option>
                          ))}
                        </Input>
                        {errors[`${idx}.policy`] && (
                          <div className="text-danger small mt-1">
                            {errors[`${idx}.policy`]}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label>Commission Amount</Label>
                        <div className="input-group">
                          <InputGroupText>£</InputGroupText>
                          <Input
                            type="number"
                            value={lump.commissionAmount}
                            min={0}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLumps((prev) => {
                                const copy = [...prev];
                                copy[idx] = {
                                  ...copy[idx],
                                  commissionAmount: val,
                                };
                                return copy;
                              });
                              clearFieldError(idx, "commissionAmount");
                            }}
                          />
                        </div>
                        {errors[`${idx}.commissionAmount`] && (
                          <div className="text-danger small mt-1">
                            {errors[`${idx}.commissionAmount`]}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label>Date Received</Label>
                        <Input
                          type="date"
                          value={lump.dateReceived}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLumps((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], dateReceived: val };
                              return copy;
                            });
                            clearFieldError(idx, "dateReceived");
                          }}
                        />
                        {errors[`${idx}.dateReceived`] && (
                          <div className="text-danger small mt-1">
                            {errors[`${idx}.dateReceived`]}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="g-3 align-items-start mt-3">
                    <Col md={4}>
                      <FormGroup>
                        <Label>Clawback Amount</Label>
                        <div className="input-group">
                          <InputGroupText>£</InputGroupText>
                          <Input
                            type="number"
                            value={lump.clawbackAmount}
                            min={0}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLumps((prev) => {
                                const copy = [...prev];
                                copy[idx] = {
                                  ...copy[idx],
                                  clawbackAmount: val,
                                };
                                return copy;
                              });
                              clearFieldError(idx, "clawbackAmount");
                            }}
                          />
                        </div>
                        {errors[`${idx}.clawbackAmount`] && (
                          <div className="text-danger small mt-1">
                            {errors[`${idx}.clawbackAmount`]}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label>Clawback Date</Label>
                        <Input
                          type="date"
                          value={lump.clawbackDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLumps((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], clawbackDate: val };
                              return copy;
                            });
                            clearFieldError(idx, "clawbackDate");
                          }}
                        />
                        {errors[`${idx}.clawbackDate`] && (
                          <div className="text-danger small mt-1">
                            {errors[`${idx}.clawbackDate`]}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={3}>
                      <FormGroup>
                        <Label>Reconciled Amount</Label>
                        <div className="input-group">
                          <InputGroupText>£</InputGroupText>
                          <Input
                            type="text"
                            readOnly
                            className="bg-light-dark"
                            value={Number(lump.reconciledAmount).toFixed(2)}
                          />
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <Button
                      outline
                      type="button"
                      color="danger"
                      title="Remove row"
                      onClick={() => openDeleteModal(lump.id)}
                      disabled={session?.user?.user_type === "CLIENT"}
                    >
                      <FaTrash /> Delete
                    </Button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        isUpdatingLump || session?.user?.user_type === "CLIENT"
                      }
                      onClick={() => handleUpdateLump(lump, idx)}
                    >
                      <ArrowUpCircle size={16} />{" "}
                      {isUpdatingLump ? "Updating..." : "Update"}
                    </button>
                  </div>
                </Form>
              </TabPane>
            ))}
          </TabContent>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddLumpSumCommissionModalOpen(true)}
            disabled={session?.user?.user_type === "CLIENT"}
          >
            <TbCirclePlus className="me-1" size={18} />
            Add New Lump Sum
          </button>
        </div>
      </div>
      <DeleteLumpSumCommissionModal
        isOpen={isDeleteModalOpen}
        toggle={closeDeleteModal}
        caseAlias={case_alias}
        commissionAlias={commission_alias}
        lumpSumAlias={selectedLumpId}
        onDeleted={() => {
          if (!selectedLumpId) {
            closeDeleteModal();
            return;
          }

          setLumps((prev) => {
            const newList = prev.filter((l) => l.id !== selectedLumpId);
            const newLen = newList.length;
            const removedIndex = selectedLumpIndex ?? -1;
            const currActive = Number(activeTab) || 0;

            let newActive = 0;
            if (newLen === 0) {
              newActive = 0;
            } else {
              if (currActive > removedIndex) {
                newActive = currActive - 1;
              } else if (currActive === removedIndex) {
                newActive = removedIndex >= newLen ? newLen - 1 : removedIndex;
              } else {
                newActive = currActive;
              }
            }

            setActiveTab(String(newActive));
            return newList;
          });

          // reset selection and close modal
          setSelectedLumpId(null);
          setSelectedLumpIndex(null);
          setIsDeleteModalOpen(false);
        }}
        policyType={selectedPolicyType}
      />
      <AddLumpSumCommissionModal
        isOpen={isAddLumpSumCommissionModalOpen}
        toggle={() => setIsAddLumpSumCommissionModalOpen(false)}
        caseAlias={case_alias}
        commissionAlias={commission_alias}
        policies={policies}
        onAdded={() => setIsAddLumpSumCommissionModalOpen(false)}
      />
    </>
  );
};

export default LumpSumCommission;
