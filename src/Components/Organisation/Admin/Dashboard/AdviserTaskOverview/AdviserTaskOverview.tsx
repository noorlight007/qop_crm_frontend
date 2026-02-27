import SVG from "@/CommonComponent/SVG";
import { AdminDashboardProps } from "@/Types/Organisation/Admin/AdminDashboardTypes";
import { useState } from "react";
import { User } from "react-feather";
import { Button, Card, CardBody, Col, Progress, Row } from "reactstrap";

const AdviserTaskOverview: React.FC<AdminDashboardProps> = ({
  isLoading,
  dashboardData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const advisers = dashboardData?.adviser_task ?? [];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(advisers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedAdvisers = advisers.slice(startIdx, startIdx + itemsPerPage);

  if (isLoading) {
    return (
      <Card className="border-0 p-4 rounded-3 shadow-sm mt-4">
        <CardBody>
          <div className="d-flex align-items-center mb-4">
            <div
              className="skeleton-loading rounded-circle me-3"
              style={{ width: "40px", height: "40px" }}
            />
            <div
              className="skeleton-loading"
              style={{ width: "200px", height: "24px" }}
            />
          </div>
          <Row className="g-4">
            {[...Array(4)].map((_, idx) => (
              <Col md={6} lg={3} key={idx}>
                <div
                  className="skeleton-loading rounded-3"
                  style={{ height: "200px" }}
                />
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    );
  }

  if (!advisers || advisers.length === 0) {
    return (
      <Card className="border-0 p-4 rounded-3 shadow-sm mt-4">
        <div className="d-flex align-items-center mb-4">
          <div
            className="bg-primary rounded-circle p-2 me-3"
            style={{ width: "40px", height: "40px" }}
          >
            <SVG iconId="users" className="text-white" />
          </div>
          <h5 className="mb-0 fw-bold text-dark">Adviser Task Overview</h5>
        </div>
        <div
          className="text-muted d-flex flex-column justify-content-center align-items-center"
          style={{ height: 200 }}
        >
          <SVG
            iconId="file-text"
            className="mb-3 opacity-30"
            style={{ width: 48, height: 48 }}
          />
          <p className="mb-0">No adviser task data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 p-4 rounded-3 shadow-sm mt-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="mb-0 fw-bold text-dark">Adviser Task Overview</h5>
        {advisers.length > itemsPerPage && (
          <div className="d-flex gap-2 align-items-center">
            <Button
              outline
              size="sm"
              color="primary"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ← Prev
            </Button>
            <span className="text-muted small">
              {currentPage} of {totalPages}
            </span>
            <Button
              outline
              size="sm"
              color="primary"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </Button>
          </div>
        )}
      </div>
      <Row className="g-4">
        {paginatedAdvisers.map((adv, idx) => {
          const total = Number(adv.total_tasks ?? 0);
          const completed = Number(adv.completed_tasks ?? 0);
          const overdue = Number(adv.overdue_tasks ?? 0);
          const rawEff = Number(adv.efficiency ?? 0);
          const efficiency =
            rawEff > 1 ? Math.round(rawEff) : Math.round(rawEff * 100);

          const completionRate = total > 0 ? (completed / total) * 100 : 0;

          return (
            <Col md={6} lg={3} key={idx}>
              <Card className="h-100 border-0 shadow hover-shadow transition-all">
                <CardBody className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="bg-light-primary rounded-circle p-2">
                      <User style={{ width: 20, height: 20 }} />
                    </div>
                    <div
                      className={`badge ${
                        efficiency >= 80
                          ? "bg-success"
                          : efficiency >= 60
                            ? "bg-warning"
                            : "bg-danger"
                      }`}
                    >
                      {efficiency}%
                    </div>
                  </div>

                  <h6
                    className="mb-3 fw-semibold text-truncate"
                    title={adv.adviser_name || "Unknown"}
                  >
                    {adv.adviser_name || "Unknown"}
                  </h6>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-muted small">Progress</span>
                      <span className="fw-semibold small">
                        {completed}/{total}
                      </span>
                    </div>
                    <Progress
                      value={completionRate}
                      className="mb-2"
                      style={{ height: "6px" }}
                      color={
                        completionRate >= 80
                          ? "success"
                          : completionRate >= 60
                            ? "warning"
                            : "danger"
                      }
                    />
                  </div>

                  <div className="row g-2 text-center">
                    <div className="col-4">
                      <div className="bg-light rounded p-2">
                        <div className="fw-bold text-primary">{total}</div>
                        <small className="text-muted">Total</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="bg-light rounded p-2">
                        <div className="fw-bold text-success">{completed}</div>
                        <small className="text-muted">Done</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="bg-light rounded p-2">
                        <div className="fw-bold text-danger">{overdue}</div>
                        <small className="text-muted">Overdue</small>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default AdviserTaskOverview;
