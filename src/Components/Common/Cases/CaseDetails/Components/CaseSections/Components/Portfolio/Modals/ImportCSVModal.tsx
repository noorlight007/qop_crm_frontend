import { ImportCSVModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/PortfolioTypes";
import { useRef } from "react";
import { toast } from "react-toastify"; // or your toast lib
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap"; // adjust to your UI lib

// ─── Column definitions ────────────────────────────────────────────────────────

const COLUMNS = [
  {
    header: "Postcode",
    mandatory: true,
    description: "Property postcode",
    accepted: "Text (e.g. AB12CD)",
  },
  {
    header: "House Name Or Number",
    mandatory: true,
    description: "House name or door number",
    accepted: "Text or Number (e.g. 10, Rose Cottage)",
  },
  {
    header: "Address 1",
    mandatory: true,
    description: "First line of address",
    accepted: "Text",
  },
  {
    header: "Address 2",
    mandatory: false,
    description: "Second line of address",
    accepted: "Text or blank",
  },
  {
    header: "City",
    mandatory: false,
    description: "City name",
    accepted: "Text",
  },
  {
    header: "County",
    mandatory: false,
    description: "County name",
    accepted: "Text",
  },
  {
    header: "Country",
    mandatory: false,
    description: "Country name",
    accepted: "Text (e.g. UK)",
  },
  {
    header: "Property Value",
    mandatory: false,
    description: "Current market value of property",
    accepted: "Number (e.g. 450000)",
  },
  {
    header: "Current Mortgage Balance",
    mandatory: false,
    description: "Outstanding mortgage amount",
    accepted: "Number",
  },
  {
    header: "Monthly Rental Income",
    mandatory: false,
    description: "Monthly rental income received",
    accepted: "Number",
  },
  {
    header: "Monthly Mortgage Payment",
    mandatory: false,
    description: "Monthly mortgage repayment amount",
    accepted: "Number",
  },
  {
    header: "Value At Purchase",
    mandatory: false,
    description: "Property value at time of purchase",
    accepted: "Number",
  },
  {
    header: "Date Purchased",
    mandatory: false,
    description: "Date the property was purchased",
    accepted: "Date (M/D/YYYY e.g. 5/10/2018)",
  },
  {
    header: "Is the property an HMO",
    mandatory: false,
    description: "Whether property is a House in Multiple Occupation",
    accepted: "TRUE or FALSE",
  },
  {
    header: "Is the property a MUFB",
    mandatory: false,
    description: "Whether property is a Multi-Unit Freehold Block",
    accepted: "TRUE or FALSE",
  },
  {
    header: "Mortgage Lender",
    mandatory: false,
    description: "Name of the mortgage lender",
    accepted: "Text (e.g. Lloyds Bank)",
  },
  {
    header: "Repayment Type",
    mandatory: false,
    description: "Type of mortgage repayment",
    accepted: "Repayment or Interest Only",
  },
  {
    header: "Current Rate",
    mandatory: false,
    description: "Current mortgage interest rate (%)",
    accepted: "Number (e.g. 3.5)",
  },
  {
    header: "Rate Type",
    mandatory: false,
    description: "Type of interest rate",
    accepted: "FIXED or VARIABLE or TRACKER",
  },
  {
    header: "To Be Repaid",
    mandatory: false,
    description: "Total remaining amount to be repaid",
    accepted: "Number",
  },
  {
    header: "Current Rate End Date",
    mandatory: false,
    description: "Date when current rate expires",
    accepted: "Date (M/D/YYYY)",
  },
  {
    header: "ERC End Date",
    mandatory: false,
    description: "Early repayment charge end date",
    accepted: "Date (M/D/YYYY)",
  },
  {
    header: "Account Number",
    mandatory: false,
    description: "Mortgage account number",
    accepted: "Text (e.g. ACC123)",
  },
  {
    header: "Property Type",
    mandatory: false,
    description: "Type of property",
    accepted: "Detached, Semi-Detached, Terraced, Flat",
  },
  {
    header: "Ownership",
    mandatory: false,
    description: "Ownership type",
    accepted: "Freehold or Leasehold",
  },
  {
    header: "Leasehold",
    mandatory: false,
    description: "Leasehold years remaining (0 if freehold)",
    accepted: "Number",
  },
  {
    header: "Year Built",
    mandatory: false,
    description: "Year the property was built",
    accepted: "Number (e.g. 2005)",
  },
  {
    header: "Number of Bedrooms",
    mandatory: false,
    description: "Total number of bedrooms",
    accepted: "Number",
  },
  {
    header: "Remaining Mortgage Term",
    mandatory: false,
    description: "Remaining term in years",
    accepted: "Number (e.g. 20)",
  },
  {
    header: "Is Limited Company",
    mandatory: false,
    description: "Whether owned through a limited company",
    accepted: "TRUE or FALSE",
  },
  {
    header: "Company Name",
    mandatory: false,
    description: "Limited company name (if applicable)",
    accepted: "Text or blank",
  },
  {
    header: "EPC Rating",
    mandatory: false,
    description: "Energy Performance Certificate rating",
    accepted: "A, B, C, D, E, F or G",
  },
];

// ─── Sample CSV generator ──────────────────────────────────────────────────────

const SAMPLE_ROW = [
  "", // Id
  "AB12CD", // Postcode
  "10", // House Name Or Number
  "Street A", // Address 1
  "", // Address 2
  "London", // City
  "Greater London", // County
  "UK", // Country
  "450000", // Property Value
  "200000", // Current Mortgage Balance
  "1500", // Monthly Rental Income
  "1200", // Monthly Mortgage Payment
  "400000", // Value At Purchase
  "5/10/2018", // Date Purchased
  "TRUE", // Is the property an HMO
  "FALSE", // Is the property a MUFB
  "Lloyds Bank", // Mortgage Lender
  "Repayment", // Repayment Type
  "3.5", // Current Rate
  "FIXED", // Rate Type
  "200000", // To Be Repaid
  "5/10/2026", // Current Rate End Date
  "5/10/2024", // ERC End Date
  "ACC123", // Account Number
  "Detached", // Property Type
  "Freehold", // Ownership
  "0", // Leasehold
  "2005", // Year Built
  "3", // Number of Bedrooms
  "20", // Remaining Mortgage Term
  "FALSE", // Is Limited Company
  "", // Company Name
  "B", // EPC Rating
];

function downloadSampleCSV() {
  const link = document.createElement("a");
  link.href = "/assets/csv/sample_property.csv";
  link.setAttribute("download", "sample_property.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ImportCSVModal({
  isOpen,
  onClose,
  onFileSelected,
  isImporting,
}: ImportCSVModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [".xlsx", ".csv", ".xls"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(
        `Invalid file type. Allowed types: ${allowedExtensions.join(", ")}`,
      );
      e.target.value = "";
      return;
    }

    onFileSelected(file);
    e.target.value = "";
    onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="xl">
      <ModalHeader toggle={onClose}>
        📥 Import Properties — CSV / Excel Guide
      </ModalHeader>

      <ModalBody style={{ maxHeight: "65vh", overflowY: "auto" }}>
        {/* Intro */}
        <div className="alert alert-primary mb-3" role="alert">
          <strong>Before importing,</strong> make sure your file follows the
          column structure below. Column headers must be{" "}
          <strong>exactly</strong> as shown. Fields marked with{" "}
          <span className="text-warning">(Required)</span> are <strong>mandatory</strong>{" "}
          — all other fields are optional, but filling them ensures the data
          displays correctly on the properties list page.
        </div>

        {/* Tips */}
        <ul className="mb-3 ps-3" style={{ fontSize: "0.9rem" }}>
          <li>
            Accepted formats: <Badge color="secondary">.csv</Badge>{" "}
            <Badge color="secondary">.xls</Badge>{" "}
            <Badge color="secondary">.xlsx</Badge>
          </li>
          <li>
            First row must be the header row — do <strong>not</strong> alter
            header names.
          </li>
          <li>
            Dates should follow the format <code>M/D/YYYY</code> (e.g.{" "}
            <code>5/10/2018</code>).
          </li>
          <li>
            Boolean fields accept <code>TRUE</code> or <code>FALSE</code> only.
          </li>
        </ul>

        {/* Column reference table */}
        <div style={{ overflowX: "auto" }}>
          <Table
            bordered
            hover
            size="sm"
            className="mb-0"
            style={{ fontSize: "0.82rem" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#212529", color: "#fff" }}>
                <th style={{ whiteSpace: "nowrap", color: "#fff" }}>#</th>
                <th style={{ whiteSpace: "nowrap", color: "#fff" }}>
                  Column Header
                </th>
                <th style={{ color: "#fff" }}>Description</th>
                <th style={{ whiteSpace: "nowrap", color: "#fff" }}>
                  Accepted Values
                </th>
              </tr>
            </thead>
            <tbody>
              {COLUMNS.map((col, i) => (
                <tr key={col.header}>
                  <td className="text-muted">{i + 1}</td>
                  <td>
                    <code style={{ whiteSpace: "nowrap" }}>{col.header}</code>
                    {col.mandatory && (
                      <span style={{ color: "red", marginLeft: 3 }}>(Required)</span>
                    )}
                  </td>
                  <td>{col.description}</td>
                  <td className="text-muted" style={{ whiteSpace: "nowrap" }}>
                    {col.accepted}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </ModalBody>

      <ModalFooter className="d-flex justify-content-between">
        {/* Left — download sample */}
        <Button color="outline-secondary" onClick={downloadSampleCSV}>
          ⬇️ Download Sample CSV
        </Button>

        {/* Right — cancel + choose file */}
        <div className="d-flex gap-2">
          <Button color="secondary" outline onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={isImporting}
            onClick={() => fileInputRef.current?.click()}
          >
            {isImporting ? "Importing..." : "Choose File & Import"}
          </Button>
        </div>
      </ModalFooter>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".xlsx,.csv,.xls"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Modal>
  );
}
