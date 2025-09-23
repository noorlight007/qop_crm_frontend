import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import { useUpdatePropertyMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyApi";
import { updateProperty } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SecurityProperty/SecurityPropertyFormSlice";
import { RootState } from "@/Redux/Store";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
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
    (state: RootState) => state.propertyForm.Properties
  );
  const propertyAlias = property_alias;

  // RTK Hooks
  const [updateSingleProperty, { isLoading }] = useUpdatePropertyMutation();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateProperty({ notes: e.target.value }));
  };
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
  );

  const handleSubmit = async () => {
    const response = await updateSingleProperty({
      case_alias: casealias,
      property_alias: propertyAlias,
      updatedSecurityProperty: formData,
    });

    if (response.data) {
      toast.success("Property Details Updated Successfully");
    } else if (response.error) {
      const errorMessage =
        (response.error as any)?.data?.detail || "Failed to update property";
      toast.error(errorMessage);
    } else {
      toast.error("Something went wrong");
    }
  };
  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(caseData?.case_stage, currentTab!);
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  return (
    <Card className="mb-3">
      <CardFooter
        style={{
          border: "2px solid #ececec",
          padding: "20px",
          backgroundColor: "#fff",
        }}
      >
        <Row>
          <Col xs={12}>
            <FormGroup>
              <Label className="fw-semibold" for="PropertyNotes">
                Notes
                <span className="required" style={{ visibility: "hidden" }}>
                  *
                </span>
              </Label>
              <Input
                type="textarea"
                id="PropertyNotes"
                name="notes"
                value={formData.notes || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(
                    e as unknown as React.ChangeEvent<HTMLTextAreaElement>
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
            </FormGroup>
          </Col>
        </Row>

        <div className="d-flex justify-content-end align-items-center gap-3">
          <Button
            color="primary"
            id="submit"
            name="next"
            className="px-4"
            onClick={handleSubmit}
            disabled={isLoading || session?.user?.user_type === "CLIENT"}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="submit"
            color="secondary"
            onClick={async () => {
              if (session?.user?.user_type === "CLIENT") {
                handleNextTab();
              } else {
                await handleSubmit();
                handleNextTab();
              }
            }}
          >
            {session?.user?.user_type === "CLIENT"
              ? "Go to Next"
              : "Save & Next"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteForProperty;
