import { LoadingSpinner2 } from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import {
  useGetInsurancePoliciesQuery,
  useUpdateInsurancePolicyMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/InsuranceOverview/InsuranceOverviewApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { PolicyTabProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/InsuranceOverviewTypes";
import getCurrencySign from "@/utils/currency";
import formatChoiceFieldValue from "@/utils/formatters";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { TbTrash } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import AddnewInsurancePolicyModal from "./Modals/AddnewInsurancePolicyModal";
import DeleteInsurancePolicyModal from "./Modals/DeleteInsurancePolicyModal";

const PolicyTab: React.FC<PolicyTabProps> = ({ insuranceOverviewAlias }) => {
  const { casealias } = useParams();
  const [activeTab, setActiveTab] = useState<string>("0");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedPolicyForDelete, setSelectedPolicyForDelete] =
    useState<any>(null);

  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  const { data: insurancePoliciesData, isLoading } =
    useGetInsurancePoliciesQuery(
      {
        case_alias: casealias,
        insurance_overview_alias: insuranceOverviewAlias,
      },
      { skip: !insuranceOverviewAlias },
    );

  const [updateInsurancePolicy, { isLoading: isUpdating }] =
    useUpdateInsurancePolicyMutation();

  const [formStates, setFormStates] = useState<any[]>([]);
  const [errorsByIndex, setErrorsByIndex] = useState<
    Record<number, Record<string, string>>
  >({});

  const FieldError: React.FC<{ idx: number; name: string }> = ({
    idx,
    name,
  }) =>
    errorsByIndex[idx]?.[name] ? (
      <div className="text-danger">{errorsByIndex[idx][name]}</div>
    ) : null;

  const dispatch = useAppDispatch();
  const currentTab: string | null = useAppSelector(
    (state: any) => state.caseSections.basicTabId,
  );
  const { data: session } = useSession();

  const submitActionRef = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const handleDeleteClick = (e: React.MouseEvent, policy: any) => {
    e.stopPropagation();
    setSelectedPolicyForDelete(policy);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    if (insurancePoliciesData && Array.isArray(insurancePoliciesData)) {
      setFormStates(insurancePoliciesData.map((policy) => ({ ...policy })));
    }
  }, [insurancePoliciesData]);

  const handleChange = (index: number, field: string, value: any) => {
    setErrorsByIndex((prev) => {
      const copy = { ...prev };
      if (copy[index]) {
        const c = { ...copy[index] };
        delete c[field];
        copy[index] = c;
      }
      return copy;
    });

    setFormStates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent, index: number) => {
    e.preventDefault();
    const policy = formStates[index];
    if (!policy) return;

    try {
      await updateInsurancePolicy({
        case_alias: casealias,
        insurance_overview_alias: insuranceOverviewAlias,
        policy_alias: policy.alias,
        payload: policy,
      }).unwrap();
      toast.success("Insurance policy updated successfully");
      setErrorsByIndex((prev) => {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      });
      // If the submit was triggered by a 'next' action, navigate to next tab
      if (submitActionRef.current === "next") {
        submitActionRef.current = null;
        handleNextTab();
      }
    } catch (err) {
      // parse API validation errors and attach to this policy index
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

      setErrorsByIndex((prev) => ({ ...prev, [index]: flattened }));

      const firstMsg =
        Object.values(flattened)[0] ||
        parsed.non_field_error ||
        "Failed to update insurance policy";
      toast.error(firstMsg);
      console.error("Failed to update insurance policy", err);
    }
  };

  const handleNextTab = () => {
    const nextTabNav: string | null = getNextTabNav(
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

  if (isLoading || !insuranceOverviewAlias) {
    return (
      <div className="p-2">
        <LoadingSpinner2 />
      </div>
    );
  }

  if (!formStates || formStates.length === 0) {
    return (
      <>
        <div className="p-2 mt-3 text-center">
          <p className="mb-3">No insurance policies found.</p>
          <Button color="success" onClick={toggleModal}>
            Add New Policy
          </Button>
        </div>

        <AddnewInsurancePolicyModal
          isOpen={isModalOpen}
          toggle={toggleModal}
          caseAlias={casealias}
          insuranceOverviewAlias={insuranceOverviewAlias}
        />
      </>
    );
  }

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
    <div className="p-2">
      <Nav tabs className="justify-content-center mt-3">
        {formStates.map((policy, index) => (
          <NavItem key={policy.alias}>
            <NavLink
              className={
                activeTab === String(index) ? "active text-secondary" : ""
              }
              onClick={() => setActiveTab(String(index))}
              style={{ cursor: "pointer" }}
            >
              Policy {index + 1} - {formatChoiceFieldValue(policy.policy_type)}
              {canApplicantEdit() && (
                <Button
                  outline
                  color="danger"
                  size="sm"
                  className="ms-2"
                  onClick={(e) => handleDeleteClick(e, policy)}
                >
                  <TbTrash size={16} />
                </Button>
              )}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      <TabContent activeTab={activeTab}>
        {formStates.map((policy, index) => (
          <TabPane tabId={String(index)} key={policy.alias}>
            <Form
              innerRef={(el: any) => {
                if (activeTab === String(index))
                  formRef.current = el as HTMLFormElement;
              }}
              onSubmit={(e) => handleSubmit(e, index)}
              className="mt-3"
            >
              <Row>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Policy Type</Label>
                    <Input
                      type="select"
                      value={policy.policy_type ?? ""}
                      onChange={(e) =>
                        handleChange(index, "policy_type", e.target.value)
                      }
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
                      <option value="INCOME_PROTECTION">
                        Income Protection
                      </option>
                      <option value="WHOLE_OF_LIFE">Whole Of Life</option>
                      <option value="BUILDINGS_INSURANCE">
                        Buildings Insurance
                      </option>
                      <option value="CONTENTS_INSURANCE">
                        Contents Insurance
                      </option>
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
                    <FieldError idx={index} name="policy_type" />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Provider</Label>
                    <Input
                      type="select"
                      value={policy.provider ?? ""}
                      onChange={(e) =>
                        handleChange(index, "provider", e.target.value)
                      }
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
                      <option value="LEGAL_AND_GENERAL">
                        Legal &amp; General
                      </option>
                      <option value="LEXELLE">Lexelle</option>
                      <option value="LV">LV=</option>
                      <option value="MODUS_UNDERWRITING">
                        Modus Underwriting
                      </option>
                      <option value="OLD_MUTUAL_WEALTH">
                        Old Mutual Wealth
                      </option>
                      <option value="ONE_FAMILY">One Family</option>
                      <option value="PEN_UNDERWRITING">Pen Underwriting</option>
                      <option value="PLUM_UNDERWRITING">
                        Plum Underwriting
                      </option>
                      <option value="ROYAL_LONDON">Royal London</option>
                      <option value="RSA">RSA</option>
                      <option value="SCOTTISH_WIDOWS">Scottish Widows</option>
                      <option value="THE_EXETER">The Exeter</option>
                      <option value="UK_GENERAL">UK General</option>
                      <option value="VITALITY_LIFE">Vitality Life</option>
                      <option value="ZURICH">Zurich</option>
                    </Input>
                    <FieldError idx={index} name="provider" />
                  </FormGroup>
                </Col>

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Insurer's Reference</Label>
                    <Input
                      type="text"
                      value={policy.insurer_reference ?? ""}
                      onChange={(e) =>
                        handleChange(index, "insurer_reference", e.target.value)
                      }
                    />
                    <FieldError idx={index} name="insurer_reference" />
                  </FormGroup>
                </Col>

                {policy.policy_type === "LIFE_LEVEL" && (
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <Label>Sum Assured</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={policy.sum_assured ?? ""}
                        onInput={limitDecimalPlaces}
                        onChange={(e) =>
                          handleChange(index, "sum_assured", e.target.value)
                        }
                      />
                      <FieldError idx={index} name="sum_assured" />
                    </FormGroup>
                  </Col>
                )}

                {policy.policy_type === "ACCIDENT_SICKNESS_UNEMPLOYMENT" && (
                  <>
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <Label>Cover Period(Months)</Label>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          value={policy.cover_period ?? ""}
                          onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>,
                          ) => {
                            if (e.key === "." || e.key === ",") {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleChange(index, "cover_period", e.target.value)
                          }
                        />
                        <FieldError idx={index} name="cover_period" />
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <Label>Deferred Period(Months)</Label>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          value={policy.deferred_period ?? ""}
                          onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>,
                          ) => {
                            if (e.key === "." || e.key === ",") {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "deferred_period",
                              e.target.value,
                            )
                          }
                        />
                        <FieldError idx={index} name="deferred_period" />
                      </FormGroup>
                    </Col>
                  </>
                )}

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Status</Label>
                    <Input
                      type="select"
                      value={policy.status ?? ""}
                      onChange={(e) =>
                        handleChange(index, "status", e.target.value)
                      }
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
                      <option value="SUITABILITY_LETTER">
                        Suitability Letter
                      </option>
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
                    <FieldError idx={index} name="status" />
                  </FormGroup>
                </Col>

                {policy.policy_type === "INCOME_PROTECTION" && (
                  <>
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <Label>Deferred Period</Label>
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
                          value={policy.deferred_period ?? ""}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "deferred_period",
                              e.target.value,
                            )
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <Label>Deferred Period Type</Label>
                        <Input
                          type="select"
                          value={policy.deferred_period_type ?? ""}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "deferred_period_type",
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Select...</option>
                          <option value="WEEKS">Weeks</option>
                          <option value="MONTHS">Months</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <Label>Monthly Sum Assured({getCurrencySign()})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          onInput={limitDecimalPlaces}
                          value={policy.monthly_sum_assured ?? ""}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "monthly_sum_assured",
                              e.target.value,
                            )
                          }
                        />
                        <FieldError idx={index} name="monthly_sum_assured" />
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <Label>Number of Dependents</Label>
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
                          value={policy.number_of_dependents ?? ""}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "number_of_dependents",
                              e.target.value,
                            )
                          }
                        />
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
                          checked={policy.sick_pay_provision ?? false}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "sick_pay_provision",
                              e.target.checked,
                            )
                          }
                        />
                        <Label check>Sick Pay Provision</Label>
                      </FormGroup>
                    </Col>
                    {policy.sick_pay_provision && (
                      <Col sm={12} md={6} lg={4}>
                        <FormGroup>
                          <Label>Sick Pay Provision Notes</Label>
                          <Input
                            type="textarea"
                            value={policy.sick_pay_provision_notes ?? ""}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "sick_pay_provision_notes",
                                e.target.value,
                              )
                            }
                          />
                        </FormGroup>
                      </Col>
                    )}
                  </>
                )}

                {(policy.policy_type === "BUILDINGS_INSURANCE" ||
                  policy.policy_type ===
                    "BUILDINGS_AND_CONTENTS_INSURANCE") && (
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
                            policy.buildings_insured_accidental_damage ?? false
                          }
                          onChange={(e) =>
                            handleChange(
                              index,
                              "buildings_insured_accidental_damage",
                              e.target.checked,
                            )
                          }
                        />
                        <Label check>
                          Is it important to you that your buildings are insured
                          against accidental damage?
                        </Label>
                      </FormGroup>
                    </Col>
                  </>
                )}
                {(policy.policy_type === "CONTENTS_INSURANCE" ||
                  policy.policy_type ===
                    "BUILDINGS_AND_CONTENTS_INSURANCE") && (
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
                          policy.valuables_outside_home_protection ?? false
                        }
                        onChange={(e) =>
                          handleChange(
                            index,
                            "valuables_outside_home_protection",
                            e.target.checked,
                          )
                        }
                      />
                      <Label check>
                        Is it important that your valuables are protected
                        against all risks when they are outside the home?
                      </Label>
                    </FormGroup>
                  </Col>
                )}

                {(policy.policy_type === "CONTENTS_INSURANCE" ||
                  policy.policy_type ===
                    "BUILDINGS_AND_CONTENTS_INSURANCE") && (
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
                            policy.contents_insured_accidental_damage ?? false
                          }
                          onChange={(e) =>
                            handleChange(
                              index,
                              "contents_insured_accidental_damage",
                              e.target.checked,
                            )
                          }
                        />
                        <Label check>
                          Is it important to you that your contents are insured
                          against accidental damage?
                        </Label>
                      </FormGroup>
                    </Col>
                  </>
                )}
                {(policy.policy_type === "CONTENTS_INSURANCE" ||
                  policy.policy_type === "BUILDINGS_INSURANCE" ||
                  policy.policy_type ===
                    "BUILDINGS_AND_CONTENTS_INSURANCE") && (
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
                          checked={policy.accidental_damage ?? false}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "accidental_damage",
                              e.target.checked,
                            )
                          }
                        />
                        <Label check>Accidental Damage</Label>
                      </FormGroup>
                    </Col>
                  </>
                )}
                {(policy.policy_type === "BUILDINGS_INSURANCE" ||
                  policy.policy_type ===
                    "BUILDINGS_AND_CONTENTS_INSURANCE") && (
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <Label>
                        Full Rebuild Value of your Home({getCurrencySign()})
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        onInput={limitDecimalPlaces}
                        value={policy.full_rebuild_value_of_home ?? ""}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "full_rebuild_value_of_home",
                            e.target.value,
                          )
                        }
                      />
                    </FormGroup>
                  </Col>
                )}

                {(policy.policy_type === "CONTENTS_INSURANCE" ||
                  policy.policy_type ===
                    "BUILDINGS_AND_CONTENTS_INSURANCE") && (
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
                          checked={policy.high_value_items_over_1500 ?? false}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "high_value_items_over_1500",
                              e.target.checked,
                            )
                          }
                        />
                        <Label check>
                          Do you have any specific item of contents worth more
                          than {getCurrencySign()}1500 to replace?
                        </Label>
                      </FormGroup>
                    </Col>
                  </>
                )}
                {(policy.policy_type === "CONTENTS_INSURANCE" ||
                  policy.policy_type ===
                    "BUILDINGS_AND_CONTENTS_INSURANCE") && (
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
                          checked={policy.personal_possessions ?? false}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "personal_possessions",
                              e.target.checked,
                            )
                          }
                        />
                        <Label check>Personal Possessions</Label>
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={6} lg={4}>
                      <FormGroup>
                        <Label>Contents({getCurrencySign()})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          onInput={limitDecimalPlaces}
                          value={policy.contents ?? ""}
                          onChange={(e) =>
                            handleChange(index, "contents", e.target.value)
                          }
                        />
                        <FieldError idx={index} name="contents" />
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
                      value={policy.premium ?? ""}
                      onChange={(e) =>
                        handleChange(index, "premium", e.target.value)
                      }
                    />
                    <FieldError idx={index} name="premium" />
                  </FormGroup>
                </Col>

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Premium Payment Type</Label>
                    <Input
                      type="select"
                      value={policy.premium_payment_type ?? ""}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "premium_payment_type",
                          e.target.value,
                        )
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
                    <FieldError idx={index} name="premium_payment_type" />
                  </FormGroup>
                </Col>

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Applicant</Label>
                    <Input
                      type="select"
                      value={policy.applicant ?? ""}
                      onChange={(e) =>
                        handleChange(index, "applicant", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="APPLICANT_1">Applicant 1</option>
                      <option value="APPLICANT_2">Applicant 2</option>
                      <option value="APPLICANT_3">Applicant 3</option>
                      <option value="APPLICANT_4">Applicant 4</option>
                      <option value="JOINT">Joint</option>
                    </Input>
                    <FieldError idx={index} name="applicant" />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>In Trust</Label>
                    <Input
                      type="select"
                      value={policy.in_trust ?? ""}
                      onChange={(e) =>
                        handleChange(index, "in_trust", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="N/A">N/A</option>
                      <option value="YES">Yes</option>
                      <option value="NO">No</option>
                    </Input>
                  </FormGroup>
                </Col>
                {policy.in_trust === "YES" && (
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <Label>In Trust Date</Label>
                      <Input
                        type="date"
                        value={policy.in_trust_date ?? ""}
                        onChange={(e) =>
                          handleChange(index, "in_trust_date", e.target.value)
                        }
                      />
                      <FieldError idx={index} name="in_trust_date" />
                    </FormGroup>
                  </Col>
                )}

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Guaranteed/Reviewable</Label>
                    <Input
                      type="select"
                      value={policy.guaranteed ?? ""}
                      onChange={(e) =>
                        handleChange(index, "guaranteed", e.target.value)
                      }
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
                    <Label>
                      Policy Term<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      value={policy.policy_term ?? ""}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "." || e.key === ",") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "policy_term",
                          e.target.value === ""
                            ? ""
                            : String(Math.trunc(Number(e.target.value))),
                        )
                      }
                      required
                    />
                    <FieldError idx={index} name="policy_term" />
                  </FormGroup>
                </Col>

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Policy Term Validity</Label>
                    <Input
                      type="select"
                      value={policy.policy_term_validity ?? ""}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "policy_term_validity",
                          e.target.value,
                        )
                      }
                    >
                      <option value="">Select...</option>
                      <option value="MONTHS">Months</option>
                      <option value="YEARS">Years</option>
                    </Input>
                  </FormGroup>
                </Col>

                {policy.policy_type === "INCOME_PROTECTION" && (
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <Label>Pays Out</Label>
                      <Input
                        type="select"
                        value={policy.pays_out ?? ""}
                        onChange={(e) =>
                          handleChange(index, "pays_out", e.target.value)
                        }
                      >
                        <option value="">Select...</option>
                        <option value="ONE_YEAR">1 Year</option>
                        <option value="TWO_YEARS">2 Years</option>
                        <option value="FIVE_YEARS">5 Years</option>
                        <option value="FULL_TERM">Full Term</option>
                      </Input>
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
                      value={policy.final_premium ?? ""}
                      onChange={(e) =>
                        handleChange(index, "final_premium", e.target.value)
                      }
                    />
                    <FieldError idx={index} name="final_premium" />
                  </FormGroup>
                </Col>

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Premium Quoted({getCurrencySign()})</Label>
                    <Input
                      type="number"
                      step="0.01"
                      onInput={limitDecimalPlaces}
                      value={policy.premium_quoted ?? ""}
                      onChange={(e) =>
                        handleChange(index, "premium_quoted", e.target.value)
                      }
                    />
                    <FieldError idx={index} name="premium_quoted" />
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
                      checked={policy.part_of_menu_plan ?? false}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "part_of_menu_plan",
                          e.target.checked,
                        )
                      }
                    />
                    <Label check>Part of a Menu Plan</Label>
                  </FormGroup>
                </Col>

                {policy.policy_type === "INCOME_PROTECTION" && (
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
                          checked={policy.budget_plan_sold ?? false}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "budget_plan_sold",
                              e.target.checked,
                            )
                          }
                        />
                        <Label check>Budget Plan Sold</Label>
                      </FormGroup>
                    </Col>
                    {policy.budget_plan_sold && (
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
                              value={policy.budget_plan_benefit_period ?? ""}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "budget_plan_benefit_period",
                                  e.target.value,
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                          <FormGroup>
                            <Label>Budget Plan Payment Type</Label>
                            <Input
                              type="select"
                              value={
                                policy.budget_plan_benefit_period_type ?? ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "budget_plan_benefit_period_type",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="">Select...</option>
                              <option value="MONTHS">Months</option>
                              <option value="YEARS">Years</option>
                            </Input>
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
                      value={policy.case_submitted_date ?? ""}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "case_submitted_date",
                          e.target.value,
                        )
                      }
                    />
                  </FormGroup>
                </Col>

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Case Underwritten Date</Label>
                    <Input
                      type="date"
                      value={policy.case_underwritten_date ?? ""}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "case_underwritten_date",
                          e.target.value,
                        )
                      }
                    />
                  </FormGroup>
                </Col>

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Terms Expiry Date</Label>
                    <Input
                      type="date"
                      value={policy.terms_expiry_date ?? ""}
                      onChange={(e) =>
                        handleChange(index, "terms_expiry_date", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>On Risk Date</Label>
                    <Input
                      type="date"
                      value={policy.on_risk_date ?? ""}
                      onChange={(e) =>
                        handleChange(index, "on_risk_date", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Cancelled Date</Label>
                    <Input
                      type="date"
                      value={policy.cancelled_date ?? ""}
                      onChange={(e) =>
                        handleChange(index, "cancelled_date", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Renewal Date</Label>
                    <Input
                      type="date"
                      value={policy.renewal_date ?? ""}
                      onChange={(e) =>
                        handleChange(index, "renewal_date", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>

                <Col sm={12} md={6} lg={4}>
                  <FormGroup>
                    <Label>Not Proceeding Date</Label>
                    <Input
                      type="date"
                      value={policy.not_proceeding_date ?? ""}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "not_proceeding_date",
                          e.target.value,
                        )
                      }
                    />
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
                      checked={policy.waiver_of_premium ?? false}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "waiver_of_premium",
                          e.target.checked,
                        )
                      }
                    />
                    <Label check>Waiver of Premium</Label>
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
                      checked={policy.indexation ?? false}
                      onChange={(e) =>
                        handleChange(index, "indexation", e.target.checked)
                      }
                    />
                    <Label check>Indexation</Label>
                  </FormGroup>
                </Col>
                {(policy.policy_type === "LIFE_LEVEL" ||
                  policy.policy_type === "LIFE_DECREASING" ||
                  policy.policy_type === "LIFE_INCREASING" ||
                  policy.policy_type === "CRITICAL_ILLNESS_LEVEL" ||
                  policy.policy_type === "CRITICAL_ILLNESS_DECREASING" ||
                  policy.policy_type === "CRITICAL_ILLNESS_INCREASING" ||
                  policy.policy_type === "LIFE_AND_CRITICAL_ILLNESS_LEVEL" ||
                  policy.policy_type ===
                    "LIFE_AND_CRITICAL_ILLNESS_DECREASING" ||
                  policy.policy_type ===
                    "LIFE_AND_CRITICAL_ILLNESS_INCREASING" ||
                  "WHOLE_OF_LIFE" ||
                  policy.policy_type === "FAMILY_INCOME_BENEFIT" ||
                  policy.policy_type === "PRIVATE_HEALTH_INSURANCE" ||
                  policy.policy_type === "FAMILY_INCOME_BENEFIT" ||
                  policy.policy_type === "PRIVATE_HEALTH_INSURANCE" ||
                  policy.policy_type === "RELEVANT_LIFE") && (
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
                          policy.total_permanent_disability_cover ?? false
                        }
                        onChange={(e) =>
                          handleChange(
                            index,
                            "total_permanent_disability_cover",
                            e.target.checked,
                          )
                        }
                      />
                      <Label check>Total & Permanent Disability Cover</Label>
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
                      checked={policy.client_accepted_recommendation ?? false}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "client_accepted_recommendation",
                          e.target.checked,
                        )
                      }
                    />
                    <Label check>
                      Have clients accepted this recommendation?
                    </Label>
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
                      checked={policy.non_standard_terms_issued ?? false}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "non_standard_terms_issued",
                          e.target.checked,
                        )
                      }
                    />
                    <Label check>Have non-standard terms been issued?</Label>
                  </FormGroup>
                </Col>

                {policy.non_standard_terms_issued && (
                  <Col sm={12} md={6} lg={4}>
                    <FormGroup>
                      <Label>
                        Copy and paste Non-standard terms from lender
                      </Label>
                      <Input
                        type="textarea"
                        value={policy.non_standard_terms_from_lender ?? ""}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "non_standard_terms_from_lender",
                            e.target.value,
                          )
                        }
                      />
                    </FormGroup>
                  </Col>
                )}

                {(policy.policy_type === "LIFE_LEVEL" ||
                  policy.policy_type === "LIFE_DECREASING" ||
                  policy.policy_type === "LIFE_INCREASING" ||
                  policy.policy_type === "CRITICAL_ILLNESS_LEVEL" ||
                  policy.policy_type === "CRITICAL_ILLNESS_DECREASING" ||
                  policy.policy_type === "CRITICAL_ILLNESS_INCREASING" ||
                  policy.policy_type === "LIFE_AND_CRITICAL_ILLNESS_LEVEL" ||
                  policy.policy_type ===
                    "LIFE_AND_CRITICAL_ILLNESS_DECREASING" ||
                  policy.policy_type ===
                    "LIFE_AND_CRITICAL_ILLNESS_INCREASING" ||
                  policy.policy_type === "ACCIDENT_SICKNESS_UNEMPLOYMENT" ||
                  policy.policy_type === "PRIVATE_HEALTH_INSURANCE" ||
                  policy.policy_type === "WHOLE_OF_LIFE" ||
                  policy.policy_type === "PRIVATE_MEDICAL_COVER" ||
                  policy.policy_type === "ACCIDENT_SICKNESS_UNEMPLOYMENT" ||
                  policy.policy_type === "PRIVATE_HEALTH_INSURANCE" ||
                  policy.policy_type === "RELEVANT_LIFE") && (
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
                        checked={policy.fracture_cover ?? false}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "fracture_cover",
                            e.target.checked,
                          )
                        }
                      />
                      <Label check>Fracture Cover</Label>
                    </FormGroup>
                  </Col>
                )}
              </Row>

              <Row>
                <Col sm={12}>
                  <FormGroup>
                    <Label>Notes</Label>
                    <Input
                      type="textarea"
                      rows={5}
                      value={policy.notes ?? ""}
                      onChange={(e) =>
                        handleChange(index, "notes", e.target.value)
                      }
                    />
                    <FieldError idx={index} name="notes" />
                  </FormGroup>
                </Col>
              </Row>

              <div className="d-flex justify-content-between mt-3 ">
                {canApplicantEdit() && (
                  <Button
                    color="success"
                    onClick={toggleModal}
                    disabled={
                      isUpdating
                      // || session?.user?.role === "APPLICANT"
                    }
                  >
                    Add New Policy
                  </Button>
                )}
                {canApplicantEdit() && (
                  <div className="d-flex gap-2">
                    <Button
                      color="primary"
                      type="submit"
                      disabled={
                        isUpdating ||
                        (session?.user?.role === "APPLICANT" &&
                          policy?.updated_by !== null)
                      }
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        // active policy in this pane
                        if (
                          session?.user?.role === "APPLICANT" &&
                          policy?.updated_by !== null
                        ) {
                          handleNextTab();
                        } else {
                          submitActionRef.current = "next";
                          // ensure the formRef points to the active form
                          formRef.current?.requestSubmit();
                        }
                      }}
                      disabled={isUpdating}
                    >
                      {session?.user?.role === "APPLICANT" &&
                      policy?.updated_by !== null
                        ? "Go To Next"
                        : "Save & Next"}
                    </Button>
                  </div>
                )}
              </div>
            </Form>
          </TabPane>
        ))}
      </TabContent>

      <AddnewInsurancePolicyModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        caseAlias={casealias}
        insuranceOverviewAlias={insuranceOverviewAlias}
      />

      <DeleteInsurancePolicyModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        caseAlias={casealias}
        insuranceOverviewAlias={insuranceOverviewAlias}
        policyAlias={selectedPolicyForDelete?.alias}
        policyType={formatChoiceFieldValue(
          selectedPolicyForDelete?.policy_type,
        )}
      />
    </div>
  );
};

export default PolicyTab;
