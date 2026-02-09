import LoadingSpinner from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import {
  useGetNeedsAndPreferencesQuery,
  useUpdateNeedsAndPreferencesMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/NeedsAndPreferences/NeedsAndPreferencesApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
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
  Row,
} from "reactstrap";

const NeedsAndPreferencesContent: React.FC = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  // rtk hooks
  const { data: needsAndPreferencesData, isLoading } =
    useGetNeedsAndPreferencesQuery({
      case_alias: casealias,
    });
  const [updateNeedsAndPreferences, { isLoading: isUpdating }] =
    useUpdateNeedsAndPreferencesMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const [formData, setFormData] = useState(needsAndPreferencesData || {});
  useEffect(() => {
    if (needsAndPreferencesData) {
      setFormData(needsAndPreferencesData);
    }
  }, [needsAndPreferencesData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!needsAndPreferencesData) setErrors({});
  }, [needsAndPreferencesData]);

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    if (!err) return out;

    const sanitize = (msg: any) => {
      if (msg == null) return "";
      let s = String(msg);
      s = s.replace(/^\s*\d+,\s*/g, "");
      return s;
    };

    if (typeof err === "string") {
      out["non_field_errors"] = sanitize(err);
      return out;
    }

    if (err && typeof err === "object") {
      if (err.detail) out["non_field_errors"] = sanitize(err.detail);
      for (const [k, v] of Object.entries(err)) {
        if (v == null) continue;
        if (typeof v === "string") out[k] = sanitize(v);
        else if (Array.isArray(v))
          out[k] = sanitize(
            v
              .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
              .join(", "),
          );
        else if (typeof v === "object") {
          const vals: string[] = [];
          for (const vv of Object.values(v)) {
            if (vv == null) continue;
            if (Array.isArray(vv)) vals.push(...vv.map((x) => String(x)));
            else vals.push(String(vv));
          }
          if (vals.length) out[k] = sanitize(vals.join(", "));
        } else out[k] = sanitize(String(v));
      }
      return out;
    }

    out["non_field_errors"] = sanitize(String(err));
    return out;
  };

  // Scroll to the first DOM element associated with an API error key
  const scrollToFirstError = (errorsObj: Record<string, string>) => {
    try {
      const keys = Object.keys(errorsObj || {});
      if (!keys.length) return;

      const snakeToCamel = (s: string) =>
        s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

      for (const rawKey of keys) {
        if (!rawKey) continue;
        const candidates = [
          rawKey,
          rawKey.replace(/\./g, "_"),
          rawKey.replace(/_/g, "."),
          snakeToCamel(rawKey.replace(/\./g, "_")),
        ];

        for (const id of candidates) {
          if (!id) continue;

          const elById = document.getElementById(id);
          if (elById) {
            (elById as HTMLElement).scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            (elById as HTMLElement).focus?.();
            return;
          }

          const elByName = document.querySelector(`[name="${id}"]`);
          if (elByName) {
            (elByName as HTMLElement).scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            (elByName as HTMLElement).focus?.();
            return;
          }
        }
      }
    } catch (e) {
      // non-fatal
      // eslint-disable-next-line no-console
      console.warn("scrollToFirstError failed", e);
    }
  };

  // Add handleInputChange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "radio" ? value === "yes" : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const formValues = {
      repayment_method: formData.repayment_method,
      monthly_mortgage_payments: formData.monthly_mortgage_payments,
      specific_mortgage_deal: formData.specific_mortgage_deal,
      referred_monthly_budget: formData.referred_monthly_budget,
      retirement_age: formData.retirement_age,
      what_suitable_mortgage_features_are_important:
        formData.what_suitable_mortgage_features_are_important,
      front_costs: formData.front_costs,
      is_ability_to_make_overpayments: formData.is_ability_to_make_overpayments,
      is_early_repayment_charges: formData.is_early_repayment_charges,
      is_minimise_any_lender_arrangement_costs:
        formData.is_minimise_any_lender_arrangement_costs,
      is_ability_to_add_fees_to_the_mortgage:
        formData.is_ability_to_add_fees_to_the_mortgage,
      is_ability_to_add_fees_mortgage: formData.is_ability_to_add_fees_mortgage,
      cashback: formData.cashback,
      portability: formData.portability,
      guarantor_jbsp: formData.guarantor_jbsp,
      offset_mortgage: formData.offset_mortgage,
      scheme_specific: formData.scheme_specific,
      speed_of_completion: formData.speed_of_completion,
      sharia_compliant_mortgages: formData.sharia_compliant_mortgages,
      ltd_company_btl: formData.ltd_company_btl,
      any_incentives: formData.any_incentives,
      considering_debt_consolidation: formData.considering_debt_consolidation,
      anticipate_any_changes_notes: formData.anticipate_any_changes_notes,
      app_one_life_cover: formData.app_one_life_cover,
      app_one_critical_illness: formData.app_one_critical_illness,
      app_one_income_protection: formData.app_one_income_protection,
      app_one_asu: formData.app_one_asu,
      app_one_pmi: formData.app_one_pmi,
      app_one_family_income_benefit: formData.app_one_family_income_benefit,
      app_one_buildings_and_contents: formData.app_one_buildings_and_contents,
      app_two_life_cover: formData.app_two_life_cover,
      app_two_critical_illness: formData.app_two_critical_illness,
      app_two_income_protection: formData.app_two_income_protection,
      app_two_asu: formData.app_two_asu,
      app_two_pmi: formData.app_two_pmi,
      app_two_family_income_benefit: formData.app_two_family_income_benefit,
      app_two_buildings_and_contents: formData.app_two_buildings_and_contents,
      anticipate_any_changes: formData.anticipate_any_changes,
      buildings: formData.buildings,
      contents: formData.contents,
      accidental_damage: formData.accidental_damage,
      landlords_cover: formData.landlords_cover,
      home_emergency_cover: formData.home_emergency_cover,
      personal_possessions_cover: formData.personal_possessions_cover,
      personal_possessions_confirm: formData.personal_possessions_confirm,
      have_you_a_will_in_place: formData.have_you_a_will_in_place,
      have_you_a_will_in_place_note: formData.have_you_a_will_in_place_note,
      mortgage_requirements_note: formData.mortgage_requirements_note,
      mortgage_requirements: formData.mortgage_requirements,
      notes: formData.notes,
    };

    try {
      const res = await updateNeedsAndPreferences({
        case_alias: casealias,
        payload: formValues,
      });
      if (res.data) {
        setErrors({});
        toast.success("Mortgage needs updated successfully!");
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_mortgage_your_needs: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
        return true;
      } else if (res.error) {
        const errData = (res.error as any)?.data || (res.error as any) || {};
        const parsed = parseApiErrors(errData);
        setErrors(parsed);
        // Scroll to the first field that caused a server-side validation error
        scrollToFirstError(parsed);
        const first =
          Object.values(parsed)[0] || "Failed to update mortgage needs.";
        toast.error(String(first));
        return false;
      } else {
        toast.error("Something went wrong");
        return false;
      }
    } catch (error) {
      const parsed = parseApiErrors(
        (error as any)?.data || (error as any) || error,
      );
      setErrors(parsed);
      if (Object.keys(parsed).length) scrollToFirstError(parsed);
      const first =
        Object.values(parsed)[0] ||
        "Failed to update mortgage needs. Please try again.";
      toast.error(String(first));
      console.error("Failed to update mortgage needs:", error);
      return false;
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

  // yesNoOptions
  const yesNoOptions = ["yes", "no"];

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader className="bg-primary">
          <h3>Questions & Answers</h3>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>What repayment method do you require and why?</Label>
              <Input
                type="textarea"
                rows={4}
                name="repayment_method"
                value={formData?.repayment_method || ""}
                onChange={handleInputChange}
              />
              {errors.repayment_method && (
                <div className="text-danger">{errors.repayment_method}</div>
              )}
              <small className="text-muted">
                Note: Explanation of Repayment mortgage /Interest Only/Part &
                part Mortgage provided and ask sufficient questions to recommend
                an appropriate repayment vehicle (e.g. Pension/ ISA, sale of
                property/ other)
              </small>
            </FormGroup>

            <FormGroup>
              <Label>
                What is important to you in regard to your monthly mortgage
                payments?
              </Label>
              <Input
                type="textarea"
                rows={4}
                name="monthly_mortgage_payments"
                value={formData?.monthly_mortgage_payments || ""}
                onChange={handleInputChange}
              />
              {errors.monthly_mortgage_payments && (
                <div className="text-danger">
                  {errors.monthly_mortgage_payments}
                </div>
              )}
              <small className="text-muted">
                Note: Explain the advantage and disadvantages of the various
                rate types and what effect they could have for the client. E.g
                Fixed rate, variable, discount, tracker.
              </small>
            </FormGroup>

            <FormGroup>
              <Label>
                How long do you feel is reasonable to be tied into a specific
                mortgage deal? (initial benefit period - e.g 2/3/5 year fixed) +
                confirm why.
              </Label>
              <Input
                type="textarea"
                rows={4}
                name="specific_mortgage_deal"
                value={formData?.specific_mortgage_deal || ""}
                onChange={handleInputChange}
              />
              {errors.specific_mortgage_deal && (
                <div className="text-danger">
                  {errors.specific_mortgage_deal}
                </div>
              )}
              <small className="text-muted">
                Note: Establishes the most appropriate length of deal period for
                client based on their personal circumstances and establish how
                long a period of early repayment charges the client is prepared
                to accept and which is appropriate to their circumstances. are
                they open to looking at a range of fixed rates for example.
              </small>
            </FormGroup>

            <FormGroup>
              <Label>
                Please confirm the length of term you would like for your
                mortgage and also your preferred monthly budget?
              </Label>
              <Input
                type="textarea"
                rows={4}
                name="referred_monthly_budget"
                value={formData?.referred_monthly_budget || ""}
                onChange={handleInputChange}
              />
              {errors.referred_monthly_budget && (
                <div className="text-danger">
                  {errors.referred_monthly_budget}
                </div>
              )}
              <small className="text-muted">
                Note: Check and confirm the client understanding, e.g longer
                term will incur further interest and be more expensive. If there
                is disposable income for a shorter term, why has this not been
                recommended. if BTL – do not link term to affordability.
              </small>
            </FormGroup>

            <FormGroup>
              <Label>Your preferences over your retirement age?</Label>
              <Input
                type="textarea"
                rows={4}
                name="retirement_age"
                value={formData?.retirement_age || ""}
                onChange={handleInputChange}
              />
              {errors.retirement_age && (
                <div className="text-danger">{errors.retirement_age}</div>
              )}
              <small className="text-muted">
                Note: Is it important the term finishes before state retirement
                age or selected retirement age? If chosen retirement age is over
                state retirement age, confirm plausibility of client working to
                that age. If Client aged over 55 and mortgage term will exceed
                state retirement age (or earlier if selected) by more than 2
                years – explanation of Later Life lending is provided and
                pension provisions discussed
              </small>
            </FormGroup>

            <FormGroup className="border-primary rounded-2 p-2">
              <Label className="text-primary">
                So, I can research a suitable mortgage, please tell me what
                mortgage features are important to you.
              </Label>
              <Row>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">
                      No up-front costs (Free Legals, Free Lender Fees and Free
                      Valuation)
                    </Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup key={`front_costs-${option}`} check inline>
                          <Input
                            type="radio"
                            name="front_costs"
                            id={`front_costs-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.front_costs
                                : !formData?.front_costs
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`front_costs-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.front_costs && (
                      <div className="text-danger">{errors.front_costs}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">
                      Ability to make overpayments
                    </Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`is_ability_to_make_overpayments-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="is_ability_to_make_overpayments"
                            id={`is_ability_to_make_overpayments-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.is_ability_to_make_overpayments
                                : !formData?.is_ability_to_make_overpayments
                            }
                            onChange={handleInputChange}
                          />
                          <Label
                            check
                            for={`is_ability_to_make_overpayments-${option}`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.is_ability_to_make_overpayments && (
                      <div className="text-danger">
                        {errors.is_ability_to_make_overpayments}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">
                      Early Repayment charges (on partial repayments, No ERCs,
                      no overhang)
                    </Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`is_early_repayment_charges-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="is_early_repayment_charges"
                            id={`is_early_repayment_charges-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.is_early_repayment_charges
                                : !formData?.is_early_repayment_charges
                            }
                            onChange={handleInputChange}
                          />
                          <Label
                            check
                            for={`is_early_repayment_charges-${option}`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.is_early_repayment_charges && (
                      <div className="text-danger">
                        {errors.is_early_repayment_charges}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">
                      To minimise any lender arrangement costs(No booking fees
                      and no arrangement fees)
                    </Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`is_minimise_any_lender_arrangement_costs-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="is_minimise_any_lender_arrangement_costs"
                            id={`is_minimise_any_lender_arrangement_costs-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.is_minimise_any_lender_arrangement_costs
                                : !formData?.is_minimise_any_lender_arrangement_costs
                            }
                            onChange={handleInputChange}
                          />
                          <Label
                            check
                            for={`is_minimise_any_lender_arrangement_costs-${option}`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.is_minimise_any_lender_arrangement_costs && (
                      <div className="text-danger">
                        {errors.is_minimise_any_lender_arrangement_costs}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">
                      The ability to add fees to the mortgage
                    </Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`is_ability_to_add_fees_to_the_mortgage-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="is_ability_to_add_fees_to_the_mortgage"
                            id={`is_ability_to_add_fees_to_the_mortgage-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.is_ability_to_add_fees_to_the_mortgage
                                : !formData?.is_ability_to_add_fees_to_the_mortgage
                            }
                            onChange={handleInputChange}
                          />
                          <Label
                            check
                            for={`is_ability_to_add_fees_to_the_mortgage-${option}`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.is_ability_to_add_fees_to_the_mortgage && (
                      <div className="text-danger">
                        {errors.is_ability_to_add_fees_to_the_mortgage}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">
                      The ability to add fees to the mortgage - Client is aware
                      that extra interst will be payable
                    </Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`is_ability_to_add_fees_mortgage-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="is_ability_to_add_fees_mortgage"
                            id={`is_ability_to_add_fees_mortgage-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.is_ability_to_add_fees_mortgage
                                : !formData?.is_ability_to_add_fees_mortgage
                            }
                            onChange={handleInputChange}
                          />
                          <Label
                            check
                            for={`is_ability_to_add_fees_mortgage-${option}`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.is_ability_to_add_fees_mortgage && (
                      <div className="text-danger">
                        {errors.is_ability_to_add_fees_mortgage}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">Cashback</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup key={`cashback-${option}`} check inline>
                          <Input
                            type="radio"
                            name="cashback"
                            id={`cashback-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.cashback
                                : !formData?.cashback
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`cashback-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.cashback && (
                      <div className="text-danger">{errors.cashback}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">Portability</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup key={`portability-${option}`} check inline>
                          <Input
                            type="radio"
                            name="portability"
                            id={`portability-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.portability
                                : !formData?.portability
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`portability-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.portability && (
                      <div className="text-danger">{errors.portability}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">Guarantor / JBSP</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`guarantor_jbsp-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="guarantor_jbsp"
                            id={`guarantor_jbsp-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.guarantor_jbsp
                                : !formData?.guarantor_jbsp
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`guarantor_jbsp-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.guarantor_jbsp && (
                      <div className="text-danger">{errors.guarantor_jbsp}</div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">Offset Mortgage</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`offset_mortgage-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="offset_mortgage"
                            id={`offset_mortgage-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.offset_mortgage
                                : !formData?.offset_mortgage
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`offset_mortgage-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.offset_mortgage && (
                      <div className="text-danger">
                        {errors.offset_mortgage}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">
                      Scheme Specific (e.g HTBI-RTB)
                    </Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`scheme_specific-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="scheme_specific"
                            id={`scheme_specific-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.scheme_specific
                                : !formData?.scheme_specific
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`scheme_specific-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.scheme_specific && (
                      <div className="text-danger">
                        {errors.scheme_specific}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">Speed of completion</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`speed_of_completion-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="speed_of_completion"
                            id={`speed_of_completion-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.speed_of_completion
                                : !formData?.speed_of_completion
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`speed_of_completion-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.speed_of_completion && (
                      <div className="text-danger">
                        {errors.speed_of_completion}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">
                      Sharia Compliant Mortgages
                    </Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`sharia_compliant_mortgages-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="sharia_compliant_mortgages"
                            id={`sharia_compliant_mortgages-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.sharia_compliant_mortgages
                                : !formData?.sharia_compliant_mortgages
                            }
                            onChange={handleInputChange}
                          />
                          <Label
                            check
                            for={`sharia_compliant_mortgages-${option}`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.sharia_compliant_mortgages && (
                      <div className="text-danger">
                        {errors.sharia_compliant_mortgages}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">Ltd Company BTL</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`ltd_company_btl-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="ltd_company_btl"
                            id={`ltd_company_btl-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.ltd_company_btl
                                : !formData?.ltd_company_btl
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`ltd_company_btl-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.ltd_company_btl && (
                      <div className="text-danger">
                        {errors.ltd_company_btl}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label className="d-block">Any Incentives</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`any_incentives-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="any_incentives"
                            id={`any_incentives-${option}`}
                            value={option}
                            checked={
                              option === "yes"
                                ? formData?.any_incentives
                                : !formData?.any_incentives
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`any_incentives-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.any_incentives && (
                      <div className="text-danger">{errors.any_incentives}</div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Input
                      type="textarea"
                      name="what_suitable_mortgage_features_are_important"
                      value={
                        formData?.what_suitable_mortgage_features_are_important ||
                        ""
                      }
                      onChange={handleInputChange}
                    />
                    {errors.what_suitable_mortgage_features_are_important && (
                      <div className="text-danger">
                        {errors.what_suitable_mortgage_features_are_important}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label>
                If you are considering debt consolidation, what are your
                reasons; and what impact do you expect the consolidation to have
                on your lifestyle?
              </Label>
              <Input
                type="textarea"
                rows={4}
                name="considering_debt_consolidation"
                value={formData?.considering_debt_consolidation || ""}
                onChange={handleInputChange}
              />
              {errors.considering_debt_consolidation && (
                <div className="text-danger">
                  {errors.considering_debt_consolidation}
                </div>
              )}
              <small className="text-muted">
                Note: If you have previously consolidated, please explain why
                you are re-consolidating and will this reoccur again in the
                future?
              </small>
            </FormGroup>
            <FormGroup>
              <Label>
                Do you anticipate any changes to your income or expenditure in
                the near future?
              </Label>
              <div className="d-flex gap-4 mb-2">
                {yesNoOptions.map((option) => (
                  <FormGroup
                    key={`anticipate_any_changes-${option}`}
                    check
                    inline
                  >
                    <Input
                      type="radio"
                      name="anticipate_any_changes"
                      value={option}
                      id={`anticipate_any_changes-${option}`}
                      checked={
                        option === "yes"
                          ? formData?.anticipate_any_changes
                          : !formData?.anticipate_any_changes
                      }
                      onChange={handleInputChange}
                    />
                    <Label check for={`anticipate_any_changes-${option}`}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Label>
                  </FormGroup>
                ))}
              </div>
              {errors.anticipate_any_changes && (
                <div className="text-danger">
                  {errors.anticipate_any_changes}
                </div>
              )}
              <Input
                type="textarea"
                rows={4}
                name="anticipate_any_changes_notes"
                value={formData?.anticipate_any_changes_notes || ""}
                onChange={handleInputChange}
              />
              {errors.anticipate_any_changes_notes && (
                <div className="text-danger">
                  {errors.anticipate_any_changes_notes}
                </div>
              )}
              <small className="text-muted">
                Note: are they expecting a pay rise/ new baby / new job /
                inheritance etc
              </small>
            </FormGroup>
            <FormGroup className="border-primary rounded-2 p-2">
              <Label className="text-primary">
                Your Mortgage Related Insurance needs and requirements.
              </Label>
              <Row>
                <Col md={12}>
                  <Row>
                    <h6 className="text-secondary mb-2">
                      Applicant 1 Existing Protection
                    </h6>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">Life Cover</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_one_life_cover-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_one_life_cover"
                                id={`app_one_life_cover-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_one_life_cover
                                    : !formData?.app_one_life_cover
                                }
                                onChange={handleInputChange}
                              />
                              <Label check for={`app_one_life_cover-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_one_life_cover && (
                          <div className="text-danger">
                            {errors.app_one_life_cover}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">Critical Illness</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_one_critical_illness-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_one_critical_illness"
                                id={`app_one_critical_illness-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_one_critical_illness
                                    : !formData?.app_one_critical_illness
                                }
                                onChange={handleInputChange}
                              />
                              <Label
                                check
                                for={`app_one_critical_illness-${option}`}
                              >
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_one_critical_illness && (
                          <div className="text-danger">
                            {errors.app_one_critical_illness}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">Income Protection</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_one_income_protection-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_one_income_protection"
                                id={`app_one_income_protection-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_one_income_protection
                                    : !formData?.app_one_income_protection
                                }
                                onChange={handleInputChange}
                              />
                              <Label
                                check
                                for={`app_one_income_protection-${option}`}
                              >
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_one_income_protection && (
                          <div className="text-danger">
                            {errors.app_one_income_protection}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">ASU</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_one_asu-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_one_asu"
                                id={`app_one_asu-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_one_asu
                                    : !formData?.app_one_asu
                                }
                                onChange={handleInputChange}
                              />
                              <Label check for={`app_one_asu-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_one_asu && (
                          <div className="text-danger">
                            {errors.app_one_asu}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">PMI</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_one_pmi-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_one_pmi"
                                id={`app_one_pmi-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_one_pmi
                                    : !formData?.app_one_pmi
                                }
                                onChange={handleInputChange}
                              />
                              <Label check for={`app_one_pmi-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_one_pmi && (
                          <div className="text-danger">
                            {errors.app_one_pmi}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">Family Income Benefit</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_one_family_income_benefit-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_one_family_income_benefit"
                                id={`app_one_family_income_benefit-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_one_family_income_benefit
                                    : !formData?.app_one_family_income_benefit
                                }
                                onChange={handleInputChange}
                              />
                              <Label
                                check
                                for={`app_one_family_income_benefit-${option}`}
                              >
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_one_family_income_benefit && (
                          <div className="text-danger">
                            {errors.app_one_family_income_benefit}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">
                          Buildings and contents
                        </Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_one_buildings_and_contents-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_one_buildings_and_contents"
                                id={`app_one_buildings_and_contents-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_one_buildings_and_contents
                                    : !formData?.app_one_buildings_and_contents
                                }
                                onChange={handleInputChange}
                              />
                              <Label
                                check
                                for={`app_one_buildings_and_contents-${option}`}
                              >
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_one_buildings_and_contents && (
                          <div className="text-danger">
                            {errors.app_one_buildings_and_contents}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md={12} className="py-2">
                  <Row>
                    <h6 className="text-secondary mb-2">
                      Applicant 2 Existing Protection
                    </h6>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">Life Cover</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_two_life_cover-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_two_life_cover"
                                id={`app_two_life_cover-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_two_life_cover
                                    : !formData?.app_two_life_cover
                                }
                                onChange={handleInputChange}
                              />
                              <Label check for={`app_two_life_cover-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_two_life_cover && (
                          <div className="text-danger">
                            {errors.app_two_life_cover}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">Critical Illness</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_two_critical_illness-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_two_critical_illness"
                                id={`app_two_critical_illness-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_two_critical_illness
                                    : !formData?.app_two_critical_illness
                                }
                                onChange={handleInputChange}
                              />
                              <Label
                                check
                                for={`app_two_critical_illness-${option}`}
                              >
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_two_critical_illness && (
                          <div className="text-danger">
                            {errors.app_two_critical_illness}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">Income Protection</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_two_income_protection-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_two_income_protection"
                                id={`app_two_income_protection-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_two_income_protection
                                    : !formData?.app_two_income_protection
                                }
                                onChange={handleInputChange}
                              />
                              <Label
                                check
                                for={`app_two_income_protection-${option}`}
                              >
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_two_income_protection && (
                          <div className="text-danger">
                            {errors.app_two_income_protection}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">ASU</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_two_asu-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_two_asu"
                                id={`app_two_asu-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_two_asu
                                    : !formData?.app_two_asu
                                }
                                onChange={handleInputChange}
                              />
                              <Label check for={`app_two_asu-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_two_asu && (
                          <div className="text-danger">
                            {errors.app_two_asu}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">PMI</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_two_pmi-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_two_pmi"
                                id={`app_two_pmi-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_two_pmi
                                    : !formData?.app_two_pmi
                                }
                                onChange={handleInputChange}
                              />
                              <Label check for={`app_two_pmi-${option}`}>
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_two_pmi && (
                          <div className="text-danger">
                            {errors.app_two_pmi}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">Family Income Benefit</Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_two_family_income_benefit-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_two_family_income_benefit"
                                id={`app_two_family_income_benefit-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_two_family_income_benefit
                                    : !formData?.app_two_family_income_benefit
                                }
                                onChange={handleInputChange}
                              />
                              <Label
                                check
                                for={`app_two_family_income_benefit-${option}`}
                              >
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_two_family_income_benefit && (
                          <div className="text-danger">
                            {errors.app_two_family_income_benefit}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="d-block">
                          Buildings and contents
                        </Label>
                        <div className="d-flex gap-4">
                          {yesNoOptions.map((option) => (
                            <FormGroup
                              key={`app_two_buildings_and_contents-${option}`}
                              check
                              inline
                            >
                              <Input
                                type="radio"
                                name="app_two_buildings_and_contents"
                                id={`app_two_buildings_and_contents-${option}`}
                                value={option}
                                checked={
                                  option === "yes"
                                    ? formData?.app_two_buildings_and_contents
                                    : !formData?.app_two_buildings_and_contents
                                }
                                onChange={handleInputChange}
                              />
                              <Label
                                check
                                for={`app_two_buildings_and_contents-${option}`}
                              >
                                {option.charAt(0).toUpperCase() +
                                  option.slice(1)}
                              </Label>
                            </FormGroup>
                          ))}
                        </div>
                        {errors.app_two_buildings_and_contents && (
                          <div className="text-danger">
                            {errors.app_two_buildings_and_contents}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup className="border-primary rounded-2 p-2">
              <Label className="text-primary">
                We will provide you with a quotation for buildings and or
                contents insurance Which of the following do you wish to be
                included within this quotation?
              </Label>
              <Row>
                <Col md={4}>
                  <FormGroup className="mb-2">
                    <Label className="d-block">Buildings</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup key={`buildings-${option}`} check inline>
                          <Input
                            type="radio"
                            name="buildings"
                            value={option}
                            id={`buildings-${option}`}
                            checked={
                              option === "yes"
                                ? formData?.buildings
                                : !formData?.buildings
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`buildings-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.buildings && (
                      <div className="text-danger">{errors.buildings}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-2">
                    <Label className="d-block">+ Contents</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup key={`contents-${option}`} check inline>
                          <Input
                            type="radio"
                            name="contents"
                            value={option}
                            id={`contents-${option}`}
                            checked={
                              option === "yes"
                                ? formData?.contents
                                : !formData?.contents
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`contents-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.contents && (
                      <div className="text-danger">{errors.contents}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-2">
                    <Label className="d-block">Accidental Damage</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`accidental_damage-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="accidental_damage"
                            value={option}
                            id={`accidental_damage-${option}`}
                            checked={
                              option === "yes"
                                ? formData?.accidental_damage
                                : !formData?.accidental_damage
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`accidental_damage-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.accidental_damage && (
                      <div className="text-danger">
                        {errors.accidental_damage}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup className="mb-2">
                    <Label className="d-block">Landlords cover</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`landlords_cover-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="landlords_cover"
                            value={option}
                            id={`landlords_cover-${option}`}
                            checked={
                              option === "yes"
                                ? formData?.landlords_cover
                                : !formData?.landlords_cover
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`landlords_cover-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.landlords_cover && (
                      <div className="text-danger">
                        {errors.landlords_cover}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-2">
                    <Label className="d-block">Home Emergency Cover</Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`home_emergency_cover-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="home_emergency_cover"
                            value={option}
                            id={`home_emergency_cover-${option}`}
                            checked={
                              option === "yes"
                                ? formData?.home_emergency_cover
                                : !formData?.home_emergency_cover
                            }
                            onChange={handleInputChange}
                          />
                          <Label check for={`home_emergency_cover-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.home_emergency_cover && (
                      <div className="text-danger">
                        {errors.home_emergency_cover}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-2">
                    <Label className="d-block">
                      Personal Possessions Cover
                    </Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`personal_possessions_cover-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="personal_possessions_cover"
                            value={option}
                            id={`personal_possessions_cover-${option}`}
                            checked={
                              option === "yes"
                                ? formData?.personal_possessions_cover
                                : !formData?.personal_possessions_cover
                            }
                            onChange={handleInputChange}
                          />
                          <Label
                            check
                            for={`personal_possessions_cover-${option}`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.personal_possessions_cover && (
                      <div className="text-danger">
                        {errors.personal_possessions_cover}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup className="mb-2">
                    <Label className="d-block">
                      If Personal possessions, confirm items and amount of cover
                    </Label>
                    <div className="d-flex gap-4">
                      {yesNoOptions.map((option) => (
                        <FormGroup
                          key={`personal_possessions_confirm-${option}`}
                          check
                          inline
                        >
                          <Input
                            type="radio"
                            name="personal_possessions_confirm"
                            value={option}
                            id={`personal_possessions_confirm-${option}`}
                            checked={
                              option === "yes"
                                ? formData?.personal_possessions_confirm
                                : !formData?.personal_possessions_confirm
                            }
                            onChange={handleInputChange}
                          />
                          <Label
                            check
                            for={`personal_possessions_confirm-${option}`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                    {errors.personal_possessions_confirm && (
                      <div className="text-danger">
                        {errors.personal_possessions_confirm}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label>Do you have a will in place?</Label>
              <div className="d-flex gap-4 mb-2">
                {yesNoOptions.map((option) => (
                  <FormGroup
                    key={`have_you_a_will_in_place-${option}`}
                    check
                    inline
                  >
                    <Input
                      type="radio"
                      name="have_you_a_will_in_place"
                      value={option}
                      id={`have_you_a_will_in_place-${option}`}
                      checked={
                        option === "yes"
                          ? formData?.have_you_a_will_in_place
                          : !formData?.have_you_a_will_in_place
                      }
                      onChange={handleInputChange}
                    />
                    <Label check for={`have_you_a_will_in_place-${option}`}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Label>
                  </FormGroup>
                ))}
              </div>
              {errors.have_you_a_will_in_place && (
                <div className="text-danger">
                  {errors.have_you_a_will_in_place}
                </div>
              )}
              <Input
                type="textarea"
                rows={4}
                name="have_you_a_will_in_place_note"
                value={formData?.have_you_a_will_in_place_note || ""}
                onChange={handleInputChange}
              />
              {errors.have_you_a_will_in_place_note && (
                <div className="text-danger">
                  {errors.have_you_a_will_in_place_note}
                </div>
              )}
              <small className="text-muted">
                Note: when was it last reviewed? Would you like us to refer you
                to someone who can draft and update your will?
              </small>
            </FormGroup>
            <FormGroup>
              <Label>
                Is there anything else you would like to discuss or add to your
                mortgage requirements?
              </Label>
              <div className="d-flex gap-4 mb-2">
                {yesNoOptions.map((option) => (
                  <FormGroup
                    key={`mortgage_requirements-${option}`}
                    check
                    inline
                  >
                    <Input
                      type="radio"
                      name="mortgage_requirements"
                      value={option}
                      id={`mortgage_requirements-${option}`}
                      checked={
                        option === "yes"
                          ? formData?.mortgage_requirements
                          : !formData?.mortgage_requirements
                      }
                      onChange={handleInputChange}
                    />
                    <Label check for={`mortgage_requirements-${option}`}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Label>
                  </FormGroup>
                ))}
              </div>
              {errors.mortgage_requirements && (
                <div className="text-danger">
                  {errors.mortgage_requirements}
                </div>
              )}
              <Input
                type="textarea"
                rows={4}
                name="mortgage_requirements_note"
                value={formData?.mortgage_requirements_note || ""}
                onChange={handleInputChange}
              />
              {errors.mortgage_requirements_note && (
                <div className="text-danger">
                  {errors.mortgage_requirements_note}
                </div>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Notes</Label>
              <Input
                type="textarea"
                rows={4}
                name="notes"
                value={formData?.notes || ""}
                onChange={handleInputChange}
              />
              {errors.notes && (
                <div className="text-danger">{errors.notes}</div>
              )}
            </FormGroup>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                color="primary"
                disabled={isUpdating || session?.user?.user_type === "CLIENT"}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                color="secondary"
                onClick={async () => {
                  if (session?.user?.user_type === "CLIENT") {
                    handleNextTab();
                  } else {
                    const success = await handleSubmit(
                      new Event("click") as any,
                    );
                    if (success) {
                      handleNextTab();
                    }
                  }
                }}
              >
                {session?.user?.user_type === "CLIENT"
                  ? "Go To Next"
                  : "Save & Next"}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default NeedsAndPreferencesContent;
