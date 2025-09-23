import {
  CreateYourAccount,
  EmailAddress,
  OrganizationName,
  Password,
  Phone,
  UserType,
  YourName,
} from "@/Constant";
import apiClient from "@/services/api-client";
import { LoginFormProp } from "@/Types/PagesType";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { CommonLogo } from "./CommonLogo";

export const RegisterForm: React.FC<LoginFormProp> = ({ logoClass }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const toggle = () => setPasswordVisible(!isPasswordVisible);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    profile_image: "",
    user_type: "",
    password: "",
    organization_name: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [id]: files ? files[0] : null });
    } else {
      setFormData({ ...formData, [id]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("first_name", formData.first_name);
      form.append("last_name", formData.last_name);
      form.append("user_type", formData.user_type);
      form.append("password", formData.password);
      form.append("organization_name", formData.organization_name);

      if (formData.profile_image) {
        form.append("profile_image", formData.profile_image);
      }
      console.log("Attempting to register:", formData); //clg
      const response = await apiClient.post("/auth/users/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Response received:", response); //clg
      if (response.status === 200) {
        alert("Registration successful!");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        alert(
          `Registration failed: ${
            error.response.data.message || "Please try again."
          }`
        );
      } else {
        alert("An error occurred during registration setup.");
      }
    }

    setFormData({
      email: "",
      phone: "",
      first_name: "",
      last_name: "",
      profile_image: "",
      user_type: "",
      password: "",
      organization_name: "",
    });
  };

  return (
    <div>
      <CommonLogo logoClass={logoClass} />
      <div className="login-main">
        <Form className="theme-form" onSubmit={handleSubmit}>
          <h2 className="text-center">
            {CreateYourAccount || "Create Your Account"}
          </h2>
          <p className="text-center">
            Enter your personal details to create an account
          </p>
          <FormGroup>
            <Col>
              <Label className="pt-0">{YourName || "Your Name"}</Label>
            </Col>
            <Row className="g-2">
              <Col xs="6">
                <Input
                  type="text"
                  id="first_name"
                  required
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs="6">
                <Input
                  type="text"
                  id="last_name"
                  required
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
          </FormGroup>

          {/* Other form inputs... */}
          <FormGroup>
            <Col>
              <Label>{Phone || "Phone"}</Label>
            </Col>
            <Input
              type="tel"
              id="phone"
              required
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Col>
              <Label>{EmailAddress || "Email Address"}</Label>
            </Col>
            <Input
              type="email"
              id="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Col>
              <Label>{Password || "Password"}</Label>
            </Col>
            <div className="form-input position-relative">
              <Input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div className="show-hide" onClick={toggle}>
                <span className={!isPasswordVisible ? "show" : ""}></span>
              </div>
            </div>
          </FormGroup>
          <FormGroup>
            <Row className="g-2">
              <Col xs="6">
                <FormGroup>
                  <Label className="pt-0">
                    {OrganizationName || "Organization Name"}
                  </Label>
                  <Input
                    type="text"
                    id="organization_name"
                    required
                    placeholder="Organization Name"
                    value={formData.organization_name}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col xs="6">
                <FormGroup>
                  <Label className="pt-0">{UserType || "User Type"}</Label>
                  <Input
                    type="select"
                    id="user_type"
                    required
                    value={formData.user_type}
                    onChange={handleInputChange}
                    className="form-select-sm f-w-600  text-body-tertiary"
                    style={{ padding: "12px", fontSize: "13px" }}
                  >
                    <option
                      className="form-select-sm f-w-600  text-body-tertiary"
                      style={{ padding: "12px", fontSize: "13px" }}
                      value=""
                      disabled
                    >
                      Select user type
                    </option>
                    <option
                      className="form-select-sm f-w-600  text-body-tertiary"
                      style={{ padding: "12px", fontSize: "13px" }}
                      value="LEAD"
                    >
                      Lead
                    </option>
                    <option
                      className="form-select-sm f-w-600  text-body-tertiary"
                      style={{ padding: "12px", fontSize: "13px" }}
                      value="CLIENT"
                    >
                      Client
                    </option>
                    <option
                      className="form-select-sm f-w-600  text-body-tertiary"
                      style={{ padding: "12px", fontSize: "13px" }}
                      value="INTRODUCER"
                    >
                      Introducer
                    </option>
                    <option
                      className="form-select-sm f-w-600  text-body-tertiary"
                      style={{ padding: "12px", fontSize: "13px" }}
                      value="SERVICE_HOLDER"
                    >
                      Service Holder
                    </option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Col>
              <Label>Profile Image</Label>
            </Col>
            <Input
              type="file"
              id="profile_image"
              accept="image/*"
              onChange={handleInputChange}
            />
          </FormGroup>

          <Button color="primary" className="w-100 mt-3">
            Create Account
          </Button>
        </Form>
      </div>
    </div>
  );
};
