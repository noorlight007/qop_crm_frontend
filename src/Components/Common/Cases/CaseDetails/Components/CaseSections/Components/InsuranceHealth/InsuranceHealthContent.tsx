import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import {
  useGetInsuranceHealthDetailsQuery,
  useUpdateInsuranceHealthDetailsMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/InsuranceHealth/InsuranceHealthApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";

const InsuranceHealthContent: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { casealias } = useParams();
  const { data: session } = useSession();
  const { data: InsuranceHealthData, isLoading } =
    useGetInsuranceHealthDetailsQuery({ case_alias: casealias });

  const [
    updateInsuranceHealthDetails,
    { isLoading: isUpdating, isError: isUpdateError },
  ] = useUpdateInsuranceHealthDetailsMutation();

  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const [healthConditions, setHealthConditions] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [submitting, setSubmitting] = useState<"save" | "save_next" | null>(
    null,
  );

  const dispatch = useAppDispatch();
  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  // Initialize local form state when data is fetched
  useEffect(() => {
    // API may return an array or a single object. Use the first item if array.
    const insuranceRecord = Array.isArray(InsuranceHealthData)
      ? InsuranceHealthData[0]
      : InsuranceHealthData;

    if (insuranceRecord) {
      setHealthConditions(Boolean(insuranceRecord.health_conditions));
      setNote(insuranceRecord.note ?? "");
    }
  }, [InsuranceHealthData]);

  const handleSubmit = async (
    action: "save" | "save_next" = "save",
    e?: React.FormEvent | React.MouseEvent,
  ): Promise<boolean> => {
    e?.preventDefault();

    setSubmitting(action);

    try {
      const insuranceRecord = Array.isArray(InsuranceHealthData)
        ? InsuranceHealthData[0]
        : InsuranceHealthData;

      const payload = {
        alias: insuranceRecord?.alias,
        health_conditions: healthConditions,
        note: note,
      };

      const res = await updateInsuranceHealthDetails({
        case_alias: casealias,
        payload,
      }).unwrap();
      toast.success("Insurance health details updated successfully.");
      try {
        await updateSectionCompleteStatus({
          case_alias: casealias,
          section_data: { is_health_insurance: true },
        });
      } catch (err) {
        console.error("Failed to update section complete status:", err);
      }
      return true;
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update insurance health details.");
      return false;
    } finally {
      setSubmitting(null);
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

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <LoadingGrow />
      </div>
    );
  }

  return (
    <div>
      <Form
        innerRef={formRef}
        onSubmit={(e) => {
          void handleSubmit("save", e);
        }}
      >
        <FormGroup check className="mt-2">
          <Label check>
            <Input
              type="checkbox"
              className="border-primary"
              checked={healthConditions}
              onChange={(e) => setHealthConditions(e.target.checked)}
            />{" "}
            Do you have or have you had any health conditions past or present?
          </Label>
        </FormGroup>

        {healthConditions && (
          <FormGroup className="mt-1">
            <Label for="insuranceNote">
              Note
              <span className="text-danger">*</span>
            </Label>
            <Input
              id="insuranceNote"
              type="textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note..."
              rows={4}
              required
            />
          </FormGroup>
        )}

        <div className="d-flex justify-content-end gap-2">
          <Button
            color="primary"
            type="submit"
            disabled={submitting !== null || isUpdating}
          >
            {submitting === "save" ? <Spinner size="sm" /> : "Save changes"}
          </Button>

          <Button
            color="secondary"
            type="button"
            disabled={submitting !== null || isUpdating}
            onClick={async () => {
              if (formRef.current && !formRef.current.checkValidity()) {
                formRef.current.reportValidity();
                return;
              }

              const success = await handleSubmit("save_next");
              if (success) {
                handleNextTab();
              }
            }}
          >
            {submitting === "save_next" ? <Spinner size="sm" /> : "Save & Next"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default InsuranceHealthContent;
