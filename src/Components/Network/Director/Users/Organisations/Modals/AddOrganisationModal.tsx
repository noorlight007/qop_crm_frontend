import { useAddOrganisationMutation } from "@/Redux/Reducers/Network/Director/Organisations/OrganisationListApi";
import {
  AddOrganisationModalProps,
  AddOrganisationProps,
  UserDataProps,
} from "@/Types/Network/Director/OrganisationsTypes";
import { useRef, useState } from "react";
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
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

const AddOrganisationModal: React.FC<AddOrganisationModalProps> = ({
  isOpen,
  toggleModal,
}) => {
  const [formData, setFormData] = useState<AddOrganisationProps>({
    user_data: {
      email: "",
      phone: "",
      title: null,
      first_name: "",
      middle_name: "",
      last_name: "",
    },
    name: "",
    email: "",
    primary_mobile: "",
    other_contact: "",
    contact_person: "",
    contact_person_designation: "",
    website: "",
    license_no: "",
  });
  // rtk hooks
  const [addOrganisation, { isLoading }] = useAddOrganisationMutation();

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle user_data text input changes
  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const fieldValue: any = type === "checkbox" ? checked : value;
    setFormData((prevState) => ({
      ...prevState,
      user_data: {
        ...(prevState.user_data as UserDataProps),
        [name]: fieldValue,
      },
    }));
  };

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("organisation");
  // form ref for native validity/reporting
  const formRef = useRef<HTMLFormElement | null>(null);
  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Validate required organisation fields
  const validateOrganisation = () => {
    // Return true if required organisation fields are non-empty.
    const name = ((formData as any).name || "").toString().trim();
    const primary = ((formData as any).primary_mobile || "").toString().trim();
    const email = ((formData as any).email || "").toString().trim();
    return !!(name && primary && email);
  };

  const onNext = () => {
    if (!validateOrganisation()) {
      // show native browser validation on the first invalid organisation field
      if (formRef.current) {
        const ids = ["name", "primary_mobile", "email"];
        for (const id of ids) {
          const el = formRef.current.querySelector<HTMLInputElement>(`#${id}`);
          if (el && !el.checkValidity()) {
            el.reportValidity();
            el.focus();
            break;
          }
        }
      }
      return;
    }
    toggleTab("user_data");
  };

  const onBack = () => {
    toggleTab("organisation");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // final validation: ensure organisation required fields
    if (!validateOrganisation()) {
      if (formRef.current) {
        const ids = ["name", "primary_mobile", "email"];
        for (const id of ids) {
          const el = formRef.current.querySelector<HTMLInputElement>(`#${id}`);
          if (el && !el.checkValidity()) {
            el.reportValidity();
            el.focus();
            break;
          }
        }
      }
      return;
    }

    // ensure entire form validity (includes user_data fields)
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    try {
      // Build JSON payload. Convert File -> base64 string when present.
      const userData = formData.user_data as any;

      const fileToBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

      const payload: Record<string, any> = {};

      for (const key in formData) {
        if (key === "user_data") continue;
        const val = (formData as any)[key];
        if (val === null || val === "") continue;
        if (val instanceof File) {
          try {
            payload[key] = await fileToBase64(val as File);
          } catch (err) {
            console.warn("Failed to convert file to base64", err);
          }
        } else {
          payload[key] = val;
        }
      }

      if (userData) payload.user_data = userData;

      console.log("Organisation JSON payload:", JSON.stringify(payload));

      const response = await addOrganisation({ payload }).unwrap();

      console.log("Response:", response);

      if (response) {
        toast.success("Organisation added successfully!");
        // Clear the form data after submission
        setFormData({
          user_data: {
            email: "",
            phone: "",
            title: null,
            first_name: "",
            middle_name: "",
            last_name: "",
          },
          name: "",
          email: "",
          primary_mobile: "",
          other_contact: "",
          contact_person: "",
          contact_person_designation: "",
          website: "",
          license_no: "",
        });
        toggleModal();
      }
    } catch (error: any) {
      if (error?.data?.email?.[0]) {
        toast.error(error.data.email[0]);
      } else {
        toast.error("Failed to add organisation. Please try again.");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg" centered>
      <ModalHeader toggle={toggleModal}>
        <h3 className="text-primary">Add New Organisation</h3>{" "}
      </ModalHeader>
      <Form innerRef={formRef} onSubmit={handleSubmit}>
        <ModalBody>
          <Nav pills className="d-flex justify-content-center gap-2">
            <NavItem>
              <NavLink
                active={activeTab === "organisation"}
                onClick={() => toggleTab("organisation")}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "organisation" ? "bg-primary" : "text-primary border-primary"}`}
              >
                Organisation
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "user_data"}
                onClick={onNext}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "user_data" ? "bg-primary" : "text-primary border-primary"}`}
              >
                Organisation Director
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-3">
            <TabPane tabId="organisation">
              <Row>
                {/* 1st colunm  */}
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="name">
                      Organisation Name<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter organisation name"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="primary_mobile">
                      Primary Mobile<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="primary_mobile"
                      name="primary_mobile"
                      value={formData.primary_mobile}
                      onChange={handleChange}
                      placeholder="Enter primary mobile number"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="other_contact">Other Contact</Label>
                    <Input
                      type="text"
                      id="other_contact"
                      name="other_contact"
                      value={formData.other_contact}
                      onChange={handleChange}
                      placeholder="Enter other contact person's phone"
                    />
                  </FormGroup>
                </Col>

                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="license_no">License Number</Label>
                    <Input
                      type="text"
                      id="license_no"
                      name="license_no"
                      value={formData.license_no}
                      onChange={handleChange}
                      placeholder="Enter license number"
                    />
                  </FormGroup>
                </Col>

                {/* 2nd Column  */}
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="email">
                      Email<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="website">
                      Website{" "}
                      <span style={{ fontSize: "0.7rem", color: "#f39c12" }}>
                        (Example: https://yourdomain.com)
                      </span>
                    </Label>
                    <Input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Enter website URL"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="contact_person">Contact Person</Label>
                    <Input
                      type="text"
                      id="contact_person"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleChange}
                      placeholder="Enter contact person's name"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="contact_person_designation">
                      Contact Person Designation
                    </Label>
                    <Input
                      type="text"
                      id="contact_person_designation"
                      name="contact_person_designation"
                      value={formData.contact_person_designation}
                      onChange={handleChange}
                      placeholder="Enter contact person's designation"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>

            <TabPane tabId="user_data">
              <Row>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_title">
                      Title<span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="user_title"
                      name="title"
                      type="select"
                      value={formData.user_data.title ?? ""}
                      onChange={handleUserChange}
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
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_first_name">
                      First Name<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="user_first_name"
                      name="first_name"
                      value={formData.user_data?.first_name}
                      onChange={handleUserChange}
                      placeholder="Enter first name"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_middle_name">Middle Name</Label>
                    <Input
                      type="text"
                      id="user_middle_name"
                      name="middle_name"
                      value={formData.user_data?.middle_name}
                      onChange={handleUserChange}
                      placeholder="Enter middle name"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_last_name">
                      Last Name<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="user_last_name"
                      name="last_name"
                      value={formData.user_data?.last_name}
                      onChange={handleUserChange}
                      placeholder="Enter last name"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_email">
                      Email<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="user_email"
                      name="email"
                      value={formData.user_data?.email}
                      onChange={handleUserChange}
                      placeholder="Enter user email"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_phone">Phone</Label>
                    <Input
                      type="text"
                      id="user_phone"
                      name="phone"
                      value={formData.user_data?.phone}
                      onChange={handleUserChange}
                      placeholder="Enter user phone"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
          <div>
            {activeTab === "user_data" ? (
              <Button color="secondary" type="button" onClick={onBack}>
                Back
              </Button>
            ) : null}
          </div>
          <div className="d-flex gap-1">
            <Button color="warning" onClick={toggleModal}>
              Cancel
            </Button>
            {activeTab === "organisation" ? (
              <Button color="primary" type="button" onClick={onNext}>
                Go Next
              </Button>
            ) : (
              <Button color="primary" type="submit">
                {isLoading ? "Saving..." : "Save Organisation"}
              </Button>
            )}
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddOrganisationModal;
