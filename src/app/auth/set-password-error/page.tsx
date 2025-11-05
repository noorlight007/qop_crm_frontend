import Link from "next/link";
import { Badge, Card } from "reactstrap";

export default function SetPasswordError() {
  return (
    <div className="login-card d-flex align-items-center justify-content-center vh-100">
      <Card className="shadow-sm p-4" style={{ maxWidth: 520, width: "100%" }}>
        <div className="text-center mb-3">
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" stroke="#E74C3C" strokeWidth="1.5" />
            <path
              d="M8 8l8 8M16 8L8 16"
              stroke="#E74C3C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="h5 text-center mb-2">Unable to set your password</h2>
        <Badge color="light-warning" className="mb-3 text-center d-block py-3 fw-bold fs-4">
          Try again
        </Badge>
        <p className="text-center text-muted mb-4">
          We couldn't complete the request to set your password. This can happen
          if the link has expired or the token is invalid.
        </p>

        <div className="d-flex gap-2 justify-content-center mb-3">
          <Link href="/auth/login" className="btn btn-outline-secondary">
            Back to login
          </Link>
        </div>

        <div className="text-center small text-muted">
          If you still face issues, contact support at{" "}
          <a href="mailto:support@example.com">support@example.com</a>.
        </div>
      </Card>
    </div>
  );
}
