import Link from "next/link";
import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Button } from "reactstrap";

const LandingFooter: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // Placeholder subscription action
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <footer aria-label="Site Footer" className="text-white bg-light-dark">
      <div className=" py-5">
        <div className="row gy-4">
          <div className="col-md-4">
            <h4 className="mb-3">
              <span className="text-primary">QOP</span> CRM
            </h4>
            <p className="small">
              We are genuinely independent, wholly impartial and we will offer
              straightforward honest advice, given freely and without
              obligation.
              <br />
              When your own Bank has failed to offer the support you need then
              call us. We will quickly assess all the available options for you
              and we will do everything possible to find a workable and
              affordable business solution.
            </p>
            <div className="d-flex gap-2 mt-3">
              <Button
                size="sm"
                outline
                color="primary"
                aria-label="Facebook"
                href="#"
              >
                <FaFacebookF />
              </Button>
              <Button
                size="sm"
                outline
                color="primary"
                aria-label="Twitter"
                href="#"
              >
                <FaTwitter />
              </Button>
              <Button
                size="sm"
                outline
                color="primary"
                aria-label="LinkedIn"
                href="#"
              >
                <FaLinkedinIn />
              </Button>
              <Button
                size="sm"
                outline
                color="primary"
                aria-label="Instagram"
                href="#"
              >
                <FaInstagram />
              </Button>
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-uppercase fw-bold small mb-2">Quick links</h6>
            <ul className="list-unstyled small">
              <li>
                <Link href="#">Home</Link>
              </li>
              <li>
                <Link href="#">Features</Link>
              </li>
              <li>
                <Link href="#">Pricing</Link>
              </li>
              <li>
                <Link href="#">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="text-uppercase fw-bold small mb-2">Contact</h6>
            <address className="small">
              123 Example Street
              <br />
              City, ST 10001
              <br />
              <a className="d-block" href="tel:+441234567890">
                +44 1234 567 890
              </a>
              <a className="d-block" href="mailto:hello@example.com">
                hello@example.com
              </a>
            </address>
          </div>

          <div className="col-md-3">
            <h6 className="text-uppercase fw-bold small mb-1">Newsletter</h6>
            <p className="small">Get useful updates, once a week.</p>
            <form onSubmit={handleSubscribe} className="d-flex gap-2">
              <input
                aria-label="Email address"
                className="form-control form-control-sm"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
              <button className="btn btn-primary btn-sm" type="submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="border-dark opacity-10 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small">
          <div>© {new Date().getFullYear()} QOP. All rights reserved.</div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <Link href="#">Terms</Link>
            <Link href="#">Privacy</Link>
            <Link href="#">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
