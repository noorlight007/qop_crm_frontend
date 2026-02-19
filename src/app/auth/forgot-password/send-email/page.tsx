"use client";
import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import { useForgotPasswordSendEmailMutation } from "@/Redux/Reducers/Auth/ForgotPasswordApi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import imageTwo from "../../../../../public/assets/images/logo/logo-dark.png";
import imageOne from "../../../../../public/assets/images/logo/logo1.png";

export default function ForgotPasswordSendEmail() {
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [sentOnce, setSentOnce] = useState(false);
  const { data: appearanceData } = useGetPublicAppranceQuery(undefined);

  const RESEND_KEY = "forgot_password_resend_expiry";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESEND_KEY);
      if (raw) {
        const expiry = parseInt(raw, 10);
        const remaining = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
        if (remaining > 0) setCooldown(remaining);
        else localStorage.removeItem(RESEND_KEY);
      }
    } catch (err) {
      localStorage.removeItem(RESEND_KEY);
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(RESEND_KEY);
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // RTK Hooks
  const [forgotPasswordSendEmail, { isLoading }] =
    useForgotPasswordSendEmailMutation();

  const formSubmitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cooldown > 0) {
      toast.error(`Please wait ${formatTime(cooldown)} before resending.`);
      return;
    }

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);

      const res = await forgotPasswordSendEmail({ payload: formData });

      if ((res as any).data) {
        toast.success("Reset email sent. Check your inbox.");
        setSentOnce(true);
        const expiry = Date.now() + 1 * 60 * 1000; // 1 minute
        localStorage.setItem(RESEND_KEY, expiry.toString());
        setCooldown(1 * 60);
      } else if ((res as any).error) {
        const errorMessage =
          (res as any).error?.data?.error ||
          (res as any).error?.message ||
          "Unable to send reset email.";
        toast.error(errorMessage);
      } else {
        toast.error("Unable to send reset email.");
      }
    } catch (err: any) {
      const errorMessage = err?.data?.error || err?.message || "Network error.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="d-flex align-items-center login-card login-dark">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-md-8 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="text-center mb-3">
                  <Link className="logo mb-2" href="/">
                    <Image
                      width={300}
                      height={100}
                      className="img-fluid for-light"
                      src={appearanceData?.logo || imageOne}
                      alt="login page"
                      priority
                      style={{ width: "140px", height: "50px" }}
                    />
                    <Image
                      width={300}
                      height={100}
                      className="img-fluid for-dark"
                      src={appearanceData?.logo || imageTwo}
                      alt="login page"
                      priority
                      style={{ width: "160px", height: "60px" }}
                    />
                  </Link>
                </div>

                <h3 className="text-center mb-2">Forgot Password</h3>
                <p className="text-center text-muted mb-2">
                  Enter your email and we'll send a link to reset your password.
                </p>

                <Form onSubmit={formSubmitHandle}>
                  <FormGroup>
                    <Label className="col-form-label">Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </FormGroup>

                  <div className="d-grid mt-3">
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isLoading || cooldown > 0}
                    >
                      {isLoading ? (
                        <Spinner size="sm" />
                      ) : cooldown > 0 ? (
                        `Resend in ${formatTime(cooldown)}`
                      ) : sentOnce ? (
                        "Resend Email"
                      ) : (
                        "Send Email"
                      )}
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Sign in again? <Link href="/auth/login">Sign in</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
