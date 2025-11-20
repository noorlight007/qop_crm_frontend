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
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";

const InsuranceHealthContent: React.FC = () => {
  const { casealias } = useParams();
  const { data: session } = useSession();
  const {
    data: InsuranceHealthData,
    isLoading,
    isError,
  } = useGetInsuranceHealthDetailsQuery({ case_alias: casealias });

  const [
    updateInsuranceHealthDetails,
    { isLoading: isUpdating, isSuccess, isError: isUpdateError },
  ] = useUpdateInsuranceHealthDetailsMutation();

  const [healthConditions, setHealthConditions] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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
    if (InsuranceHealthData) {
      setHealthConditions(Boolean(InsuranceHealthData.health_conditions));
      setNote(InsuranceHealthData.note ?? "");
    }
  }, [InsuranceHealthData]);

  useEffect(() => {
    if (isSuccess) {
      setFeedback({
        type: "success",
        message: "Insurance health details updated successfully.",
      });
    } else if (isUpdateError) {
      setFeedback({
        type: "error",
        message: "Failed to update insurance health details.",
      });
    }
  }, [isSuccess, isUpdateError]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFeedback(null);

    try {
      const res = await updateInsuranceHealthDetails({
        case_alias: casealias,
        alias: InsuranceHealthData?.alias,
        health_conditions: healthConditions,
        note: note,
      }).unwrap();
      return res;
    } catch (err) {
      console.error("Update failed", err);
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

  if (isError) {
    return (
      <div className="py-3">
        <Alert color="danger">Failed to load insurance health details.</Alert>
      </div>
    );
  }

  return (
    <div>
      {feedback ? (
        <Alert color={feedback.type === "success" ? "success" : "danger"}>
          {feedback.message}
        </Alert>
      ) : null}

      <Form onSubmit={handleSubmit}>
        <FormGroup check className="mt-2 text-center">
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
