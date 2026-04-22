import { LoadingSpinner2 } from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import {
  useGetInsuranceOverviewQuery,
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

  const dispatch = useAppDispatch();
  const currentTab: string | null = useAppSelector(
    (state: any) => state.caseSections.basicTabId,
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (overview) {
      // shallow clone to detach from query cache
      setFormState({ ...overview, joint_users: overview.joint_users ?? [] });
    }
  }, [overview]);

  const handleChange = (field: string, value: any) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
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
      setErrors({});
      toast.success("Insurance overview updated successfully");
    } catch (err) {
      // parse API validation errors and set per-field messages
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
        "Failed to update insurance overview";
      toast.error(firstMsg);
      console.error("Failed to update insurance overview", err);
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
        <LoadingSpinner2 />
      </div>
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
                  {errors.introduction_type && (
                    <div className="text-danger">
                      {errors.introduction_type}
                    </div>
                  )}
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
                  {errors.advise_level && (
                    <div className="text-danger">{errors.advise_level}</div>
                  )}
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
                  {errors.lead_source && (
                    <div className="text-danger">{errors.lead_source}</div>
                  )}
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
                  {errors.summary && (
                    <div className="text-danger">{errors.summary}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3 gap-2">
              {canApplicantEdit() && (
                <Button
                  color="primary"
                  type="submit"
                  // disabled={
                  //   isUpdating ||
                  //   (session?.user?.role === "APPLICANT" &&
                  //     overview?.updated_by !== null)
                  // }
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              )}
              {session?.user?.role !== "APPLICANT" && (
                <Button
                  type="submit"
                  color="secondary"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (
                      session?.user?.role === "APPLICANT" &&
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
                  {session?.user?.role === "APPLICANT" &&
                  overview?.updated_by !== null
                    ? "Go To Next"
                    : "Save & Next"}
                </Button>
              )}
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
