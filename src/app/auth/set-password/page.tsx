"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import logoDark from "../../../../public/assets/images/logo/logo-dark.png";
import logoLight from "../../../../public/assets/images/logo/logo1.png";

export default function SetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill both password fields.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password should be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast.success("Password updated. Redirecting to login...");
        // Small delay so the user can see the toast
        setTimeout(() => router.push("/auth/login"), 900);
      } else {
        const data = await res.json().catch(() => ({}));
        const message = data?.message || "Unable to update password.";
        toast.error(message);
      }
    } catch (err) {
      toast.error("Network error while updating password.");
    } finally {
      setIsLoading(false);
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
                  <Link href="/" className="logo mb-2">
                    <Image
                      src={logoLight}
                      alt="logo"
                      width={120}
                      height={36}
                      className="img-fluid for-light"
                    />
                    <Image
                      src={logoDark}
                      alt="logo-dark"
                      width={120}
                      height={36}
                      className="img-fluid for-dark"
                    />
                  </Link>
                </div>

                <h3 className="text-center mb-2">Set a new password</h3>
                <p className="text-center text-muted mb-4">
                  Choose a strong password and confirm it to secure your
                  account.
                </p>

                <Form onSubmit={formSubmitHandle}>
                  <FormGroup>
                    <Label className="col-form-label">New Password</Label>
                    <div className="position-relative">
                      <Input
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        minLength={8}
                        required
                      />
                      <div
                        className="show-hide top-50"
                        onClick={() => setShow(!show)}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="show fs-4">{show ? "🫣" : "🤫"}</span>
                      </div>
                    </div>
                    <small className="text-muted">Minimum 8 characters.</small>
                  </FormGroup>

                  <FormGroup>
                    <Label className="col-form-label">Confirm Password</Label>
                    <Input
                      type={show ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      minLength={8}
                      required
                    />
                  </FormGroup>

                  <div className="d-grid mt-3">
                    <Button type="submit" color="primary" disabled={isLoading}>
                      {isLoading ? <Spinner size="sm" /> : "Set Password"}
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Remembered your password?{" "}
                    <Link href="/auth/login">Sign in</Link>
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
