import { defaultAnswersData } from "@/Data/CommonComponentsData/SingleCaseInfo/CaseDetailsData/SuitabilityData";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import {
  useGetExtraAnswerQuery,
  useGetSuitabilityQuery,
  useUpdateSuitabilityMutation,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Suitability/SuitabilityApi";
import LoadingSpinner from "@/app/loading";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import ExtraAnswerModal from "./Modals/ExtraAnswerModal";

const SuitabilityContent: React.FC = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
  );
  const [defaultAnswers, setDefaultAnswers] = useState(defaultAnswersData);
  // Modal State
  const [isExtraAnswerModalOpen, setIsExtraAnswerModalOpen] = useState(false);

  // Form State
  const [formValue, setFormValue] = useState({
    circumstances_objectives: {
      circumstances_type: "",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_one_sharia: "",
      question_two_sharia: "",
    },
    budget_affordability: {
      budget_affordability_type: "",
      question_one_answer: "",
      question_two_answer: "",
      question_one_sharia: "",
      question_two_sharia: "",
    },
    new_mortgage_details: {
      new_mortgage_details_type: "",
      question_one_answer: "",
      question_two_answer: "",
      question_one_sharia: "",
      question_two_sharia: "",
    },
    recommending_repayment_method: {
      recommending_repayment_method_type: "",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_four_answer: "",
      question_five_answer: "",
      question_one_sharia: "",
      question_two_sharia: "",
    },
    recommending_mortgage_type: {
      recommending_mortgage_type: "",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_four_answer: "",
      question_one_sharia: "",
      question_two_sharia: "",
    },
    recommending_term: {
      recommending_term: "",
      question_one_answer: "",
      question_one: "",
    },
    recommending_mortgage_lender: {
      recommending_mortgage_lender_type: "",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_one_sharia: "",
    },
    recommending_mortgage_amount: {
      recommending_mortgage_amount: "",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_one_sharia: "",
    },
    costs_fees: {
      costs_fees: "",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_one_sharia: "",
    },
    disadvantage_risks: {
      disadvantage_risks: "",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_four_answer: "",
      question_five_answer: "",
      question_six_answer: "",
      question_seven_answer: "",
      question_eight_answer: "",
      question_nine_answer: "",
      question_one_sharia: "",
      question_two: "",
    },
    cost_advice: {
      cost_advice: "",
      question_one_answer: "",
      question_two_answer: "",
      question_one_sharia: "",
      question_two_sharia: "",
    },
    protection: {
      protection: "",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_four_answer: "",
      question_one_sharia: "",
      question_two: "",
      question_three_sharia: "",
      question_four_sharia: "",
    },
    buildings_insurance: {
      buildings_insurance: "",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_four_answer: "",
      question_one: "",
      question_two: "",
      question_three_sharia: "",
      question_five_sharia: "",
    },
    wills: {
      wills: "",
      question_one_answer: "",
      question_two_answer: "",
      question_three_answer: "",
      question_one: "",
    },
  });

  // Handle modal change
  const toggleExtraAnswerModal = () => {
    setIsExtraAnswerModalOpen(!isExtraAnswerModalOpen);
  };

  // RTK hooks
  const { data: suitabilityData, isLoading } = useGetSuitabilityQuery({
    case_alias: casealias,
  });
  const [updateSuitability, { isLoading: isUpdating }] =
    useUpdateSuitabilityMutation();
  const { data: extraAnswersData, isLoading: isExtraAnswerLoading } =
    useGetExtraAnswerQuery({
      case_alias: casealias,
    });

  // Set initial form data when API data is available
  useEffect(() => {
    if (
      suitabilityData?.circumstances_objectives ||
      suitabilityData?.budget_affordability ||
      suitabilityData?.new_mortgage_details ||
      suitabilityData?.recommending_repayment_method ||
      suitabilityData?.recommending_mortgage_type ||
      suitabilityData?.recommending_term ||
      suitabilityData?.recommending_mortgage_lender ||
      suitabilityData?.recommending_mortgage_amount ||
      suitabilityData?.costs_fees ||
      suitabilityData?.disadvantage_risks ||
      suitabilityData?.cost_advice ||
      suitabilityData?.protection ||
      suitabilityData?.buildings_insurance ||
      suitabilityData?.wills
    ) {
      setFormValue({
        ...formValue,
        circumstances_objectives: {
          circumstances_type:
            suitabilityData.circumstances_objectives.circumstances_type ||
            "GENERAL",
          question_one_answer:
            suitabilityData.circumstances_objectives.question_one_answer ||
            defaultAnswers.circumstancesAndObjectives_G_A1,
          question_two_answer:
            suitabilityData.circumstances_objectives.question_two_answer ||
            defaultAnswers.circumstancesAndObjectives_G_A2,
          question_three_answer:
            suitabilityData.circumstances_objectives.question_three_answer ||
            defaultAnswers.circumstancesAndObjectives_G_A3,
          question_one_sharia:
            suitabilityData.circumstances_objectives.question_one_sharia ||
            defaultAnswers.circumstancesAndObjectives_S_A1,
          question_two_sharia:
            suitabilityData.circumstances_objectives.question_two_sharia ||
            defaultAnswers.circumstancesAndObjectives_S_A2,
        },
        budget_affordability: {
          budget_affordability_type:
            suitabilityData.budget_affordability.budget_affordability_type ||
            "GENERAL",
          question_one_answer:
            suitabilityData.budget_affordability.question_one_answer ||
            defaultAnswers.budgetAndAffordability_G_A1,
          question_two_answer:
            suitabilityData.budget_affordability.question_two_answer ||
            defaultAnswers.budgetAndAffordability_G_A2,
          question_one_sharia:
            suitabilityData.budget_affordability.question_one_sharia ||
            defaultAnswers.budgetAndAffordability_S_A1,
          question_two_sharia:
            suitabilityData.budget_affordability.question_two_sharia ||
            defaultAnswers.budgetAndAffordability_S_A2,
        },
        new_mortgage_details: {
          new_mortgage_details_type:
            suitabilityData.new_mortgage_details.new_mortgage_details_type ||
            "GENERAL",
          question_one_answer:
            suitabilityData.new_mortgage_details.question_one_answer ||
            defaultAnswers.newMortgageDetails_G_A1,
          question_two_answer:
            suitabilityData.new_mortgage_details.question_two_answer ||
            defaultAnswers.newMortgageDetails_G_A2,
          question_one_sharia:
            suitabilityData.new_mortgage_details.question_one_sharia ||
            defaultAnswers.newMortgageDetails_S_A1,
          question_two_sharia:
            suitabilityData.new_mortgage_details.question_two_sharia ||
            defaultAnswers.newMortgageDetails_S_A2,
        },
        recommending_repayment_method: {
          recommending_repayment_method_type:
            suitabilityData.recommending_repayment_method
              .recommending_repayment_method_type || "GENERAL",
          question_one_answer:
            suitabilityData.recommending_repayment_method.question_one_answer ||
            defaultAnswers.recommendingRepaymentMethod_G_A1,
          question_two_answer:
            suitabilityData.recommending_repayment_method.question_two_answer ||
            defaultAnswers.recommendingRepaymentMethod_G_A2,
          question_three_answer:
            suitabilityData.recommending_repayment_method
              .question_three_answer ||
            defaultAnswers.recommendingRepaymentMethod_G_A3,
          question_four_answer:
            suitabilityData.recommending_repayment_method
              .question_four_answer ||
            defaultAnswers.recommendingRepaymentMethod_G_A4,
          question_five_answer:
            suitabilityData.recommending_repayment_method
              .question_five_answer ||
            defaultAnswers.recommendingRepaymentMethod_G_A5,
          question_one_sharia:
            suitabilityData.recommending_repayment_method.question_one_sharia ||
            defaultAnswers.recommendingRepaymentMethod_S_A1,
          question_two_sharia:
            suitabilityData.recommending_repayment_method.question_two_sharia ||
            defaultAnswers.recommendingRepaymentMethod_S_A2,
        },
        recommending_mortgage_type: {
          recommending_mortgage_type:
            suitabilityData.recommending_mortgage_type
              .recommending_mortgage_type || "GENERAL",
          question_one_answer:
            suitabilityData.recommending_mortgage_type.question_one_answer ||
            defaultAnswers.recommendingMortgageType_G_A1,
          question_two_answer:
            suitabilityData.recommending_mortgage_type.question_two_answer ||
            defaultAnswers.recommendingMortgageType_G_A2,
          question_three_answer:
            suitabilityData.recommending_mortgage_type.question_three_answer ||
            defaultAnswers.recommendingMortgageType_G_A3,
          question_four_answer:
            suitabilityData.recommending_mortgage_type.question_four_answer ||
            defaultAnswers.recommendingMortgageType_G_A4,
          question_one_sharia:
            suitabilityData.recommending_mortgage_type.question_one_sharia ||
            defaultAnswers.recommendingMortgageType_S_A1,
          question_two_sharia:
            suitabilityData.recommending_mortgage_type.question_two_sharia ||
            defaultAnswers.recommendingMortgageType_S_A2,
        },
        recommending_term: {
          recommending_term:
            suitabilityData.recommending_term.recommending_term || "GENERAL",
          question_one_answer:
            suitabilityData.recommending_term.question_one_answer ||
            defaultAnswers.recommendingTerm_G_A1,
          question_one:
            suitabilityData.recommending_term.question_one ||
            defaultAnswers.recommendingTerm_S_A1,
        },
        recommending_mortgage_lender: {
          recommending_mortgage_lender_type:
            suitabilityData.recommending_mortgage_lender
              .recommending_mortgage_lender_type || "GENERAL",
          question_one_answer:
            suitabilityData.recommending_mortgage_lender.question_one_answer ||
            defaultAnswers.recommendingMortgageLender_G_A1,
          question_two_answer:
            suitabilityData.recommending_mortgage_lender.question_two_answer ||
            defaultAnswers.recommendingMortgageLender_G_A2,
          question_three_answer:
            suitabilityData.recommending_mortgage_lender
              .question_three_answer ||
            defaultAnswers.recommendingMortgageLender_G_A3,
          question_one_sharia:
            suitabilityData.recommending_mortgage_lender.question_one_sharia ||
            defaultAnswers.recommendingMortgageLender_S_A1,
        },
        recommending_mortgage_amount: {
          recommending_mortgage_amount:
            suitabilityData.recommending_mortgage_amount
              .recommending_mortgage_amount || "GENERAL",
          question_one_answer:
            suitabilityData.recommending_mortgage_amount.question_one_answer ||
            defaultAnswers.recommendingMortgageAmount_G_A1,
          question_two_answer:
            suitabilityData.recommending_mortgage_amount.question_two_answer ||
            defaultAnswers.recommendingMortgageAmount_G_A2,
          question_three_answer:
            suitabilityData.recommending_mortgage_amount
              .question_three_answer ||
            defaultAnswers.recommendingMortgageAmount_G_A3,
          question_one_sharia:
            suitabilityData.recommending_mortgage_amount.question_one_sharia ||
            defaultAnswers.recommendingMortgageAmount_S_A1,
        },
        costs_fees: {
          costs_fees: suitabilityData.costs_fees.costs_fees_type || "GENERAL",
          question_one_answer:
            suitabilityData.costs_fees.question_one_answer ||
            defaultAnswers.costsAndFees_G_A1,
          question_two_answer:
            suitabilityData.costs_fees.question_two_answer ||
            defaultAnswers.costsAndFees_G_A2,
          question_three_answer:
            suitabilityData.costs_fees.question_three_answer ||
            defaultAnswers.costsAndFees_G_A3,
          question_one_sharia:
            suitabilityData.costs_fees.question_one_sharia ||
            defaultAnswers.costsAndFees_S_A1,
        },
        disadvantage_risks: {
          disadvantage_risks:
            suitabilityData.disadvantage_risks.disadvantage_risks || "GENERAL",
          question_one_answer:
            suitabilityData.disadvantage_risks.question_one_answer ||
            defaultAnswers.disadvantageAndRisks_G_A1,
          question_two_answer:
            suitabilityData.disadvantage_risks.question_two_answer ||
            defaultAnswers.disadvantageAndRisks_G_A2,
          question_three_answer:
            suitabilityData.disadvantage_risks.question_three_answer ||
            defaultAnswers.disadvantageAndRisks_G_A3,
          question_four_answer:
            suitabilityData.disadvantage_risks.question_four_answer ||
            defaultAnswers.disadvantageAndRisks_G_A4,
          question_five_answer:
            suitabilityData.disadvantage_risks.question_five_answer ||
            defaultAnswers.disadvantageAndRisks_G_A5,
          question_six_answer:
            suitabilityData.disadvantage_risks.question_six_answer ||
            defaultAnswers.disadvantageAndRisks_G_A6,
          question_seven_answer:
            suitabilityData.disadvantage_risks.question_seven_answer ||
            defaultAnswers.disadvantageAndRisks_G_A7,
          question_eight_answer:
            suitabilityData.disadvantage_risks.question_eight_answer ||
            defaultAnswers.disadvantageAndRisks_G_A8,
          question_nine_answer:
            suitabilityData.disadvantage_risks.question_nine_answer ||
            defaultAnswers.disadvantageAndRisks_G_A9,
          question_one_sharia:
            suitabilityData.disadvantage_risks.question_one_sharia ||
            defaultAnswers.disadvantageAndRisks_S_A1,
          question_two:
            suitabilityData.disadvantage_risks.question_two ||
            defaultAnswers.disadvantageAndRisks_S_A2,
        },
        cost_advice: {
          cost_advice: suitabilityData.cost_advice.cost_advice || "GENERAL",
          question_one_answer:
            suitabilityData.cost_advice.question_one_answer ||
            defaultAnswers.costAdvice_G_A1,
          question_two_answer:
            suitabilityData.cost_advice.question_two_answer ||
            defaultAnswers.costAdvice_G_A2,
          question_one_sharia:
            suitabilityData.cost_advice.question_one_sharia ||
            defaultAnswers.costAdvice_S_A1,
          question_two_sharia:
            suitabilityData.cost_advice.question_two_sharia ||
            defaultAnswers.costAdvice_S_A2,
        },
        protection: {
          protection: suitabilityData.protection.protection || "GENERAL",
          question_one_answer:
            suitabilityData.protection.question_one_answer ||
            defaultAnswers.protection_G_A1,
          question_two_answer:
            suitabilityData.protection.question_two_answer ||
            defaultAnswers.protection_G_A2,
          question_three_answer:
            suitabilityData.protection.question_three_answer ||
            defaultAnswers.protection_G_A3,
          question_four_answer:
            suitabilityData.protection.question_four_answer ||
            defaultAnswers.protection_G_A4,
          question_one_sharia:
            suitabilityData.protection.question_one_sharia ||
            defaultAnswers.protection_S_A1,
          question_two:
            suitabilityData.protection.question_two ||
            defaultAnswers.protection_S_A2,
          question_three_sharia:
            suitabilityData.protection.question_three_sharia ||
            defaultAnswers.protection_S_A3,
          question_four_sharia:
            suitabilityData.protection.question_four_sharia ||
            defaultAnswers.protection_S_A4,
        },
        buildings_insurance: {
          buildings_insurance:
            suitabilityData.buildings_insurance.buildings_insurance ||
            "GENERAL",
          question_one_answer:
            suitabilityData.buildings_insurance.question_one_answer ||
            defaultAnswers.buildingsInsurance_G_A1,
          question_two_answer:
            suitabilityData.buildings_insurance.question_two_answer ||
            defaultAnswers.buildingsInsurance_G_A2,
          question_three_answer:
            suitabilityData.buildings_insurance.question_three_answer ||
            defaultAnswers.buildingsInsurance_G_A3,
          question_four_answer:
            suitabilityData.buildings_insurance.question_four_answer ||
            defaultAnswers.buildingsInsurance_G_A4,
          question_one:
            suitabilityData.buildings_insurance.question_one ||
            defaultAnswers.buildingsInsurance_S_A1,
          question_two:
            suitabilityData.buildings_insurance.question_two ||
            defaultAnswers.buildingsInsurance_S_A2,
          question_three_sharia:
            suitabilityData.buildings_insurance.question_three_sharia ||
            defaultAnswers.buildingsInsurance_S_A3,
          question_five_sharia:
            suitabilityData.buildings_insurance.question_five_sharia ||
            defaultAnswers.buildingsInsurance_S_A4,
        },
        wills: {
          wills: suitabilityData.wills.wills || "GENERAL",
          question_one_answer:
            suitabilityData.wills.question_one_answer ||
            defaultAnswers.wills_G_A1,
          question_two_answer:
            suitabilityData.wills.question_two_answer ||
            defaultAnswers.wills_G_A2,
          question_three_answer:
            suitabilityData.wills.question_three_answer ||
            defaultAnswers.wills_G_A3,
          question_one:
            suitabilityData.wills.question_one || defaultAnswers.wills_S_A1,
        },
      });
    }
  }, [suitabilityData]);

  // Handle input changes for nested state
  const handleChange = <T extends keyof typeof formValue>(
    section: T,
    field: keyof (typeof formValue)[T],
    value: string
  ) => {
    setFormValue((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      alias: casealias,
      circumstances_objectives: {
        ...formValue.circumstances_objectives,
      },
      budget_affordability: {
        ...formValue.budget_affordability,
      },
      new_mortgage_details: {
        ...formValue.new_mortgage_details,
      },
      recommending_repayment_method: {
        ...formValue.recommending_repayment_method,
      },
      recommending_mortgage_type: {
        ...formValue.recommending_mortgage_type,
      },
      recommending_term: {
        ...formValue.recommending_term,
      },
      recommending_mortgage_lender: {
        ...formValue.recommending_mortgage_lender,
      },
      recommending_mortgage_amount: {
        ...formValue.recommending_mortgage_amount,
      },
      costs_fees: {
        ...formValue.costs_fees,
      },
      disadvantage_risks: {
        ...formValue.disadvantage_risks,
      },
      cost_advice: {
        ...formValue.cost_advice,
      },
      protection: {
        ...formValue.protection,
      },
      buildings_insurance: {
        ...formValue.buildings_insurance,
      },
      wills: {
        ...formValue.wills,
      },
    };
    try {
      const res = await updateSuitability({
        payload: payload,
        case_alias: casealias,
      });
      if (res.data) {
        toast.success("Changes saved successfully!");
      } else if (res.error) {
        const errorMessage =
          (res.error as any)?.data?.detail || "Failed to save changes";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to save changes. Please try again!");
      }
    } catch (error) {
      console.error("Failed to update suitability:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const handleNextTab = () => {
    const nextTabNav: string | null = getNextTabNav(
      caseData?.case_stage,
      currentTab!
    );
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  if (isLoading || isExtraAnswerLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {/* Your circumstances and objectives */}
        <Card className="border-1 border-success">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>Your circumstances and objectives</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="circumstances_type"
                  value={formValue.circumstances_objectives.circumstances_type}
                  onChange={(e) =>
                    handleChange(
                      "circumstances_objectives",
                      "circumstances_type",
                      e.target.value
                    )
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.circumstances_objectives.circumstances_type ===
              "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={
                      formValue.circumstances_objectives.question_one_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "circumstances_objectives",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={
                      formValue.circumstances_objectives.question_two_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "circumstances_objectives",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_answer"
                    rows="3"
                    value={
                      formValue.circumstances_objectives.question_three_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "circumstances_objectives",
                        "question_three_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.circumstances_objectives.circumstances_type ===
              "SHARIA" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_sharia"
                    rows="6"
                    value={
                      formValue.circumstances_objectives.question_one_sharia
                    }
                    onChange={(e) =>
                      handleChange(
                        "circumstances_objectives",
                        "question_one_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_sharia"
                    rows="3"
                    value={
                      formValue.circumstances_objectives.question_two_sharia
                    }
                    onChange={(e) =>
                      handleChange(
                        "circumstances_objectives",
                        "question_two_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>

        {/* Budget and affordability */}
        <Card className="border-1 border-secondary mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>Budget and affordability</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="budget_affordability_type"
                  value={
                    formValue.budget_affordability.budget_affordability_type
                  }
                  onChange={(e) =>
                    handleChange(
                      "budget_affordability",
                      "budget_affordability_type",
                      e.target.value
                    )
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.budget_affordability.budget_affordability_type ===
              "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={formValue.budget_affordability.question_one_answer}
                    onChange={(e) =>
                      handleChange(
                        "budget_affordability",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={formValue.budget_affordability.question_two_answer}
                    onChange={(e) =>
                      handleChange(
                        "budget_affordability",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.budget_affordability.budget_affordability_type ===
              "SHARIA" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_sharia"
                    rows="3"
                    value={formValue.budget_affordability.question_one_sharia}
                    onChange={(e) =>
                      handleChange(
                        "budget_affordability",
                        "question_one_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_sharia"
                    rows="3"
                    value={formValue.budget_affordability.question_two_sharia}
                    onChange={(e) =>
                      handleChange(
                        "budget_affordability",
                        "question_two_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        {/* New mortgage details */}
        <Card className="border-1 border-success mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>New mortgage details</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="new_mortgage_details_type"
                  value={
                    formValue.new_mortgage_details.new_mortgage_details_type
                  }
                  onChange={(e) =>
                    handleChange(
                      "new_mortgage_details",
                      "new_mortgage_details_type",
                      e.target.value
                    )
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.new_mortgage_details.new_mortgage_details_type ===
              "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={formValue.new_mortgage_details.question_one_answer}
                    onChange={(e) =>
                      handleChange(
                        "new_mortgage_details",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={formValue.new_mortgage_details.question_two_answer}
                    onChange={(e) =>
                      handleChange(
                        "new_mortgage_details",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.new_mortgage_details.new_mortgage_details_type ===
              "SHARIA" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_sharia"
                    rows="3"
                    value={formValue.new_mortgage_details.question_one_sharia}
                    onChange={(e) =>
                      handleChange(
                        "new_mortgage_details",
                        "question_one_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_sharia"
                    rows="3"
                    value={formValue.new_mortgage_details.question_two_sharia}
                    onChange={(e) =>
                      handleChange(
                        "new_mortgage_details",
                        "question_two_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        {/* Recommending repayment method */}
        <Card className="border-1 border-secondary mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>Why are we recommending this repayment method?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="recommending_repayment_method_type"
                  value={
                    formValue.recommending_repayment_method
                      .recommending_repayment_method_type
                  }
                  onChange={(e) =>
                    handleChange(
                      "recommending_repayment_method",
                      "recommending_repayment_method_type",
                      e.target.value
                    )
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.recommending_repayment_method
              .recommending_repayment_method_type === "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={
                      formValue.recommending_repayment_method
                        .question_one_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_repayment_method",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={
                      formValue.recommending_repayment_method
                        .question_two_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_repayment_method",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_answer"
                    rows="3"
                    value={
                      formValue.recommending_repayment_method
                        .question_three_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_repayment_method",
                        "question_three_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 4</Label>
                  <Input
                    type="textarea"
                    name="question_four_answer"
                    rows="3"
                    value={
                      formValue.recommending_repayment_method
                        .question_four_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_repayment_method",
                        "question_four_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.recommending_repayment_method
              .recommending_repayment_method_type === "SHARIA" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_sharia"
                    rows="3"
                    value={
                      formValue.recommending_repayment_method
                        .question_one_sharia
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_repayment_method",
                        "question_one_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_sharia"
                    rows="3"
                    value={
                      formValue.recommending_repayment_method
                        .question_two_sharia
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_repayment_method",
                        "question_two_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        {/* recommending_mortgage_type */}
        <Card className="border-1 border-success mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>Why are we recommending this mortgage type?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="recommending_mortgage_type_type"
                  value={
                    formValue.recommending_mortgage_type
                      .recommending_mortgage_type
                  }
                  onChange={(e) =>
                    handleChange(
                      "recommending_mortgage_type",
                      "recommending_mortgage_type",
                      e.target.value
                    )
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.recommending_mortgage_type.recommending_mortgage_type ===
              "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_type.question_one_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_type",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_type.question_two_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_type",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_answer"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_type.question_three_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_type",
                        "question_three_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 4</Label>
                  <Input
                    type="textarea"
                    name="question_four_answer"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_type.question_four_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_type",
                        "question_four_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.recommending_mortgage_type.recommending_mortgage_type ===
              "SHARIA" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_sharia"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_type.question_one_sharia
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_type",
                        "question_one_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_sharia"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_type.question_two_sharia
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_type",
                        "question_two_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        {/* recommending_term */}
        <Card className="border-1 border-secondary mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>Why are you recommending this term?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="recommending_term_type"
                  value={formValue.recommending_term.recommending_term}
                  onChange={(e) =>
                    handleChange(
                      "recommending_term",
                      "recommending_term",
                      e.target.value
                    )
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.recommending_term.recommending_term === "GENERAL" && (
              <FormGroup>
                <Label>Answer 1</Label>
                <Input
                  type="textarea"
                  name="question_one_answer"
                  rows="3"
                  value={formValue.recommending_term.question_one_answer}
                  onChange={(e) =>
                    handleChange(
                      "recommending_term",
                      "question_one_answer",
                      e.target.value
                    )
                  }
                />
              </FormGroup>
            )}
            {formValue.recommending_term.recommending_term === "SHARIA" && (
              <FormGroup>
                <Label>Answer 1</Label>
                <Input
                  type="textarea"
                  name="question_one_sharia"
                  rows="3"
                  value={formValue.recommending_term.question_one}
                  onChange={(e) =>
                    handleChange(
                      "recommending_term",
                      "question_one",
                      e.target.value
                    )
                  }
                />
              </FormGroup>
            )}
          </CardBody>
        </Card>
        {/* recommending_mortgage_lender  */}
        <Card className="border-1 border-success mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>Why are we recommending this mortgage Lender?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="recommending_mortgage_lender_type"
                  value={
                    formValue.recommending_mortgage_lender
                      .recommending_mortgage_lender_type
                  }
                  onChange={(e) =>
                    handleChange(
                      "recommending_mortgage_lender",
                      "recommending_mortgage_lender_type",
                      e.target.value
                    )
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.recommending_mortgage_lender
              .recommending_mortgage_lender_type === "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_lender.question_one_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_lender",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_lender.question_two_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_lender",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_answer"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_lender
                        .question_three_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_lender",
                        "question_three_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.recommending_mortgage_lender
              .recommending_mortgage_lender_type === "SHARIA" && (
              <FormGroup>
                <Label>Answer 1</Label>
                <Input
                  type="textarea"
                  name="question_one_sharia"
                  rows="3"
                  value={
                    formValue.recommending_mortgage_lender.question_one_sharia
                  }
                  onChange={(e) =>
                    handleChange(
                      "recommending_mortgage_lender",
                      "question_one_sharia",
                      e.target.value
                    )
                  }
                />
              </FormGroup>
            )}
          </CardBody>
        </Card>
        {/* recommending_mortgage_amount  */}
        <Card className="border-1 border-secondary mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>Why are we recommending this mortgage amount?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="recommending_mortgage_amount_type"
                  value={
                    formValue.recommending_mortgage_amount
                      .recommending_mortgage_amount
                  }
                  onChange={(e) =>
                    handleChange(
                      "recommending_mortgage_amount",
                      "recommending_mortgage_amount",
                      e.target.value
                    )
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.recommending_mortgage_amount
              .recommending_mortgage_amount === "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_amount.question_one_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_amount",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_amount.question_two_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_amount",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_answer"
                    rows="3"
                    value={
                      formValue.recommending_mortgage_amount
                        .question_three_answer
                    }
                    onChange={(e) =>
                      handleChange(
                        "recommending_mortgage_amount",
                        "question_three_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.recommending_mortgage_amount
              .recommending_mortgage_amount === "SHARIA" && (
              <FormGroup>
                <Label>Answer 1</Label>
                <Input
                  type="textarea"
                  name="question_one_sharia"
                  rows="3"
                  value={
                    formValue.recommending_mortgage_amount.question_one_sharia
                  }
                  onChange={(e) =>
                    handleChange(
                      "recommending_mortgage_amount",
                      "question_one_sharia",
                      e.target.value
                    )
                  }
                />
              </FormGroup>
            )}
          </CardBody>
        </Card>
        {/* costs_fees */}
        <Card className="border-1 border-success mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>What are the costs and fees?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="costs_fees_type"
                  value={formValue.costs_fees.costs_fees}
                  onChange={(e) =>
                    handleChange("costs_fees", "costs_fees", e.target.value)
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.costs_fees.costs_fees === "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={formValue.costs_fees.question_one_answer}
                    onChange={(e) =>
                      handleChange(
                        "costs_fees",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={formValue.costs_fees.question_two_answer}
                    onChange={(e) =>
                      handleChange(
                        "costs_fees",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_answer"
                    rows="3"
                    value={formValue.costs_fees.question_three_answer}
                    onChange={(e) =>
                      handleChange(
                        "costs_fees",
                        "question_three_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.costs_fees.costs_fees === "SHARIA" && (
              <FormGroup>
                <Label>Answer 1</Label>
                <Input
                  type="textarea"
                  name="question_one_sharia"
                  rows="3"
                  value={formValue.costs_fees.question_one_sharia}
                  onChange={(e) =>
                    handleChange(
                      "costs_fees",
                      "question_one_sharia",
                      e.target.value
                    )
                  }
                />
              </FormGroup>
            )}
          </CardBody>
        </Card>
        {/* disadvantage_risks  */}
        <Card className="border-1 border-secondary mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>What are the disadvantages and risks?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="disadvantageAndRisks_type"
                  value={formValue.disadvantage_risks.disadvantage_risks}
                  onChange={(e) =>
                    handleChange(
                      "disadvantage_risks",
                      "disadvantage_risks",
                      e.target.value
                    )
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.disadvantage_risks.disadvantage_risks === "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={formValue.disadvantage_risks.question_one_answer}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={formValue.disadvantage_risks.question_two_answer}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_answer"
                    rows="3"
                    value={formValue.disadvantage_risks.question_three_answer}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_three_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 4</Label>
                  <Input
                    type="textarea"
                    name="question_four_answer"
                    rows="3"
                    value={formValue.disadvantage_risks.question_four_answer}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_four_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 5</Label>
                  <Input
                    type="textarea"
                    name="question_five_answer"
                    rows="3"
                    value={formValue.disadvantage_risks.question_five_answer}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_five_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 6</Label>
                  <Input
                    type="textarea"
                    name="question_six_answer"
                    rows="3"
                    value={formValue.disadvantage_risks.question_six_answer}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_six_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 7</Label>
                  <Input
                    type="textarea"
                    name="question_seven_answer"
                    rows="3"
                    value={formValue.disadvantage_risks.question_seven_answer}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_seven_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 8</Label>
                  <Input
                    type="textarea"
                    name="question_eight_answer"
                    rows="3"
                    value={formValue.disadvantage_risks.question_eight_answer}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_eight_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 9</Label>
                  <Input
                    type="textarea"
                    name="question_nine_answer"
                    rows="3"
                    value={formValue.disadvantage_risks.question_nine_answer}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_nine_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.disadvantage_risks.disadvantage_risks === "SHARIA" && (
              <>
                {" "}
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_sharia"
                    rows="3"
                    value={formValue.disadvantage_risks.question_one_sharia}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_one_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_sharia"
                    rows="3"
                    value={formValue.disadvantage_risks.question_two}
                    onChange={(e) =>
                      handleChange(
                        "disadvantage_risks",
                        "question_two",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        {/* cost_advice */}
        <Card className="border-1 border-success mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>What is the cost of our advice?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="cost_advice_type"
                  value={formValue.cost_advice.cost_advice}
                  onChange={(e) =>
                    handleChange("cost_advice", "cost_advice", e.target.value)
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.cost_advice.cost_advice === "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={formValue.cost_advice.question_one_answer}
                    onChange={(e) =>
                      handleChange(
                        "cost_advice",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={formValue.cost_advice.question_two_answer}
                    onChange={(e) =>
                      handleChange(
                        "cost_advice",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.cost_advice.cost_advice === "SHARIA" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_sharia"
                    rows="3"
                    value={formValue.cost_advice.question_one_sharia}
                    onChange={(e) =>
                      handleChange(
                        "cost_advice",
                        "question_one_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_sharia"
                    rows="3"
                    value={formValue.cost_advice.question_two_sharia}
                    onChange={(e) =>
                      handleChange(
                        "cost_advice",
                        "question_two_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        {/* protection */}
        <Card className="border-1 border-secondary mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>What is the protection?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="protection_type"
                  value={formValue.protection.protection}
                  onChange={(e) =>
                    handleChange("protection", "protection", e.target.value)
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.protection.protection === "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={formValue.protection.question_one_answer}
                    onChange={(e) =>
                      handleChange(
                        "protection",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={formValue.protection.question_two_answer}
                    onChange={(e) =>
                      handleChange(
                        "protection",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_answer"
                    rows="3"
                    value={formValue.protection.question_three_answer}
                    onChange={(e) =>
                      handleChange(
                        "protection",
                        "question_three_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 4</Label>
                  <Input
                    type="textarea"
                    name="question_four_answer"
                    rows="3"
                    value={formValue.protection.question_four_answer}
                    onChange={(e) =>
                      handleChange(
                        "protection",
                        "question_four_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.protection.protection === "SHARIA" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_sharia"
                    rows="3"
                    value={formValue.protection.question_one_sharia}
                    onChange={(e) =>
                      handleChange(
                        "protection",
                        "question_one_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_sharia"
                    rows="3"
                    value={formValue.protection.question_two}
                    onChange={(e) =>
                      handleChange("protection", "question_two", e.target.value)
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_sharia"
                    rows="3"
                    value={formValue.protection.question_three_sharia}
                    onChange={(e) =>
                      handleChange(
                        "protection",
                        "question_three_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 4</Label>
                  <Input
                    type="textarea"
                    name="question_four_sharia"
                    rows="3"
                    value={formValue.protection.question_four_sharia}
                    onChange={(e) =>
                      handleChange(
                        "protection",
                        "question_four_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        {/* buildings_insurance */}
        <Card className="border-1 border-success mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>What is the buildings insurance?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="buildings_insurance_type"
                  value={formValue.buildings_insurance.buildings_insurance}
                  onChange={(e) =>
                    handleChange(
                      "buildings_insurance",
                      "buildings_insurance",
                      e.target.value
                    )
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.buildings_insurance.buildings_insurance ===
              "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={formValue.buildings_insurance.question_one_answer}
                    onChange={(e) =>
                      handleChange(
                        "buildings_insurance",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={formValue.buildings_insurance.question_two_answer}
                    onChange={(e) =>
                      handleChange(
                        "buildings_insurance",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_answer"
                    rows="3"
                    value={formValue.buildings_insurance.question_three_answer}
                    onChange={(e) =>
                      handleChange(
                        "buildings_insurance",
                        "question_three_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 4</Label>
                  <Input
                    type="textarea"
                    name="question_four_answer"
                    rows="3"
                    value={formValue.buildings_insurance.question_four_answer}
                    onChange={(e) =>
                      handleChange(
                        "buildings_insurance",
                        "question_four_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.buildings_insurance.buildings_insurance === "SHARIA" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_sharia"
                    rows="3"
                    value={formValue.buildings_insurance.question_one}
                    onChange={(e) =>
                      handleChange(
                        "buildings_insurance",
                        "question_one",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_sharia"
                    rows="3"
                    value={formValue.buildings_insurance.question_two}
                    onChange={(e) =>
                      handleChange(
                        "buildings_insurance",
                        "question_two",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_sharia"
                    rows="3"
                    value={formValue.buildings_insurance.question_three_sharia}
                    onChange={(e) =>
                      handleChange(
                        "buildings_insurance",
                        "question_three_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 4</Label>
                  <Input
                    type="textarea"
                    name="question_four_sharia"
                    rows="3"
                    value={formValue.buildings_insurance.question_five_sharia}
                    onChange={(e) =>
                      handleChange(
                        "buildings_insurance",
                        "question_five_sharia",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        {/* wills  */}
        <Card className="border-1 border-secondary mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <Col md={6}>
              <h4>What is the wills?</h4>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Input
                  type="select"
                  name="wills_type"
                  value={formValue.wills.wills}
                  onChange={(e) =>
                    handleChange("wills", "wills", e.target.value)
                  }
                >
                  <option value="GENERAL">General</option>
                  <option value="SHARIA">Sharia</option>
                </Input>
              </FormGroup>
            </Col>
          </CardHeader>
          <CardBody>
            {formValue.wills.wills === "GENERAL" && (
              <>
                <FormGroup>
                  <Label>Answer 1</Label>
                  <Input
                    type="textarea"
                    name="question_one_answer"
                    rows="3"
                    value={formValue.wills.question_one_answer}
                    onChange={(e) =>
                      handleChange(
                        "wills",
                        "question_one_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 2</Label>
                  <Input
                    type="textarea"
                    name="question_two_answer"
                    rows="3"
                    value={formValue.wills.question_two_answer}
                    onChange={(e) =>
                      handleChange(
                        "wills",
                        "question_two_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Answer 3</Label>
                  <Input
                    type="textarea"
                    name="question_three_answer"
                    rows="3"
                    value={formValue.wills.question_three_answer}
                    onChange={(e) =>
                      handleChange(
                        "wills",
                        "question_three_answer",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </>
            )}
            {formValue.wills.wills === "SHARIA" && (
              <FormGroup>
                <Label>Answer 1</Label>
                <Input
                  type="textarea"
                  name="question_one_sharia"
                  rows="3"
                  value={formValue.wills.question_one}
                  onChange={(e) =>
                    handleChange("wills", "question_one", e.target.value)
                  }
                />
              </FormGroup>
            )}
          </CardBody>
        </Card>
        {/* Extra question answer  */}
        <Card className="border-1 border-info mt-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h4>
              Extra Question Answers(
              <small className="text-danger opacity-75">
                These fields are read-only
              </small>
              )
            </h4>
          </CardHeader>
          <CardBody>
            {extraAnswersData?.length > 0 ? (
              extraAnswersData.map((extraAnswer: any) => (
                <FormGroup key={extraAnswer?.alias}>
                  <Label>
                    <strong>Question Name:</strong>{" "}
                    {extraAnswer?.section_choices ===
                      "YOUR_CIRCUMSTANCES_AND_OBJECTIVES" &&
                      "Your circumstances and objectives"}
                    {extraAnswer?.section_choices ===
                      "BUDGET_AND_AFFORDABILITY" && "Budget and affordability"}
                    {extraAnswer?.section_choices === "NEW_MORTGAGE_DETAILS" &&
                      "New mortgage details"}
                    {extraAnswer?.section_choices ===
                      "RECOMMENDED_REPAYMENT_METHOD" &&
                      "Why are we recommending this repayment method?"}
                    {extraAnswer?.section_choices ===
                      "RECOMMENDED_MORTGAGE_TYPE" &&
                      "Why are we recommending this mortgage type?"}
                    {extraAnswer?.section_choices === "RECOMMENDED_TERM" &&
                      "Why are we recommending this term?"}
                    {extraAnswer?.section_choices === "RECOMMENDED_LENDER" &&
                      "Why are we recommending this mortgage lender?"}
                    {extraAnswer?.section_choices === "RECOMMENDED_AMOUNT" &&
                      "Why are we recommending this mortgage amount?"}
                    {extraAnswer?.section_choices === "COSTS_AND_FEES" &&
                      "What are the costs and fees?"}
                    {extraAnswer?.section_choices ===
                      "DISADVANTAGES_AND_RISKS" &&
                      "What are the disadvantages and risks?"}
                    {extraAnswer?.section_choices === "COST_OF_ADVICE" &&
                      "What is the cost of our advice?"}
                    {extraAnswer?.section_choices === "PROTECTION" &&
                      "What is the protection?"}
                    {extraAnswer?.section_choices === "BUILDINGS_INSURANCE" &&
                      "What is the buildings insurance?"}
                    {extraAnswer?.section_choices === "WILLS" &&
                      "What is the wills?"}
                  </Label>
                  <Input
                    type="textarea"
                    readOnly
                    name="question_one_answer"
                    rows="5"
                    value={extraAnswer?.answer}
                  />
                </FormGroup>
              ))
            ) : (
              <div className="text-center text-muted">
                No extra answers found
              </div>
            )}

            <div className="d-flex justify-content-start align-items-center">
              <Button
                color="info"
                onClick={toggleExtraAnswerModal}
                disabled={isUpdating || session?.user?.user_type === "CLIENT"}
              >
                Add More Answer
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Buttons */}
        <div className="d-flex justify-content-end mt-3 mb-0 gap-2">
          <Button
            color="primary"
            type="submit"
            disabled={isUpdating || session?.user?.user_type === "CLIENT"}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            color="secondary"
            onClick={async (e) => {
              if (session?.user?.user_type === "CLIENT") {
                handleNextTab();
              } else {
                await handleSubmit(e);
                handleNextTab();
              }
            }}
          >
            {session?.user?.user_type === "CLIENT"
              ? "Go To Next"
              : "Save & Next"}
          </Button>
        </div>
      </Form>
      {/* Modal Components */}
      <ExtraAnswerModal
        isOpen={isExtraAnswerModalOpen}
        toggle={toggleExtraAnswerModal}
      />
    </>
  );
};

export default SuitabilityContent;
