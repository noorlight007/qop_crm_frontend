import LoadingSpinner from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import {
  useAddCommissionMutation,
  useGetCommissionQuery,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Commission/CommissionApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import LumpSumCommission from "./LumpSumCommission/LumpSumCommission";
import TrailCommission from "./TrailCommission/TrailCommission";

const CommissionContent: React.FC = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  // RTK hooks
  const { data: commissionData, isLoading } = useGetCommissionQuery({
    case_alias: casealias,
  });
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  // API may return an array (e.g. [{...}]) — normalize to single object
  const commission = Array.isArray(commissionData)
    ? commissionData[0]
    : commissionData;
  const [addCommission, { isLoading: isAdding }] = useAddCommissionMutation();

  const [note, setNote] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  useEffect(() => {
    if (commission) {
      setNote(commission.note ?? "");
    }
  }, [commission]);

  if (isLoading) {
    return (
      <div className="p-2">
        <LoadingSpinner />
      </div>
    );
  }

  const totalCommission = commission?.total_commission ?? 0;

  const handleSubmit = async (e?: React.FormEvent): Promise<boolean> => {
    e?.preventDefault();
    try {
      const res = await addCommission({
        case_alias: casealias,
        commission_alias: commission?.alias,
        commissionData: { note },
      });
      if (res.data) {
        toast.success("Commission notes updated successfully");
        setErrors({});
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_commission: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
        return true;
      }
      return false;
    } catch (err) {
      // parse API validation errors and show per-field
      const parsed: Record<string, string> = {};
      const sanitize = (s: string) => s.replace(/^\s*\d+,\s*/g, "").trim();
      const data: any = (err && (err as any).data) || err;

      if (data?.errors && typeof data.errors === "object") {
        Object.keys(data.errors).forEach((k) => {
          const v = data.errors[k];
          if (Array.isArray(v)) parsed[k] = sanitize(String(v[0]));
          else parsed[k] = sanitize(String(v));
        });
      } else if (data?.message && typeof data.message === "string") {
        parsed.non_field_error = sanitize(data.message);
      } else if (typeof data === "string") {
        parsed.non_field_error = sanitize(data);
      }

      const flattened: Record<string, string> = {};
      Object.keys(parsed).forEach((k) => {
        const base = k.split(".")[0];
        if (!flattened[base]) flattened[base] = parsed[k];
      });

      setErrors(flattened);
      const firstMsg =
        Object.values(flattened)[0] ||
        parsed.non_field_error ||
        "Failed to update commission notes";
      toast.error(firstMsg);
      console.error(err);
      return false;
    }
  };

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(
      caseData?.case_stage,
      caseData?.case_category,
      currentTab!,
    );
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  return (
    <div className="p-2">
      <Row>
        <Col>
          <LumpSumCommission
            caseAlias={casealias}
            commissionAlias={commission?.alias}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <TrailCommission
            caseAlias={casealias}
            commissionAlias={commission?.alias}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <div className="d-flex justify-content-center align-items-center mb-3 bg-light-success p-3">
            <h6>Total Commission: </h6>
            <h5>
              {new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
              }).format(totalCommission)}
            </h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="commissionNotes">Commission Notes</Label>
              <Input
                type="textarea"
                id="commissionNotes"
                name="commissionNotes"
                placeholder="Enter commission notes here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
              />
              {errors.note && <div className="text-danger">{errors.note}</div>}
            </FormGroup>
            <div className="d-flex justify-content-end gap-2">
              <Button
                color="primary"
                type="submit"
                disabled={isAdding || session?.user?.role === "APPLICANT"}
              >
                {isAdding ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                color="secondary"
                disabled={isAdding}
                onClick={async () => {
                  if (session?.user?.role === "APPLICANT") {
                    handleNextTab();
                  } else {
                    const success = await handleSubmit();
                    if (success) {
                      handleNextTab();
                    }
                  }
                }}
              >
                {isAdding
                  ? "Saving..."
                  : session?.user?.role === "APPLICANT"
                    ? "Go To Next"
                    : "Save & Next"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default CommissionContent;
