import { LoadingSpinner2 } from "@/app/loading";
import {
  useGetTrailCommissionQuery,
  useUpdateTrailCommissionMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Commission/CommissionApi";
import {
  useGetInsuranceOverviewQuery,
  useGetInsurancePoliciesQuery,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/InsuranceOverview/InsuranceOverviewApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { CommissionProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/CommissionTypes";
import getCurrencySign from "@/utils/currency";
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
import AddTrailCommissionModal from "./Modals/AddTrailCommissionModal";
import DeleteTrailCommissionModal from "./Modals/DeleteTrailCommissionModal";

type Trail = {
  id: string;
  policy: string;
  monthlyPayment: string;
  numberOfPayments: string;
  startDate: string;
  endDate: string;
  totalTrailCommission: string;
};

const TrailCommission: React.FC<CommissionProps> = ({
  caseAlias,
  commissionAlias,
}) => {
  const { data: session } = useSession();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [trails, setTrails] = useState<Trail[]>([]);
  const [activeTab, setActiveTab] = useState<string>("0");

  const case_alias = Array.isArray(caseAlias) ? caseAlias[0] : caseAlias;
  const commission_alias = commissionAlias ?? undefined;

  const { data: trailCommissionData, isLoading } = useGetTrailCommissionQuery(
    { case_alias, commission_alias },
    { skip: !case_alias || !commission_alias },
  );

  const [updateTrailCommission, { isLoading: isUpdating }] =
    useUpdateTrailCommissionMutation();

  const { data: insuranceOverviewData } = useGetInsuranceOverviewQuery(
    { case_alias },
    { skip: !case_alias },
  );

  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: case_alias },
    { skip: !case_alias },
  );

  const overview = Array.isArray(insuranceOverviewData)
    ? insuranceOverviewData[0]
    : insuranceOverviewData;

  const { data: insurancePoliciesData } = useGetInsurancePoliciesQuery(
    { case_alias, insurance_overview_alias: overview?.alias },
    { skip: !case_alias || !overview?.alias },
  );

  const [policies, setPolicies] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [selectedTrailIndex, setSelectedTrailIndex] = useState<number | null>(
    null,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

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
            (Array.isArray(v)
              ? v
                  .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
                  .join(", ")
              : v) as string,
          );
        } else {
          Object.assign(out, flattenErrors(v, newPath));
        }
      }
    }
    return out;
  };

  const normalizeKeyWithIndex = (rawKey: string, idx: number) => {
    const parts = rawKey.split(".").filter(Boolean);
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
    if (err?.message) return String(err.message);
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const handleUpdateTrail = async (trail: Trail, idx: number) => {
    try {
      const payload = {
        policy: trail.policy || null,
        monthly_payment:
          trail.monthlyPayment === "" ? null : parseFloat(trail.monthlyPayment),
        number_of_payments:
          trail.numberOfPayments === ""
            ? null
            : parseInt(trail.numberOfPayments, 10),
        start_date: trail.startDate || null,
        end_date: trail.endDate || null,
        total_trail_commission:
          trail.totalTrailCommission === ""
            ? 0.0
            : parseFloat(trail.totalTrailCommission),
      };

      await updateTrailCommission({
        case_alias: case_alias!,
        commission_alias: commission_alias!,
        trail_commission_alias: trail.id,
        trailCommissionData: payload,
      }).unwrap();
      // clear any row errors on success
      clearRowErrors(idx);
      toast.success("Trail commission updated successfully");
    } catch (err) {
      console.error("Failed to update trail commission", err);
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

      toast.error(getErrorMessage(err) || "Failed to update trail commission");
    }
  };

  const openDeleteModal = (trailId: string) => {
    const idx = trails.findIndex((t) => t.id === trailId);
    setSelectedTrailId(trailId);
    setSelectedTrailIndex(idx !== -1 ? idx : null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedTrailId(null);
    setSelectedTrailIndex(null);
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
    if (!trailCommissionData) return;
    const items: any[] = Array.isArray(trailCommissionData)
      ? trailCommissionData
      : [trailCommissionData];
    const mapped: Trail[] = items.map((it: any) => ({
      id: it.alias ?? String(Date.now()),
      policy: it.policy ?? "",
      monthlyPayment:
        typeof it.monthly_payment === "number"
          ? it.monthly_payment.toString()
          : String(it.monthly_payment ?? ""),
      numberOfPayments:
        typeof it.number_of_payments === "number"
          ? String(it.number_of_payments)
          : String(it.number_of_payments ?? ""),
      startDate: it.start_date ?? "",
      endDate: it.end_date ?? "",
      totalTrailCommission:
        typeof it.total_trail_commission === "number"
          ? it.total_trail_commission.toFixed(2)
          : String(it.total_trail_commission ?? "0.00"),
    }));
    setTrails(mapped);
  }, [trailCommissionData]);

  if (isLoading) {
    return (
      <div className="p-2">
        <LoadingSpinner2 />
      </div>
    );
  }

  const canApplicantEdit = (): boolean => {
    if (session?.user?.role === "APPLICANT") {
      return (
        caseData?.case_stage === "ENQUIRY" ||
        caseData?.case_stage === "FACT_FIND"
      );
    }
    return true; // Non-applicant users can always edit
  };

  if (!isLoading && trails.length === 0) {
    return (
      <div className="mb-4">
        <div className="bg-primary text-white p-2 mb-3">Trail Commission</div>
        <div className="d-flex justify-content-center">
          {canApplicantEdit() && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
              // disabled={session?.user?.role === "APPLICANT"}
            >
              <TbCirclePlus className="me-1" size={18} />
              Add New Trail Commission
            </button>
          )}
        </div>
        <AddTrailCommissionModal
          isOpen={isAddModalOpen}
          toggle={() => setIsAddModalOpen(false)}
          caseAlias={case_alias}
          commissionAlias={commission_alias}
          policies={policies}
          onAdded={() => setIsAddModalOpen(false)}
        />
      </div>
    );
  }

  const selectedPolicyType = (() => {
    if (!selectedTrailId) return null;
    const trail = trails.find((t) => t.id === selectedTrailId);
    if (!trail) return null;
    const policyAlias = trail.policy;
    if (!policyAlias) return null;
    const found = policies.find((p: any) => p.alias === policyAlias);
    return found?.policy_type ?? null;
  })();

  return (
    <>
      <div className="mb-4">
        <div className="bg-primary fs-6 p-2 mb-3 rounded-1">
          Trail Commission
        </div>
        <div>
          <Nav tabs className="mb-3 justify-content-center">
            {trails.map((trail, idx) => (
              <NavItem key={trail.id}>
                <NavLink
                  className={
                    activeTab === String(idx) ? "active text-secondary" : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab(String(idx))}
                >
                  Trail {idx + 1}{" "}
                  {trail.policy
                    ? `- ${formatChoiceFieldValue(
                        policies.find((p: any) => p.alias === trail.policy)
                          ?.policy_type || "Policy",
                      )}`
                    : ""}
                </NavLink>
              </NavItem>
            ))}
          </Nav>

          <TabContent activeTab={activeTab}>
            {trails.map((trail, idx) => (
              <TabPane tabId={String(idx)} key={trail.id}>
                <div className="border border-primary p-3 mb-3 rounded-1">
                  <Row className="g-3 align-items-start">
                    <Col md={4}>
                      <FormGroup>
                        <Label>Policy</Label>
                        <Input
                          type="select"
                          value={trail.policy}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTrails((prev) => {
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
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label>Monthly Payment</Label>
                        <div className="input-group">
                          <InputGroupText>{getCurrencySign()}</InputGroupText>
                          <Input
                            type="number"
                            value={trail.monthlyPayment}
                            min={0}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTrails((prev) => {
                                const copy = [...prev];
                                copy[idx] = {
                                  ...copy[idx],
                                  monthlyPayment: val,
                                };
                                return copy;
                              });
                              clearFieldError(idx, "monthlyPayment");
                            }}
                          />
                        </div>
                        {errors[`${idx}.monthlyPayment`] && (
                          <div className="text-danger small mt-1">
                            {errors[`${idx}.monthlyPayment`]}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label>Number Of Payments</Label>
                        <Input
                          type="number"
                          value={trail.numberOfPayments}
                          min={0}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTrails((prev) => {
                              const copy = [...prev];
                              copy[idx] = {
                                ...copy[idx],
                                numberOfPayments: val,
                              };
                              return copy;
                            });
                            clearFieldError(idx, "numberOfPayments");
                          }}
                        />
                        {errors[`${idx}.numberOfPayments`] && (
                          <div className="text-danger small mt-1">
                            {errors[`${idx}.numberOfPayments`]}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="g-3 align-items-center mt-3">
                    <Col md={4}>
                      <FormGroup>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={trail.startDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTrails((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], startDate: val };
                              return copy;
                            });
                            clearFieldError(idx, "startDate");
                          }}
                        />
                        {errors[`${idx}.startDate`] && (
                          <div className="text-danger small mt-1">
                            {errors[`${idx}.startDate`]}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={trail.endDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTrails((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], endDate: val };
                              return copy;
                            });
                            clearFieldError(idx, "endDate");
                          }}
                        />
                        {errors[`${idx}.endDate`] && (
                          <div className="text-danger small mt-1">
                            {errors[`${idx}.endDate`]}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={3}>
                      <FormGroup>
                        <Label>Total Trail Commission</Label>
                        <div className="input-group">
                          <InputGroupText>{getCurrencySign()}</InputGroupText>
                          <Input
                            type="text"
                            readOnly
                            className="bg-light-dark"
                            value={Number(trail.totalTrailCommission).toFixed(
                              2,
                            )}
                          />
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  {canApplicantEdit() && (
                    <div className="d-flex justify-content-end gap-2 mt-2">
                      <Button
                        outline
                        type="button"
                        color="danger"
                        title="Remove row"
                        onClick={() => openDeleteModal(trail.id)}
                        // disabled={session?.user?.role === "APPLICANT"}
                      >
                        <FaTrash /> Delete
                      </Button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={
                          isUpdating
                          // || session?.user?.role === "APPLICANT"
                        }
                        onClick={() => handleUpdateTrail(trail, idx)}
                      >
                        <ArrowUpCircle size={16} />{" "}
                        {isUpdating ? "Updating..." : "Update"}
                      </button>
                    </div>
                  )}
                </div>
              </TabPane>
            ))}
          </TabContent>
        </div>

        <div>
          {canApplicantEdit() && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
              // disabled={session?.user?.role === "APPLICANT"}
            >
              <TbCirclePlus className="me-1" size={18} />
              Add New Trail Commission
            </button>
          )}
        </div>
      </div>
      <DeleteTrailCommissionModal
        isOpen={isDeleteModalOpen}
        toggle={closeDeleteModal}
        caseAlias={case_alias}
        commissionAlias={commission_alias}
        trailCommissionAlias={selectedTrailId}
        onDeleted={() => {
          if (!selectedTrailId) {
            closeDeleteModal();
            return;
          }

          setTrails((prev) => {
            const newList = prev.filter((l) => l.id !== selectedTrailId);
            const newLen = newList.length;
            const removedIndex = selectedTrailIndex ?? -1;
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

          setSelectedTrailId(null);
          setSelectedTrailIndex(null);
          setIsDeleteModalOpen(false);
        }}
        policyType={selectedPolicyType}
      />
      <AddTrailCommissionModal
        isOpen={isAddModalOpen}
        toggle={() => setIsAddModalOpen(false)}
        caseAlias={case_alias}
        commissionAlias={commission_alias}
        policies={policies}
        onAdded={() => setIsAddModalOpen(false)}
      />
    </>
  );
};

export default TrailCommission;
