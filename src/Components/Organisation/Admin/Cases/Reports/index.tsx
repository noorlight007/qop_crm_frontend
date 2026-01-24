"use client";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import {
  caseCategories,
  dateFilters,
  insuranceCaseStages,
  mortgageStages,
  reportTypes,
} from "@/Data/General/Dashboard/CommonData/FilterChoiceFields";
import {
  useGetOrgAdminReportsMutation,
  useGetOrgAdminReportsViewQuery,
} from "@/Redux/Reducers/Organisation/Admin/Reports/OrganisationAdminReportsApi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

const OrganisationAdminReportsContainer: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [getOrgAdminReports, { isLoading }] = useGetOrgAdminReportsMutation();

  const [filters, setFilters] = useState({
    date_filter: "",
    case_category: "",
    case_stage: "",
    report_type: "",
  });

  const [dateRange, setDateRange] = useState({
    from_date: "",
    to_date: "",
  });
  const [dateRangeError, setDateRangeError] = useState("");

  const activePayload = {
    ...filters,
    ...(filters.date_filter === "range"
      ? {
          from_date: dateRange.from_date,
          to_date: dateRange.to_date,
        }
      : {}),
  };

  const {
    data: getGetOrgAdminReportsViewData,
    isLoading: isViewLoading,
    isFetching,
    error: viewError,
  } = useGetOrgAdminReportsViewQuery(activePayload, {
    skip: !filters.date_filter,
  });

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

    // Validate the date range whenever both dates are present
    const { from_date, to_date } = updatedRange;
    if (from_date && to_date) {
      // Compare as Date objects to handle formatting reliably
      const from = new Date(from_date);
      const to = new Date(to_date);
      if (from > to) {
        setDateRangeError("Start date must be before or equal to End date.");
      } else {
        setDateRangeError("");
      }
    } else {
      // If one of the dates is missing, clear the error (other validations will handle requiredness)
      setDateRangeError("");
    }
  };

  const clearFilters = () => {
    const resetFilters = {
      date_filter: "",
      case_category: "",
      case_stage: "",
      report_type: "",
    };
    const resetDate = { from_date: "", to_date: "" };
    setFilters(resetFilters);
    setDateRange(resetDate);
    // Replace to the base pathname without query params
    router.replace(pathname || "/");
  };

  // Sync filters -> URL but only include keys with non-empty values
  useEffect(() => {
    // Build query params from filters (omit empty values)
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value as string);
      }
    });

    // If custom range is selected, include from/to when present
    if (filters.date_filter === "range") {
      if (dateRange.from_date) params.set("from_date", dateRange.from_date);
      if (dateRange.to_date) params.set("to_date", dateRange.to_date);
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname || "/";
    // use replace to avoid polluting history while keeping URL in sync
    router.replace(url);
    // we intentionally don't include router.replace in deps beyond router to avoid re-creating
  }, [filters, dateRange, pathname, router]);

  const handleDownloadReport = async () => {
    if (
      filters.date_filter === "range" &&
      (!dateRange.from_date || !dateRange.to_date)
    ) {
      toast.error("Please select both start and end dates for custom range.");
      return;
    }
    try {
      // Build payload but omit keys that are empty strings or null/undefined
      const payload: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          payload[key] = value;
        }
      });

      // If custom range selected, include from/to dates (they are validated above)
      if (filters.date_filter === "range") {
        payload.from_date = dateRange.from_date;
        payload.to_date = dateRange.to_date;
      }
      const blob = await getOrgAdminReports(payload).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "organisation-admin-report";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // console.error("Download failed:", err);
      toast.error("Failed to download report. Please try again.");
    }
  };

  // Compute disabled state for the download button explicitly
  const isDownloadDisabled = (() => {
    // If loading, always disabled
    if (isLoading) return true;
    // Require Date Range selection before enabling download
    if (!filters.date_filter) return true;
    // If custom range selected, require both dates
    if (filters.date_filter === "range") {
      if (!dateRange.from_date || !dateRange.to_date) return true;
      // If date range is present but invalid, disable download
      if (dateRangeError) return true;
    }
    return false;
  })();

  return (
    <div>
      <Breadcrumbs
        title="Organisation Admin Reports"
        subTitle="Generate and analyze comprehensive organisation reports"
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
                      Organisation Admin Reports Dashboard
                    </h4>
                    <p className="text-muted mb-0 mt-1">
                      Generate comprehensive reports across your organisation
                    </p>
                  </Col>
                  <Col md={6} className="text-end">
                    <Button
                      color="success"
                      onClick={(e: any) => {
                        // guard in case something triggers click while disabled
                        if (isDownloadDisabled) return;
                        return handleDownloadReport();
                      }}
                      disabled={isDownloadDisabled}
                      title={
                        // Prefer the explicit date range error message if present
                        dateRangeError
                          ? dateRangeError
                          : isDownloadDisabled &&
                              filters.date_filter === "range"
                            ? "Please select both start and end dates for custom range"
                            : undefined
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
                          <small className="text-danger">(required)</small>
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
                          {dateFilters?.map((option) => (
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
                              aria-invalid={!!dateRangeError}
                              onChange={(e) =>
                                handleDateRangeChange(
                                  "from_date",
                                  e.target.value,
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
                              aria-invalid={!!dateRangeError}
                              onChange={(e) =>
                                handleDateRangeChange("to_date", e.target.value)
                              }
                            />
                            {dateRangeError && (
                              <div className="text-danger small mt-1">
                                {dateRangeError}
                              </div>
                            )}
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
                          {caseCategories?.map((option) => (
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
                          disabled={!filters.case_category}
                        >
                          {filters?.case_category === "MORTGAGE" ? (
                            <>
                              {mortgageStages.map((stage) => (
                                <option key={stage.value} value={stage.value}>
                                  {stage.label}
                                </option>
                              ))}
                            </>
                          ) : (
                            <>
                              {insuranceCaseStages.map((stage) => (
                                <option key={stage.value} value={stage.value}>
                                  {stage.label}
                                </option>
                              ))}
                            </>
                          )}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md={6} lg={3} className="mb-3">
                      <FormGroup>
                        <Label className="fw-semibold text-dark">
                          <i className="fa fa-eye me-2 text-secondary"></i>
                          Report Type
                        </Label>
                        <Input
                          type="select"
                          value={filters.report_type}
                          onChange={(e) =>
                            handleFilterChange("report_type", e.target.value)
                          }
                          className="form-select"
                        >
                          {reportTypes?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* Report Data Table Section */}
                  <Row className="mt-4">
                    <Col>
                      <Card className="shadow-sm border-0">
                        <CardHeader className="bg-white border-bottom">
                          <h5 className="mb-0 text-dark fw-bold">
                            Report Results
                          </h5>
                        </CardHeader>
                        <CardBody>
                          {isViewLoading || isFetching ? (
                            <div className="text-center p-5">
                              <Spinner color="primary" />
                              <p className="mt-2 text-muted">
                                Updating report data...
                              </p>
                            </div>
                          ) : getGetOrgAdminReportsViewData &&
                            getGetOrgAdminReportsViewData.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-hover align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th className="fw-bold">Case Number</th>
                                    <th className="fw-bold">Adviser Name</th>
                                    <th className="fw-bold">
                                      Type of Mortgage/Insurance
                                    </th>
                                    <th className="fw-bold">LTV (%)</th>
                                    <th className="fw-bold">Current Stage</th>
                                    <th className="fw-bold">Lender Name</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getGetOrgAdminReportsViewData.map(
                                    (item: any, index: number) => (
                                      <tr key={index}>
                                        <td className="text-primary fw-medium">
                                          {item.case_number || "N/A"}
                                        </td>
                                        <td>{item.adviser_name || "N/A"}</td>
                                        <td>{item.mortgage_type || "N/A"}</td>
                                        <td>
                                          {item.ltv ? `${item.ltv}` : "N/A"}
                                        </td>
                                        <td>{item.current_stage || "N/A"}</td>
                                        <td>{item.lender_name || "N/A"}</td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center p-5 border rounded bg-light">
                              <i className="fa fa-folder-open fa-3x text-muted mb-3"></i>
                              <p className="text-muted">
                                No data found for the selected filters.
                              </p>
                            </div>
                          )}
                        </CardBody>
                      </Card>
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

export default OrganisationAdminReportsContainer;
