import React, { useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { CreateYourPassword, Done, EnterOtp, EnterYourMobileNumber, Href, NewPassword, RememberPassword, Resend, ResetYourPassword, RetypePassword, Send, SignIn } from "@/Constant";
import Link from "next/link";

export const ForgetPasswordForm = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ checkbox1: false });
  const toggle = () => setPasswordVisible(!isPasswordVisible);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({...prevData,[id]: type === "checkbox" ? checked : value,}));};
  return (
    <Form className="theme-form" onSubmit={handleSubmit}>
      <h2>{ResetYourPassword}</h2>
      <FormGroup>
        <Col><Label>{EnterYourMobileNumber}</Label></Col>
        <Row>
          <Col xs="4" sm="3"><Input className="mb-1" type="text" defaultValue="+ 91" /></Col>
          <Col xs="8" sm="9"><Input className="mb-1" type="tel" defaultValue="000-000-0000" /></Col>
          <Col xs="12"><div className="text-end"><Button color="primary" block className="m-t-10">{Send}</Button></div></Col>
        </Row>
      </FormGroup>
      <div className="mt-4 mb-4">
        <span className="reset-password-link">
          {"If don't receive OTP? "}
          <a className="btn-link text-danger" href={Href}>{Resend}</a>
        </span>
      </div>
      <FormGroup>
        <Col><Label className="pt-0">{EnterOtp}</Label></Col>
        <Row>
          <Col><Input className="text-center opt-text" type="text" defaultValue="00" maxLength={2} /></Col>
          <Col><Input className="text-center opt-text" type="text" defaultValue="00" maxLength={2} /></Col>
          <Col><Input className="text-center opt-text" type="text" defaultValue="00" maxLength={2} /></Col>
        </Row>
      </FormGroup>
      <h6 className="mt-4 f-w-700">{CreateYourPassword}</h6>
      <FormGroup>
        <Col><Label>{NewPassword}</Label></Col>
        <div className="form-input position-relative">
          <Input type={isPasswordVisible ? "text" : "password"} id="password" name="login[password]" required placeholder="*********" />
          <div className="show-hide" onClick={toggle}><span className={!isPasswordVisible ? "show" : ""}></span></div>
        </div>
      </FormGroup>
      <FormGroup>
        <Col><Label>{RetypePassword}</Label></Col>
        <Input type={isPasswordVisible ? "text" : "password"} name="login[password]" required placeholder="*********" />
        <div className="show-hide" onClick={toggle}></div>
      </FormGroup>
      <FormGroup className="mb-0 checkbox-checked">
        <FormGroup className="checkbox-solid-info" check>
          <Input id="solid6" type="checkbox" defaultChecked={formData.checkbox1 ? true : false} onChange={handleInputChange} />
          <Label htmlFor="solid6" check>{RememberPassword}</Label>
        </FormGroup>
        <Button color="primary" className="w-100 mt-3" block>{Done}</Button>
      </FormGroup>
      <p className="mt-4 mb-0 text-center">
        {"Already have an account?"}
        <Link href={`/others/authentication/loginsimple`} className="ms-2">{SignIn}</Link>
      </p>
    </Form>
  );
};
