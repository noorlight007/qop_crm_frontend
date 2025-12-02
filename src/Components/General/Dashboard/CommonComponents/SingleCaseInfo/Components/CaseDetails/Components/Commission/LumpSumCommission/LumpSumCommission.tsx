import LoadingSpinner from "@/app/loading";
import {
  useGetLumpSumCommissionQuery,
  useUpdateLumpSumCommissionMutation,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Commission/CommissionApi";
import {
  useGetInsuranceOverviewQuery,
  useGetInsurancePoliciesQuery,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/InsuranceOverview/InsuranceOverviewApi";
import formatChoiceFieldValue from "@/utils/formatters";
import React, { useEffect, useState } from "react";
import { ArrowUpCircle } from "react-feather";
import { FaTrash } from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import AddLumpSumCommissionModal from "./Modals/AddLumpSumCommissionModal";
import DeleteLumpSumCommissionModal from "./Modals/DeleteLumpSumCommissionModal";

type Lump = {
  id: string;
  policy: string;
  commissionAmount: string;
  dateReceived: string;
  clawbackAmount: string;
  clawbackDate: string;
  reconciledAmount: string;
};

interface Props {
  caseAlias?: string | string[];
  commissionAlias?: string | null;
}

const LumpSumCommission: React.FC<Props> = ({ caseAlias, commissionAlias }) => {
  const [isAddLumpSumCommissionModalOpen, setIsAddLumpSumCommissionModalOpen] =
    useState(false);

  const [lumps, setLumps] = useState<Lump[]>([]);
  const [activeTab, setActiveTab] = useState<string>("0");

  const case_alias = Array.isArray(caseAlias) ? caseAlias[0] : caseAlias;
  const commission_alias = commissionAlias ?? undefined;

  const {
    data: lumpSumCommissionData,
    isLoading,
    isError,
  } = useGetLumpSumCommissionQuery(
    { case_alias, commission_alias },
    { skip: !case_alias || !commission_alias }
  );

  const [updateLumpSumCommission, { isLoading: isUpdatingLump }] =
    useUpdateLumpSumCommissionMutation();

  const { data: insuranceOverviewData, isLoading: isLoadingOverview } =
    useGetInsuranceOverviewQuery({ case_alias }, { skip: !case_alias });

  // Handle both array and single object responses from API
  const overview = Array.isArray(insuranceOverviewData)
    ? insuranceOverviewData[0]
    : insuranceOverviewData;

  console.log("Overview Data:", overview);
  console.log("Overview Alias:", overview?.alias);

  const { data: insurancePoliciesData, isLoading: isPoliciesLoading } =
    useGetInsurancePoliciesQuery(
      {
        case_alias,
        insurance_overview_alias: overview?.alias,
      },
      { skip: !case_alias || !overview?.alias }
    );
  console.log("IPData::", insurancePoliciesData);

  const [policies, setPolicies] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLumpId, setSelectedLumpId] = useState<string | null>(null);

  // Move update logic out of JSX: re-usable handler
  const handleUpdateLump = async (lump: Lump) => {
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
    } catch (err) {
      console.error("Failed to update lump sum", err);
    }
  };

  const openDeleteModal = (lumpId: string) => {
    setSelectedLumpId(lumpId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedLumpId(null);
    setIsDeleteModalOpen(false);
  };

  // deletion will be handled inside DeleteLumpSumCommissionModal

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
    const mapped: Lump[] = items.map((it: any) => ({
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
      // keep existing UI; optionally we could surface toast here
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
        <div className="bg-primary text-white p-2 mb-3">
          Lump Sum Commission
        </div>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary"
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
                          ?.policy_type || "Policy"
                      )}`
                    : ""}
                </NavLink>
              </NavItem>
            ))}
          </Nav>

          <TabContent activeTab={activeTab}>
            {lumps.map((lump, idx) => (
              <TabPane tabId={String(idx)} key={lump.id}>
                <div className="border border-primary p-3 mb-3 rounded-1">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-4">
                      <label className="form-label">Policy</label>
                      <select
                        className="form-select"
                        value={lump.policy}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLumps((prev) => {
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
                      <label className="form-label">Commission Amount</label>
                      <div className="input-group">
                        <span className="input-group-text">£</span>
                        <input
                          type="number"
                          className="form-control"
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
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Date Received</label>
                      <div className="d-flex">
                        <input
                          type="date"
                          className="form-control"
                          value={lump.dateReceived}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLumps((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], dateReceived: val };
                              return copy;
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 align-items-center mt-3">
                    <div className="col-md-4">
                      <label className="form-label">Clawback Amount</label>
                      <div className="input-group">
                        <span className="input-group-text">£</span>
                        <input
                          type="number"
                          className="form-control"
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
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Clawback Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={lump.clawbackDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLumps((prev) => {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], clawbackDate: val };
                            return copy;
                          });
                        }}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Reconciled Amount</label>
                      <div className="input-group">
                        <span className="input-group-text">£</span>
                        <input
                          type="text"
                          readOnly
                          className="form-control bg-light-dark"
                          value={Number(lump.reconciledAmount).toFixed(2)}
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
                      onClick={() => openDeleteModal(lump.id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={isUpdatingLump}
                      onClick={() => handleUpdateLump(lump)}
                    >
                      <ArrowUpCircle size={16} />{" "}
                      {isUpdatingLump ? "Updating..." : "Update"}
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
            onClick={() => setIsAddLumpSumCommissionModalOpen(true)}
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
        onDeleted={closeDeleteModal}
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
