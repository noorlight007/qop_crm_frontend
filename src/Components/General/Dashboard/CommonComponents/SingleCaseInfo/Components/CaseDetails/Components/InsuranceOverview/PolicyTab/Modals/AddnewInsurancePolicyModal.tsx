import { useAddNewInsurancePolicyMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/InsuranceOverview/InsuranceOverviewApi";
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

interface AddNewInsurancePolicyModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseAlias: string | string[];
  insuranceOverviewAlias: string | undefined;
}

const AddnewInsurancePolicyModal: React.FC<AddNewInsurancePolicyModalProps> = ({
  isOpen,
  toggle,
  caseAlias,
  insuranceOverviewAlias,
}) => {
  const [addNewInsurancePolicy, { isLoading }] =
    useAddNewInsurancePolicyMutation();

  const [formData, setFormData] = useState({
    policy_type: "",
    provider: "",
    insurer_reference: "",
    status: "",
    applicant: "",
    in_trust: "",
    guaranteed: "",
    in_trust_date: null,
    pays_out: "",
    sum_assured: "",
    monthly_sum_assured: "",
    premium: "",
    final_premium: "",
    premium_quoted: "",
    premium_payment_type: "",
    contents: "",
    full_rebuild_value_of_home: "",
    number_of_dependents: null,
    policy_term: "",
    policy_term_validity: "MONTHS",
    cover_period: null,
    deferred_period: null,
    deferred_period_type: "WEEKS",
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
    fracture_cover: false,
    sick_pay_provision: false,
    accidental_damage: false,
    personal_possessions: false,
    valuables_outside_home_protection: false,
    contents_insured_accidental_damage: false,
    buildings_insured_accidental_damage: false,
    high_value_items_over_1500: false,
    client_accepted_recommendation: false,
    non_standard_terms_issued: false,
    part_of_menu_plan: false,
    budget_plan_sold: false,
    notes: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.policy_type) {
      toast.error("Please select a policy type");
      return;
    }

    if (!formData.provider) {
      toast.error("Please select a provider");
      return;
    }

    try {
      await addNewInsurancePolicy({
        case_alias: caseAlias,
        insurance_overview_alias: insuranceOverviewAlias,
        payload: formData,
      }).unwrap();
      toast.success("Insurance policy added successfully");
      toggle();
      // Reset form
      setFormData({
        policy_type: "",
        provider: "",
        insurer_reference: "",
        status: "",
        applicant: "",
        in_trust: "",
        guaranteed: "",
        in_trust_date: null,
        pays_out: "",
        sum_assured: "",
        monthly_sum_assured: "",
        premium: "",
        final_premium: "",
        premium_quoted: "",
        premium_payment_type: "",
        contents: "",
        full_rebuild_value_of_home: "",
        number_of_dependents: null,
        policy_term: "",
        policy_term_validity: "MONTHS",
        cover_period: null,
        deferred_period: null,
        deferred_period_type: "WEEKS",
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
        fracture_cover: false,
        sick_pay_provision: false,
        accidental_damage: false,
        personal_possessions: false,
        valuables_outside_home_protection: false,
        contents_insured_accidental_damage: false,
        buildings_insured_accidental_damage: false,
        high_value_items_over_1500: false,
        client_accepted_recommendation: false,
        non_standard_terms_issued: false,
        part_of_menu_plan: false,
        budget_plan_sold: false,
        notes: "",
      });
    } catch (err) {
      console.error("Failed to add insurance policy", err);
      toast.error("Failed to add insurance policy");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Insurance Policy</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <h5 className="mb-3">Basic Information</h5>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>
                  Policy Type <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  value={formData.policy_type}
                  onChange={(e) => handleChange("policy_type", e.target.value)}
                  required
                >
                  <option value="">Select...</option>
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
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>
                  Provider <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  value={formData.provider}
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
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Insurer Reference</Label>
                <Input
                  type="text"
                  value={formData.insurer_reference}
                  onChange={(e) =>
                    handleChange("insurer_reference", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Status</Label>
                <Input
                  type="select"
                  value={formData.status}
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
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Applicant</Label>
                <Input
                  type="select"
                  value={formData.applicant}
                  onChange={(e) => handleChange("applicant", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="APPLICANT_1">Applicant 1</option>
                  <option value="APPLICANT_2">Applicant 2</option>
                  <option value="APPLICANT_3">Applicant 3</option>
                  <option value="APPLICANT_4">Applicant 4</option>
                  <option value="JOINT">Joint</option>
                </Input>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>In Trust</Label>
                <Input
                  type="select"
                  value={formData.in_trust}
                  onChange={(e) => handleChange("in_trust", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="N/A">N/A</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Guaranteed</Label>
                <Input
                  type="select"
                  value={formData.guaranteed}
                  onChange={(e) => handleChange("guaranteed", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="N/A">N/A</option>
                  <option value="GUARANTEED">Guaranteed</option>
                  <option value="REVIEWABLE">Reviewable</option>
                  <option value="AGE_COSTED">Age Costed</option>
                </Input>
              </FormGroup>
            </Col>
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
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Pays Out</Label>
                <Input
                  type="select"
                  value={formData.pays_out}
                  onChange={(e) => handleChange("pays_out", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="ONE_YEAR">1 Year</option>
                  <option value="TWO_YEARS">2 Years</option>
                  <option value="FIVE_YEARS">5 Years</option>
                  <option value="FULL_TERM">Full Term</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          {/* Financial Information */}
          <h5 className="mb-3 mt-4">Financial Information</h5>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Sum Assured</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.sum_assured}
                  onChange={(e) => handleChange("sum_assured", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Monthly Sum Assured</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.monthly_sum_assured}
                  onChange={(e) =>
                    handleChange("monthly_sum_assured", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Premium</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.premium}
                  onChange={(e) => handleChange("premium", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Final Premium</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.final_premium}
                  onChange={(e) =>
                    handleChange("final_premium", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Premium Quoted</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.premium_quoted}
                  onChange={(e) =>
                    handleChange("premium_quoted", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Premium Payment Type</Label>
                <Input
                  type="select"
                  value={formData.premium_payment_type}
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
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Contents</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.contents}
                  onChange={(e) => handleChange("contents", e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Full Rebuild Value of Home</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.full_rebuild_value_of_home}
                  onChange={(e) =>
                    handleChange("full_rebuild_value_of_home", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Number of Dependents</Label>
                <Input
                  type="number"
                  value={formData.number_of_dependents ?? ""}
                  onChange={(e) =>
                    handleChange("number_of_dependents", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Policy Terms */}
          <h5 className="mb-3 mt-4">Policy Terms</h5>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>
                  Policy Term<span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.policy_term}
                  onChange={(e) => handleChange("policy_term", e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Policy Term Validity</Label>
                <Input
                  type="select"
                  value={formData.policy_term_validity}
                  onChange={(e) =>
                    handleChange("policy_term_validity", e.target.value)
                  }
                >
                  <option value="MONTHS">Months</option>
                  <option value="YEARS">Years</option>
                </Input>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Cover Period</Label>
                <Input
                  type="number"
                  value={formData.cover_period ?? ""}
                  onChange={(e) => handleChange("cover_period", e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Deferred Period</Label>
                <Input
                  type="number"
                  value={formData.deferred_period ?? ""}
                  onChange={(e) =>
                    handleChange("deferred_period", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>Deferred Period Type</Label>
                <Input
                  type="select"
                  value={formData.deferred_period_type}
                  onChange={(e) =>
                    handleChange("deferred_period_type", e.target.value)
                  }
                >
                  <option value="WEEKS">Weeks</option>
                  <option value="MONTHS">Months</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          {/* Important Dates */}
          <h5 className="mb-3 mt-4">Important Dates</h5>
          <Row>
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
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup>
                <Label>On Risk Date</Label>
                <Input
                  type="date"
                  value={formData.on_risk_date ?? ""}
                  onChange={(e) => handleChange("on_risk_date", e.target.value)}
                />
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
              </FormGroup>
            </Col>
          </Row>

          <Row>
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
              </FormGroup>
            </Col>
          </Row>

          {/* Boolean Flags */}
          <h5 className="mb-3 mt-4">Policy Features</h5>
          <Row>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.waiver_of_premium}
                  onChange={(e) =>
                    handleChange("waiver_of_premium", e.target.checked)
                  }
                />
                <Label check>Waiver of Premium</Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.indexation}
                  onChange={(e) => handleChange("indexation", e.target.checked)}
                />
                <Label check>Indexation</Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.total_permanent_disability_cover}
                  onChange={(e) =>
                    handleChange(
                      "total_permanent_disability_cover",
                      e.target.checked
                    )
                  }
                />
                <Label check>Total Permanent Disability Cover</Label>
              </FormGroup>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.fracture_cover}
                  onChange={(e) =>
                    handleChange("fracture_cover", e.target.checked)
                  }
                />
                <Label check>Fracture Cover</Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.sick_pay_provision}
                  onChange={(e) =>
                    handleChange("sick_pay_provision", e.target.checked)
                  }
                />
                <Label check>Sick Pay Provision</Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.accidental_damage}
                  onChange={(e) =>
                    handleChange("accidental_damage", e.target.checked)
                  }
                />
                <Label check>Accidental Damage</Label>
              </FormGroup>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.personal_possessions}
                  onChange={(e) =>
                    handleChange("personal_possessions", e.target.checked)
                  }
                />
                <Label check>Personal Possessions</Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.valuables_outside_home_protection}
                  onChange={(e) =>
                    handleChange(
                      "valuables_outside_home_protection",
                      e.target.checked
                    )
                  }
                />
                <Label check>Valuables Outside Home Protection</Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.contents_insured_accidental_damage}
                  onChange={(e) =>
                    handleChange(
                      "contents_insured_accidental_damage",
                      e.target.checked
                    )
                  }
                />
                <Label check>Contents Insured Accidental Damage</Label>
              </FormGroup>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.buildings_insured_accidental_damage}
                  onChange={(e) =>
                    handleChange(
                      "buildings_insured_accidental_damage",
                      e.target.checked
                    )
                  }
                />
                <Label check>Buildings Insured Accidental Damage</Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.high_value_items_over_1500}
                  onChange={(e) =>
                    handleChange("high_value_items_over_1500", e.target.checked)
                  }
                />
                <Label check>High Value Items Over £1500</Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.client_accepted_recommendation}
                  onChange={(e) =>
                    handleChange(
                      "client_accepted_recommendation",
                      e.target.checked
                    )
                  }
                />
                <Label check>Client Accepted Recommendation</Label>
              </FormGroup>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.non_standard_terms_issued}
                  onChange={(e) =>
                    handleChange("non_standard_terms_issued", e.target.checked)
                  }
                />
                <Label check>Non-Standard Terms Issued</Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.part_of_menu_plan}
                  onChange={(e) =>
                    handleChange("part_of_menu_plan", e.target.checked)
                  }
                />
                <Label check>Part of Menu Plan</Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  className="border-primary"
                  checked={formData.budget_plan_sold}
                  onChange={(e) =>
                    handleChange("budget_plan_sold", e.target.checked)
                  }
                />
                <Label check>Budget Plan Sold</Label>
              </FormGroup>
            </Col>
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
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isLoading}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Policy"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddnewInsurancePolicyModal;
