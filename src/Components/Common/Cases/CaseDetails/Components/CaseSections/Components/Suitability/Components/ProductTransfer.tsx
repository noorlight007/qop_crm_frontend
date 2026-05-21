import { productTransferOptions } from "@/Data/Cases/SuitabilityData";
import { ProductTransferProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
import { formatDate } from "@/utils/dateAndTimeFormatter";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
} from "reactstrap";

const AdvisorNote = ({ children }: { children: React.ReactNode }) => (
  <p className="suitability-advisor-note rounded">{children}</p>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h6 className="suitability-section-heading">{children}</h6>
);

const ProductTransfer: React.FC<ProductTransferProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  const blue = "#1565c0";
  const s = suitability;
  const lender = s?.loan_details?.lender ?? "";

  const expiryStatusOptions = [
    { value: "EXPIRES", label: "expires" },
    { value: "EXPIRED", label: "expired" },
  ];

  // ── UI-only states ──
  const [isProductTransferOptionOpen, setIsProductTransferOptionOpen] =
    useState(false);
  const [isDealEndDateEditing, setIsDealEndDateEditing] = useState(false);
  const [isSvrRateEditing, setIsSvrRateEditing] = useState(false);
  const [isExpiryStatusOpen, setIsExpiryStatusOpen] = useState(false);

  // ── Draft states ──
  const [dealEndDateDraft, setDealEndDateDraft] = useState("");
  const [svrRateDraft, setSvrRateDraft] = useState("");

  const selectedExpiryStatus =
    expiryStatusOptions.find(
      (o) => o.value === formValues.product_transfer_expires_or_expired_type,
    ) ?? null;
  // ── Derived from formValues ──
  const selectedProductTransferOption =
    productTransferOptions.find(
      (o) => o.value === formValues.product_transfer_reason,
    ) ?? null;

  // ── Deal end date handlers ──
  const startDealEndDateEdit = () => {
    setDealEndDateDraft(formValues.product_transfer_expired_date ?? "");
    setIsDealEndDateEditing(true);
  };
  const handleDealEndDateSave = () => {
    onFormChange({ product_transfer_expired_date: dealEndDateDraft });
    setIsDealEndDateEditing(false);
  };
  const handleDealEndDateCancel = () => {
    setDealEndDateDraft(formValues.product_transfer_expired_date ?? "");
    setIsDealEndDateEditing(false);
  };

  // ── SVR rate handlers ──
  const startSvrRateEdit = () => {
    setSvrRateDraft(formValues.product_transfer_standard_variable_rate ?? "");
    setIsSvrRateEditing(true);
  };
  const handleSvrRateSave = () => {
    onFormChange({ product_transfer_standard_variable_rate: svrRateDraft });
    setIsSvrRateEditing(false);
  };
  const handleSvrRateCancel = () => {
    setSvrRateDraft(formValues.product_transfer_standard_variable_rate ?? "");
    setIsSvrRateEditing(false);
  };

  return (
    <>
      <SectionHeading>Product Transfer</SectionHeading>

      <p>
        Your current mortgage deal with{" "}
        <strong style={{ color: blue }}>{lender}</strong>{" "}
        <Dropdown
          isOpen={isExpiryStatusOpen}
          toggle={() => setIsExpiryStatusOpen((p) => !p)}
          className="d-inline"
        >
          <DropdownToggle
            tag="span"
            style={{
              color: "#6a1b9a",
              cursor: "pointer",
              textDecoration: "underline dotted",
            }}
          >
            {selectedExpiryStatus
              ? selectedExpiryStatus.label
              : "select expiry status..."}
          </DropdownToggle>
          <DropdownMenu>
            {expiryStatusOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() =>
                  onFormChange({
                    product_transfer_expires_or_expired_type: option.value,
                  })
                }
              >
                <span className="me-1 fw-bolder">•</span>
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>{" "}
        on{" "}
        {isDealEndDateEditing ? (
          <span className="d-inline-flex align-items-center gap-2 ms-1">
            <Input
              type="date"
              value={dealEndDateDraft}
              onChange={(e) => setDealEndDateDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleDealEndDateSave();
                if (e.key === "Escape") handleDealEndDateCancel();
              }}
              autoFocus
              style={{ width: "160px", display: "inline-block" }}
              className="p-1"
            />
            <Button
              color="light"
              className="text-black"
              size="sm"
              onClick={handleDealEndDateSave}
            >
              Save
            </Button>
            <Button
              color="light"
              className="text-black"
              size="sm"
              onClick={handleDealEndDateCancel}
            >
              Cancel
            </Button>
          </span>
        ) : (
          <span
            className="text-success"
            style={{ cursor: "pointer" }}
            onClick={startDealEndDateEdit}
            title="Click to edit"
          >
            {formatDate(formValues.product_transfer_expired_date) ||
              "click to set date..."}
          </span>
        )}
        . As there are no penalties for changing this mortgage product beyond
        this date, it allows us to review your options.
      </p>

      <p className="fw-bold mb-1">These options included:</p>
      <ul className="mb-3" style={{ listStyle: "none", paddingLeft: "1rem" }}>
        <li>
          <span className="me-2">•</span>
          Staying on standard variable rate (SVR){" "}
          {isSvrRateEditing ? (
            <span className="d-inline-flex align-items-center gap-2 ms-1">
              <Input
                type="text"
                value={svrRateDraft}
                onChange={(e) => setSvrRateDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSvrRateSave();
                  if (e.key === "Escape") handleSvrRateCancel();
                }}
                placeholder="e.g. 5.25"
                autoFocus
                style={{ width: "120px", display: "inline-block" }}
                className="p-1"
              />
              <Button
                color="light"
                className="text-black"
                size="sm"
                onClick={handleSvrRateSave}
              >
                Save
              </Button>
              <Button
                color="light"
                className="text-black"
                size="sm"
                onClick={handleSvrRateCancel}
              >
                Cancel
              </Button>
            </span>
          ) : (
            <span
              className="text-success"
              style={{ cursor: "pointer" }}
              onClick={startSvrRateEdit}
              title="Click to edit"
            >
              {formValues.product_transfer_standard_variable_rate
                ? `${formValues.product_transfer_standard_variable_rate}%`
                : "click to set rate..."}
            </span>
          )}
        </li>
        <li>
          <span className="me-2">•</span>
          Moving to another deal from the lender&rsquo;s product range &mdash;
          known as a product transfer
        </li>
        <li>
          <span className="me-2">•</span>
          Moving your mortgage to a new lender &mdash; known as a remortgage
        </li>
      </ul>

      <p>
        Having reviewed your circumstances and discussed your needs, I then
        compared the available products, and I recommend a product transfer
        because{" "}
        <Dropdown
          isOpen={isProductTransferOptionOpen}
          toggle={() => setIsProductTransferOptionOpen((prev) => !prev)}
          className="d-inline"
          style={{ display: "inline" }}
        >
          <DropdownToggle
            tag="span"
            style={{
              color: "#6a1b9a",
              cursor: "pointer",
              textDecoration: "underline dotted",
            }}
          >
            {selectedProductTransferOption
              ? selectedProductTransferOption.label
              : "select reason..."}
          </DropdownToggle>
          <DropdownMenu
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: "400px",
            }}
          >
            {productTransferOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() =>
                  onFormChange({ product_transfer_reason: option.value })
                }
                className="text-wrap"
              >
                <span className="me-1 fw-bolder">•</span>
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </p>

      <AdvisorNote>
        (If there are client-specific reasons as to why they wanted a simpler
        process, e.g. busy work life, family commitments etc., please include
        details here to make the suitability letter as personalised as
        possible.)
      </AdvisorNote>
    </>
  );
};

export default ProductTransfer;
