import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import {
  useGetInsuranceHealthDetailsQuery,
  useUpdateInsuranceHealthDetailsMutation,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/InsuranceHealth/InsuranceHealthApi";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";

const InsuranceHealthContent: React.FC = () => {
  const { casealias } = useParams();
  const { data: session } = useSession();
  const { data: InsuranceHealthData, isLoading } =
    useGetInsuranceHealthDetailsQuery({ case_alias: casealias });

  const [
    updateInsuranceHealthDetails,
    { isLoading: isUpdating, isSuccess, isError: isUpdateError },
  ] = useUpdateInsuranceHealthDetailsMutation();

  const [healthConditions, setHealthConditions] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const dispatch = useAppDispatch();
  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

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
      return res;
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update insurance health details.");
      throw err;
    }
  };

  const handleSaveAndNext = async () => {
    try {
      await handleSubmit();
      handleNextTab();
    } catch (err) {
      // if save failed, don't navigate; the feedback state will show error
    }
  };

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(caseData?.case_stage, currentTab!);
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
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
            <Label for="insuranceNote">Note</Label>
            <Input
              id="insuranceNote"
              type="textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note..."
              rows={4}
            />
          </FormGroup>
        )}

        <div className="d-flex justify-content-end gap-2">
          <Button color="primary" disabled={isUpdating} onClick={handleSubmit}>
            {isUpdating ? <Spinner size="sm" /> : "Save changes"}
          </Button>
          <Button
            color="success"
            disabled={isUpdating}
            onClick={handleSaveAndNext}
          >
            {isUpdating ? (
              <Spinner size="sm" />
            ) : session?.user?.user_type === "CLIENT" ? (
              "Go To Next"
            ) : (
              "Save & Next"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default InsuranceHealthContent;
