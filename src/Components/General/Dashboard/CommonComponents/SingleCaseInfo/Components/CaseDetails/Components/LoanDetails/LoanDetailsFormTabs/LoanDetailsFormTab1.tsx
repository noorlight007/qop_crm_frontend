import { LoanDetailsFormTab1Props } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/LoanDetailsTypes";
import LenderList from "@/utils/LenderList";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

const LoanDetailsFormTab1: React.FC<LoanDetailsFormTab1Props> = ({
  formData,
  handleFormChange,
}) => {
  return (
    <Form>
      <Row>
        {/* First Column */}
        <Col md={6}>
          <FormGroup>
            <Label>Application Type</Label>
            <Input
              type="select"
              name="application_type"
              value={formData.application_type}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select......</option>
              <option value="BUSINESS_LOAN">Business Loan</option>
              <option value="BUY_TO_LET">Buy to Let Mortgage</option>
              <option value="COMMERCIAL_MORTGAGE">Commercial Mortgage</option>
              <option value="HMO_MORTGAGE">HMO Mortgage</option>
              <option value="RESIDENTIAL_MORTGAGE">Residential Mortgage</option>
              <option value="SECOND_CHARGE_MORTGAGE">
                Second Charge Mortgage
              </option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Mortgage Type</Label>
            <Input
              type="select"
              name="mortgage_type"
              value={formData.mortgage_type}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select......</option>
              <option value="PURCHASE">Purchase</option>
              <option value="REMORTGAGE">Remortgage</option>
              <option value="SECURED_LOAN">Secured Loan</option>
              <option value="FURTHER_ADVANCE">Further Advance</option>
              <option value="PRODUCT_TRANSFER">Product Transfer</option>
              <option value="OTHER">Other</option>
              <option value="UNSECURED">Unsecured</option>
              <option value="INVOICE_DISCOUNTING">Invoice Discounting</option>
              <option value="ASSET_FINANCE">Asset Finance</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Loan Purpose</Label>
            <Input
              type="select"
              name="loan_purpose"
              value={formData.loan_purpose}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select......</option>
              <option value="PURCHASE">Purchase</option>
              <option value="LIKE_FOR_LIKE_REMORTGAGE">
                Like for Like Remortgage
              </option>
              <option value="BUSINESS_PURPOSES">Business Purposes</option>
              <option value="DEBT_CONSOLIDATION">Debt Consolidation</option>
              <option value="DIVORCE_SETTLEMENT">Divorce Settlement</option>
              <option value="HOLIDAYS_CARS">Holidays/Cars</option>
              <option value="HOME_IMPROVEMENTS">Home Improvements</option>
              <option value="OTHER_PROPERTY_PURCHASE">
                Other Property Purchase
              </option>
              <option value="SCHOOL_FEES">School Fees</option>
              <option value="RATE_SWITCH">
                Rate Switch (switch to better rate)
              </option>
              <option value="TAX_BILL">Tax Bill</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Borrower Type</Label>
            <Input
              type="select"
              name="borrower_type"
              value={formData.borrower_type}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select......</option>
              <option value="HOMEMOVER">Homemover</option>
              <option value="FIRST_TIME_BUYER">First Time Buyer</option>
              <option value="RE_MORTGAGE">Re-Mortgage</option>
              <option value="CAPITAL_RAISE">Capital Raise</option>
              <option value="HELP_TO_BUY">Help to Buy</option>
              <option value="SHARED_OWNERSHIP">Shared Ownership</option>
              <option value="RIGHT_TO_BUY">Right to Buy</option>
              <option value="LATER_LIFE_LENDING">Later Life Lending</option>
              <option value="EQUITY_RELEASE">Equity Release</option>
              <option value="BUY_TO_LET">Buy to Let</option>
              <option value="LET_TO_BUY">Let to Buy</option>
              <option value="FIRST_TIME_LANDLORD">First Time Landlord</option>
              <option value="PORTFOLIO_LANDLORD">Portfolio Landlord</option>
              <option value="SHARED_EQUITY">Shared Equity</option>
              <option value="ISLAMIC_MORTGAGE">Islamic Mortgage</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Interest Rate Type</Label>
            <Input
              type="select"
              name="interest_rate_type"
              value={formData.interest_rate_type}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="FIXED">Fixed</option>
              <option value="VARIABLE">Variable</option>
              <option value="TRACKER">Tracker</option>
              <option value="LIBOR_LINKED">Libor Linked</option>
              <option value="DISCOUNT">Discount</option>
              <option value="CAPPED">Capped</option>
              <option value="ALL">All</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>
              Interest Rate{" "}
              <small className="text-muted text-warning">
                (This is Read-Only Field)
              </small>{" "}
            </Label>
            <Input
              type="text"
              name="interest_rate"
              readOnly
              value={formData.interest_rate || 0}
              placeholder="No value set yet"
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </FormGroup>
        </Col>

        {/* Second Column */}
        <Col md={6}>
          <FormGroup>
            <Label>Product Term</Label>
            <Input
              type="select"
              name="product_term"
              value={formData.product_term}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="ONE_YEAR">1 Year</option>
              <option value="TWO_YEARS">2 Years</option>
              <option value="THREE_YEARS">3 Years</option>
              <option value="FOUR_YEARS">4 Years</option>
              <option value="FIVE_PLUS_YEARS">5+ Years</option>
              <option value="FULL_TERM">Full Term</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Lender</Label>
            <Input
              type="select"
              name="lender"
              value={formData.lender}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select...</option>
              {LenderList.map((lender) => (
                <option key={lender.value} value={lender.value}>
                  {lender.label}
                </option>
              ))}
            </Input>
          </FormGroup>
          {formData.lender === "OTHER" && (
            <FormGroup>
              <Label>Other Lender Note</Label>
              <Input
                type="text"
                name="other_lender_note"
                value={formData.other_lender_note}
                onChange={(e) =>
                  handleFormChange(e.target.name, e.target.value)
                }
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Repayment Method</Label>
            <Input
              type="select"
              name="repayment_method"
              value={formData.repayment_method}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="CAPITAL_AND_INTEREST">Capital and Interest</option>
              <option value="INTEREST_ONLY">Interest Only</option>
              <option value="PART_AND_PART">Part And Part</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Repayment Vehicle</Label>
            <Input
              type="select"
              name="repayment_vehicle"
              value={formData.repayment_vehicle}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="ENDOWMENT">Endowment</option>
              <option value="INDIVIDUAL_SAVINGS_ACCOUNT">
                Individual Savings Account
              </option>
              <option value="PENSION">Pension</option>
              <option value="SALE_OF_MORTGAGED_PROPERTY">
                Sale of Mortgaged Property
              </option>
              <option value="SALE_OF_OTHER_PROPERTY">
                Sale of Other Property
              </option>
              <option value="INHERITANCE">Inheritance</option>
              <option value="MORTGAGE_LINKED_INVESTMENT">
                Mortgage-Linked Investment
              </option>
              <option value="REVERT_TO_CAPITAL_REPAYMENT">
                Revert to Capital Repayment
              </option>
              <option value="SALE_OF_NON_PROPERTY_ASSETS">
                Sale of non-Property Assets
              </option>
              <option value="OTHER">Other</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Lender's Reference</Label>
            <Input
              type="text"
              name="lenders_reference"
              value={formData.lenders_reference}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default LoanDetailsFormTab1;
