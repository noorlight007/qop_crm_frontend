import {
  EmailAddressLogIn,
  ForgotPassword,
  Password,
  SignIn,
  SignInToAccount,
} from "@/Constant";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import imageTwo from "../../../public/assets/images/logo/logo-dark.png";
import imageOne from "../../../public/assets/images/logo/logo1.png";

export const LoginForm = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Get user agent from navigator
    const userAgent =
      typeof navigator !== "undefined" ? navigator.userAgent : "Unknown Device";

    const result = await signIn("credentials", {
      email,
      password,
      userAgent,
      redirect: false,
    });
    setIsLoading(false);
    if (result?.ok) {
      toast.success("Successfully Logged in Rediract......");
    } else {
      toast.error("Invalid Credentaial...");
    }
  };
  return (
    <div className="login-main">
      <Form
        className="theme-form"
        onSubmit={(event) => formSubmitHandle(event)}
      >
        <div>
          <Link className="logo mb-2" href="/">
            <Image
              width={91}
              height={27}
              className="img-fluid for-light"
              src={imageOne}
              alt="login page"
              priority
            />
            <Image
              width={91}
              height={27}
              className="img-fluid for-dark"
              src={imageTwo}
              alt="login page"
              priority
            />
          </Link>
        </div>
        <h2 className="text-center">{SignInToAccount}</h2>
        <p className="text-center">Enter your email & password to login</p>
        <FormGroup>
          <Label className="col-form-label">{EmailAddressLogIn}</Label>
          <Input
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter Your Registered Email"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label className="col-form-label">{Password}</Label>
          <div className="position-relative form-input">
            <Input
              type={show ? "text" : "password"}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter Password"
              required
            />
            <div className="show-hide" onClick={() => setShow(!show)}>
              <span className="show fs-4">{show ? "🫣" : "🤫"}</span>
            </div>
          </div>
        </FormGroup>
        <FormGroup className="mb-0 checkbox-checked">
          <Link className="link" href={`/auth/forgot-password/send-email`}>
            {ForgotPassword}
          </Link>
          <div className="text-end mt-3">
            <Button type="submit" color="primary" block disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : `${SignIn}`}
            </Button>
          </div>
        </FormGroup>
        {/* <p className="mt-4 mb-0 text-center">{DontHaveAccount}
            <Link className="ms-2" href="/others/authentication/registersimple">{CreateAccount}</Link>
          </p> */}
      </Form>
    </div>
  );
};
