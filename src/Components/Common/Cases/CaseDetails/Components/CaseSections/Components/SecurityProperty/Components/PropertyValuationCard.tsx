import {
  useGetCaseLoanDetailsQuery,
  useGetLoanDetailsQuery,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/LoanDetails/LoanDetailsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "next/navigation";
import { FC } from "react";
import {
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";

const PropertyValuationCard: FC = () => {
  const { casealias } = useParams();
  const { data, isLoading } = useGetCaseLoanDetailsQuery(casealias);

  // Ensure data exists and has elements before accessing [0]
  const loandetailsAlias =
    Array.isArray(data) && data.length > 0 ? data[0].alias : null;

  const { data: loandetailsData, isLoading: isLoandetailsDataLoading } =
    useGetLoanDetailsQuery(
      loandetailsAlias
        ? { case_alias: casealias, loanDetails_alias: loandetailsAlias }
        : skipToken
    );

  // Extract values from API if available, otherwise use props fallback
  const purchasePrice = loandetailsData?.purchase_price;
  const estimatedValue = loandetailsData?.estimated_value;

  return (
    <Card className="shadow-sm border-0 mb-2">
      <CardBody>
        <Row>
          {!(purchasePrice === 0 && estimatedValue !== 0) && (
            <Col sm={6} className="mb-2">
              <FormGroup>
                <Label for="property_value">Property Purchase Price</Label>
                <InputGroup>
                  <InputGroupText>£</InputGroupText>
                  <Input
                    id="property_value"
                    name="property_value"
                    type="text"
                    value={purchasePrice}
                    readOnly
                    className="form-control"
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          )}

          <Col sm={6} className="mb-3">
            <FormGroup>
              <Label for="estimated_valuation">
                Property Estimated Valuation
              </Label>
              <InputGroup>
                <InputGroupText>£</InputGroupText>
                <Input
                  id="estimated_valuation"
                  name="estimated_valuation"
                  type="text"
                  value={estimatedValue}
                  readOnly
                  className="form-control"
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default PropertyValuationCard;
