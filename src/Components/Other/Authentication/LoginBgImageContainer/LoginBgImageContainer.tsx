"use client";
import { Col, Container, Row } from "reactstrap";
import { LoginForm } from "../Common/LoginForm";
import Image from "next/image";
import { ImagePath } from "@/Constant";
import RatioImage from "@/CommonComponent/RatioImage";

const LoginBgImageContainer = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="7" className="login_one_image">
          <RatioImage className="bg-img-cover bg-center" src={`${ImagePath}/login/2.jpg`} alt="looginpage" />
        </Col>
        <Col xl="5" className="p-0">
          <div className="login-card login-dark login-bg">
            <LoginForm />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default LoginBgImageContainer;
