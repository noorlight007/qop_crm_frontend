import { CommonDashboardProps } from "@/Types/CommonComponents/CommonDashboard/CommonDashboardType";
import { Card, CardBody } from "reactstrap";

const TopPerformingAdvisers: React.FC<CommonDashboardProps> = ({
  isLoading,
  commonDashboardData,
}) => {
  const formatCurrency = (amount: number): string => {
    return `£${amount.toLocaleString()}`;
  };

  return (
    <Card className="border-0 rounded-lg bg-white shadow-sm mb-0">
      <CardBody className="p-3">
        <h4>Top Performing Advisers</h4>
        {isLoading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <Card
                key={index}
                className="border-0 p-2 rounded-2 shadow-sm bg-white"
              >
                <CardBody className="p-2">
                  <div className="d-flex justify-content-between">
                    <div style={{ width: "80%" }} className="d-flex gap-2">
                      <div
                        className="skeleton-loading mb-2 rounded-circle"
                        style={{ width: "30px", height: "30px" }}
                      />
                      <div
                        className="skeleton-loading"
                        style={{ width: "50%", height: "24px" }}
                      />
                    </div>
                    <div
                      className="skeleton-loading"
                      style={{ width: "50px", height: "30px" }}
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </>
        ) : commonDashboardData?.top_performing_advisers &&
          commonDashboardData.top_performing_advisers.length > 0 ? (
          <div
            className="space-y-6 mt-2"
            style={{ height: "350px", overflow: "auto" }}
          >
            {commonDashboardData.top_performing_advisers.map((data) => (
              <div
                key={data?.rank}
                className="d-flex justify-content-between mt-4 px-3 py-1"
              >
                <div className="d-flex justify-content-start gap-2">
                  <div className="d-flex align-items-center justify-content-center">
                    <span
                      className="d-flex align-items-center justify-content-center rounded-circle text-white bg-primary fw-medium small"
                      style={{ width: "25px", height: "25px" }}
                    >
                      {data?.rank}
                    </span>
                  </div>
                  <div>
                    <h6 className="fw-semibold">{data?.advisor_name}</h6>
                    <p className="small">{data?.total_cases} cases</p>
                  </div>
                </div>
                <div className="d-flex justify-content-center flex-column">
                  <h6 className="fw-semibold">
                    {data?.total_loan_amount
                      ? formatCurrency(data?.total_loan_amount)
                      : "0"}
                  </h6>
                  <p className="small">
                    <i className="fa-solid fa-award text-warning"></i>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "350px" }}
          >
            <p className="text-muted">No data available</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default TopPerformingAdvisers;
