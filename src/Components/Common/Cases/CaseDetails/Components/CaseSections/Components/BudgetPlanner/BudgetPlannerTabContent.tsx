import { LoadingSpinner2 } from "@/app/loading";
import {
  useGetCaseBudgetPlannerQuery,
  useValidateBudgetPlannerMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerApi";
import {
  clearApiErrors,
  initializeBudgetPlannerForm,
  setApiErrors,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerFormSlice";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { BudgetPlannerTabContentProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/BudgetPlannerTypes";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, TabContent, TabPane } from "reactstrap";
import DebtRepaymentTabContent from "./BudgetPlannerTabContents/DebtRepaymentTabContent";
import DisclaimerTabContents from "./BudgetPlannerTabContents/DisclaimerTabContents";
import HouseHoldIncomeTabContent from "./BudgetPlannerTabContents/HouseHoldIncomeTabContent";
import LivingExpensesTabContents from "./BudgetPlannerTabContents/LivingExpensesTabContents";
import MonthlyBudgetTabContents from "./BudgetPlannerTabContents/MonthlyBudgetTabContents";

const tabs = [
  { id: 1, Component: HouseHoldIncomeTabContent },
  { id: 2, Component: DebtRepaymentTabContent },
  { id: 3, Component: LivingExpensesTabContents },
  { id: 4, Component: MonthlyBudgetTabContents },
  { id: 5, Component: DisclaimerTabContents },
];

const BudgetPlannerTabContent: FC<BudgetPlannerTabContentProps> = ({
  tabId,
  setTabId,
  updateField,
  errors,
  setErrors,
}) => {
  const { casealias } = useParams();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetCaseBudgetPlannerQuery(
    { case_alias: casealias as string },
    { skip: !casealias },
  );
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );
  const initializedRef = useRef<string | null>(null);

  // Get current form values from store so we can validate them
  const budgetPlannerState = (useSelector as any)(
    (state: any) => state.budgetPlanner,
  );
  const [validateBudgetPlanner, { isLoading: isValidating }] =
    useValidateBudgetPlannerMutation();

  const buildChangedPayload = (original: any, current: any) => {
    const deepDiff = (a: any, b: any): any => {
      // primitives / nullish
      if (a === b) return undefined;
      if (a == null || b == null) return b;
      if (typeof a !== "object" || typeof b !== "object") return b;

      // arrays
      if (Array.isArray(a) || Array.isArray(b)) {
        try {
          return JSON.stringify(a) === JSON.stringify(b) ? undefined : b;
        } catch {
          return b;
        }
      }

      const out: any = {};
      for (const key of Object.keys(b)) {
        if (key === "api_errors") continue;
        const v = deepDiff(a?.[key], b?.[key]);
        if (v === undefined) continue;
        if (typeof v === "object" && v && !Array.isArray(v)) {
          if (Object.keys(v).length === 0) continue;
        }
        out[key] = v;
      }

      return Object.keys(out).length ? out : undefined;
    };

    const diff = deepDiff(original, current) || {};
    // keep alias if present (many endpoints rely on it)
    if (current?.alias && diff.alias == null) diff.alias = current.alias;
    return diff;
  };

  // Helper to map bare API keys into UI dotted keys (keeps mapping small — expand as needed)
  const normalizeBudgetPlannerErrors = (errs: Record<string, string>) => {
    const out: Record<string, string> = {};

    const add = (key: string, value: string) => {
      if (!key) return;
      if (out[key]) return;
      out[key] = value;
    };

    const subTotalIdFromSnake = (snake: string) => {
      if (snake === "total_income") return "TotalIncome";
      if (snake === "total_debt_repayment") return "TotalDebtRepayment";
      if (snake === "total_living_expenses") return "TotalHome";
      if (snake === "available_income") return "AvailableIncome";
      return null;
    };

    for (const [k, rawValue] of Object.entries(errs || {})) {
      const value = String(rawValue);
      // Always keep the original key (e.g. `current_income.applicant_one_net_monthly_income`).
      // Avoid adding generic keys like `applicant_one_net_monthly_income` because they can
      // incorrectly display the same error under both Current and Post inputs.
      add(k, value);

      // Handle bare keys (backend sometimes returns just the UI id)
      if (
        /^TotalIncome$|^TotalDebtRepayment$|^TotalHome$|^AvailableIncome$/i.test(
          k,
        )
      ) {
        add(`CurrentBudgetPlanner.${k}`, value);
        add(`PostCompletionBudgetPlanner.${k}`, value);
        continue;
      }

      // Map typical backend keys (snake_case sections) to DOM ids used by inputs.
      // This enables both inline display (via component aliases) and scroll/focus.
      const m = k.match(
        /^(current_income|post_income|current_debt_repayments|post_debt_repayments|current_priority_debt|post_priority_debt|current_unsecured_borrowing|post_unsecured_borrowing|current_living_cost|post_living_cost|current_insurance|post_insurance|current_sub_total|post_sub_total)\.(.+)$/,
      );
      if (!m) continue;

      const section = m[1];
      const fieldSnake = m[2];
      const isPost = section.startsWith("post_");
      const prefix = isPost
        ? "PostCompletionBudgetPlanner"
        : "CurrentBudgetPlanner";

      // Most inputs use id `${prefix}_${snake}`
      add(`${prefix}_${fieldSnake}`, value);

      // Monthly budget tab uses `${prefix}.<Id>` for sub totals
      if (section.endsWith("sub_total")) {
        const subId = subTotalIdFromSnake(fieldSnake);
        if (subId) {
          add(`${prefix}.${subId}`, value);
        }
      }
    }

    return out;
  };

  // merge errors passed via props with any persisted API errors in redux
  const reduxApiErrors =
    (budgetPlannerState && budgetPlannerState.api_errors) || {};
  const mergedErrors = { ...(reduxApiErrors || {}), ...(errors || {}) };

  const getErrorMessage = (err: any) => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (typeof err?.data === "string") return err.data;

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

  const parseApiErrors = (err: any): Record<string, string> => {
    if (!err) return {};
    const out: Record<string, string> = {};

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

    const dataErr = err?.data || err;
    if (dataErr && typeof dataErr === "object") {
      const recurse = (value: any, path: string[]) => {
        if (value == null) return;
        if (typeof value === "string") {
          out[path.join(".")] = value;
          return;
        }
        if (Array.isArray(value)) {
          out[path.join(".")] = value
            .map((v: any) => (typeof v === "string" ? v : JSON.stringify(v)))
            .join(", ");
          return;
        }
        if (typeof value === "object") {
          for (const k of Object.keys(value)) recurse(value[k], path.concat(k));
          return;
        }
        out[path.join(".")] = String(value);
      };
      recurse(dataErr, []);
    }

    return out;
  };

  const scrollToFirstError = (errorsObj: Record<string, string>) => {
    try {
      const keys = Object.keys(errorsObj || {});
      if (!keys.length) return;

      const tryIds = (k: string) => {
        const variants = [
          k,
          k.replace(/\./g, "_"),
          k.replace(/_/g, "."),
          (k.split(".").pop() as string) || k,
          k.replace(/[^a-zA-Z0-9\.]/g, ""),
        ];
        for (const v of variants) {
          const el =
            document.getElementById(v) ||
            document.querySelector(`[name="${v}"]`);
          if (el) {
            (el as HTMLElement).scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            try {
              (el as HTMLElement).focus();
            } catch {}
            return true;
          }
        }
        return false;
      };

      for (const k of keys) {
        if (tryIds(k)) return;
      }
    } catch (e) {
      console.warn("scrollToFirstError failed", e);
    }
  };

  const findTabFromErrors = (errs: Record<string, string>) => {
    const keys = Object.keys(errs || {});
    if (!keys.length) return null;

    const first = keys[0];
    if (
      /Applicant|Rental|Part Time|Child|Tax|Maintenance|Pension|Other Benefits|TotalIncome/i.test(
        first,
      )
    )
      return 1;
    if (
      /Mortgage|Second Mortgage|Priority|Credit Cards|Loans|Car Finance|Overdraft|CCJs|Debt|TotalDebt/i.test(
        first,
      )
    )
      return 2;
    if (
      /Electricity|Gas|Water|Council|Food|Fuel|TV|Insurance|Buildings|Contents|Childcare|TotalHome/i.test(
        first,
      )
    )
      return 3;
    if (
      /TotalIncome|TotalDebtRepayment|TotalHome|AvailableIncome|Available/i.test(
        first,
      )
    )
      return 4;

    return 1;
  };

  // Helper function to check if applicant can proceed
  const canApplicantProceed = (): boolean => {
    const userRole = session?.user?.role;
    const caseStage = caseData?.case_stage;

    // If user is not an applicant, allow
    if (userRole !== "APPLICANT") return true;

    // For applicants, only allow if stage is ENQUIRY or FACT_FIND
    return caseStage === "ENQUIRY" || caseStage === "FACT_FIND";
  };

  const handleNextClick = async () => {
    // Validate before advancing
    try {
      const alias = data && data[0] ? (data[0] as any).alias : undefined;
      if (!alias) {
        // fallback to just move
        setTabId((tabId ?? 1) + 1);
        return;
      }

      // Send only changed fields compared to last-loaded API data
      const original = data && data[0] ? (data[0] as any) : {};
      const changedPayload = buildChangedPayload(original, budgetPlannerState);
      if (!changedPayload || Object.keys(changedPayload).length === 0) {
        // nothing changed; allow navigation without validate call
        setTabId((tabId ?? 1) + 1);
        return;
      }

      const res = await validateBudgetPlanner({
        case_alias: casealias,
        budgetplanner_alias: alias,
        updatedBudgetPlannerData: changedPayload,
      });
      if ((res as any).data) {
        setErrors && setErrors({});
        dispatch(clearApiErrors());
        setTabId((tabId ?? 1) + 1);
      } else if ((res as any).error) {
        const parsed = parseApiErrors((res as any).error);
        if (Object.keys(parsed).length) {
          const normalized = normalizeBudgetPlannerErrors(parsed);
          setErrors && setErrors(normalized);
          dispatch(setApiErrors(normalized));
          const target = findTabFromErrors(normalized);
          if (target) setTabId(target);
          scrollToFirstError(normalized);
          toast.error(String(Object.values(normalized)[0]));
        } else {
          toast.error(getErrorMessage((res as any).error));
        }
      }
    } catch (e) {
      console.error("Validation failed:", e);
      toast.error("Validation failed. Please try again.");
    }
  };

  useEffect(() => {
    if (data && data[0]) {
      const alias = (data[0] as any)?.alias ?? JSON.stringify(data[0]);
      if (initializedRef.current !== alias) {
        dispatch(initializeBudgetPlannerForm(data[0]));
        initializedRef.current = alias;
      }
    }
  }, [data, dispatch]);

  // Don't hard-block UI; only show spinner if no data has been initialized yet
  if (isLoading && !initializedRef.current) {
    return (
      <div>
        <LoadingSpinner2 />
      </div>
    );
  }

  return (
    <TabContent activeTab={tabId ?? undefined}>
      {tabs.map(({ id, Component }) => (
        <TabPane key={id} tabId={id}>
          <Component updateField={updateField} errors={mergedErrors} />{" "}
          {/* Pass updateField to each tab */}
          {id !== 5 && canApplicantProceed() && (
            <Button
              color="primary"
              onClick={() => (tabId !== null ? handleNextClick() : null)}
              className="float-end mt-2"
            >
              {isValidating ? "Validating..." : "Next"}
            </Button>
          )}
        </TabPane>
      ))}
    </TabContent>
  );
};

export default BudgetPlannerTabContent;
