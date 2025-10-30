import { useGetCommonDashboardQuery } from "@/Redux/Reducers/CommonComponents/CommonDashboard/CommonDashboardApi";
import { Badge, Card, CardBody, Col, Row, Spinner, Table } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";

const NetworkAdvisersStatusContainer: React.FC = () => {
  //RTK hooks
  const { data: commonDashboardData, isLoading } =
    useGetCommonDashboardQuery(undefined);
  return (
    <>
      <Breadcrumbs
        title="Advisers Status"
        subTitle="Overview of Advisers Status"
        parent="Network"
        child="Advisers Status"
      />
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm p-1 mb-2">
            <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom rounded-top-5">
              <h4 className="mb-0 fw-bold">Adviser Status</h4>
              <div>
                <Badge color="success" pill className="me-2">
                  Residential
                </Badge>
                <Badge color="info" pill className="me-2">
                  Buy to Let
                </Badge>
                <Badge color="warning" pill className="me-2">
                  Commercial
                </Badge>
                <Badge color="dark" pill className="me-2">
                  Second Charge
                </Badge>
                <Badge color="success" pill className="me-2">
                  Bridging
                </Badge>
                <Badge color="secondary" pill className="me-2">
                  Protection
                </Badge>
                <Badge color="primary" pill className="me-2">
                  General Insurance
                </Badge>
              </div>
            </div>
            <CardBody className="p-1">
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
                  ) : (
                    <>
                      {commonDashboardData?.top_performing_advisers?.map(
                        (data: any, idx: number) => (
                          <tr key={idx}>
                            <td>{data?.rank ?? "-"}</td>
                            <td>{data?.advisor_name ?? "-"}</td>
                            <td>{data?.total_cases ?? "-"}</td>
                            <td>{data?.residential ?? "-"}</td>
                            <td>
                              {data?.buy_to_Let ?? data.buy_to_let ?? "-"}
                            </td>
                            <td>{data?.commercial ?? "-"}</td>
                            <td>{data?.second_charge ?? "-"}</td>
                            <td>{data?.bridging ?? "-"}</td>
                            <td>{data?.protection ?? "-"}</td>
                            <td>{data?.general_insurance ?? "-"}</td>
                          </tr>
                        )
                      )}
                    </>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default NetworkAdvisersStatusContainer;
