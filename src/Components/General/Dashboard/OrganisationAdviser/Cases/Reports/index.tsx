"use client";
import { useGetOrganisationAdviserReportsMutation } from "@/Redux/Reducers/OrganisationAdviser/Reports/OrganisationAdviserReportsApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";

const OrganisationAdviserReportsContainer: React.FC = () => {
  const [getOrganisationAdviserReports, { isLoading }] =
    useGetOrganisationAdviserReportsMutation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    date_filter: "",
    case_category: "",
    applicant_type: "",
    case_status: "",
    case_stage: "",
    is_removed: "",
  });

  const [dateRange, setDateRange] = useState({
    from_date: "",
    to_date: "",
  });

  const filterOptions = {
    dateFilters: [
      { value: "today", label: "Today" },
      { value: "this_week", label: "This Week" },
      { value: "this_month", label: "This Month" },
      { value: "this_year", label: "This Year" },
      { value: "range", label: "Custom Range" },
    ],
    caseCategories: [
      { value: "", label: "All Categories" },
      { value: "mortgage", label: "Mortgage" },
      { value: "protection", label: "Protection" },
      { value: "general_insurance", label: "General Insurance" },
    ],
    applicantTypes: [
      { value: "", label: "All Types" },
      { value: "individual", label: "Individual" },
      { value: "joint", label: "Joint" },
    ],
    caseStatuses: [
      { value: "", label: "All Statuses" },
      { value: "care", label: "Care" },
      { value: "closed", label: "Closed" },
      { value: "pending", label: "Pending" },
    ],
    caseStages: [
      { value: "", label: "All Stages" },
      { value: "enquiry", label: "Enquiry" },
      { value: "fact_find", label: "Fact Find" },
      {
        value: "research_compliance_check",
        label: "Research & Compliance Check",
      },
      { value: "decision_in_principle", label: "Decision in Principle" },
      {
        value: "full_mortgage_application",
        label: "Full Mortgage Application",
      },
      { value: "offer_from_bank", label: "Offer from Bank" },
      { value: "legal", label: "Legal" },
      { value: "completion", label: "Completion" },
      { value: "future_opportunity", label: "Future Opportunity" },
      { value: "not_proceed", label: "Not Proceed" },
    ],
  };
  // Get current date and calculate date range (one year from today)
  const getCurrentDateLimits = () => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    return {
      min: oneYearAgo.toISOString().split("T")[0],
      max: today.toISOString().split("T")[0],
    };
  };

  const dateLimits = getCurrentDateLimits();

  // Load filters from URL on mount
  useEffect(() => {
    const params: any = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    setFilters((prev) => ({ ...prev, ...params }));
    if (params.from_date || params.to_date) {
      setDateRange({
        from_date: params.from_date || "",
        to_date: params.to_date || "",
      });
    }
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
  };

  const handleDateRangeChange = (key: string, value: string) => {
    const updatedRange = { ...dateRange, [key]: value };
    setDateRange(updatedRange);
  };

  const clearFilters = () => {
    const resetFilters = {
      date_filter: "",
      case_category: "",
      applicant_type: "",
      case_status: "",
      case_stage: "",
      is_removed: "",
    };
    const resetDate = { from_date: "", to_date: "" };
    setFilters(resetFilters);
    setDateRange(resetDate);
    router.push("?");
  };

  const handleDownloadReport = async () => {
    if (
      filters.date_filter === "range" &&
      (!dateRange.from_date || !dateRange.to_date)
    ) {
      toast.error("Please select both start and end dates for custom range.");
      return;
    }
    try {
      const payload = {
        ...filters,
        ...(filters.date_filter === "range" && {
          from_date: dateRange.from_date,
          to_date: dateRange.to_date,
        }),
      };
      const blob = await getOrganisationAdviserReports(payload).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "organisation-adviser-report";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // console.error("Download failed:", err);
      toast.error("Failed to download report. Please try again.");
    }
  };

  return (
    <div>
      <Breadcrumbs
        title="Organisation Adviser Reports"
        subTitle="Generate and analyze comprehensive organisation adviser reports"
        parent="Cases"
        child="Reports"
      />
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-0">
              <CardBody>
                <Row className="align-items-center">
                  <Col md={6}>
                    <h4 className="mb-0 text-primary fw-bold">
                      <i className="fa fa-chart-line me-2"></i>
                      Organisation Adviser Reports Dashboard
                    </h4>
                    <p className="text-muted mb-0 mt-1">
                      Generate comprehensive reports across your organisation
                    </p>
                  </Col>
                  <Col md={6} className="text-end">
                    <Button
                      color="success"
                      onClick={handleDownloadReport}
                      disabled={
                        isLoading ||
                        (!filters.date_filter &&
                          !filters.case_category &&
                          !filters.applicant_type &&
                          !filters.case_status &&
                          !filters.case_stage)
                      }
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-download me-2"></i>
                          Download Report
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Filter Panel */}
        <Row className="mb-4">
          <Col>
            <Card className="border-primary">
              <CardHeader className="bg-primary text-white">
                <Row className="align-items-center">
                  <Col>
                    <h6 className="mb-0">
                      <i className="fa fa-sliders-h me-2"></i>
                      Advanced Filters
                    </h6>
                  </Col>
                  <Col xs="auto">
                    <Button
                      color="light"
                      size="sm"
                      onClick={clearFilters}
                      className="text-primary"
                    >
                      <i className="fa fa-refresh me-1"></i>
                      Clear All
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="bg-light">
                <Form>
                  <Row>
                    <Col md={6} lg={4} className="mb-3">
                      <FormGroup>
                        <Label className="fw-semibold text-dark">
                          <i className="fa fa-calendar me-2 text-primary"></i>
                          Date Range
                        </Label>
                        <Input
                          type="select"
                          value={filters.date_filter}
                          onChange={(e) =>
                            handleFilterChange("date_filter", e.target.value)
                          }
                          className="form-select"
                        >
                          <option value="" disabled>
                            Select Date Range
                          </option>
                          {filterOptions.dateFilters.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    {filters.date_filter === "range" && (
                      <>
                        <Col md={3} lg={2} className="mb-3">
                          <FormGroup>
                            <Label className="fw-semibold text-dark">
                              Start Date
                            </Label>
                            <Input
                              type="date"
                              value={dateRange.from_date}
                              min={dateLimits.min}
                              max={dateLimits.max}
                              style={{ padding: "10px 10px" }}
                              onChange={(e) =>
                                handleDateRangeChange(
                                  "from_date",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3} lg={2} className="mb-3">
                          <FormGroup>
                            <Label className="fw-semibold text-dark">
                              End Date
                            </Label>
                            <Input
                              type="date"
                              value={dateRange.to_date}
                              min={dateLimits.min}
                              max={dateLimits.max}
                              style={{ padding: "10px 10px" }}
                              onChange={(e) =>
                                handleDateRangeChange("to_date", e.target.value)
                              }
                            />
                          </FormGroup>
                        </Col>
                      </>
                    )}

                    <Col md={6} lg={3} className="mb-3">
                      <FormGroup>
                        <Label className="fw-semibold text-dark">
                          <i className="fa fa-tag me-2 text-success"></i>
                          Case Category
                        </Label>
                        <Input
                          type="select"
                          value={filters.case_category}
                          onChange={(e) =>
                            handleFilterChange("case_category", e.target.value)
                          }
                          className="form-select"
                        >
                          {filterOptions.caseCategories.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md={6} lg={3} className="mb-3">
                      <FormGroup>
                        <Label className="fw-semibold text-dark">
                          <i className="fa fa-user me-2 text-info"></i>
                          Applicant Type
                        </Label>
                        <Input
                          type="select"
                          value={filters.applicant_type}
                          onChange={(e) =>
                            handleFilterChange("applicant_type", e.target.value)
                          }
                          className="form-select"
                        >
                          {filterOptions.applicantTypes.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md={6} lg={3} className="mb-3">
                      <FormGroup>
                        <Label className="fw-semibold text-dark">
                          <i className="fa fa-flag me-2 text-warning"></i>
                          Case Status
                        </Label>
                        <Input
                          type="select"
                          value={filters.case_status}
                          onChange={(e) =>
                            handleFilterChange("case_status", e.target.value)
                          }
                          className="form-select"
                        >
                          {filterOptions.caseStatuses.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md={6} lg={3} className="mb-3">
                      <FormGroup>
                        <Label className="fw-semibold text-dark">
                          <i className="fa fa-tasks me-2 text-danger"></i>
                          Case Stage
                        </Label>
                        <Input
                          type="select"
                          value={filters.case_stage}
                          onChange={(e) =>
                            handleFilterChange("case_stage", e.target.value)
                          }
                          className="form-select"
                        >
                          {filterOptions.caseStages.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md={6} lg={3} className="mb-3">
                      <FormGroup>
                        <Label className="fw-semibold text-dark">
                          <i className="fa fa-eye me-2 text-secondary"></i>
                          Include Removed
                        </Label>
                        <Input
                          type="select"
                          value={filters.is_removed}
                          onChange={(e) =>
                            handleFilterChange("is_removed", e.target.value)
                          }
                          className="form-select"
                        >
                          <option value="">All Cases</option>
                          <option value="false">Active Only</option>
                          <option value="true">Removed Only</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrganisationAdviserReportsContainer;
