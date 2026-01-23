import { NetworkDirectorDashboardProps } from "@/Types/Network/Director/DashboardTypes";
import Image from "next/image";
import Link from "next/link";
import { User } from "react-feather";
import { TbEye } from "react-icons/tb";
import { Badge, Card, CardBody, Col, Row, Spinner, Table } from "reactstrap";

const AdviserStatus: React.FC<NetworkDirectorDashboardProps> = ({
  isLoading,
  networkDirectorDashboardData,
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
              href="/network/director/advisers-status"
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
                  <th className="border-0 small text-uppercase text-start">
                    Adviser Name
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
                    {Array.isArray(
                      networkDirectorDashboardData?.top_performing_advisers
                    ) &&
                    networkDirectorDashboardData.top_performing_advisers
                      .length > 0 ? (
                      networkDirectorDashboardData.top_performing_advisers
                        .slice(0, 5)
                        .map((data, idx: number) => (
                          <tr key={idx}>
                            <td>{data?.rank ?? "0"}</td>
                            <td className="d-flex justify-content-start align-items-center gap-1 text-truncate">
                              <span
                                className="border rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                                style={{ width: 30, height: 30 }}
                              >
                                {data?.profile_image ? (
                                  <Image
                                    src={data.profile_image}
                                    alt="Profile"
                                    width={25}
                                    height={25}
                                    className="rounded-circle"
                                  />
                                ) : (
                                  <User size={25} className="text-primary" />
                                )}
                              </span>
                              <span>{data?.name ?? "Not Available"}</span>
                            </td>
                            <td>{data?.total_cases ?? "0"}</td>
                            <td>{data?.residential ?? "0"}</td>
                            <td>{data?.buy_to_let ?? "0"}</td>
                            <td>{data?.commercial ?? "0"}</td>
                            <td>{data?.second_charge ?? "0"}</td>
                            <td>{data?.bridging ?? "0"}</td>
                            <td>{data?.protection ?? "0"}</td>
                            <td>{data?.general_insurance ?? "0"}</td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="text-center text-muted">
                          No data found
                        </td>
                      </tr>
                    )}
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
