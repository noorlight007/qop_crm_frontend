import React from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

// Sample data for roles
const roles = [
  { id: 1, name: "Executive" },
  { id: 2, name: "Senior Adviser" },
  { id: 3, name: "Junior Adviser" },
  { id: 4, name: "Compliance Officer" },
];

// Main component
interface AddUserModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Add New User</h3>
        <small className="text-dark opacity-50">
          Create a new user account and assign appropriate permissions.
        </small>
      </ModalHeader>
      <ModalBody>
        <Form>
          {/* Name Field */}
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" id="name" placeholder="Enter name" required />
          </FormGroup>

          {/* Email Field */}
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" id="email" placeholder="Enter email" required />
          </FormGroup>

          {/* Role Select */}
          <FormGroup>
            <Label for="role">Role</Label>
            <Input type="select" id="role" placeholder="Select role" required>
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <div className="d-flex gap-2">
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary">Create User</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default AddUserModal;
