import LoadingSpinner from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import {
  useGetInsuranceOverviewQuery,
  useGetInsurancePoliciesQuery,
  useUpdateInsuranceOverviewMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/InsuranceOverview/InsuranceOverviewApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import PolicyTab from "./PolicyTab/PolicyTab";

const InsuranceOverviewContent: React.FC = () => {
  const { casealias } = useParams();
  const [activeMainTab, setActiveMainTab] = useState<string>("overview");

  const { data: insuranceOverviewData, isLoading } =
    useGetInsuranceOverviewQuery({ case_alias: casealias });
  const [updateInsuranceOverview, { isLoading: isUpdating }] =
    useUpdateInsuranceOverviewMutation();
  const { data: insurancePoliciesData, isLoading: isLoadingPolicies } =
    useGetInsurancePoliciesQuery(
      {
        case_alias: casealias,
        insurance_overview_alias: insuranceOverviewData?.alias,
      },
      { skip: !insuranceOverviewData?.alias },
    );

  const dispatch = useAppDispatch();
  const currentTab: string | null = useAppSelector(
    (state: any) => state.caseDetails.basicTabId,
  );
  const { data: session } = useSession();
  const { data: caseData } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  // API may return an array; prefer the first item when that is the case.
  const overview = Array.isArray(insuranceOverviewData)
    ? insuranceOverviewData[0]
    : insuranceOverviewData;

  const [formState, setFormState] = useState<any>(null);

  useEffect(() => {
    if (overview) {
      // shallow clone to detach from query cache
      setFormState({ ...overview, joint_users: overview.joint_users ?? [] });
    }
  }, [overview]);

  const handleChange = (field: string, value: any) => {
    setFormState((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;
    // Determine the alias for the specific insurance overview item.
    const insurance_overview_alias =
      formState?.insurance_overview_alias ||
      formState?.insurance_overview_id ||
      formState?.alias ||
      formState?.id;

    if (!insurance_overview_alias) {
      toast.error("Unable to determine insurance overview identifier");
      return;
    }

    const editablePayload = {
      introduction_type: formState.introduction_type,
      advise_level: formState.advise_level,
      lead_source: formState.lead_source,
      summary: formState.summary,
    };

    try {
      await updateInsuranceOverview({
        case_alias: casealias,
        insurance_overview_alias,
        payload: editablePayload,
      }).unwrap();
      toast.success("Insurance overview updated successfully");
    } catch (err) {
      console.error("Failed to update insurance overview", err);
      toast.error("Failed to update insurance overview");
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

  if (isLoading || !formState) {
    return (
      <div className="p-2">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-2">
      <Nav pills className="justify-content-center nav-primary">
        <NavItem>
          <NavLink
            className={activeMainTab === "overview" ? "active" : ""}
            onClick={() => setActiveMainTab("overview")}
            style={{ cursor: "pointer" }}
          >
            Overview
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeMainTab === "policies" ? "active" : ""}
            onClick={() => setActiveMainTab("policies")}
            style={{ cursor: "pointer" }}
          >
            Policies
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeMainTab}>
        <TabPane tabId="overview">
          <Form onSubmit={handleSubmit} className="mt-3">
            <Row>
              <Col sm={12} md={4}>
                <FormGroup>
                  <Label>Applicant</Label>
                  <Input
                    value={formState?.applicant ?? ""}
                    className="bg-light-dark"
                    readOnly
                  />
                </FormGroup>
              </Col>

              {/* Render each joint user in its own column */}
              {formState?.joint_users && formState.joint_users.length > 0 ? (
                formState.joint_users.map((ju: string, idx: number) => (
                  <Col sm={12} md={4} key={`joint-${idx}`}>
                    <FormGroup>
                      <Label>{`Joint Applicant ${idx + 1}`}</Label>
                      <Input
                        value={ju ?? ""}
                        className="bg-light-dark"
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                ))
              ) : (
                <Col sm={12} md={4}>
                  <FormGroup>
                    <Label>Joint Applicants</Label>
                    <Input value={formState?.joint_users[0] ?? ""} readOnly />
                  </FormGroup>
                </Col>
              )}
            </Row>

            <Row className="mt-2">
              <Col sm={12} md={4}>
                <FormGroup>
                  <Label>Introduction Type</Label>
                  <Input
                    value={formState?.introduction_type ?? ""}
                    type="select"
                    onChange={(e) =>
                      handleChange("introduction_type", e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="DIRECT">Direct</option>
                    <option value="RDI">RDI</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col sm={12} md={4}>
                <FormGroup>
                  <Label>Advise Level</Label>
                  <Input
                    value={formState?.advise_level ?? ""}
                    type="select"
                    onChange={(e) =>
                      handleChange("advise_level", e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="ADVISING">Advising</option>
                    <option value="EXECUTION_ONLY">Execution Only</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col sm={12} md={4}>
                <FormGroup>
                  <Label>Lead Source</Label>
                  <Input
                    value={formState?.lead_source ?? ""}
                    type="select"
                    onChange={(e) =>
                      handleChange("lead_source", e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    <option value="INTERNAL">Internal</option>
                    <option value="EXTERNAL">External</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="WEBSITE">Website</option>
                    <option value="ESTATE_AGENTS">Estate Agents</option>
                    <option value="TV3">TV3</option>
                    <option value="FAMILY">Family</option>
                    <option value="FRIENDS">Friends</option>
                    <option value="REFERRALS">Referrals</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col sm={12} md={4}>
                <FormGroup>
                  <Label>Total Final Premium</Label>
                  <Input
                    value={formState?.total_final_premium ?? 0}
                    className="bg-light-dark"
                    readOnly
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={4}>
                <FormGroup>
                  <Label>Total Premium Quoted</Label>
                  <Input
                    value={formState?.total_premium_quoted ?? 0}
                    className="bg-light-dark"
                    readOnly
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={4}>
                <FormGroup>
                  <Label>Net Case Value</Label>
                  <Input
                    value={formState?.net_case_value ?? 0}
                    className="bg-light-dark"
                    readOnly
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col sm={12}>
                <FormGroup>
                  <Label>Summary</Label>
                  <Input
                    type="textarea"
                    value={formState?.summary ?? ""}
                    onChange={(e) => handleChange("summary", e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3 gap-2">
              <Button
                color="primary"
                type="submit"
                disabled={
                  isUpdating ||
                  (session?.user?.user_type === "CLIENT" &&
                    overview?.updated_by !== null)
                }
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="submit"
                color="secondary"
                onClick={async (e) => {
                  e.preventDefault();
                  if (
                    session?.user?.user_type === "CLIENT" &&
                    overview?.updated_by !== null
                  ) {
                    handleNextTab();
                  } else {
                    try {
                      await handleSubmit(e);
                      handleNextTab();
                    } catch (err) {
                      console.error(
                        "Failed to save and navigate to next tab:",
                        err,
                      );
                    }
                  }
                }}
                disabled={isUpdating}
              >
                {session?.user?.user_type === "CLIENT" &&
                overview?.updated_by !== null
                  ? "Go To Next"
                  : "Save & Next"}
              </Button>
            </div>
          </Form>
        </TabPane>

        <TabPane tabId="policies">
          <PolicyTab insuranceOverviewAlias={overview?.alias} />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default InsuranceOverviewContent;
