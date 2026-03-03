"use client";
import { useGetPublicAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import { useResetUserPasswordMutation } from "@/Redux/Reducers/Common/UserProfile/ResetUserPasswordApi";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import imageTwo from "../../../../public/assets/images/logo/logo-dark.png";
import imageOne from "../../../../public/assets/images/logo/logo1.png";

type FieldErrors = Partial<
  Record<"current_password" | "new_password" | "confirm_password", string[]>
>;

export default function ResetPassword() {
  const { data: appearanceData } = useGetPublicAppranceQuery(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  // console.log("UID:", uid);
  // console.log("Token:", token);

  // Determine subdomain: prefer explicit ?subdomain= query, otherwise derive from hostname subdomain
  const getTenantFromHost = () => {
    if (typeof window === "undefined") return null;
    const hostname = window.location.hostname;

    // Local development: allow overriding via env
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || null;
    }

    const parts = hostname.split(".");
    // Examples handled:
    // - subdomain.example.com -> subdomain
    // - subdomain.localhost -> subdomain (when using dev host like subdomain.localhost)
    if (parts.length > 2 || (parts.length === 2 && parts[1] === "localhost")) {
      const subdomain = parts[0];
      if (subdomain && subdomain !== "www") return subdomain;
    }

    return null;
  };

  const subdomain = searchParams.get("subdomain") || getTenantFromHost();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>("");

  // RTK Hooks
  const [resetPassword, { isLoading }] = useResetUserPasswordMutation();

  // Password validation helper
  const getPasswordValidation = (pw: string) => {
    return {
      minLength: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
    };
  };

  const validation = getPasswordValidation(newPassword);
  const isPasswordValid =
    validation.minLength &&
    validation.upper &&
    validation.lower &&
    validation.number &&
    validation.special;

  const normalizeToStringArray = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === "string") return value ? [value] : [];
    return [String(value)];
  };

  const extractFieldErrors = (
    errorData: any,
  ): {
    fieldErrors: FieldErrors;
    formError: string;
  } => {
    const nextFieldErrors: FieldErrors = {};
    let nextFormError = "";

    if (!errorData || typeof errorData !== "object") {
      return { fieldErrors: nextFieldErrors, formError: nextFormError };
    }

    // Django REST Framework common patterns
    if (errorData.detail) {
      nextFormError = String(errorData.detail);
    }

    (["current_password", "new_password", "confirm_password"] as const).forEach(
      (key) => {
        if (key in errorData) {
          const messages = normalizeToStringArray(errorData[key]);
          if (messages.length) nextFieldErrors[key] = messages;
        }
      },
    );

    // Some backends use { error: "..." }
    if (!nextFormError && errorData.error) {
      nextFormError = String(errorData.error);
    }

    return { fieldErrors: nextFieldErrors, formError: nextFormError };
  };

  const renderFieldErrors = (name: keyof FieldErrors) => {
    const errors = fieldErrors[name];
    if (!errors?.length) return null;
    return (
      <FormFeedback className="d-block">
        {errors.map((msg, idx) => (
          <div key={`${name}-${idx}`}>{msg}</div>
        ))}
      </FormFeedback>
    );
  };

  const formSubmitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError("");

    const nextErrors: FieldErrors = {};
    if (!currentPassword) {
      nextErrors.current_password = ["Current password is required."];
    }
    if (!newPassword) {
      nextErrors.new_password = ["New password is required."];
    }
    if (!confirmPassword) {
      nextErrors.confirm_password = ["Confirm password is required."];
    }
    if (newPassword && !isPasswordValid) {
      nextErrors.new_password = [
        ...(nextErrors.new_password ?? []),
        "Password does not meet all requirements.",
      ];
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      nextErrors.confirm_password = [
        ...(nextErrors.confirm_password ?? []),
        "Passwords do not match.",
      ];
    }
    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    if (!uid || !token || !subdomain) {
      setFormError("Invalid or missing credentials. Please try again.");
      return;
    }

    try {
      // Build FormData payload as requested
      const formData = new FormData();
      formData.append("current_password", currentPassword);
      formData.append("new_password", newPassword);
      formData.append("confirm_password", confirmPassword);

      const res = await resetPassword({
        payload: formData,
        uid: uid,
        token: token,
        subdomain: subdomain,
      });
      // console.log("Res:", res.data);

      if (res.data) {
        toast.success("Password updated. Redirecting to login...");
        // Small delay so the user can see the toast
        setTimeout(() => router.push("/auth/login"), 900);
      } else if (res.error) {
        const errorData = (res.error as any)?.data;
        const extracted = extractFieldErrors(errorData);
        if (Object.keys(extracted.fieldErrors).length) {
          setFieldErrors(extracted.fieldErrors);
        }
        const errorMessage =
          extracted.formError ||
          (res.error as any)?.message ||
          "Unable to update password.";
        setFormError(errorMessage);
      } else {
        setFormError("Unable to update password.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.error ||
        err?.data?.detail ||
        err?.message ||
        "Network error while updating password.";
      setFormError(errorMessage);
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
                      style={{ width: "160px", height: "60px" }}
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

                <h3 className="text-center">Reset new password</h3>
                <p className="text-center text-muted mb-2">
                  Choose a strong password and confirm it to secure your
                  account.
                </p>

                <Form onSubmit={formSubmitHandle}>
                  <FormGroup>
                    <Label className="col-form-label">Current Password</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (fieldErrors.current_password?.length) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            current_password: undefined,
                          }));
                        }
                      }}
                      placeholder="Enter current password"
                      required
                      invalid={Boolean(fieldErrors.current_password?.length)}
                    />
                    {renderFieldErrors("current_password")}
                  </FormGroup>
                  <FormGroup>
                    <Label className="col-form-label">New Password</Label>
                    <div className="position-relative">
                      <Input
                        type={show ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (fieldErrors.new_password?.length) {
                            setFieldErrors((prev) => ({
                              ...prev,
                              new_password: undefined,
                            }));
                          }
                        }}
                        placeholder="Enter new password"
                        minLength={8}
                        required
                        invalid={Boolean(fieldErrors.new_password?.length)}
                      />
                      <div
                        className="show-hide top-50"
                        onClick={() => setShow(!show)}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="show fs-4">{show ? "🫣" : "🤫"}</span>
                      </div>
                    </div>
                    {renderFieldErrors("new_password")}

                    <div className="mt-2">
                      <ul className="mb-0 ps-3">
                        <li
                          className={
                            validation.minLength
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          <span className="me-2">
                            {validation.minLength ? "✓" : "✕"}
                          </span>
                          Must be at least 8 characters
                        </li>
                        <li
                          className={
                            validation.upper ? "text-success" : "text-danger"
                          }
                        >
                          <span className="me-2">
                            {validation.upper ? "✓" : "✕"}
                          </span>
                          Must contain at least 1 capital letter
                        </li>
                        <li
                          className={
                            validation.lower ? "text-success" : "text-danger"
                          }
                        >
                          <span className="me-2">
                            {validation.lower ? "✓" : "✕"}
                          </span>
                          Must contain at least 1 small letter
                        </li>
                        <li
                          className={
                            validation.number ? "text-success" : "text-danger"
                          }
                        >
                          <span className="me-2">
                            {validation.number ? "✓" : "✕"}
                          </span>
                          Must contain at least 1 number
                        </li>
                        <li
                          className={
                            validation.special ? "text-success" : "text-danger"
                          }
                        >
                          <span className="me-2">
                            {validation.special ? "✓" : "✕"}
                          </span>
                          Must contain at least 1 special character
                        </li>
                      </ul>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label className="col-form-label">Confirm Password</Label>
                    <Input
                      type={show ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirm_password?.length) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            confirm_password: undefined,
                          }));
                        }
                      }}
                      placeholder="Repeat new password"
                      minLength={8}
                      required
                      invalid={Boolean(fieldErrors.confirm_password?.length)}
                    />
                    {renderFieldErrors("confirm_password")}
                  </FormGroup>

                  <div className="d-grid mt-3">
                    <Button
                      type="submit"
                      color="primary"
                      disabled={
                        !isPasswordValid ||
                        newPassword !== confirmPassword ||
                        !currentPassword ||
                        isLoading
                      }
                    >
                      {isLoading ? <Spinner size="sm" /> : "Reset Password"}
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
