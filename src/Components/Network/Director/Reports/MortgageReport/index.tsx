"use client";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import {
  caseCategories,
  dateFilters,
  insuranceCaseStages,
  mortgageStages,
  reportCategories,
  reportTypes,
} from "@/Data/Common/FilterChoiceFields";
import {
  useGetNetworkDirectorMortgageReportsMutation,
  useGetNetworkDirectorMortgageReportsViewQuery,
} from "@/Redux/Reducers/Network/Director/Reports/NetworkDirectorMortgageReportsApi/NetworkDirectorMortgageReportsApi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
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

// Maps internal "range" value -> "custom" for API/URL, leaves everything else unchanged
const toApiFilterValue = (filter: string) =>
  filter === "range" ? "custom" : filter;

const NetworkDirectorReportsContainer: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [getNetworkMortgageReports, { isLoading }] =
    useGetNetworkDirectorMortgageReportsMutation();

  const [filters, setFilters] = useState({
    filter: "",
    case_category: "",
    case_stage: "",
    report_type: "",
    report_category: "",
  });

  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: "",
  });
  const [dateRangeError, setDateRangeError] = useState("");

  // For "range", only include dates in the payload when BOTH are present and valid
  const isRangeReady =
    filters.filter === "range" &&
    !!dateRange.start_date &&
    !!dateRange.end_date &&
    !dateRangeError;

  const activePayload = {
    ...filters,
    filter: toApiFilterValue(filters.filter), // "range" -> "custom" for API
    ...(isRangeReady
      ? {
          start_date: dateRange.start_date,
          end_date: dateRange.end_date,
        }
      : {}),
  };

  const {
    data: getNetworkMortgageReportsViewData,
    isLoading: isViewLoading,
    isFetching,
    error: viewError,
  } = useGetNetworkDirectorMortgageReportsViewQuery(activePayload, {
    // Skip if no filter selected at all
    // Also skip if "range" is selected but dates are not both filled & valid
    skip: !filters.filter || (filters.filter === "range" && !isRangeReady),
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

    // Re-map "custom" back to "range" for internal state when reading from URL
    if (params.filter === "custom") {
      params.filter = "range";
    }

    // Only pick keys that belong to filters state
    const knownFilterKeys = [
      "filter",
      "case_category",
      "case_stage",
      "report_type",
      "report_category",
    ];
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([key]) => knownFilterKeys.includes(key)),
    );

    setFilters((prev) => ({ ...prev, ...filteredParams }));

    if (params.start_date || params.end_date) {
      setDateRange({
        start_date: params.start_date || "",
        end_date: params.end_date || "",
      });
    }
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    // Clear date range when switching away from "range"
    if (key === "filter" && value !== "range") {
      setDateRange({ start_date: "", end_date: "" });
      setDateRangeError("");
    }
    setFilters(updatedFilters);
  };

  const handleDateRangeChange = (key: string, value: string) => {
    const updatedRange = { ...dateRange, [key]: value };
    setDateRange(updatedRange);

    const { start_date, end_date } = updatedRange;
    if (start_date && end_date) {
      const from = new Date(start_date);
      const to = new Date(end_date);
      if (from > to) {
        setDateRangeError("Start date must be before or equal to End date.");
      } else {
        setDateRangeError("");
      }
    } else {
      setDateRangeError("");
    }
  };

  const clearFilters = () => {
    const resetFilters = {
      filter: "",
      case_category: "",
      case_stage: "",
      report_type: "",
      report_category: "",
    };
    const resetDate = { start_date: "", end_date: "" };
    setFilters(resetFilters);
    setDateRange(resetDate);
    setDateRangeError("");
    router.replace(pathname || "/");
  };

  // Sync filters -> URL, mapping "range" -> "custom" in the URL
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        // Map "range" -> "custom" in the URL
        params.set(key, key === "filter" ? toApiFilterValue(value) : value);
      }
    });

    // Only append dates to URL when both are present
    if (filters.filter === "range") {
      if (dateRange.start_date) params.set("start_date", dateRange.start_date);
      if (dateRange.end_date) params.set("end_date", dateRange.end_date);
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname || "/";
    router.replace(url);
  }, [filters, dateRange, pathname, router]);

  const handleDownloadReport = async () => {
    if (
      filters.filter === "range" &&
      (!dateRange.start_date || !dateRange.end_date)
    ) {
      toast.error("Please select both start and end dates for custom range.");
      return;
    }
    try {
      const payload: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Map "range" -> "custom" for API
          payload[key] = key === "filter" ? toApiFilterValue(value) : value;
        }
      });

      if (filters.filter === "range") {
        payload.start_date = dateRange.start_date;
        payload.end_date = dateRange.end_date;
      }

      const blob = await getNetworkMortgageReports(payload).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "report";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download report. Please try again.");
    }
  };

  const isDownloadDisabled = (() => {
    if (isLoading) return true;
    if (!filters.filter) return true;
    if (filters.filter === "range") {
      if (!dateRange.start_date || !dateRange.end_date) return true;
      if (dateRangeError) return true;
    }
    return false;
  })();

  const getStageBadgeColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      ENQUIRY: "bg-secondary",
      FACT_FIND: "bg-info",
      SUBMISSION: "bg-warning text-dark",
      FULL_MORTGAGE_APPLICATION: "bg-primary",
      LEGAL: "bg-danger",
      COMPLETION: "bg-success",
      FUTURE_OPPORTUNITY: "bg-dark text-white border",
    };
    return stageColors[stage] ?? "bg-secondary";
  };

  return (
    <div>
      <Breadcrumbs
        title="Network Director Reports"
        subTitle="Generate and analyze comprehensive organisation reports"
        items={[{ label: "Cases" }, { label: "Reports", active: true }]}
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
                      Network Director Mortgage Reports Dashboard
                    </h4>
                    <p className="text-muted mb-0 mt-1">
                      Generate comprehensive reports across your organisation
                    </p>
                  </Col>
                  <Col md={6} className="text-end">
                    <Button
                      color="success"
                      onClick={(e: any) => {
                        if (isDownloadDisabled) return;
                        return handleDownloadReport();
                      }}
                      disabled={isDownloadDisabled}
                      title={
                        dateRangeError
                          ? dateRangeError
                          : isDownloadDisabled && filters.filter === "range"
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
                          value={filters.filter}
                          onChange={(e) =>
                            handleFilterChange("filter", e.target.value)
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

                    {filters.filter === "range" && (
                      <>
                        <Col md={3} lg={2} className="mb-3">
                          <FormGroup>
                            <Label className="fw-semibold text-dark">
                              Start Date
                            </Label>
                            <Input
                              type="date"
                              value={dateRange.start_date}
                              min={dateLimits.min}
                              max={dateLimits.max}
                              style={{ padding: "10px 10px" }}
                              aria-invalid={!!dateRangeError}
                              onChange={(e) =>
                                handleDateRangeChange(
                                  "start_date",
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
                              value={dateRange.end_date}
                              min={dateLimits.min}
                              max={dateLimits.max}
                              style={{ padding: "10px 10px" }}
                              aria-invalid={!!dateRangeError}
                              onChange={(e) =>
                                handleDateRangeChange(
                                  "end_date",
                                  e.target.value,
                                )
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
                    <Col md={6} lg={3} className="mb-3">
                      <FormGroup>
                        <Label className="fw-semibold text-dark">
                          <FaShoppingBag className="me-2 text-primary" />
                          Report Category
                        </Label>
                        <Input
                          type="select"
                          value={filters.report_category}
                          onChange={(e) =>
                            handleFilterChange(
                              "report_category",
                              e.target.value,
                            )
                          }
                          className="form-select"
                        >
                          {reportCategories?.map((option) => (
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
                          ) : getNetworkMortgageReportsViewData &&
                            getNetworkMortgageReportsViewData.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-hover align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th className="fw-bold">#</th>
                                    <th className="fw-bold">CRM Ref</th>
                                    <th className="fw-bold">Firm</th>
                                    <th className="fw-bold">Client</th>
                                    <th className="fw-bold">Adviser</th>
                                    <th className="fw-bold">Current Stage</th>
                                    <th className="fw-bold">
                                      Application Type
                                    </th>
                                    <th className="fw-bold">Case Type</th>
                                    <th className="fw-bold">Lender</th>
                                    <th className="fw-bold">Loan Amount</th>
                                    <th className="fw-bold">Rate (%)</th>
                                    <th className="fw-bold">Type</th>
                                    <th className="fw-bold">Repayment Type</th>
                                    <th className="fw-bold">Loan Term (yrs)</th>
                                    <th className="fw-bold">Term</th>
                                    <th className="fw-bold">Commit Fee</th>
                                    <th className="fw-bold">Offer Fee</th>
                                    <th className="fw-bold">Adviser Fee</th>
                                    <th className="fw-bold">Proc Fee</th>
                                    <th className="fw-bold">Network Amount</th>
                                    <th className="fw-bold">Pre-AIP Check</th>
                                    <th className="fw-bold">Post App Date</th>
                                    <th className="fw-bold">FMA Date</th>
                                    <th className="fw-bold">
                                      Vulnerability Type
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getNetworkMortgageReportsViewData.map(
                                    (item: any, index: number) => (
                                      <tr key={index}>
                                        <td className="text-muted fw-semibold">
                                          {index + 1}
                                        </td>
                                        <td className="text-primary fw-medium">
                                          {item.crm_ref || "N/A"}
                                        </td>
                                        <td>{item.firm || "N/A"}</td>
                                        <td>{item.client || "N/A"}</td>
                                        <td>{item.adviser || "N/A"}</td>
                                        <td>
                                          <span
                                            className={`badge ${getStageBadgeColor(item.current_stage)}`}
                                          >
                                            {item.current_stage?.replace(
                                              /_/g,
                                              " ",
                                            ) || "N/A"}
                                          </span>
                                        </td>
                                        <td>
                                          {item.application_type?.replace(
                                            /_/g,
                                            " ",
                                          ) || "N/A"}
                                        </td>
                                        <td>
                                          {item.case_type?.replace(/_/g, " ") ||
                                            "N/A"}
                                        </td>
                                        <td>
                                          {item.lender?.replace(/_/g, " ") ||
                                            "N/A"}
                                        </td>
                                        <td>
                                          {item.loan_amount
                                            ? `£${item.loan_amount.toLocaleString()}`
                                            : "N/A"}
                                        </td>
                                        <td>
                                          {item.rate ? `${item.rate}%` : "N/A"}
                                        </td>
                                        <td>
                                          {item.type?.replace(/_/g, " ") ||
                                            "N/A"}
                                        </td>
                                        <td>
                                          {item.repayment_type?.replace(
                                            /_/g,
                                            " ",
                                          ) || "N/A"}
                                        </td>
                                        <td>{item.loan_term || "N/A"}</td>
                                        <td>
                                          {item.term?.replace(/_/g, " ") ||
                                            "N/A"}
                                        </td>
                                        <td>
                                          {item.commit_fee
                                            ? `£${item.commit_fee}`
                                            : "N/A"}
                                        </td>
                                        <td>
                                          {item.offer_fee
                                            ? `£${item.offer_fee}`
                                            : "N/A"}
                                        </td>
                                        <td>
                                          {item.adviser_fee
                                            ? `£${item.adviser_fee}`
                                            : "N/A"}
                                        </td>
                                        <td>
                                          {item.proc_fee
                                            ? `£${item.proc_fee}`
                                            : "N/A"}
                                        </td>
                                        <td>
                                          {item.network_amount
                                            ? `£${item.network_amount}`
                                            : "N/A"}
                                        </td>
                                        <td>{item.pre_aip_check || "N/A"}</td>
                                        <td>{item.post_app_date || "N/A"}</td>
                                        <td>{item.fma_date || "N/A"}</td>
                                        <td>
                                          {item.vulnerability_type || "N/A"}
                                        </td>
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

export default NetworkDirectorReportsContainer;
