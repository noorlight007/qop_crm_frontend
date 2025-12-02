import LoadingSpinner from "@/app/loading";
import {
  useGetTrailCommissionQuery,
  useUpdateTrailCommissionMutation,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Commission/CommissionApi";
import {
  useGetInsuranceOverviewQuery,
  useGetInsurancePoliciesQuery,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/InsuranceOverview/InsuranceOverviewApi";
import { CommissionProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/CommissionTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import React, { useEffect, useState } from "react";
import { ArrowUpCircle } from "react-feather";
import { FaTrash } from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import { toast } from "react-toastify";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [trails, setTrails] = useState<Trail[]>([]);
  const [activeTab, setActiveTab] = useState<string>("0");

  const case_alias = Array.isArray(caseAlias) ? caseAlias[0] : caseAlias;
  const commission_alias = commissionAlias ?? undefined;

  const { data: trailCommissionData, isLoading } = useGetTrailCommissionQuery(
    { case_alias, commission_alias },
    { skip: !case_alias || !commission_alias }
  );

  const [updateTrailCommission, { isLoading: isUpdating }] =
    useUpdateTrailCommissionMutation();

  const { data: insuranceOverviewData } = useGetInsuranceOverviewQuery(
    { case_alias },
    { skip: !case_alias }
  );

  const overview = Array.isArray(insuranceOverviewData)
    ? insuranceOverviewData[0]
    : insuranceOverviewData;

  const { data: insurancePoliciesData } = useGetInsurancePoliciesQuery(
    { case_alias, insurance_overview_alias: overview?.alias },
    { skip: !case_alias || !overview?.alias }
  );

  const [policies, setPolicies] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [selectedTrailIndex, setSelectedTrailIndex] = useState<number | null>(
    null
  );

  const handleUpdateTrail = async (trail: Trail) => {
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
      toast.success("Trail commission updated successfully");
    } catch (err) {
      console.error("Failed to update trail commission", err);
      toast.error("Failed to update trail commission");
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
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoading && trails.length === 0) {
    return (
      <div className="mb-4">
        <div className="bg-primary text-white p-2 mb-3">Trail Commission</div>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <TbCirclePlus className="me-1" size={18} />
            Add New Trail Commission
          </button>
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
                          ?.policy_type || "Policy"
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
                  <div className="row g-3 align-items-center">
                    <div className="col-md-4">
                      <label className="form-label">Policy</label>
                      <select
                        className="form-select"
                        value={trail.policy}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTrails((prev) => {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], policy: val };
                            return copy;
                          });
                        }}
                      >
                        <option value="">Select...</option>
                        {policies.map((policy: any) => (
                          <option key={policy.alias} value={policy.alias}>
                            {formatChoiceFieldValue(policy.policy_type) ||
                              "Policy"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Monthly Payment</label>
                      <div className="input-group">
                        <span className="input-group-text">£</span>
                        <input
                          type="number"
                          className="form-control"
                          value={trail.monthlyPayment}
                          min={0}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTrails((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], monthlyPayment: val };
                              return copy;
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Number Of Payments</label>
                      <input
                        type="number"
                        className="form-control"
                        value={trail.numberOfPayments}
                        min={0}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTrails((prev) => {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], numberOfPayments: val };
                            return copy;
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="row g-3 align-items-center mt-3">
                    <div className="col-md-4">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={trail.startDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTrails((prev) => {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], startDate: val };
                            return copy;
                          });
                        }}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={trail.endDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTrails((prev) => {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], endDate: val };
                            return copy;
                          });
                        }}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">
                        Total Trail Commission
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">£</span>
                        <input
                          type="text"
                          readOnly
                          className="form-control bg-light-dark"
                          value={Number(trail.totalTrailCommission).toFixed(2)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <Button
                      outline
                      type="button"
                      color="danger"
                      title="Remove row"
                      onClick={() => openDeleteModal(trail.id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={isUpdating}
                      onClick={() => handleUpdateTrail(trail)}
                    >
                      <ArrowUpCircle size={16} />{" "}
                      {isUpdating ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </TabPane>
            ))}
          </TabContent>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <TbCirclePlus className="me-1" size={18} />
            Add New Trail Commission
          </button>
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
