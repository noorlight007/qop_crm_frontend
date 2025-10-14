import Link from "next/link";
import { TbEye } from "react-icons/tb";
import { Badge, Card, CardBody, Col, Row, Table } from "reactstrap";

const tableData = [
  {
    rank: 1,
    advisor: "Shahariar Sadat",
    cases: 310,
    resi: 180,
    btl: 90,
    commercial: 5,
    secondCharge: 5,
    bridging: 80,
    protection: 5,
    insurance: 5,
  },
  {
    rank: 2,
    advisor: "Zahirul Bloyain",
    cases: 300,
    resi: 170,
    btl: 85,
    commercial: 5,
    secondCharge: 5,
    bridging: 80,
    protection: 5,
    insurance: 5,
  },
  {
    rank: 3,
    advisor: "Zahirul Bloyain",
    cases: 300,
    resi: 170,
    btl: 85,
    commercial: 5,
    secondCharge: 5,
    bridging: 80,
    protection: 5,
    insurance: 5,
  },
  {
    rank: 4,
    advisor: "Zahirul Bloyain",
    cases: 300,
    resi: 170,
    btl: 85,
    commercial: 5,
    secondCharge: 5,
    bridging: 80,
    protection: 5,
    insurance: 5,
  },
  {
    rank: 5,
    advisor: "Zahirul Bloyain",
    cases: 300,
    resi: 170,
    btl: 85,
    commercial: 5,
    secondCharge: 5,
    bridging: 80,
    protection: 5,
    insurance: 5,
  },
  // Add more data as needed
];

const AdviserStatus = () => {
  return (
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
                Protection
              </Badge>
              <Badge color="primary" pill className="me-2">
                General Insurance
              </Badge>
            </div>
            <Link href="#" className="ms-3 text_decoration_hover">
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
                {tableData.map((data) => (
                  <tr key={data.rank}>
                    <td>{data.rank}</td>
                    <td>{data.advisor}</td>
                    <td>{data.cases}</td>
                    <td>{data.resi}</td>
                    <td>{data.btl}</td>
                    <td>{data.commercial}</td>
                    <td>{data.secondCharge}</td>
                    <td>{data.bridging}</td>
                    <td>{data.protection}</td>
                    <td>{data.insurance}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AdviserStatus;
