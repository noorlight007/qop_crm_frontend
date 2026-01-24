import { RootState } from "@/Redux/Store";
import { DisclaimerTabContentsProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/BudgetPlannerTypes";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

const DisclaimerTabContents: FC<DisclaimerTabContentsProps> = ({
  updateField,
}) => {
  const budgetPlannerData = useSelector(
    (state: RootState) => state.budgetPlanner
  );
  const [isChecked, setIsChecked] = useState(
    budgetPlannerData.disclaimer || false
  );
  const [details, setDetails] = useState(
    budgetPlannerData.disclaimer_details || ""
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    updateField("disclaimer", newValue);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDetails(newValue);
    updateField("disclaimer_details", newValue);
  };

  useEffect(() => {
    setIsChecked(budgetPlannerData.disclaimer || false);
    setDetails(budgetPlannerData.disclaimer_details || "");
  }, [budgetPlannerData]);

  const disclaimerText = (
    <>
      <p className="mb-2">
        I/we confirm that the budget planner has been completed accurately and
        reflects our current monthly expenditure.
      </p>
      <p className="mb-0">
        I/we agree to inform our adviser of any changes to our expenditure.
      </p>
    </>
  );

  return (
    <Card className="mt-3 shadow-sm">
      <CardHeader className="bg-light d-flex align-items-center justify-content-between">
        <span className="fw-bold text-primary">Disclaimer</span>
      </CardHeader>
      <CardBody>
        <FormGroup check className="d-flex align-items-start">
          <Input
            type="checkbox"
            id="Disclaimer"
            name="Disclaimer"
            className="mt-1 me-3"
            checked={isChecked}
            onChange={handleCheckboxChange}
            data-val="true"
            data-val-required="The Disclaimer field is required."
          />
          <Label for="Disclaimer" className="text-muted">
            {disclaimerText}
          </Label>
        </FormGroup>
        <FormGroup className="mt-3">
          <Label for="DisclaimerDetails" className="text-muted">
            Additional Details (optional)
          </Label>
          <Input
            type="textarea"
            id="DisclaimerDetails"
            name="DisclaimerDetails"
            value={details}
            onChange={handleDetailsChange}
            placeholder="Enter any additional details about the disclaimer..."
          />
        </FormGroup>
      </CardBody>
    </Card>
  );
};

export default DisclaimerTabContents;
