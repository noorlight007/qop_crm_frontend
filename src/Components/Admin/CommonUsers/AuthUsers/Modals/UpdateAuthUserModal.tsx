
import { useUpdateAuthUserDetailsMutation } from "@/Redux/Reducers/Admin/CommonUsers/AuthUsersApi";
import {
  AuthUser,
  UpdateAuthUserModalProps,
} from "@/Types/Admin/Common/AuthUsers/AuthUserType";
import React, { useEffect, useState } from "react";
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

const UpdateAuthUserModal: React.FC<UpdateAuthUserModalProps> = ({
  title,
  isOpen,
  toggle,
  selectedAuthUser,
}) => {
  const [authUserData, setAuthUserData] =
    useState<Partial<AuthUser>>(selectedAuthUser);
  const [originalData, setOriginalData] =
    useState<Partial<AuthUser>>(selectedAuthUser);
  const [isModified, setIsModified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateAuthUserDetails, { isLoading }] =
    useUpdateAuthUserDetailsMutation();

  useEffect(() => {
    setAuthUserData(selectedAuthUser);
    setOriginalData(selectedAuthUser);
    setIsModified(false);
    setErrors({});
  }, [selectedAuthUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const finalValue = name === "is_active" ? value === "true" : value;
    setAuthUserData((prev: any) => ({
      ...prev,
      [name]: finalValue,
    }));
    setIsModified(true);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      delete copy[camelToSnake(name)];
      return copy;
    });
  };

  const camelToSnake = (s: string) =>
    s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  const getFieldError = (name: string) => {
    if (!errors) return undefined;
    if (errors[name]) return errors[name];
    const snake = camelToSnake(name);
    if (errors[snake]) return errors[snake];
    return undefined;
  };

  const getErrorMessage = (err: any) => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (typeof err?.data === "string") return err.data;

    const collect = (value: any): string[] => {
      if (value == null) return [];
      if (typeof value === "string") return [value];
      if (Array.isArray(value))
        return value.map((v) =>
          typeof v === "string" ? v : JSON.stringify(v),
        );
      if (typeof value === "object") {
        try {
          return Object.values(value).flatMap((v) => collect(v));
        } catch {
          return [String(value)];
        }
      }
      return [String(value)];
    };

    if (err && typeof err === "object") {
      const msgs = collect(err);
      if (msgs.length) return msgs.join(", ");
    }

    if (err?.data?.message) return String(err.data.message);

    if (err?.data && typeof err.data === "object") {
      const msgs = collect(err.data);
      if (msgs.length) return msgs.join(", ");
    }

    if (err?.error) return String(err.error);
    if (err?.message) {
      if (/status code/i.test(err.message)) return "Server returned an error";
      return String(err.message);
    }

    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const handleUpdateAuthUser = async (
    e: React.FormEvent<HTMLFormElement>,
    authUserData: Partial<AuthUser>,
  ) => {
    e.preventDefault();
    try {
      if (authUserData.alias) {
        // Build payload with only changed fields
        const payload: Record<string, any> = {};

        // Check each field for changes
        const fieldsToCheck = [
          "title",
          "first_name",
          "middle_name",
          "last_name",
          "email",
          "phone",
          "is_active",
        ];

        fieldsToCheck.forEach((field) => {
          const currentValue = (authUserData as any)[field];
          const originalValue = (originalData as any)[field];

          if (currentValue !== originalValue) {
            payload[field] = currentValue;
          }
        });

        // If no fields changed, show message
        if (Object.keys(payload).length === 0) {
          toast.info("No changes to save.");
          return;
        }

        const result = await updateAuthUserDetails({
          payload: payload as Partial<AuthUser>,
          user_alias: authUserData.alias,
        });

        if (result.data) {
          toast.success(`${title} Updated Successfully.`);
          setErrors({});
          toggle();
        } else if ("error" in result) {
          const errData = (result.error as any)?.data;
          if (errData && typeof errData === "object") {
            const collect = (value: any): string[] => {
              if (value == null) return [];
              if (typeof value === "string") return [value];
              if (Array.isArray(value))
                return value.map((v) =>
                  typeof v === "string" ? v : JSON.stringify(v),
                );
              if (typeof value === "object") {
                try {
                  return Object.values(value).flatMap((v) => collect(v));
                } catch {
                  return [String(value)];
                }
              }
              return [String(value)];
            };
            const fieldErrors: Record<string, string> = {};
            Object.entries(errData).forEach(([k, v]) => {
              const msgs = collect(v);
              if (msgs.length) fieldErrors[k] = msgs.join(", ");
            });
            if (Object.keys(fieldErrors).length) {
              setErrors(fieldErrors);
              const firstMsg = Object.values(fieldErrors)[0];
              toast.error(firstMsg);
            } else {
              const errorMessage = getErrorMessage(errData);
              toast.error(errorMessage);
            }
          } else {
            const errorMessage = getErrorMessage(result.error as any);
            toast.error(errorMessage);
          }
        } else {
          toast.error("Invalid Request...");
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      console.error("Error saving admin:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Update Info</span>
      </ModalHeader>
      <Form
        onSubmit={(e) => handleUpdateAuthUser(e, authUserData)}
        encType="multipart/form-data"
      >
        <ModalBody>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="title">
                  Title<span className="text-danger">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="select"
                  value={authUserData?.title || ""}
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
                {getFieldError("title") && (
                  <div className="text-danger small mt-1">
                    {getFieldError("title")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="firstName">
                  First Name<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  name="first_name"
                  placeholder="First Name"
                  value={authUserData?.first_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
                {getFieldError("first_name") && (
                  <div className="text-danger small mt-1">
                    {getFieldError("first_name")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="middleName">Middle Name(s)</Label>
                <Input
                  type="text"
                  id="middleName"
                  name="middle_name"
                  placeholder="Middle Name(s)"
                  value={authUserData?.middle_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
                {getFieldError("middle_name") && (
                  <div className="text-danger small mt-1">
                    {getFieldError("middle_name")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="lastName">
                  Last Name<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  name="last_name"
                  placeholder="Last Name"
                  value={authUserData?.last_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
                {getFieldError("last_name") && (
                  <div className="text-danger small mt-1">
                    {getFieldError("last_name")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md="6" xs="12">
              <FormGroup>
                <Label for="email">
                  Email<span className="text-danger">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={authUserData?.email || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
                {getFieldError("email") && (
                  <div className="text-danger small mt-1">
                    {getFieldError("email")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Phone"
                  value={authUserData?.phone || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
                {getFieldError("phone") && (
                  <div className="text-danger small mt-1">
                    {getFieldError("phone")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="is_active">
                  Status<span className="text-danger">*</span>
                </Label>
                <Input
                  id="is_active"
                  name="is_active"
                  type="select"
                  value={String(authUserData?.is_active)}
                  onChange={handleChange}
                  required
                >
                  <option value="true">Approved</option>
                  <option value="false">Pending</option>
                </Input>
                {getFieldError("is_active") && (
                  <div className="text-danger small mt-1">
                    {getFieldError("is_active")}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={!isModified || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
export default UpdateAuthUserModal;
