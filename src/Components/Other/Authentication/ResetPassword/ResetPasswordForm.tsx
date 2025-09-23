import {
  Done,
  NewPassword,
  RememberPassword,
  ResetYourPassword,
  RetypePassword,
} from "@/Constant";
import React, { useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";

export const ResetPasswordForm = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ checkbox1: false });
  const toggle = () => setPasswordVisible(!isPasswordVisible);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    e.preventDefault();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };
  return (
    <Form className="theme-form" onSubmit={handleSubmit}>
      <h2>{ResetYourPassword}</h2>
      <FormGroup>
        <Col>
          <Label>{NewPassword}</Label>
        </Col>
        <div className="form-input position-relative">
          <Input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            name="login[password]"
            required
            placeholder="*********"
          />
          <div className="show-hide" onClick={toggle}>
            <span className={!isPasswordVisible ? "show" : ""} />
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <Col>
          <Label>{RetypePassword}</Label>
        </Col>
        <div className="form-input position-relative">
          <Input
            type={isPasswordVisible ? "text" : "password"}
            name="login[password]"
            required
            placeholder="*********"
          />
          <div className="show-hide" onClick={toggle}>
            <span className={!isPasswordVisible ? "show" : ""} />
          </div>
        </div>
      </FormGroup>
      <FormGroup className="mb-0 checkbox-checked">
        <FormGroup className="checkbox-solid-info" check>
          <Input
            id="solid6"
            type="checkbox"
            defaultChecked={formData.checkbox1 ? true : false}
            onChange={handleInputChange}
          />
          <Label htmlFor="solid6" check>
            {RememberPassword}
          </Label>
        </FormGroup>
        <Button color="primary" className="w-100 mt-3" block>
          {Done}
        </Button>
      </FormGroup>
      {/* <p className="mt-4 mb-0">{"Don't have account?"}
        <Link className="ms-2" href={`/others/authentication/registersimple`}>{CreateAccount}</Link>
      </p> */}
    </Form>
  );
};
