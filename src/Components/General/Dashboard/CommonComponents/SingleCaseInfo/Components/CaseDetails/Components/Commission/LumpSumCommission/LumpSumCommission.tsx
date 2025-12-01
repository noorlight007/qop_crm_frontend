import LoadingSpinner from "@/app/loading";
import {
  useGetLumpSumCommissionQuery,
  useUpdateLumpSumCommissionMutation,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Commission/CommissionApi";
import formatChoiceFieldValue from "@/utils/formatters";
import React, { useEffect, useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

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
          <button type="button" className="btn btn-primary">
            <TbCirclePlus className="me-1" size={18} />
            Add New Lump Sum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="bg-primary text-white p-2 mb-3">Lump Sum Commission</div>
      {lumps.length > 1 ? (
        <>
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
                    ? `- ${formatChoiceFieldValue(lump.policy)}`
                    : ""}
                </NavLink>
              </NavItem>
            ))}
          </Nav>

          <TabContent activeTab={activeTab}>
            {lumps.map((lump, idx) => (
              <TabPane tabId={String(idx)} key={lump.id}>
                <div className="border border-primary p-3 mb-3">
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
                        <option value="policy-1">Policy 1</option>
                        <option value="policy-2">Policy 2</option>
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
                              copy[idx] = { ...copy[idx], clawbackAmount: val };
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

                    <div className="col-md-1 d-flex align-items-center justify-content-center">
                      <button
                        type="button"
                        className="btn btn-link text-danger"
                        title="Remove row"
                      >
                        <i className="fa fa-times" />
                      </button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={isUpdatingLump}
                      onClick={async () => {
                        try {
                          const payload = {
                            policy: lump.policy || null,
                            commission_amount:
                              parseFloat(lump.commissionAmount) || 0,
                            date_received: lump.dateReceived || null,
                            clawback_amount:
                              parseFloat(lump.clawbackAmount) || 0,
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
                      }}
                    >
                      {isUpdatingLump ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </TabPane>
            ))}
          </TabContent>
        </>
      ) : (
        lumps.map((lump) => (
          <div key={lump.id} className="border border-primary p-3 mb-3">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <label className="form-label">Policy</label>
                <select
                  className="form-select"
                  value={lump.policy}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLumps((prev) =>
                      prev.map((p) =>
                        p.id === lump.id ? { ...p, policy: val } : p
                      )
                    );
                  }}
                >
                  <option value="">Select...</option>
                  <option value="policy-1">Policy 1</option>
                  <option value="policy-2">Policy 2</option>
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
                      setLumps((prev) =>
                        prev.map((p) =>
                          p.id === lump.id ? { ...p, commissionAmount: val } : p
                        )
                      );
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
                      setLumps((prev) =>
                        prev.map((p) =>
                          p.id === lump.id ? { ...p, dateReceived: val } : p
                        )
                      );
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
                      setLumps((prev) =>
                        prev.map((p) =>
                          p.id === lump.id ? { ...p, clawbackAmount: val } : p
                        )
                      );
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
                    setLumps((prev) =>
                      prev.map((p) =>
                        p.id === lump.id ? { ...p, clawbackDate: val } : p
                      )
                    );
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

              <div className="col-md-1 d-flex align-items-center justify-content-center">
                <button
                  type="button"
                  className="btn btn-link text-danger"
                  title="Remove row"
                >
                  <i className="fa fa-times" />
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-primary"
                disabled={isUpdatingLump}
                onClick={async () => {
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
                }}
              >
                {isUpdatingLump ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        ))
      )}

      <div>
        <button type="button" className="btn btn-primary">
          <TbCirclePlus className="me-1" size={18} />
          Add New Lump Sum
        </button>
      </div>
    </div>
  );
};

export default LumpSumCommission;
