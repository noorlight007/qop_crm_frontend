import { Card, CardBody, CardHeader, Col, Table } from "reactstrap";

const MeetingHistory = () => {
  return (
    <Col sm="12" className="box-col-12">
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <h3 className="mb-2">Meeting History</h3>
          {/* <Button color="primary">Add Joint User</Button> */}
        </CardHeader>
        <CardBody className="pt-0 recent-order">
          <div className="table-responsive theme-scrollbar">
            <Table
              className="display table-bordernone mt-0"
              id="recent-order"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>amount</th>
                  <th>vendor</th>
                  <th>status</th>
                  <th className="text-center">rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="flex-shrink-0 comman-round">
                        <h3 className="bg-success rounded-circle p-2">AA</h3>
                      </div>
                      <div className="flex-grow-1">
                        <h6>Test</h6>
                      </div>
                    </div>
                  </td>
                  <td className="f-w-600">dfdf</td>
                  <td className="font-primary f-w-600">3</td>
                  <td className="f-w-600">dd</td>
                  <td>
                    <div className="status-showcase">
                      <p>4%</p>
                    </div>
                  </td>
                  <td className="text-end">
                    <h6>44</h6>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default MeetingHistory;
