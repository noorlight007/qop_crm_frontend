import LoadingSpinner from "@/app/loading";
import {
  useGetCaseBudgetPlannerQuery,
  useValidateBudgetPlannerMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerApi";
import { initializeBudgetPlannerForm } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerFormSlice";
import { BudgetPlannerTabContentProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/BudgetPlannerTypes";
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
  const dispatch = useDispatch();
  const { data, isLoading } = useGetCaseBudgetPlannerQuery(
    { case_alias: casealias as string },
    { skip: !casealias },
  );
  const initializedRef = useRef<string | null>(null);

  // Get current form values from store so we can validate them
  const budgetPlannerState = (useSelector as any)(
    (state: any) => state.budgetPlanner,
  );
  const [validateBudgetPlanner] = useValidateBudgetPlannerMutation();

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

  const handleNextClick = async () => {
    // Validate before advancing
    try {
      const alias = data && data[0] ? (data[0] as any).alias : undefined;
      if (!alias) {
        // fallback to just move
        setTabId((tabId ?? 1) + 1);
        return;
      }
      const res = await validateBudgetPlanner({
        case_alias: casealias,
        budgetplanner_alias: alias,
        updatedBudgetPlannerData: budgetPlannerState,
      });
      if ((res as any).data) {
        setErrors && setErrors({});
        setTabId((tabId ?? 1) + 1);
      } else if ((res as any).error) {
        const parsed = parseApiErrors((res as any).error);
        if (Object.keys(parsed).length) {
          setErrors && setErrors(parsed);
          const target = findTabFromErrors(parsed);
          if (target) setTabId(target);
          scrollToFirstError(parsed);
          toast.error(Object.values(parsed)[0]);
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
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <TabContent activeTab={tabId ?? undefined}>
      {tabs.map(({ id, Component }) => (
        <TabPane key={id} tabId={id}>
          <Component updateField={updateField} errors={errors} />{" "}
          {/* Pass updateField to each tab */}
          {id !== 5 && (
            <Button
              color="primary"
              onClick={() => (tabId !== null ? handleNextClick() : null)}
              className="float-end mt-2"
            >
              Next
            </Button>
          )}
        </TabPane>
      ))}
    </TabContent>
  );
};

export default BudgetPlannerTabContent;
