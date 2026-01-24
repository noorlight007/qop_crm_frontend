import LoadingSpinner from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import {
  useGetProductDetailsQuery,
  useUpdateProductDetailsMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ProductDetails/ProductDetailsApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";

const getErrorMessage = (err: any) => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (typeof err?.data === "string") return err.data;

  const collect = (value: any): string[] => {
    if (value == null) return [];
    if (typeof value === "string") return [value];
    if (Array.isArray(value))
      return value.map((v) => (typeof v === "string" ? v : JSON.stringify(v)));
    if (typeof value === "object") {
      try {
        return Object.values(value).flatMap((v) => collect(v));
      } catch {
        return [String(value)];
      }
    }
    return [String(value)];
  };

  if (err?.data?.message) return String(err.data.message);

  if (err?.data && typeof err.data === "object") {
    const msgs = collect(err.data);
    if (msgs.length) return msgs.join(", ");
  }

  if (err?.error) return String(err.error);
  if (err?.message) {
    if (/status code/i.test(err.message)) return "Server returned an error";
    return String(err.message);
  }

  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
};

const camelToSnake = (s: string) =>
  s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const getFieldError = (errors: Record<string, string>, name: string) => {
  if (!errors) return undefined;
  if (errors[name]) return errors[name];
  const snake = camelToSnake(name);
  if (errors[snake]) return errors[snake];
  return undefined;
};

