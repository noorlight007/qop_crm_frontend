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
      const errorMessage =
        (res.error as any)?.data?.detail ||
        "Error updating budget planner details!";
      toast.error(errorMessage);
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
