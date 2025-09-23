import { FiMessageSquare } from "react-icons/fi";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  FormText,
  Input,
} from "reactstrap";

const AddNewComment: React.FC = () => {
  return (
    <Card className="shadow">
      <CardBody>
        <CardTitle>
          <h3>Add New Comment</h3>
        </CardTitle>
        <Form>
          <FormGroup>
            <Input
              type="textarea"
              name="text"
              id="exampleText"
              rows={3}
              placeholder="Write your comment..."
            />
            <FormText>
              <small>
                Tip: Use @username to tag team members for notifications
              </small>
            </FormText>
          </FormGroup>
        </Form>
        <div className="d-flex justify-content-end">
          <Button color="primary">
            <FiMessageSquare size={18} className="me-1" />
            Add Comment
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default AddNewComment;
