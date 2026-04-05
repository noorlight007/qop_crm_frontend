import { useUpdateUserDetailsMutation } from "@/Redux/Reducers/UserProfileAndSettings/UserProfileApi";
import { UserProfileModalProps } from "@/Types/Common/UserProfile/UserProfileType";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const EditProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [form, setForm] = useState({
    phone: "",
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    post_code: "",
  });

  const [editUserData, { isLoading }] = useUpdateUserDetailsMutation();
  const { data: session, update: updateSession } = useSession();

  useEffect(() => {
    if (initialData) {
      setForm({
        phone: initialData.phone || "",
        title: initialData.title || "",
        first_name: initialData.first_name || "",
        middle_name: initialData.middle_name || "",
        last_name: initialData.last_name || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "",
        post_code: initialData.post_code || "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const payload: Record<string, any> = {
        title: form.title || null,
        first_name: form.first_name || null,
        middle_name: form.middle_name || "",
        last_name: form.last_name || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        country: form.country || null,
        post_code: form.post_code || null,
      };

      // Only include phone if it has changed
      if (form.phone !== initialData?.phone) {
        payload.phone = form.phone || null;
      }

      const updatedUserData = await editUserData({ payload }).unwrap();

      // Update session with new profile data
      if (updateSession) {
        const formatChoiceFieldValue = (value: string) => {
          const mapping: Record<string, string> = {
            MR: "Mr",
            MRS: "Mrs",
            MS: "Ms",
            DR: "Dr",
            MISS: "Miss",
            MADAM: "Madam",
            MAIDEN: "Maiden",
            PROFESSOR: "Professor",
            DOCTOR: "Doctor",
          };
          return mapping[value] || value;
        };

        const updatedName = `${
          form.title ? formatChoiceFieldValue(form.title) + " " : ""
        }${form.first_name || ""}${
          form.middle_name ? " " + form.middle_name : ""
        }${form.last_name ? " " + form.last_name : ""}`.trim();

        const sessionUpdate = {
          name: updatedName,
        };

        console.log("Updating session with:", sessionUpdate);

        // Trigger session update - NextAuth will merge this data
        await updateSession(sessionUpdate);

        console.log("Session updated successfully");
      }

      toast.success("Profile updated successfully");
      onClose();
    } catch (err: any) {
      console.error("Full error object:", err);

      let errorMessage = "Failed to update profile";

      // Handle field-level validation errors from API
      if (err?.data && typeof err.data === "object") {
        const errorArray: string[] = [];

        Object.entries(err.data).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            errorArray.push(...messages);
          } else if (typeof messages === "string") {
            errorArray.push(messages);
          }
        });

        if (errorArray.length > 0) {
          errorMessage = errorArray.join(" ");
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered size="lg">
      <ModalHeader toggle={onClose}>
        <h3 className="text-primary">Edit Profile</h3>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col sm="12" md="6">
              <FormGroup>
                <Label for="title">Title*</Label>
                <Input
                  id="title"
                  name="title"
                  type="select"
                  value={form.title}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select...</option>
                  <option value="MR">Mr</option>
                  <option value="MRS">Mrs</option>
                  <option value="MS">Ms</option>
                  <option value="DR">Dr</option>
                  <option value="MISS">Miss</option>
                  <option value="MADAM">Madam</option>
                  <option value="MAIDEN">Maiden</option>
                  <option value="PROFESSOR">Professor</option>
                  <option value="DOCTOR">Doctor</option>
                </Input>
              </FormGroup>
            </Col>
            <Col sm="12" md="6">
              <FormGroup>
                <Label for="first_name">First Name</Label>
                <Input
                  name="first_name"
                  id="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col sm="12" md="6">
              <FormGroup>
                <Label for="middle_name">Middle Name</Label>
                <Input
                  name="middle_name"
                  id="middle_name"
                  value={form.middle_name}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col sm="12" md="6">
              <FormGroup>
                <Label for="last_name">Last Name</Label>
                <Input
                  name="last_name"
                  id="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col sm="12" md="6">
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  name="phone"
                  id="phone"
                  type="number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col sm="12" md="6">
              <FormGroup>
                <Label for="post_code">Postcode</Label>
                <Input
                  name="post_code"
                  id="post_code"
                  value={form.post_code}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col sm="12" md="6">
              <FormGroup>
                <Label for="address">Address Line 1</Label>
                <Input
                  name="address"
                  id="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col sm="12" md="6">
              <FormGroup>
                <Label for="city">City</Label>
                <Input
                  name="city"
                  id="city"
                  value={form.city}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col sm="12" md="6">
              <FormGroup>
                <Label for="state">State</Label>
                <Input
                  name="state"
                  id="state"
                  value={form.state}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col sm="12" md="6">
              <FormGroup>
                <Label for="country">Country</Label>
                <Input
                  name="country"
                  id="country"
                  value={form.country}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
