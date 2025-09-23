import {
  EmailAddress,
  Password,
  RememberPassword,
  SignIn,
  SignInAccount,
} from "@/Constant";
import { LoginFormProp } from "@/Types/PagesType";
import Link from "next/link";
import React, { useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { CommonLogo } from "./CommonLogo";

export const LoginForm: React.FC<LoginFormProp> = ({ logoClass }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const toggle = () => setPasswordVisible(!isPasswordVisible);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    checkbox1: false,
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData({ email: "", password: "", checkbox1: false });
  };
  return (
    <div>
      <div>
        <CommonLogo logoClass={logoClass} />
      </div>
      <div className="login-main">
        <Form className="theme-form" onSubmit={handleSubmit}>
          <h2 className="text-center">{SignInAccount}</h2>
          <p className="text-center">
            {"Enter your email & password to login"}
          </p>
          <FormGroup>
            <Col>
              <Label>{EmailAddress}</Label>
            </Col>
            <Input
              type="email"
              required
              placeholder="Email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Col>
              <Label>{Password}</Label>
            </Col>
            <div className="form-input position-relative">
              <Input
                type={isPasswordVisible ? "text" : "password"}
                name="login[password]"
                required
                placeholder="Password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div className="show-hide" onClick={toggle}>
                <span className={!isPasswordVisible ? "show" : ""}></span>
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
            <Link href={`/others/authentication/forgetpassword`}>
              {"Forgot password?"}
            </Link>
            <div className="text-end mt-3">
              <Button color="primary" block className="w-100">
                {SignIn}
              </Button>
            </div>
          </FormGroup>
          {/* <SocialLinks /> */}
        </Form>
      </div>
    </div>
  );
};