const ProductContent: React.FC = () => {
  const params = useParams();
  const { casealias } = params;
  const { data: session } = useSession();
  const submitActionRef = useRef<"save" | "next">("save");
  const formRef = useRef<HTMLFormElement>(null);

  // State to manage form data
  const [formData, setFormData] = useState({
    product_description: "",
    initial_rate: 0.0,
    initial_rate_type: "",
    initial_rate_period_type: "",
    initial_rate_period: 0.0,
    initial_rate_date_period: null,
    reversion_rate: "",
    max_ltv: "",
    annual_percentage_rate: "",
    product_class: "",
    early_repayment_charge: 0.0,
    early_repayment_charge_end_date: null,
    initial_monthly_payment: "",
    initial_monthly_payment_including_fees: "",
    monthly_payment_after_initial_period: "",
    true_cost_over_initial_period: "",
    true_cost_over_term: "",
    true_cost_without_fees: "",
    loan_required_including_fees: "",
    lender_product_fee: "",
    arrangement_fee_added_to_loan: "",
    lender_solicitor_fee: "",
    valuation_fee: "",
    booking_fee: "",
    booking_fee_added_to_loan: "",
    procuration_fee: "",
    processing_consent: false,
    application_review: false,
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );
  const { data: productDetails, isLoading } = useGetProductDetailsQuery({
    case_alias: casealias,
  });
  const [updateProductDetails, { isLoading: isUpdating }] =
    useUpdateProductDetailsMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();
  const dispatch = useAppDispatch();
  // Update form data when API data is received
  // Update useEffect to properly map the API response
  useEffect(() => {
    if (productDetails && productDetails[0]) {
      const details = productDetails[0];
      setFormData({
        product_description: details.product_description || "",
        initial_rate: details.initial_rate || 0,
        initial_rate_type: details.initial_rate_type || "",
        initial_rate_period_type: details.initial_rate_period_type || "",
        initial_rate_period: details.initial_rate_period || null,
        initial_rate_date_period: details.initial_rate_date_period || null,
        reversion_rate: details.reversion_rate || null,
        max_ltv: details.max_ltv || null,
        annual_percentage_rate: details.annual_percentage_rate || null,
        product_class: details.product_class || "",
        early_repayment_charge: details.early_repayment_charge || null,
        early_repayment_charge_end_date:
          details.early_repayment_charge_end_date || null,
        initial_monthly_payment: details.initial_monthly_payment || null,
        initial_monthly_payment_including_fees:
          details.initial_monthly_payment_including_fees || null,
        monthly_payment_after_initial_period:
          details.monthly_payment_after_initial_period || null,
        true_cost_over_initial_period:
          details.true_cost_over_initial_period || null,
        true_cost_over_term: details.true_cost_over_term || null,
        true_cost_without_fees: details.true_cost_without_fees || null,
        loan_required_including_fees:
          details.loan_required_including_fees || null,
        lender_product_fee: details.lender_product_fee || null,
        lender_solicitor_fee: details.lender_solicitor_fee || null,
        arrangement_fee_added_to_loan:
          details.arrangement_fee_added_to_loan || "",
        valuation_fee: details.valuation_fee || null,
        booking_fee: details.booking_fee || null,
        booking_fee_added_to_loan: details.booking_fee_added_to_loan || "",
        procuration_fee: details.procuration_fee || null,
        processing_consent: details.processing_consent || false,
        application_review: details.application_review || false,
        note: details.note || "",
      });
    }
  }, [productDetails]);

  // Update handleSubmit to include the product alias
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (productDetails && productDetails[0]) {
        // Clean up the form data before sending
        const cleanedFormData = { ...formData };

        // Ensure date fields are properly formatted or null
        if (
          cleanedFormData.initial_rate_date_period === "" ||
          cleanedFormData.initial_rate_date_period === null
        ) {
          cleanedFormData.initial_rate_date_period = null;
        }
        if (
          cleanedFormData.early_repayment_charge_end_date === "" ||
          cleanedFormData.early_repayment_charge_end_date === null
        ) {
          cleanedFormData.early_repayment_charge_end_date = null;
        }

        const response = await updateProductDetails({
          case_alias: casealias,
          product_alias: productDetails[0].alias,
          productUpdatePayload: cleanedFormData,
        });

        if (response.data) {
          toast.success("Product details updated successfully!");
          setErrors({});
          // Only go to next tab if this was a Save & Next action
          try {
            await updateSectionCompleteStatus({
              case_alias: casealias,
              section_data: { is_product: true },
            });
          } catch (err) {
            console.error("Failed to update section complete status:", err);
          }
          if (submitActionRef.current === "next") {
            handleNextTab();
          }
        } else if (response.error) {
          const errData = (response as any).error?.data;
          if (errData && typeof errData === "object") {
            const collect = (value: any): string[] => {
              if (value == null) return [];
              if (typeof value === "string") return [value];
              if (Array.isArray(value))
                return value.map((v) =>
                  typeof v === "string" ? v : JSON.stringify(v),
                );
              if (typeof value === "object") {
                try {
                  return Object.values(value).flatMap((v) => collect(v));
                } catch {
                  return [String(value)];
                }
              }
              return [String(value)];
            };
            const fieldErrors: Record<string, string> = {};
            Object.entries(errData).forEach(([k, v]) => {
              const msgs = collect(v);
              if (msgs.length) fieldErrors[k] = msgs.join(", ");
            });
            if (Object.keys(fieldErrors).length) {
              setErrors(fieldErrors);
              const firstMsg = Object.values(fieldErrors)[0];
              toast.error(firstMsg);
            } else {
              const errorMessage =
                getErrorMessage((response as any).error) ||
                "Failed to update product details";
              toast.error(errorMessage);
            }
          } else {
            const errorMessage =
              getErrorMessage((response as any).error) ||
              "Failed to update product details";
            toast.error(errorMessage);
          }
        } else {
          toast.error("Failed to update product details");
        }
      }
    } catch (error: any) {
      // Handle any unexpected errors
      const errorMessage =
        getErrorMessage(error) || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let processedValue = type === "checkbox" ? checked : value;

    // Handle date fields - ensure empty dates are null instead of empty string
    if (type === "date" && value === "") {
      processedValue = null as any;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      delete copy[camelToSnake(name)];
      return copy;
    });
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

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  return (
    <form
      ref={formRef}
      id="product-form"
      className="p-3"
      onSubmit={handleSubmit}
    >
      <h4 className="mb-4 fs-4 text-primary">Product Details</h4>
      <Row>
        <Col md={4}>
          <FormGroup>
            <Label for="productDescription">Product Description*</Label>
            <Input
              id="productDescription"
              name="product_description"
              type="text"
              value={formData.product_description || ""}
              onChange={handleChange}
              required
            />
            {getFieldError(errors, "product_description") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "product_description")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="initialRate">Initial Rate*</Label>
            <Input
              id="initialRate"
              name="initial_rate"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.initial_rate || ""}
              onChange={handleChange}
              required
            />
            {getFieldError(errors, "initial_rate") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "initial_rate")}
              </div>
            )}
          </FormGroup>
        </Col>

        <Col md={4}>
          <FormGroup>
            <Label for="initialRateType">Initial Rate Type*</Label>
            <Input
              id="initialRateType"
              name="initial_rate_type"
              type="select"
              value={formData.initial_rate_type}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="FIXED">Fixed</option>
              <option value="VARIABLE">Variable</option>
              <option value="TRACKER">Tracker</option>
              <option value="DISCOUNTED">Discounted</option>
              <option value="ALL">All</option>
            </Input>
            {getFieldError(errors, "initial_rate_type") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "initial_rate_type")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="initialRatePeriodType">Initial Rate Period Type*</Label>
            <Input
              id="initialRatePeriodType"
              name="initial_rate_period_type"
              type="select"
              value={formData.initial_rate_period_type}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="MONTHS">Months</option>
              <option value="FIXED_DATE">Fixed Date</option>
              <option value="END_OF_MORTGAGE_TERM">End of Mortgage Term</option>
            </Input>
            {getFieldError(errors, "initial_rate_period_type") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "initial_rate_period_type")}
              </div>
            )}
          </FormGroup>
        </Col>
        {formData.initial_rate_period_type === "MONTHS" && (
          <Col md={4}>
            <FormGroup>
              <Label for="initialRatePeriod">Initial Rate Period</Label>
              <Input
                id="initialRatePeriod"
                name="initial_rate_period"
                type="number"
                min="0"
                step="1"
                value={formData.initial_rate_period || ""}
                onChange={handleChange}
              />
              {getFieldError(errors, "initial_rate_period") && (
                <div className="text-danger small mt-1">
                  {getFieldError(errors, "initial_rate_period")}
                </div>
              )}
            </FormGroup>
          </Col>
        )}
        {formData.initial_rate_period_type === "FIXED_DATE" && (
          <Col md={4}>
            <FormGroup>
              <Label for="fixedDate">Initial Rate Period (Fixed Date)</Label>
              <Input
                id="fixedDate"
                name="initial_rate_date_period"
                type="date"
                value={formData.initial_rate_date_period || ""}
                onChange={handleChange}
              />
              {getFieldError(errors, "initial_rate_date_period") && (
                <div className="text-danger small mt-1">
                  {getFieldError(errors, "initial_rate_date_period")}
                </div>
              )}
            </FormGroup>
          </Col>
        )}
        <Col md={4}>
          <FormGroup>
            <Label for="reversionRate">Reversion Rate(%)</Label>
            <Input
              id="reversionRate"
              name="reversion_rate"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.reversion_rate || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "reversion_rate") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "reversion_rate")}
              </div>
            )}
          </FormGroup>
        </Col>

        <Col md={4}>
          <FormGroup>
            <Label for="maxLTV">Max LTV</Label>
            <Input
              id="maxLTV"
              name="max_ltv"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.max_ltv || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "max_ltv") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "max_ltv")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="annualPercentageRate">Annual Percentage Rate</Label>
            <Input
              id="annualPercentageRate"
              name="annual_percentage_rate"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.annual_percentage_rate || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "annual_percentage_rate") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "annual_percentage_rate")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="productClass">Product Class</Label>
            <Input
              id="productClass"
              name="product_class"
              type="select"
              value={formData.product_class}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="BTL">BTL</option>
              <option value="SECURED">Secured</option>
              <option value="BRIDGING">Bridge</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="LET_TO_BUY">Let To Buy</option>
            </Input>
            {getFieldError(errors, "product_class") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "product_class")}
              </div>
            )}
          </FormGroup>
        </Col>

        <Col md={4}>
          <FormGroup>
            <Label for="earlyRepaymentCharge">Early Repayment Charge</Label>
            <Input
              id="earlyRepaymentCharge"
              name="early_repayment_charge"
              type="text"
              value={formData.early_repayment_charge || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "early_repayment_charge") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "early_repayment_charge")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="earlyRepaymentChargeEndDate">
              Early Repayment Charge End Date
            </Label>
            <Input
              id="earlyRepaymentChargeEndDate"
              name="early_repayment_charge_end_date"
              type="date"
              value={formData.early_repayment_charge_end_date || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "early_repayment_charge_end_date") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "early_repayment_charge_end_date")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="initialMonthlyPayment">
              Initial Monthly Payment (£)
            </Label>
            <Input
              id="initialMonthlyPayment"
              name="initial_monthly_payment"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.initial_monthly_payment}
              onChange={handleChange}
            />
            {getFieldError(errors, "initial_monthly_payment") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "initial_monthly_payment")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="initialMonthlyPaymentIncludingFees">
              Initial Monthly Payment Including Fees (£)
            </Label>
            <Input
              id="initialMonthlyPaymentIncludingFees"
              name="initial_monthly_payment_including_fees"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.initial_monthly_payment_including_fees || ""}
              onChange={handleChange}
            />
            {getFieldError(
              errors,
              "initial_monthly_payment_including_fees",
            ) && (
              <div className="text-danger small mt-1">
                {getFieldError(
                  errors,
                  "initial_monthly_payment_including_fees",
                )}
              </div>
            )}
          </FormGroup>
        </Col>

        <Col md={4}>
          <FormGroup>
            <Label for="monthlyPaymentAfterInitial">
              Monthly Payment After Initial Period (£)
            </Label>
            <Input
              id="monthlyPaymentAfterInitial"
              name="monthly_payment_after_initial_period"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.monthly_payment_after_initial_period || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "monthly_payment_after_initial_period") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "monthly_payment_after_initial_period")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="trueCostOverInitialPeriod">
              True Cost Over Initial Period
            </Label>
            <Input
              id="trueCostOverInitialPeriod"
              name="true_cost_over_initial_period"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.true_cost_over_initial_period || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "true_cost_over_initial_period") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "true_cost_over_initial_period")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="trueCostOverTerm">True Cost Over Term</Label>
            <Input
              id="trueCostOverTerm"
              name="true_cost_over_term"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.true_cost_over_term || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "true_cost_over_term") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "true_cost_over_term")}
              </div>
            )}
          </FormGroup>
        </Col>

        <Col md={4}>
          <FormGroup>
            <Label for="trueCostWithoutFees">True Cost Without Fees</Label>
            <Input
              id="trueCostWithoutFees"
              name="true_cost_without_fees"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.true_cost_without_fees || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "true_cost_without_fees") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "true_cost_without_fees")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="loanRequiredIncludingFees">
              Loan Required Including Fees (£)
            </Label>
            <Input
              id="loanRequiredIncludingFees"
              name="loan_required_including_fees"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.loan_required_including_fees || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "loan_required_including_fees") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "loan_required_including_fees")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="lender_product_fee">Lender Product Fee (£)</Label>
            <Input
              id="lender_product_fee"
              name="lender_product_fee"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.lender_product_fee || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "lender_product_fee") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "lender_product_fee")}
              </div>
            )}
          </FormGroup>
        </Col>

        <Col md={4}>
          <FormGroup>
            <Label for="arrangementFeeAddedToLoan">
              Arrangement Fee Added To Loan
            </Label>
            <Input
              id="arrangementFeeAddedToLoan"
              name="arrangement_fee_added_to_loan"
              type="select"
              value={formData.arrangement_fee_added_to_loan}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </Input>
            {getFieldError(errors, "arrangement_fee_added_to_loan") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "arrangement_fee_added_to_loan")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="lender_solicitor_fee">Lender Solicitors Fee (£)</Label>
            <Input
              id="lender_solicitor_fee"
              name="lender_solicitor_fee"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.lender_solicitor_fee || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "lender_solicitor_fee") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "lender_solicitor_fee")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="valuationFee">Valuation Fee (£)</Label>
            <Input
              id="valuationFee"
              name="valuation_fee"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.valuation_fee || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "valuation_fee") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "valuation_fee")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="bookingFee">Booking Fee (£)</Label>
            <Input
              id="bookingFee"
              name="booking_fee"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.booking_fee || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "booking_fee") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "booking_fee")}
              </div>
            )}
          </FormGroup>
        </Col>

        <Col md={4}>
          <FormGroup>
            <Label for="bookingFeeAddedToLoan">Booking Fee Added to Loan</Label>
            <Input
              id="bookingFeeAddedToLoan"
              name="booking_fee_added_to_loan"
              type="select"
              value={formData.booking_fee_added_to_loan}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
              <option value="NA">N/A</option>
            </Input>
            {getFieldError(errors, "booking_fee_added_to_loan") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "booking_fee_added_to_loan")}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="procurationFee">Procuration Fee (£)</Label>
            <Input
              id="procurationFee"
              name="procuration_fee"
              type="number"
              step="0.01"
              inputMode="decimal"
              onInput={limitDecimalPlaces}
              value={formData.procuration_fee || ""}
              onChange={handleChange}
            />
            {getFieldError(errors, "procuration_fee") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "procuration_fee")}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <hr className="my-4" />

      <div className="consent-section mt-4 border-success p-4 rounded-2">
        <FormGroup check>
          <Input
            type="checkbox"
            id="processingConsent"
            name="processing_consent"
            checked={formData.processing_consent || false}
            onChange={handleChange}
          />
          <Label check for="processingConsent" className="text-primary">
            Processing Consent
          </Label>
        </FormGroup>
        <div className="mt-4">
          <h5 className="fw-bold text-uppercase">
            Confidential Fact Find Declaration
          </h5>
          <p className="text-muted mt-1">
            Please ensure you have completed this form as accurately as
            possible. The information you confirm here will be used to submit
            your application to the mortgage lender who may decline your
            application if the information is later found to be inaccurate.
          </p>

          <h6 className="mt-4 fw-bold">Documents</h6>
          <p className="text-muted mt-1">
            The following documents may assist you in ensuring the information
            provided in this Fact Find is as accurate as possible an are also
            the most common documents requested by lenders to support your
            application:
          </p>
          <ol className="text-muted">
            <li>Identification such as a passport or driver's license</li>
            <li>Address proof such as a utility bill</li>
            <li>Personal and business bank statements</li>
            <li>Income details such as payslips or accounts</li>
            <li>Evidence of deposit (purchases only)</li>
          </ol>
          <small className="text-muted">
            These documents can also be uploaded as part of this form.
          </small>

          <h6 className="mt-4 fw-bold">Property Portfolios</h6>
          <p className="text-muted mt-1">
            If you hold a property portfolio, the lender will expect that you
            have submitted details of any profits or losses to HMRC for tax
            purposes. If you have NOT for any reason submitted your accounting
            information to HMRC, it may be a requirement of the application that
            this is corrected. Where you have NOT yet submitted tax returns,
            please provide details in the notes section of this form of your
            anticipated/projected profit or losses from your portfolio for each
            of the years you have held investment property and an explanation
            why they have not yet been submitted.
          </p>
        </div>
      </div>

      <div className="border-success p-4 rounded-2 mt-4">
        <FormGroup check>
          <Input
            type="checkbox"
            id="applicationReview"
            name="application_review"
            checked={formData.application_review || false}
            onChange={handleChange}
          />
          <Label check for="applicationReview" className="text-primary">
            Application Review
          </Label>
        </FormGroup>

        <h6 className="mt-4 fw-bold text-uppercase">
          Reviewing Your Mortgage Arrangements
        </h6>
        <p className="text-muted mt-1">
          Following Completion of your mortgage or loan and/or setting up and
          insurance policy on your behalf, we will keep in contact with you by
          appropriate means to review your mortgage arrangements and keep you
          informed of any products or services that may be of interest to you.
        </p>
        <small className="text-muted">
          Please tick the box above if you would like QOP Financial Services Ltd
          to contact you regarding your mortgage arrangements.
        </small>
      </div>

      <Row>
        <Col md={12} className="mt-4">
          <FormGroup>
            <Label for="note">Note</Label>
            <Input
              type="textarea"
              id="note"
              name="note"
              rows={4}
              value={formData.note}
              onChange={handleChange}
            />
            {getFieldError(errors, "note") && (
              <div className="text-danger small mt-1">
                {getFieldError(errors, "note")}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button
          color="primary"
          type="submit"
          onClick={() => {
            submitActionRef.current = "save";
          }}
          disabled={
            isUpdating ||
            (session?.user?.user_type === "CLIENT" &&
              productDetails[0]?.updated_by !== null)
          }
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="submit"
          color="secondary"
          onClick={(e) => {
            e.preventDefault();
            if (
              session?.user?.user_type === "CLIENT" &&
              productDetails[0]?.updated_by !== null
            ) {
              handleNextTab();
            } else {
              submitActionRef.current = "next";
              formRef.current?.requestSubmit();
            }
          }}
        >
          {/* {session?.user?.user_type === "CLIENT" ? "Go to Next" : "Save & Next"} */}
          {session?.user?.user_type === "CLIENT" &&
          productDetails[0]?.updated_by !== null
            ? "Go to Next"
            : "Save & Next"}
        </Button>
      </div>
    </form>
  );
};

export default ProductContent;
