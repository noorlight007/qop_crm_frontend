"use client";
import { useUpdateBudgetPlannerMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerApi";
import {
  initializeBudgetPlannerForm,
  updateBudgetPlannerSection,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/BudgetPlanner/BudgetPlannerFormSlice";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { BudgetPlannerModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/BudgetPlannerTypes";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { FC, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import BudgetPlannerTabContent from "../BudgetPlannerTabContent";

const budgetPlannerTabTitleData = [
  "Household Income",
  "Debt Repayment",
  "Living Expenses",
  "Monthly Budget",
  "Disclaimers",
];

const BudgetPlannerModal: FC<BudgetPlannerModalProps> = ({
  isOpen,
  toggle,
}) => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const dispatch = useDispatch();
  const [basicTab, setBasicTab] = useState<number>(1);
  const budgetPlannerData = useSelector((state: any) => state.budgetPlanner);
  const [updateBudgetPlanner, { isLoading }] = useUpdateBudgetPlannerMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();
  // Local state to track only the changes
  const [updatedFields, setUpdatedFields] = useState<Record<string, any>>({});

  // Server-side validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    const data = err?.data || err;
    if (data && typeof data === "object") {
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
      recurse(data, []);
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

  const handleTabClick = (index: number) => {
    setBasicTab(index);
  };

  const handleSaveChanges = useCallback(async () => {
    const finalData = {
      ...budgetPlannerData,
      ...updatedFields,
      updated_at: new Date().toISOString(),
    };

    dispatch(initializeBudgetPlannerForm(finalData));

    const res = await updateBudgetPlanner({
      case_alias: casealias,
      budgetplanner_alias: budgetPlannerData.alias,
      updatedBudgetPlannerData: finalData,
    });
    if (res.data) {
      toast.success("Budget Planner Updated Successfully");
      setErrors({});
      try {
        await updateSectionCompleteStatus({
          case_alias: casealias,
          section_data: { is_budget_planner: true },
        });
      } catch (err) {
        console.error("Failed to update section complete status:", err);
      }
      toggle();
    } else if (res.error) {
      const parsed = parseApiErrors((res as any).error);
      if (Object.keys(parsed).length) {
        setErrors(parsed);
        // Determine the tab containing the first error
        const firstKey = Object.keys(parsed)[0] || "";
        let targetTab = 1;
        if (
          /TotalIncome|Applicant|Rental|Part Time|Child|Tax|Maintenance|Pension|Other Benefits/i.test(
            firstKey,
          )
        )
          targetTab = 1;
        else if (
          /Mortgage|Second Mortgage|Priority|Credit Cards|Loans|Car Finance|Overdraft|CCJs|Debt/i.test(
            firstKey,
          )
        )
          targetTab = 2;
        else if (
          /Electricity|Gas|Water|Council|Food|Fuel|TV|Insurance|Buildings|Contents|Childcare/i.test(
            firstKey,
          )
        )
          targetTab = 3;
        else if (
          /TotalIncome|TotalDebtRepayment|TotalHome|AvailableIncome|Available/i.test(
            firstKey,
          )
        )
          targetTab = 4;
        setBasicTab(targetTab);
        try {
          scrollToFirstError(parsed);
        } catch (e) {}
        toast.error(Object.values(parsed)[0]);
      } else {
        const errorMessage =
          (res.error as any)?.data?.detail ||
          "Error updating budget planner details!";
        toast.error(errorMessage);
      }
    } else {
      toast.error("Budget Planner Update Failed");
    }
  }, [budgetPlannerData, updatedFields, dispatch, toggle]);

  // Function to update local changes and store section
  const updateField = useCallback(
    (field: string, value: any) => {
      setUpdatedFields((prev: Record<string, any>) => {
        if (JSON.stringify(prev[field]) === JSON.stringify(value)) {
          return prev; // No change, prevent unnecessary updates
        }
        const next = { ...prev, [field]: value };
        // Update only the affected section to avoid heavy reflows
        dispatch(
          updateBudgetPlannerSection({ section: field as any, data: value }),
        );
        return next;
      });
    },
    [dispatch],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle} className="bg-primary text-white">
        <span className="fs-5">Budget Planner</span>
      </ModalHeader>
      <ModalBody>
        <Card>
          <CardBody>
            <CardHeader className="d-flex justify-content-center align-items-center flex-wrap pb-2 p-0">
              <Nav tabs className="w-100">
                {budgetPlannerTabTitleData.map((tabName, index) => (
                  <NavItem key={index + 1} className="flex-grow-1">
                    <NavLink
                      className={`text-primary text-center ${
                        basicTab === index + 1 ? "active" : ""
                      }`}
                      onClick={() => handleTabClick(index + 1)}
                      style={{ cursor: "pointer", fontSize: ".9rem" }}
                    >
                      {tabName}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </CardHeader>
            <CardBody className="px-0 pb-0">
              <BudgetPlannerTabContent
                tabId={basicTab}
                setTabId={setBasicTab}
                updateField={useCallback(
                  (field: string, value: any) => updateField(field, value),
                  [updateField],
                )}
                errors={errors}
                setErrors={setErrors}
              />
            </CardBody>
          </CardBody>
        </Card>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
        <Button
          color="primary"
          onClick={handleSaveChanges}
          disabled={
            (!budgetPlannerData.disclaimer && !updatedFields.disclaimer) ||
            session?.user?.user_type === "CLIENT"
          }
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BudgetPlannerModal;
