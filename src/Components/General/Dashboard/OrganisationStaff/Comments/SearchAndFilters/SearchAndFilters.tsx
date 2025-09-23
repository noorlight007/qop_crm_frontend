import { Card, CardBody, Col, FormGroup, Input, Row } from "reactstrap";

const SearchAndFilters: React.FC = () => {
  return (
    <Card>
      <CardBody className="mt-3">
        <Row>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                id="search"
                placeholder="Search for comments, contexts, or client..."
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="select"
                id="contexts"
                style={{ padding: "10px", cursor: "pointer" }}
              >
                <option value="ALL_CONTEXTS">All Contexts</option>
                <option value="CASEUPDATE">Case Update</option>
                <option value="DOCUMENT_UPLOAD">Document Upload</option>
                <option value="REMINDER">Reminder</option>
                <option value="TASK">Task</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SearchAndFilters;
