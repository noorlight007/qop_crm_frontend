import { useAddNewInsurancePolicyMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/InsuranceOverview/InsuranceOverviewApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { AddNewInsurancePolicyModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/InsuranceOverviewTypes";
import getCurrencySign from "@/utils/currency";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const AddnewInsurancePolicyModal: React.FC<AddNewInsurancePolicyModalProps> = ({
  isOpen,
  toggle,
  caseAlias,
  insuranceOverviewAlias,
}) => {
  const [addNewInsurancePolicy, { isLoading }] =
    useAddNewInsurancePolicyMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const [formData, setFormData] = useState({
    policy_type: "LIFE_LEVEL",
    provider: "",
    insurer_reference: "",
    sum_assured: "",
    cover_period: null,
    status: "",
    deferred_period: null,
    deferred_period_type: "WEEKS",
    monthly_sum_assured: "",
    number_of_dependents: null,
    sick_pay_provision: false,
    sick_pay_provision_notes: "",
    buildings_insured_accidental_damage: false,
    valuables_outside_home_protection: false,
    contents_insured_accidental_damage: false,
    accidental_damage: false,
    full_rebuild_value_of_home: "",
    high_value_items_over_1500: false,
    personal_possessions: false,
    contents: "",
    premium: "",
    premium_payment_type: "",
    applicant: "",
    in_trust: "",
    in_trust_date: null,
    guaranteed: "",
    policy_term: "",
    policy_term_validity: "MONTHS",
    pays_out: "",
    final_premium: "",
    premium_quoted: "",
    part_of_menu_plan: false,
    budget_plan_sold: false,
    budget_plan_benefit_period: null,
    budget_plan_benefit_period_type: "MONTHS",
    case_submitted_date: null,
    case_underwritten_date: null,
    terms_expiry_date: null,
    on_risk_date: null,
    cancelled_date: null,
    renewal_date: null,
    not_proceeding_date: null,
    waiver_of_premium: false,
    indexation: false,
    total_permanent_disability_cover: false,
    client_accepted_recommendation: false,
    non_standard_terms_issued: false,
    non_standard_terms_from_lender: "",
    fracture_cover: false,
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    e.preventDefault();

    try {
      await addNewInsurancePolicy({
        case_alias: caseAlias,
        insurance_overview_alias: insuranceOverviewAlias,
        payload: formData,
      }).unwrap();
      toast.success("Insurance policy added successfully");
      setErrors({});
      try {
        await updateSectionCompleteStatus({
          case_alias: caseAlias,
          section_data: { is_insurance_loan_details: true },
        });
      } catch (err) {
        console.error("Failed to update section complete status:", err);
      }
      toggle();
      // Reset form
      setFormData({
        policy_type: "LIFE_LEVEL",
        provider: "",
        insurer_reference: "",
        sum_assured: "",
        cover_period: null,
        status: "",
        deferred_period: null,
        deferred_period_type: "WEEKS",
        monthly_sum_assured: "",
        number_of_dependents: null,
        sick_pay_provision: false,
        sick_pay_provision_notes: "",
        buildings_insured_accidental_damage: false,
        valuables_outside_home_protection: false,
        contents_insured_accidental_damage: false,
        accidental_damage: false,
        full_rebuild_value_of_home: "",
        high_value_items_over_1500: false,
        personal_possessions: false,
        contents: "",
        premium: "",
        premium_payment_type: "",
        applicant: "",
        in_trust: "",
        in_trust_date: null,
        guaranteed: "",
        policy_term: "",
        policy_term_validity: "MONTHS",
        pays_out: "",
        final_premium: "",
        premium_quoted: "",
        part_of_menu_plan: false,
        budget_plan_sold: false,
        budget_plan_benefit_period: null,
        budget_plan_benefit_period_type: "MONTHS",
        case_submitted_date: null,
        case_underwritten_date: null,
        terms_expiry_date: null,
        on_risk_date: null,
        cancelled_date: null,
        renewal_date: null,
        not_proceeding_date: null,
        waiver_of_premium: false,
        indexation: false,
        total_permanent_disability_cover: false,
        client_accepted_recommendation: false,
        non_standard_terms_issued: false,
        non_standard_terms_from_lender: "",
        fracture_cover: false,
        notes: "",
      });
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
        "Failed to add insurance policy";
      toast.error(firstMsg);
      console.error("Failed to add insurance policy", err);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Add New Insurance Policy</h3>
      </ModalHeader>
      <Form onSubmit={handleSubmit} id="add-policy-form">
        <ModalBody>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Policy Type*</Label>
                <Input
                  type="select"
                  value={formData.policy_type ?? ""}
                  onChange={(e) => handleChange("policy_type", e.target.value)}
                  required
                >
                  <option value="LIFE_LEVEL">Life Level</option>
                  <option value="LIFE_DECREASING">Life Decreasing</option>
                  <option value="LIFE_INCREASING">Life Increasing</option>
                  <option value="CRITICAL_ILLNESS_LEVEL">
                    Critical Illness Level
                  </option>
                  <option value="CRITICAL_ILLNESS_DECREASING">
                    Critical Illness Decreasing
                  </option>
                  <option value="CRITICAL_ILLNESS_INCREASING">
                    Critical Illness Increasing
                  </option>
                  <option value="LIFE_AND_CRITICAL_ILLNESS_LEVEL">
                    Life and Critical Illness Level
                  </option>
                  <option value="LIFE_AND_CRITICAL_ILLNESS_DECREASING">
                    Life and Critical Illness Decreasing
                  </option>
                  <option value="LIFE_AND_CRITICAL_ILLNESS_INCREASING">
                    Life and Critical Illness Increasing
                  </option>
                  <option value="INCOME_PROTECTION">Income Protection</option>
                  <option value="WHOLE_OF_LIFE">Whole Of Life</option>
                  <option value="BUILDINGS_INSURANCE">
                    Buildings Insurance
                  </option>
                  <option value="CONTENTS_INSURANCE">Contents Insurance</option>
                  <option value="BUILDINGS_AND_CONTENTS_INSURANCE">
                    Buildings and Contents Insurance
                  </option>
                  <option value="LANDLORDS_INSURANCE">
                    Landlords Insurance
                  </option>
                  <option value="PRIVATE_MEDICAL_COVER">
                    Private Medical Cover
                  </option>
                  <option value="TAX_EFFICIENT_LIFE_COVER">
                    Tax Efficient Life Cover (Ltd. Company)
                  </option>
                  <option value="KEY_PERSON">Key Person</option>
                  <option value="SHAREHOLDER_PROTECTION">
                    Shareholder Protection
                  </option>
                  <option value="BUY_TO_LET_COVER">Buy To Let Cover</option>
                  <option value="PROTECTING_GIFTS_PROTECTING_THE_ESTATE">
                    Protecting Gifts Protecting the Estate
                  </option>
                  <option value="ACCIDENT_SICKNESS_UNEMPLOYMENT">
                    Accident Sickness and Unemployment
                  </option>
                  <option value="MORTGAGE_PROTECTION">
                    Mortgage Protection
                  </option>
                  <option value="FAMILY_INCOME_BENEFIT">
                    Family Income Benefit
                  </option>
                  <option value="PRIVATE_HEALTH_INSURANCE">
                    Private Health Insurance
                  </option>
                  <option value="COMMERCIAL_INSURANCE">
                    Commercial Insurance
                  </option>
                  <option value="BUSINESS_PROTECTION">
                    Business Protection
                  </option>
                  <option value="RELEVANT_LIFE">Relevant Life</option>
                </Input>
                {errors.premium_payment_type && (
                  <div className="text-danger">
                    {errors.premium_payment_type}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Provider*</Label>
                <Input
                  type="select"
                  value={formData.provider ?? ""}
                  onChange={(e) => handleChange("provider", e.target.value)}
                  required
                >
                  <option value="">Select...</option>
                  <option value="AEGON">Aegon</option>
                  <option value="AGEAS">Ageas</option>
                  <option value="AIG">AIG</option>
                  <option value="ALLIANZ">Allianz</option>
                  <option value="AVIVA">Aviva</option>
                  <option value="AXA">AXA</option>
                  <option value="AXIS_CAPITAL">Axis Capital</option>
                  <option value="BRITISH_FRIENDLY">British Friendly</option>
                  <option value="CANADA_LIFE">Canada Life</option>
                  <option value="COVEA">Covea</option>
                  <option value="FORTRESS">Fortress</option>
                  <option value="HISCOX">Hiscox</option>
                  <option value="LEGAL_AND_GENERAL">Legal &amp; General</option>
                  <option value="LEXELLE">Lexelle</option>
                  <option value="LV">LV=</option>
                  <option value="MODUS_UNDERWRITING">Modus Underwriting</option>
                  <option value="OLD_MUTUAL_WEALTH">Old Mutual Wealth</option>
                  <option value="ONE_FAMILY">One Family</option>
                  <option value="PEN_UNDERWRITING">Pen Underwriting</option>
                  <option value="PLUM_UNDERWRITING">Plum Underwriting</option>
                  <option value="ROYAL_LONDON">Royal London</option>
                  <option value="RSA">RSA</option>
                  <option value="SCOTTISH_WIDOWS">Scottish Widows</option>
                  <option value="THE_EXETER">The Exeter</option>
                  <option value="UK_GENERAL">UK General</option>
                  <option value="VITALITY_LIFE">Vitality Life</option>
                  <option value="ZURICH">Zurich</option>
                </Input>
                {errors.applicant && (
                  <div className="text-danger">{errors.applicant}</div>
                )}
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Insurer's Reference</Label>
                <Input
                  type="text"
                  value={formData.insurer_reference ?? ""}
                  onChange={(e) =>
                    handleChange("insurer_reference", e.target.value)
                  }
                />
                {errors.insurer_reference && (
                  <div className="text-danger">{errors.insurer_reference}</div>
                )}
              </FormGroup>
            </Col>

            {formData.policy_type === "LIFE_LEVEL" && (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label>Sum Assured</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.sum_assured ?? ""}
                    onInput={limitDecimalPlaces}
                    onChange={(e) =>
                      handleChange("sum_assured", e.target.value)
                    }
                  />
                  {errors.sum_assured && (
                    <div className="text-danger">{errors.sum_assured}</div>
                  )}
                </FormGroup>
              </Col>
            )}

            {formData.policy_type === "ACCIDENT_SICKNESS_UNEMPLOYMENT" && (
              <>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Cover Period(Months)</Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      value={formData.cover_period ?? ""}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "." || e.key === ",") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handleChange("cover_period", e.target.value)
                      }
                    />
                    {errors.cover_period && (
                      <div className="text-danger">{errors.cover_period}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Deferred Period(Months)</Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      value={formData.deferred_period ?? ""}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "." || e.key === ",") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handleChange("deferred_period", e.target.value)
                      }
                    />
                    {errors.deferred_period && (
                      <div className="text-danger">
                        {errors.deferred_period}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </>
            )}

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Status</Label>
                <Input
                  type="select"
                  value={formData.status ?? ""}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="DISCLOSURE_AND_INITIALS_DOCUMENTS">
                    Disclosure &amp; Initials Documents
                  </option>
                  <option value="ID_AND_POA">ID &amp; POA</option>
                  <option value="PROOF_OF_INCOME">Proof of Income</option>
                  <option value="BANK_STATEMENTS_3_MONTHS">
                    Bank statements - 3 months
                  </option>
                  <option value="PROOF_OF_DEPOSIT">Proof of Deposit</option>
                  <option value="CREDIT_REPORTS">Credit Reports</option>
                  <option value="RESEARCH_AND_ILLUSTRATIONS">
                    Research &amp; Illustrations
                  </option>
                  <option value="AFFORD_CALC_AND_AIP">
                    Afford Calc &amp; AIP
                  </option>
                  <option value="APPLICATION">Application</option>
                  <option value="SUITABILITY_LETTER">Suitability Letter</option>
                  <option value="OFFER">Offer</option>
                  <option value="FACTFIND_NOTES">Factfind Notes</option>
                  <option value="REMEDIAL_NOTES">Remedial Notes</option>
                  <option value="INSURANCES">Insurances</option>
                  <option value="OTHER">Other</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDERWRITTEN">Underwritten</option>
                  <option value="ON_RISK">On Risk</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="NOT_PROCEEDING">Not Proceeding</option>
                </Input>
                {errors.provider && (
                  <div className="text-danger">{errors.provider}</div>
                )}
              </FormGroup>
            </Col>

            {formData.policy_type === "INCOME_PROTECTION" && (
              <>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Deferred Period</Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "." || e.key === ",") {
                          e.preventDefault();
                        }
                      }}
                      value={formData.deferred_period ?? ""}
                      onChange={(e) =>
                        handleChange("deferred_period", e.target.value)
                      }
                    />
                    {errors.deferred_period && (
                      <div className="text-danger">
                        {errors.deferred_period}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Deferred Period Type</Label>
                    <Input
                      type="select"
                      value={formData.deferred_period_type ?? ""}
                      onChange={(e) =>
                        handleChange("deferred_period_type", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="WEEKS">Weeks</option>
                      <option value="MONTHS">Months</option>
                    </Input>
                    {errors.deferred_period_type && (
                      <div className="text-danger">
                        {errors.deferred_period_type}
                      </div>
                    )}
                  </FormGroup>
                </Col>

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Monthly Sum Assured({getCurrencySign()})</Label>
                    <Input
                      type="number"
                      step="0.01"
                      onInput={limitDecimalPlaces}
                      value={formData.monthly_sum_assured ?? ""}
                      onChange={(e) =>
                        handleChange("monthly_sum_assured", e.target.value)
                      }
                    />
                    {errors.monthly_sum_assured && (
                      <div className="text-danger">
                        {errors.monthly_sum_assured}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Number of Dependents</Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "." || e.key === ",") {
                          e.preventDefault();
                        }
                      }}
                      value={formData.number_of_dependents ?? ""}
                      onChange={(e) =>
                        handleChange("number_of_dependents", e.target.value)
                      }
                    />
                    {errors.number_of_dependents && (
                      <div className="text-danger">
                        {errors.number_of_dependents}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col
                  sm={12}
                  md={6}
                  lg={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      className="border-primary"
                      checked={formData.sick_pay_provision ?? false}
                      onChange={(e) =>
                        handleChange("sick_pay_provision", e.target.checked)
                      }
                    />
                    <Label check>Sick Pay Provision</Label>
                    {errors.sick_pay_provision && (
                      <div className="text-danger">{errors.sick_pay_provision}</div>
                    )}
                  </FormGroup>
                </Col>
                {formData.sick_pay_provision && (
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <Label>Sick Pay Provision Notes</Label>
                      <Input
                        type="textarea"
                        value={formData.sick_pay_provision_notes ?? ""}
                        onChange={(e) =>
                          handleChange(
                            "sick_pay_provision_notes",
                            e.target.value,
                          )
                        }
                      />
                      {errors.sick_pay_provision_notes && (
                        <div className="text-danger">
                          {errors.sick_pay_provision_notes}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                )}
              </>
            )}

            {(formData.policy_type === "BUILDINGS_INSURANCE" ||
              formData.policy_type === "BUILDINGS_AND_CONTENTS_INSURANCE") && (
              <>
                <Col
                  sm={12}
                  md={6}
                  lg={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      className="border-primary"
                      checked={
                        formData.buildings_insured_accidental_damage ?? false
                      }
                      onChange={(e) =>
                        handleChange(
                          "buildings_insured_accidental_damage",
                          e.target.checked,
                        )
                      }
                    />
                    <Label check>
                      Is it important to you that your buildings are insured
                      against accidental damage?
                    </Label>
                    {errors.buildings_insured_accidental_damage && (
                      <div className="text-danger">
                        {errors.buildings_insured_accidental_damage}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </>
            )}
            {(formData.policy_type === "CONTENTS_INSURANCE" ||
              formData.policy_type === "BUILDINGS_AND_CONTENTS_INSURANCE") && (
              <Col
                sm={12}
                md={6}
                lg={4}
                className="d-flex justify-content-center align-items-center"
              >
                <FormGroup check>
                  <Input
                    type="checkbox"
                    className="border-primary"
                    checked={
                      formData.valuables_outside_home_protection ?? false
                    }
                    onChange={(e) =>
                      handleChange(
                        "valuables_outside_home_protection",
                        e.target.checked,
                      )
                    }
                  />
                  <Label check>
                    Is it important that your valuables are protected against
                    all risks when they are outside the home?
                  </Label>
                  {errors.valuables_outside_home_protection && (
                    <div className="text-danger">
                      {errors.valuables_outside_home_protection}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}

            {(formData.policy_type === "CONTENTS_INSURANCE" ||
              formData.policy_type === "BUILDINGS_AND_CONTENTS_INSURANCE") && (
              <>
                <Col
                  sm={12}
                  md={6}
                  lg={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      className="border-primary"
                      checked={
                        formData.contents_insured_accidental_damage ?? false
                      }
                      onChange={(e) =>
                        handleChange(
                          "contents_insured_accidental_damage",
                          e.target.checked,
                        )
                      }
                    />
                    <Label check>
                      Is it important to you that your contents are insured
                      against accidental damage?
                    </Label>
                    {errors.contents_insured_accidental_damage && (
                      <div className="text-danger">
                        {errors.contents_insured_accidental_damage}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </>
            )}
            {(formData.policy_type === "CONTENTS_INSURANCE" ||
              formData.policy_type === "BUILDINGS_INSURANCE" ||
              formData.policy_type === "BUILDINGS_AND_CONTENTS_INSURANCE") && (
              <>
                <Col
                  sm={12}
                  md={6}
                  lg={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      className="border-primary"
                      checked={formData.accidental_damage ?? false}
                      onChange={(e) =>
                        handleChange("accidental_damage", e.target.checked)
                      }
                    />
                    <Label check>Accidental Damage</Label>
                    {errors.accidental_damage && (
                      <div className="text-danger">{errors.accidental_damage}</div>
                    )}
                  </FormGroup>
                </Col>
              </>
            )}
            {(formData.policy_type === "BUILDINGS_INSURANCE" ||
              formData.policy_type === "BUILDINGS_AND_CONTENTS_INSURANCE") && (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label>Full Rebuild Value of your Home({getCurrencySign()})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    onInput={limitDecimalPlaces}
                    value={formData.full_rebuild_value_of_home ?? ""}
                    onChange={(e) =>
                      handleChange("full_rebuild_value_of_home", e.target.value)
                    }
                  />
                  {errors.full_rebuild_value_of_home && (
                    <div className="text-danger">{errors.full_rebuild_value_of_home}</div>
                  )}
                </FormGroup>
              </Col>
            )}

            {(formData.policy_type === "CONTENTS_INSURANCE" ||
              formData.policy_type === "BUILDINGS_AND_CONTENTS_INSURANCE") && (
              <>
                <Col
                  sm={12}
                  md={6}
                  lg={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      className="border-primary"
                      checked={formData.high_value_items_over_1500 ?? false}
                      onChange={(e) =>
                        handleChange(
                          "high_value_items_over_1500",
                          e.target.checked,
                        )
                      }
                    />
                    <Label check>
                      Do you have any specific item of contents worth more than
                      {getCurrencySign()}1500 to replace?
                    </Label>  
                    {errors.high_value_items_over_1500 && (
                      <div className="text-danger">{errors.high_value_items_over_1500}</div>
                    )}
                  </FormGroup>
                </Col>
              </>
            )}
            {(formData.policy_type === "CONTENTS_INSURANCE" ||
              formData.policy_type === "BUILDINGS_AND_CONTENTS_INSURANCE") && (
              <>
                <Col
                  sm={12}
                  md={6}
                  lg={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      className="border-primary"
                      checked={formData.personal_possessions ?? false}
                      onChange={(e) =>
                        handleChange("personal_possessions", e.target.checked)
                      }
                    />
                    <Label check>Personal Possessions</Label>
                    {errors.personal_possessions && (
                      <div className="text-danger">{errors.personal_possessions}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Contents({getCurrencySign()})</Label>
                    <Input
                      type="number"
                      step="0.01"
                      onInput={limitDecimalPlaces}
                      value={formData.contents ?? ""}
                      onChange={(e) => handleChange("contents", e.target.value)}
                    />
                    {errors.contents && (
                      <div className="text-danger">{errors.contents}</div>
                    )}
                  </FormGroup>
                </Col>
              </>
            )}

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Premium({getCurrencySign()})</Label>
                <Input
                  type="number"
                  step="0.01"
                  onInput={limitDecimalPlaces}
                  value={formData.premium ?? ""}
                  onChange={(e) => handleChange("premium", e.target.value)}
                />
                {errors.premium && (
                  <div className="text-danger">{errors.premium}</div>
                )}
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Premium Payment Type</Label>
                <Input
                  type="select"
                  value={formData.premium_payment_type ?? ""}
                  onChange={(e) =>
                    handleChange("premium_payment_type", e.target.value)
                  }
                >
                  <option value="">Select...</option>
                  <option value="SINGLE_PREMIUM">Single Premium</option>
                  <option value="QUATERLY">Quarterly</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="FOUR_WEEKLY">4 Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="BI_ANNUALLY">Bi Annually</option>
                  <option value="ANNUALLY">Annually</option>
                </Input>
                {errors.premium_payment_type && (
                  <div className="text-danger">{errors.premium_payment_type}</div>
                )}
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Applicant</Label>
                <Input
                  type="select"
                  value={formData.applicant ?? ""}
                  onChange={(e) => handleChange("applicant", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="APPLICANT_1">Applicant 1</option>
                  <option value="APPLICANT_2">Applicant 2</option>
                  <option value="APPLICANT_3">Applicant 3</option>
                  <option value="APPLICANT_4">Applicant 4</option>
                  <option value="JOINT">Joint</option>
                </Input>
                {errors.applicant && (
                  <div className="text-danger">{errors.applicant}</div>
                )}
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>In Trust</Label>
                <Input
                  type="select"
                  value={formData.in_trust ?? ""}
                  onChange={(e) => handleChange("in_trust", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="N/A">N/A</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </Input>
                {errors.in_trust && (
                  <div className="text-danger">{errors.in_trust}</div>
                )}
              </FormGroup>
            </Col>
            {formData.in_trust === "YES" && (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label>In Trust Date</Label>
                  <Input
                    type="date"
                    value={formData.in_trust_date ?? ""}
                    onChange={(e) =>
                      handleChange("in_trust_date", e.target.value)
                    }
                  />
                  {errors.in_trust_date && (
                    <div className="text-danger">{errors.in_trust_date}</div>
                  )}
                </FormGroup>
              </Col>
            )}

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Guaranteed/Reviewable</Label>
                <Input
                  type="select"
                  value={formData.guaranteed ?? ""}
                  onChange={(e) => handleChange("guaranteed", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="N/A">N/A</option>
                  <option value="GUARANTEED">Guaranteed</option>
                  <option value="REVIEWABLE">Reviewable</option>
                  <option value="AGE_COSTED">Age Costed</option>
                </Input>
                {errors.guaranteed && (
                  <div className="text-danger">{errors.guaranteed}</div>
                )}
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Policy Term*</Label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.policy_term ?? ""}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "." || e.key === ",") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) =>
                    handleChange(
                      "policy_term",
                      e.target.value === ""
                        ? ""
                        : String(Math.trunc(Number(e.target.value))),
                    )
                  }
                  required
                />
                {errors.policy_term && (
                  <div className="text-danger">{errors.policy_term}</div>
                )}
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Policy Term Validity</Label>
                <Input
                  type="select"
                  value={formData.policy_term_validity ?? ""}
                  onChange={(e) =>
                    handleChange("policy_term_validity", e.target.value)
                  }
                >
                  <option value="">Select...</option>
                  <option value="MONTHS">Months</option>
                  <option value="YEARS">Years</option>
                </Input>
                {errors.policy_term_validity && (
                  <div className="text-danger">{errors.policy_term_validity}</div>
                )}
              </FormGroup>
            </Col>

            {formData.policy_type === "INCOME_PROTECTION" && (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label>Pays Out</Label>
                  <Input
                    type="select"
                    value={formData.pays_out ?? ""}
                    onChange={(e) => handleChange("pays_out", e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="ONE_YEAR">1 Year</option>
                    <option value="TWO_YEARS">2 Years</option>
                    <option value="FIVE_YEARS">5 Years</option>
                    <option value="FULL_TERM">Full Term</option>
                  </Input>
                  {errors.pays_out && (
                    <div className="text-danger">{errors.pays_out}</div>
                  )}
                </FormGroup>
              </Col>
            )}

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Final Premium({getCurrencySign()})</Label>
                <Input
                  type="number"
                  step="0.01"
                  onInput={limitDecimalPlaces}
                  value={formData.final_premium ?? ""}
                  onChange={(e) =>
                    handleChange("final_premium", e.target.value)
                  }
                />
                {errors.final_premium && (
                  <div className="text-danger">{errors.final_premium}</div>
                )}
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Premium Quoted({getCurrencySign()})</Label>
                <Input
                  type="number"
                  step="0.01"
                  onInput={limitDecimalPlaces}
                  value={formData.premium_quoted ?? ""}
                  onChange={(e) =>
                    handleChange("premium_quoted", e.target.value)
                  }
                />
                {errors.premium_quoted && (
                  <div className="text-danger">{errors.premium_quoted}</div>
                )}
              </FormGroup>
            </Col>

            <Col
              sm={12}
              md={6}
              lg={4}
              className="d-flex justify-content-center align-items-center"
            >
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.part_of_menu_plan ?? false}
                  onChange={(e) =>
                    handleChange("part_of_menu_plan", e.target.checked)
                  }
                />
                <Label check>Part of a Menu Plan</Label>
                {errors.part_of_menu_plan && (
                  <div className="text-danger">{errors.part_of_menu_plan}</div>
                )}
              </FormGroup>
            </Col>

            {formData.policy_type === "INCOME_PROTECTION" && (
              <>
                {" "}
                <Col
                  sm={12}
                  md={6}
                  lg={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      className="border-primary"
                      checked={formData.budget_plan_sold ?? false}
                      onChange={(e) =>
                        handleChange("budget_plan_sold", e.target.checked)
                      }
                    />
                    <Label check>Budget Plan Sold</Label>
                    {errors.budget_plan_sold && (
                      <div className="text-danger">{errors.budget_plan_sold}</div>
                    )}
                  </FormGroup>
                </Col>
                {formData.budget_plan_sold && (
                  <>
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <Label>Budget Plan Benefit Period</Label>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>,
                          ) => {
                            if (e.key === "." || e.key === ",") {
                              e.preventDefault();
                            }
                          }}
                          value={formData.budget_plan_benefit_period ?? ""}
                          onChange={(e) =>
                            handleChange(
                              "budget_plan_benefit_period",
                              e.target.value,
                            )
                          }
                        />
                        {errors.budget_plan_benefit_period && (
                          <div className="text-danger">{errors.budget_plan_benefit_period}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <Label>Budget Plan Payment Type</Label>
                        <Input
                          type="select"
                          value={formData.budget_plan_benefit_period_type ?? ""}
                          onChange={(e) =>
                            handleChange(
                              "budget_plan_benefit_period_type",
                              e.target.value,
                            )
                          }
                        >
                          <option value="MONTHS">Months</option>
                          <option value="YEARS">Years</option>
                        </Input>
                        {errors.budget_plan_benefit_period_type && (
                          <div className="text-danger">{errors.budget_plan_benefit_period_type}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </>
                )}
              </>
            )}

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Case Submitted Date</Label>
                <Input
                  type="date"
                  value={formData.case_submitted_date ?? ""}
                  onChange={(e) =>
                    handleChange("case_submitted_date", e.target.value)
                  }
                />
                {errors.case_submitted_date && (
                  <div className="text-danger">{errors.case_submitted_date}</div>
                )}
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Case Underwritten Date</Label>
                <Input
                  type="date"
                  value={formData.case_underwritten_date ?? ""}
                  onChange={(e) =>
                    handleChange("case_underwritten_date", e.target.value)
                  }
                />
                {errors.case_underwritten_date && (
                  <div className="text-danger">{errors.case_underwritten_date}</div>
                )}
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Terms Expiry Date</Label>
                <Input
                  type="date"
                  value={formData.terms_expiry_date ?? ""}
                  onChange={(e) =>
                    handleChange("terms_expiry_date", e.target.value)
                  }
                />
                {errors.terms_expiry_date && (
                  <div className="text-danger">{errors.terms_expiry_date}</div>
                )}
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>On Risk Date</Label>
                <Input
                  type="date"
                  value={formData.on_risk_date ?? ""}
                  onChange={(e) => handleChange("on_risk_date", e.target.value)}
                />
                {errors.on_risk_date && (
                  <div className="text-danger">{errors.on_risk_date}</div>
                )}
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Cancelled Date</Label>
                <Input
                  type="date"
                  value={formData.cancelled_date ?? ""}
                  onChange={(e) =>
                    handleChange("cancelled_date", e.target.value)
                  }
                />
                {errors.cancelled_date && (
                  <div className="text-danger">{errors.cancelled_date}</div>
                )}
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Renewal Date</Label>
                <Input
                  type="date"
                  value={formData.renewal_date ?? ""}
                  onChange={(e) => handleChange("renewal_date", e.target.value)}
                />
                {errors.renewal_date && (
                  <div className="text-danger">{errors.renewal_date}</div>
                )}
              </FormGroup>
            </Col>

            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Not Proceeding Date</Label>
                <Input
                  type="date"
                  value={formData.not_proceeding_date ?? ""}
                  onChange={(e) =>
                    handleChange("not_proceeding_date", e.target.value)
                  }
                />
                {errors.not_proceeding_date && (
                  <div className="text-danger">{errors.not_proceeding_date}</div>
                )}
              </FormGroup>
            </Col>

            <Col
              sm={12}
              md={6}
              lg={4}
              className="d-flex justify-content-center align-items-center"
            >
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.waiver_of_premium ?? false}
                  onChange={(e) =>
                    handleChange("waiver_of_premium", e.target.checked)
                  }
                />
                <Label check>Waiver of Premium</Label>
                {errors.waiver_of_premium && (
                  <div className="text-danger">{errors.waiver_of_premium}</div>
                )}
              </FormGroup>
            </Col>
            <Col
              sm={12}
              md={6}
              lg={4}
              className="d-flex justify-content-center align-items-center"
            >
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.indexation ?? false}
                  onChange={(e) => handleChange("indexation", e.target.checked)}
                />
                <Label check>Indexation</Label>
                {errors.indexation && (
                  <div className="text-danger">{errors.indexation}</div>
                )}
              </FormGroup>
            </Col>
            {(formData.policy_type === "LIFE_LEVEL" ||
              formData.policy_type === "LIFE_DECREASING" ||
              formData.policy_type === "LIFE_INCREASING" ||
              formData.policy_type === "CRITICAL_ILLNESS_LEVEL" ||
              formData.policy_type === "CRITICAL_ILLNESS_DECREASING" ||
              formData.policy_type === "CRITICAL_ILLNESS_INCREASING" ||
              formData.policy_type === "LIFE_AND_CRITICAL_ILLNESS_LEVEL" ||
              formData.policy_type === "LIFE_AND_CRITICAL_ILLNESS_DECREASING" ||
              formData.policy_type === "LIFE_AND_CRITICAL_ILLNESS_INCREASING" ||
              "WHOLE_OF_LIFE" ||
              formData.policy_type === "FAMILY_INCOME_BENEFIT" ||
              formData.policy_type === "PRIVATE_HEALTH_INSURANCE" ||
              formData.policy_type === "FAMILY_INCOME_BENEFIT" ||
              formData.policy_type === "PRIVATE_HEALTH_INSURANCE" ||
              formData.policy_type === "RELEVANT_LIFE") && (
              <Col
                sm={12}
                md={6}
                lg={4}
                className="d-flex justify-content-center align-items-center"
              >
                <FormGroup check>
                  <Input
                    type="checkbox"
                    className="border-primary"
                    checked={formData.total_permanent_disability_cover ?? false}
                    onChange={(e) =>
                      handleChange(
                        "total_permanent_disability_cover",
                        e.target.checked,
                      )
                    }
                  />
                  <Label check>Total & Permanent Disability Cover</Label>
                  {errors.total_permanent_disability_cover && (
                    <div className="text-danger">{errors.total_permanent_disability_cover}</div>
                  )}
                </FormGroup>
              </Col>
            )}

            <Col
              sm={12}
              md={6}
              lg={4}
              className="d-flex justify-content-center align-items-center"
            >
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.client_accepted_recommendation ?? false}
                  onChange={(e) =>
                    handleChange(
                      "client_accepted_recommendation",
                      e.target.checked,
                    )
                  }
                />
                <Label check>Have clients accepted this recommendation?</Label>
                {errors.client_accepted_recommendation && (
                  <div className="text-danger">{errors.client_accepted_recommendation}</div>
                )}
              </FormGroup>
            </Col>

            <Col
              sm={12}
              md={6}
              lg={4}
              className="d-flex justify-content-center align-items-center"
            >
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.non_standard_terms_issued ?? false}
                  onChange={(e) =>
                    handleChange("non_standard_terms_issued", e.target.checked)
                  }
                />
                <Label check>Have non-standard terms been issued?</Label>
                {errors.non_standard_terms_issued && (
                  <div className="text-danger">{errors.non_standard_terms_issued}</div>
                )}
              </FormGroup>
            </Col>

            {formData.non_standard_terms_issued && (
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label>Copy and paste Non-standard terms from lender</Label>
                  <Input
                    type="textarea"
                    value={formData.non_standard_terms_from_lender ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "non_standard_terms_from_lender",
                        e.target.value,
                      )
                    }
                  />
                  {errors.non_standard_terms_from_lender && (
                    <div className="text-danger">
                      {errors.non_standard_terms_from_lender}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}

            {(formData.policy_type === "LIFE_LEVEL" ||
              formData.policy_type === "LIFE_DECREASING" ||
              formData.policy_type === "LIFE_INCREASING" ||
              formData.policy_type === "CRITICAL_ILLNESS_LEVEL" ||
              formData.policy_type === "CRITICAL_ILLNESS_DECREASING" ||
              formData.policy_type === "CRITICAL_ILLNESS_INCREASING" ||
              formData.policy_type === "LIFE_AND_CRITICAL_ILLNESS_LEVEL" ||
              formData.policy_type === "LIFE_AND_CRITICAL_ILLNESS_DECREASING" ||
              formData.policy_type === "LIFE_AND_CRITICAL_ILLNESS_INCREASING" ||
              formData.policy_type === "ACCIDENT_SICKNESS_UNEMPLOYMENT" ||
              formData.policy_type === "PRIVATE_HEALTH_INSURANCE" ||
              formData.policy_type === "WHOLE_OF_LIFE" ||
              formData.policy_type === "PRIVATE_MEDICAL_COVER" ||
              formData.policy_type === "ACCIDENT_SICKNESS_UNEMPLOYMENT" ||
              formData.policy_type === "PRIVATE_HEALTH_INSURANCE" ||
              formData.policy_type === "RELEVANT_LIFE") && (
              <Col
                sm={12}
                md={6}
                lg={4}
                className="d-flex justify-content-center align-items-center"
              >
                <FormGroup check>
                  <Input
                    type="checkbox"
                    className="border-primary"
                    checked={formData.fracture_cover ?? false}
                    onChange={(e) =>
                      handleChange("fracture_cover", e.target.checked)
                    }
                  />
                  <Label check>Fracture Cover</Label>
                  {errors.fracture_cover && (
                    <div className="text-danger">{errors.fracture_cover}</div>
                  )}
                </FormGroup>
              </Col>
            )}
          </Row>

          {/* Notes */}
          <h5 className="mb-3 mt-4">Additional Information</h5>
          <Row>
            <Col sm={12}>
              <FormGroup>
                <Label>Notes</Label>
                <Input
                  type="textarea"
                  rows={5}
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
                {errors.notes && (
                  <div className="text-danger">{errors.notes}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={isLoading}
            form="add-policy-form"
          >
            {isLoading ? "Adding..." : "Add Policy"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddnewInsurancePolicyModal;
