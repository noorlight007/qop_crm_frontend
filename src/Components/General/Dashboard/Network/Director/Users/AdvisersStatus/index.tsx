import { useGetCommonDashboardQuery } from "@/Redux/Reducers/CommonComponents/CommonDashboard/CommonDashboardApi";
import { CommonDashboardDataProps } from "@/Types/CommonComponents/CommonDashboard/CommonDashboardType";
import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  Col,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";

const NetworkAdvisersStatusContainer: React.FC = () => {
  // RTK hooks
  const { data: commonDashboardData, isLoading } =
    useGetCommonDashboardQuery(undefined);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // derive a typed alias for the top performing adviser entries
  type TopAdviser = NonNullable<
    CommonDashboardDataProps["top_performing_advisers"]
  >[number];
  const advisers: TopAdviser[] =
    commonDashboardData?.top_performing_advisers ?? [];
  const total = advisers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Ensure current page is valid when data or page size changes
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const pagedAdvisers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return advisers.slice(start, start + pageSize);
  }, [advisers, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <Breadcrumbs
        title="Adviser Status Overview"
        subTitle="Overview of Adviser Status"
        parent="Network"
        child="Adviser Status"
      />
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm p-1 mb-2">
            <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom rounded-top-5">
              <h4 className="mb-0 fw-bold">Adviser Status</h4>
              <div>
                <Badge color="light-success" pill className="me-2">
                  Residential
                </Badge>
                <Badge color="light-info" pill className="me-2">
                  Buy to Let
                </Badge>
                <Badge color="light-warning" pill className="me-2">
                  Commercial
                </Badge>
                <Badge color="light-dark" pill className="me-2">
                  Second Charge
                </Badge>
                <Badge color="light-success" pill className="me-2">
                  Bridging
                </Badge>
                <Badge color="light-secondary" pill className="me-2">
                  Protection
                </Badge>
                <Badge color="light-primary" pill className="me-2">
                  General Insurance
                </Badge>
              </div>
            </div>
            <CardBody className="p-1">
              <div className="d-flex justify-content-between align-items-center mb-2 px-3">
                <div>
                  <strong>Total Advisers: </strong>
                  <span>{isLoading ? "..." : total}</span>
                </div>
                <div className="d-flex align-items-center">
                  <small className="me-2 text-muted">Rows per page:</small>
                  <Input
                    type="select"
                    value={pageSize}
                    onChange={(e: any) => {
                      const size = Number(e.target.value) || 10;
                      setPageSize(size);
                      setCurrentPage(1); // reset to first page when page size changes
                    }}
                    style={{ width: 90 }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </Input>
                </div>
              </div>

              <Table responsive hover className="rounded-3 overflow-hidden">
                <thead className="bg-light-primary text-center">
                  <tr>
                    <th className="border-0 small text-uppercase">Rank</th>
                    <th className="border-0 small text-uppercase">
                      Advisor Name
                    </th>
                    <th className="border-0 small text-uppercase">
                      Total Cases
                    </th>
                    <th className="border-0 small text-uppercase">
                      Residential
                    </th>
                    <th className="border-0 small text-uppercase">
                      Buy to Let
                    </th>
                    <th className="border-0 small text-uppercase">
                      Commercial
                    </th>
                    <th className="border-0 small text-uppercase">
                      Second Charge
                    </th>
                    <th className="border-0 small text-uppercase">Bridging</th>
                    <th className="border-0 small text-uppercase">
                      Protection
                    </th>
                    <th className="border-0 small text-uppercase">
                      General Insurance
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="text-center">
                        <Spinner color="primary" />
                      </td>
                    </tr>
                  ) : pagedAdvisers.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center text-muted">
                        No advisers found.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {pagedAdvisers.map((data, idx: number) => (
                        <tr key={idx}>
                          <td>{data?.rank ?? "0"}</td>
                          <td>{data?.advisor_name ?? "0"}</td>
                          <td>{data?.total_cases ?? "0"}</td>
                          <td>{data?.residential ?? "0"}</td>
                          <td>{data?.buy_to_let ?? "0"}</td>
                          <td>{data?.commercial ?? "0"}</td>
                          <td>{data?.second_charge ?? "0"}</td>
                          <td>{data?.bridging ?? "0"}</td>
                          <td>{data?.protection ?? "0"}</td>
                          <td>{data?.general_insurance ?? "0"}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </Table>

              {/* Pagination controls */}
              <div className="d-flex justify-content-between align-items-center px-3">
                <div className="text-muted small">
                  Page {currentPage} of {totalPages}
                </div>
                <div>
                  <Pagination aria-label="Advisers pagination" className="mb-0">
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        previous
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      // show first, last, current, and neighbors
                      if (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 2
                      ) {
                        return (
                          <PaginationItem
                            active={page === currentPage}
                            key={page}
                          >
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      // show ellipsis placeholder only once between ranges
                      const shouldShowEllipsis =
                        page === currentPage - 3 || page === currentPage + 3;
                      if (shouldShowEllipsis) {
                        return (
                          <PaginationItem key={`ell-${page}`} disabled>
                            <PaginationLink>…</PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink
                        next
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </PaginationItem>
                  </Pagination>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default NetworkAdvisersStatusContainer;
