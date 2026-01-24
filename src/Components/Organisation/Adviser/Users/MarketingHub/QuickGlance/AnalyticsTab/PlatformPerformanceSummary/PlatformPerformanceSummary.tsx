import { Badge, Card, CardBody, Table } from "reactstrap";

const PlatformPerformanceSummary: React.FC = () => {
  const data = [
    {
      platform: "Facebook",
      posts: 12,
      reach: 8900,
      engagement: 456,
      leads: 15,
      costPerLead: "£16.67",
      roi: "11900%",
    },
    {
      platform: "Instagram",
      posts: 18,
      reach: 12400,
      engagement: 789,
      leads: 8,
      costPerLead: "£31.25",
      roi: "6300%",
    },
    {
      platform: "LinkedIn",
      posts: 6,
      reach: 3200,
      engagement: 234,
      leads: 12,
      costPerLead: "£20.83",
      roi: "9500%",
    },
    {
      platform: "Twitter",
      posts: 24,
      reach: 2100,
      engagement: 145,
      leads: 3,
      costPerLead: "£83.33",
      roi: "2300%",
    },
  ];
  return (
    <Card>
      <CardBody>
        <div className="mb-3">
          <h3>Platform Performance Summary</h3>
          <small>Detailed metrics for each marketing channel</small>
        </div>
        <div>
          <Table responsive>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Posts</th>
                <th>Reach</th>
                <th>Engagement</th>
                <th>Leads</th>
                <th>Cost/Lead</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="fw-semibold">{row.platform}</td>
                  <td>{row.posts}</td>
                  <td>{row.reach}</td>
                  <td>{row.engagement}</td>
                  <td className="fw-semibold text-success">{row.leads}</td>
                  <td>{row.costPerLead}</td>
                  <td>
                    <Badge className="bg-light-success">{row.roi}</Badge>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default PlatformPerformanceSummary;
