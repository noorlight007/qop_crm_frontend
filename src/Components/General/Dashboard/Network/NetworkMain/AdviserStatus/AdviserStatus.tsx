import { CommonDashboardProps } from "@/Types/CommonComponents/CommonDashboard/CommonDashboardType";
import Link from "next/link";
import { TbEye } from "react-icons/tb";
import { Badge, Card, CardBody, Col, Row, Spinner, Table } from "reactstrap";

const AdviserStatus: React.FC<CommonDashboardProps> = ({
  isLoading,
  commonDashboardData,
}) => {
  return (
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
            <Link
              href="/dashboard/network/advisers-status"
              className="ms-3 text_decoration_hover"
            >
              <TbEye size={18} className="me-1" />
              View full report
            </Link>
          </div>
          <CardBody className="p-1">
            <Table responsive hover className="rounded-3 overflow-hidden">
              <thead className="bg-light-primary text-center">
                <tr>
                  <th className="border-0 small text-uppercase">Rank</th>
                  <th className="border-0 small text-uppercase">
                    Advisor Name
                  </th>
                  <th className="border-0 small text-uppercase">Total Cases</th>
                  <th className="border-0 small text-uppercase">Residential</th>
                  <th className="border-0 small text-uppercase">Buy to Let</th>
                  <th className="border-0 small text-uppercase">Commercial</th>
                  <th className="border-0 small text-uppercase">
                    Second Charge
                  </th>
                  <th className="border-0 small text-uppercase">Bridging</th>
                  <th className="border-0 small text-uppercase">Protection</th>
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
                ) : (
                  <>
                    {commonDashboardData?.top_performing_advisers
                      ?.slice(0, 5)
                      .map((data, idx: number) => (
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
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AdviserStatus;
