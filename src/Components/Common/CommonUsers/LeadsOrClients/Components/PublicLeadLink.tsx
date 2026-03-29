import { useEffect, useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { Button, Card, CardBody } from "reactstrap";

const PublicLeadLink: React.FC = () => {
  const [subdomain, setSubdomain] = useState(
    process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || "",
  );
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hostname = window.location.hostname;
    let detectedSubdomain = "";

    if (hostname === "localhost") {
      detectedSubdomain = process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || "";
    } else {
      const parts = hostname.split(".");
      if (parts.length > 2) {
        detectedSubdomain = parts[0];
      } else if (parts.length === 2 && parts[1] === "localhost") {
        detectedSubdomain = parts[0];
      }
    }

    if (detectedSubdomain === "www") {
      detectedSubdomain = "";
    }

    setSubdomain(detectedSubdomain);
  }, []);

  const baseDomain = (process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "").replace(
    /^\./,
    "",
  );
  const host = subdomain ? `${subdomain}.${baseDomain}` : baseDomain;
  const url = host ? `https://${host}/public-enquiry` : "";

  const handleCopy = () => {
    if (!url) return;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
  };

  return (
    <Card className="shadow-lg mb-4">
      <CardBody className="d-flex align-items-center p-3">
        <FaGlobe className="me-2 text-primary" size={24} />
        <div className="flex-grow-1">
          <h5 className="mb-1">Client Enquiry Link</h5>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary"
              style={{ wordBreak: "break-all" }}
            >
              {url}
            </a>
          ) : (
            <span className="text-muted">Public link unavailable</span>
          )}
        </div>
        <Button
          color={isCopied ? "success" : "primary"}
          outline={!isCopied}
          size="sm"
          onClick={handleCopy}
          disabled={!url}
        >
          {isCopied ? "Copied" : "Copy"}
        </Button>
      </CardBody>
    </Card>
  );
};

export default PublicLeadLink;
