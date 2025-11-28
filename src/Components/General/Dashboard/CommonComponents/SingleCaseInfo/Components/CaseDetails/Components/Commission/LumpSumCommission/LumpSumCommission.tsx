import LoadingSpinner from "@/app/loading";
import { useGetLumpSumCommissionQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Commission/CommissionApi";
import React, { useEffect, useState } from "react";
import { TbCirclePlus } from "react-icons/tb";

type Lump = {
  id: string;
  policy: string;
  commissionAmount: string;
  dateReceived: string;
  clawbackAmount: string;
  clawbackDate: string;
  reconciledAmount: string;
};

const emptyLump = (id = ""): Lump => ({
  id,
  policy: "",
  commissionAmount: "0",
  dateReceived: "",
  clawbackAmount: "0",
  clawbackDate: "",
  reconciledAmount: "0.00",
});

interface Props {
  caseAlias?: string | string[];
  commissionAlias?: string | null;
}

const LumpSumCommission: React.FC<Props> = ({ caseAlias, commissionAlias }) => {
  const [lumps, setLumps] = useState<Lump[]>([]);

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

  const addLump = () => {
    const id = String(Date.now());
    setLumps((s) => [...s, emptyLump(id)]);
  };

  const removeLump = (id: string) => {
    setLumps((s) => s.filter((l) => l.id !== id));
  };

  const updateField = (id: string, field: keyof Lump, value: string) => {
    setLumps((s) => s.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

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
          <button type="button" className="btn btn-primary" onClick={addLump}>
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

      {lumps.map((lump) => (
        <div key={lump.id} className="border border-primary p-3 mb-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label className="form-label">Policy</label>
              <select
                className="form-select"
                value={lump.policy}
                onChange={(e) => updateField(lump.id, "policy", e.target.value)}
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
                  onChange={(e) =>
                    updateField(lump.id, "commissionAmount", e.target.value)
                  }
                  min={0}
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
                  onChange={(e) =>
                    updateField(lump.id, "dateReceived", e.target.value)
                  }
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
                  onChange={(e) =>
                    updateField(lump.id, "clawbackAmount", e.target.value)
                  }
                  min={0}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Clawback Date</label>
              <input
                type="date"
                className="form-control"
                value={lump.clawbackDate}
                onChange={(e) =>
                  updateField(lump.id, "clawbackDate", e.target.value)
                }
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Reconciled Amount</label>
              <div className="input-group">
                <span className="input-group-text">£</span>
                <input
                  type="text"
                  readOnly
                  className="form-control bg-light"
                  value={Number(lump.reconciledAmount).toFixed(2)}
                />
              </div>
            </div>

            <div className="col-md-1 d-flex align-items-center justify-content-center">
              <button
                type="button"
                className="btn btn-link text-danger"
                onClick={() => removeLump(lump.id)}
                title="Remove row"
              >
                <i className="fa fa-times" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div>
        <button type="button" className="btn btn-primary" onClick={addLump}>
          <TbCirclePlus className="me-1" size={18} />
          Add New Lump Sum
        </button>
      </div>
    </div>
  );
};

export default LumpSumCommission;
