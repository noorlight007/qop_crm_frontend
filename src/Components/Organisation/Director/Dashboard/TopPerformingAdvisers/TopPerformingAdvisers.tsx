import { OrganisationDirectorDashboardProps } from "@/Types/Organisation/Director/DashboardTypes";
import getCurrencySign from "@/utils/currency";
import Image from "next/image";
import { User } from "react-feather";
import { Card, CardBody } from "reactstrap";

const TopPerformingAdvisers: React.FC<OrganisationDirectorDashboardProps> = ({
  isLoading,
  organisationDirectorDashboardData,
}) => {
  const formatCurrency = (amount: number): string => {
    if (!isFinite(amount)) return `${getCurrencySign()}0`;
    const sign = amount < 0 ? "-" : "";
    const abs = Math.abs(amount);

    const units = [
      { value: 1e12, symbol: "T" },
      { value: 1e9, symbol: "B" },
      { value: 1e6, symbol: "M" },
      { value: 1e3, symbol: "K" },
    ];

    for (const unit of units) {
      if (abs >= unit.value) {
        const formatted = (abs / unit.value).toFixed(1).replace(/\.0$/, "");
        return `${getCurrencySign()}${sign}${formatted}${unit.symbol}`;
      }
    }
    return `${getCurrencySign()}${sign}${abs.toLocaleString()}`;
  };

  return (
    <Card className="border-0 rounded-lg shadow-sm mb-4">
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
                        style={{ width: "40px", height: "40px" }}
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
        ) : organisationDirectorDashboardData?.top_advisers &&
          organisationDirectorDashboardData.top_advisers.length > 0 ? (
          <Card
            className="space-y-4"
            style={{ height: "325px", overflow: "auto" }}
          >
            {organisationDirectorDashboardData.top_advisers.map((data) => {
              return (
                <div
                  key={data?.rank}
                  className="d-flex justify-content-between align-items-center mt-4 px-3 py-1"
                >
                  <div className="d-flex justify-content-start gap-2 align-items-center">
                    <div
                      style={{ position: "relative", width: 40, height: 40 }}
                    >
                      {data?.profile_image ? (
                        <Image
                          src={data.profile_image}
                          alt={data?.name ?? "Profile Image"}
                          width={35}
                          height={35}
                          className="rounded-circle"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-secondary"
                          style={{ width: 40, height: 40 }}
                        >
                          <User size={35} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h6 className="fw-semibold mb-0">
                        {data?.name ?? "Not Available"}
                      </h6>
                      <p className="small mb-0">{data?.total_cases} cases</p>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center align-items-center flex-column">
                    <small>Loan Amount</small>
                    <h6 className="fw-semibold">
                      {data?.total_loan_amount
                        ? formatCurrency(data?.total_loan_amount)
                        : "0"}
                    </h6>
                  </div>
                </div>
              );
            })}
          </Card>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "345px" }}
          >
            <p className="text-muted">No data available</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default TopPerformingAdvisers;
