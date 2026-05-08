import { ptCostOptions } from "@/Data/Cases/SuitabilityData";
import { ShortenedProductTransferProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/SuitabilityTypes";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
} from "reactstrap";

/* ── Pink: advisor guidance note ── */
const AdvisorNote = ({ children }: { children: React.ReactNode }) => (
  <p className="suitability-advisor-note rounded">{children}</p>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h6 className="suitability-section-heading">{children}</h6>
);

const ShortenedProductTransfer: React.FC<ShortenedProductTransferProps> = ({
  caseData,
  suitability,
  formValues,
  onFormChange,
}) => {
  const blue = "#1565c0";
  const s = suitability;
  const lender = s?.loan_details?.lender ?? "";

  // ── UI-only states ──
  const [isPTCostOptionOpen, setIsPTCostOptionOpen] = useState(false);
  const [isDealEndDateEditing, setIsDealEndDateEditing] = useState(false);
  const [isSvrRateEditing, setIsSvrRateEditing] = useState(false);

  // ── Draft states ──
  const [dealEndDateDraft, setDealEndDateDraft] = useState("");
  const [svrRateDraft, setSvrRateDraft] = useState("");

  // ── Derived from formValues ──
  const selectedPTCostOption =
    ptCostOptions.find(
      (o) => o.value === formValues.product_transfer_recommended_was,
    ) ?? null;

  // ── Deal end date handlers ──
  const startDealEndDateEdit = () => {
    setDealEndDateDraft(
      formValues.shortened_product_transfer_expired_date ?? "",
    );
    setIsDealEndDateEditing(true);
  };
  const handleDealEndDateSave = () => {
    onFormChange({ shortened_product_transfer_expired_date: dealEndDateDraft });
    setIsDealEndDateEditing(false);
  };
  const handleDealEndDateCancel = () => {
    setDealEndDateDraft(
      formValues.shortened_product_transfer_expired_date ?? "",
    );
    setIsDealEndDateEditing(false);
  };

  // ── SVR rate handlers ──
  const startSvrRateEdit = () => {
    setSvrRateDraft(
      formValues.shortened_product_transfer_standard_variable_rate ?? "",
    );
    setIsSvrRateEditing(true);
  };
  const handleSvrRateSave = () => {
    onFormChange({
      shortened_product_transfer_standard_variable_rate: svrRateDraft,
    });
    setIsSvrRateEditing(false);
  };
  const handleSvrRateCancel = () => {
    setSvrRateDraft(
      formValues.shortened_product_transfer_standard_variable_rate ?? "",
    );
    setIsSvrRateEditing(false);
  };

  return (
    <>
      <SectionHeading>Shortened Product Transfer</SectionHeading>

      <p>
        Your current mortgage deal with{" "}
        <strong style={{ color: blue }}>{lender}</strong> expires / expired on{" "}
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
            {formValues.shortened_product_transfer_expired_date ||
              "click to set date..."}
          </span>
        )}
        . As there are no penalties for changing this mortgage product beyond
        this date, it allowed us to review your options.
      </p>

      <p className="fw-bold mb-1">These options were:</p>
      <ul className="mb-3" style={{ listStyle: "none", paddingLeft: "1rem" }}>
        <li>
          <span className="me-2">•</span>
          Staying on standard variable rate (SVR) currently{" "}
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
              {formValues.shortened_product_transfer_standard_variable_rate
                ? `${formValues.shortened_product_transfer_standard_variable_rate}%`
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

      <p>It was your preference not to review remortgage options.</p>

      <AdvisorNote>
        (Please include any background about why the client preferred to proceed
        with a product transfer specifically, for example ease of process, speed
        of application etc.)
      </AdvisorNote>

      <p>
        You confirmed that since our last review of your mortgage there were no
        changes to your income or outgoings that would negatively affect your
        affordability, or other material changes to your circumstances.
      </p>

      <p>
        You also did not need to change any of the other details of the mortgage
        such as borrowing amount, mortgage term, repayment method etc.
      </p>

      <p>
        The product transfer recommended was{" "}
        <Dropdown
          isOpen={isPTCostOptionOpen}
          toggle={() => setIsPTCostOptionOpen((prev) => !prev)}
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
            {selectedPTCostOption === null && "select option..."}
            {selectedPTCostOption?.value === "MOST_COST_EFFECTIVE" &&
              "the most cost-effective deal available, therefore there was no disadvantage to remaining with your current lender."}
            {selectedPTCostOption?.value === "NOT_MOST_COST_EFFECTIVE" && (
              <>
                not the most cost-effective deal available, and will cost more
                during the initial product term. However, you were happy to
                forfeit this saving to proceed with a product transfer.
              </>
            )}
          </DropdownToggle>
          <DropdownMenu
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: "400px",
            }}
          >
            <DropdownItem
              onClick={() =>
                onFormChange({
                  product_transfer_recommended_was: "MOST_COST_EFFECTIVE",
                })
              }
              className="text-wrap"
            >
              <span className="me-1 fw-bolder">•</span>
              the most cost-effective deal available, therefore there was no
              disadvantage to remaining with your current lender.
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                onFormChange({
                  product_transfer_recommended_was: "NOT_MOST_COST_EFFECTIVE",
                })
              }
              className="text-wrap"
            >
              <span className="me-1 fw-bolder">•</span>
              not the most cost-effective deal available, and will cost more
              during the initial product term. However, you were happy to
              forfeit this saving to proceed with a product transfer.
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </p>

      <p className="mt-3">
        You did not wish to leave the mortgage on standard variable rate as this
        was more expensive than completing a product transfer.
      </p>
    </>
  );
};

export default ShortenedProductTransfer;
