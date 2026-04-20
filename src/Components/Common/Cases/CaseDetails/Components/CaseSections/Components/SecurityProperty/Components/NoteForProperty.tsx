import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useUpdatePropertyMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SecurityProperty/SecurityPropertyApi";
import {
  clearPropertyErrors,
  setPropertyErrors,
  updateProperty,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SecurityProperty/SecurityPropertyFormSlice";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { RootState } from "@/Redux/Store";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardFooter,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

const NoteForProperty: React.FC<{ property_alias: string }> = ({
  property_alias,
}) => {
  const { casealias } = useParams();
  const { data: session } = useSession();

  const formData = useSelector(
    (state: RootState) => state.propertyForm.Properties,
  );
  const propertyAlias = property_alias;

  // RTK Hooks
  const [updateSingleProperty, { isLoading }] = useUpdatePropertyMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const [submitting, setSubmitting] = useState<"save" | "save_next" | null>(
    null,
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    dispatch(updateProperty({ notes: value }));
    const newErrors = { ...(formData.api_errors || {}) };
    if (newErrors["notes"]) delete newErrors["notes"];
    dispatch(setPropertyErrors(newErrors));
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    const src = err?.data || err || {};
    const sanitize = (s: any) => String(s ?? "").replace(/^\s*\d+,\s*/g, "");

    const walk = (obj: any) => {
      if (!obj) return;
      if (typeof obj === "string") {
        out.detail = sanitize(obj);
        return;
      }
      if (Array.isArray(obj)) {
        obj.forEach((it) => {
          if (typeof it === "string") out.detail = sanitize(it);
          else walk(it);
        });
        return;
      }
      if (typeof obj === "object") {
        Object.entries(obj).forEach(([k, v]) => {
          if (typeof v === "string" || typeof v === "number") {
            out[k] = sanitize(v);
          } else if (Array.isArray(v)) {
            out[k] = v.map(sanitize).join(" ");
          } else if (typeof v === "object") {
            Object.entries(v as any).forEach(([k2, v2]) => {
              if (Array.isArray(v2))
                out[`${k}.${k2}`] = v2.map(sanitize).join(" ");
              else out[`${k}.${k2}`] = sanitize(v2);
            });
          }
        });
      }
    };

    walk(src);
    return out;
  };
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  const handleSubmit = async () => {
    try {
      const response = await updateSingleProperty({
        case_alias: casealias,
        property_alias: propertyAlias,
        updatedSecurityProperty: formData,
      });

      if (response.data) {
        dispatch(clearPropertyErrors());
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_security_property: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
        toast.success("Property Details Updated Successfully");
      } else if (response.error) {
        const parsed = parseApiErrors(response.error);
        dispatch(setPropertyErrors(parsed));
        const firstMsg =
          Object.values(parsed)[0] ||
          (response.error as any)?.data?.detail ||
          "Failed to update property";
        toast.error(firstMsg);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(null);
    }
  };
  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

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

  const canApplicantEdit = (): boolean => {
    if (session?.user?.role === "APPLICANT") {
      return (
        caseData?.case_stage === "ENQUIRY" ||
        caseData?.case_stage === "FACT_FIND"
      );
    }
    return true; // Non-applicant users can always edit
  };

  return (
    <Card className="mb-3">
      <CardFooter>
        <Row>
          <Col xs={12}>
            <FormGroup>
              <Label className="fw-semibold" for="PropertyNotes">
                Note
              </Label>
              <Input
                type="textarea"
                id="PropertyNotes"
                name="notes"
                value={formData.notes || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(
                    e as unknown as React.ChangeEvent<HTMLTextAreaElement>,
                  )
                }
                style={{
                  maxWidth: "100%",
                  minWidth: "100%",
                  minHeight: "80px",
                  resize: "vertical",
                }}
                className="mb-3"
              />
              {formData?.api_errors?.notes && (
                <div className="text-danger">{formData.api_errors.notes}</div>
              )}
            </FormGroup>
          </Col>
        </Row>

        {canApplicantEdit() && (
          <div className="d-flex justify-content-end align-items-center gap-3">
            <Button
              type="button"
              color="primary"
              id="submit"
              name="next"
              className="px-4"
              onClick={async () => {
                // if (session?.user?.role === "APPLICANT") return;
                setSubmitting("save");
                await handleSubmit();
              }}
              // disabled={
              //   submitting !== null ||
              //   isLoading ||
              //   session?.user?.role === "APPLICANT"
              // }
            >
              {submitting === "save" ? "Saving..." : "Save Changes"}
            </Button>
            {session?.user?.role !== "APPLICANT" && (
              <Button
                type="button"
                color="secondary"
                onClick={async () => {
                  setSubmitting("save_next");
                  await handleSubmit();
                  handleNextTab();
                }}
                disabled={submitting !== null || isLoading}
              >
                {submitting === "save_next" ? "Saving..." : "Save & Next"}
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default NoteForProperty;
