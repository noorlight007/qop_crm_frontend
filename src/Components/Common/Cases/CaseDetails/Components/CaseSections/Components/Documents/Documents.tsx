import { LoadingSpinner2 } from "@/app/loading";
import {
  useGetCaseDocumentsQuery,
  useGetFileCountQuery,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Documents/DocumentsApi";
import { CaseDocumentProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/DocumentsTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { saveAs } from "file-saver";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaEye, FaFolder } from "react-icons/fa";
import { TbCircleArrowUp, TbEye, TbTransfer } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Row,
  Table,
} from "reactstrap";
import BatchDeleteModal from "./Modals/BatchDeleteModal";
import DocumentDeleteModal from "./Modals/DocumentDeleteModal";
import DocumentUploadModal from "./Modals/DocumentUploadModal";
import TransferDocumentsModal from "./Modals/TransferDocumentsModal";
import UpdateInfoModal from "./Modals/UpdateInfoModal";

const Documents: React.FC = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;
  const [caseDocuments, setCaseDocuments] = useState<CaseDocumentProps[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [batchDeleteModalOpen, setBatchDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<CaseDocumentProps | null>(null);
  const [transferDocumentModalOpen, setTransferDocumentModalOpen] =
    useState(false);
  const [selectedDocumentForUpdate, setSelectedDocumentForUpdate] =
    useState<CaseDocumentProps | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(
    new Set(),
  );
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const params = useParams();
  const { casealias } = params;

  // File type tabs - keep labels in sync with the upload modal select options
  const FILE_TYPES: { value: string; label: string }[] = [
    { value: "COMPLIANCE_DOCUMENTS", label: "Compliance Documents" },
    { value: "FACT_FINDS", label: "Fact Finds" },
    { value: "IDS", label: "IDs" },
    { value: "PROOF_OF_ADDRESS", label: "Proof of Address" },
    { value: "INCOME_DOCUMENTS", label: "Income Documents" },
    { value: "BANK_STATEMENTS", label: "Bank Statements" },
    {
      value: "PROOF_OF_DEPOSIT_BANK_STATEMENTS",
      label: "Proof of Deposit - Bank Statements",
    },
    { value: "DONOR_DOCUMENTS", label: "Donor Documents" },
    { value: "CREDIT_REPORT", label: "Credit Report" },
    { value: "RESEARCH_DOCUMENTS", label: "Research Documents" },
    { value: "LENDERS_KFI", label: "Lender's KFI" },
    { value: "LENDERS_DIP", label: "Lender's DIP" },
    {
      value: "LENDERS_FULL_MORTGAGE_APPLICATION",
      label: "Lender's Full Mortgage Application",
    },
    { value: "LENDERS_OFFER", label: "Lender's Offer" },
    { value: "SUITABILITY_LETTER", label: "Suitability Letter" },
    {
      value: "GENERAL_INSURANCE_DOCUMENTS",
      label: "General Insurance Documents",
    },
    { value: "PROTECTION_DOCUMENTS", label: "Protection Documents" },
    { value: "AML_AND_SANCTIONS_SEARCH", label: "AML and Sanctions Search" },
    { value: "OTHERS", label: "Others" },
  ];

  // RTK hooks - server-side pagination and file_type filtering
  const { data: caseDocumentsData, isLoading } = useGetCaseDocumentsQuery({
    case_alias: casealias,
    page: currentPage,
    page_size: filesPerPage,
    file_type: activeTab || undefined,
  });

  const { data: fileCount } = useGetFileCountQuery({
    case_alias: casealias,
  });

  // Build a lookup map from the file count API. Supports multiple possible shapes:
  // - [{ value: 'IDS', label: 'IDs', count: 16 }, ...]
  // - [{ IDS: 16 }, { SUITABILITY_LETTER: 6 }, ...]
  const fileCountMap = new Map<string, number>();
  if (Array.isArray(fileCount)) {
    fileCount.forEach((ft: any) => {
      if (ft && typeof ft === "object") {
        // shape: { value, count }
        if (typeof ft.value === "string" && typeof ft.count === "number") {
          fileCountMap.set(ft.value, ft.count);
          return;
        }
        // shape: { KEY: number }
        Object.keys(ft).forEach((k) => {
          if (typeof ft[k] === "number") fileCountMap.set(k, ft[k]);
        });
      }
    });
  }

  // Ordered list of types for consistent display
  const allCount = fileCountMap.get("ALL") ?? caseDocuments.length;

  const renderCount = (count: number) =>
    count === 0 ? <span className="text-muted">{count}</span> : count;

  // Server provides file_type filtering via API; keep local list as-is
  const tabFilteredDocuments = caseDocuments;

  const filteredDocuments = tabFilteredDocuments.filter((doc) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    // Search by document name
    const documentName = doc.name?.toLowerCase() || "";

    // Search by owner name (support array of owners or single owner)
    const owners = Array.isArray(doc.customer_info)
      ? doc.customer_info
      : doc.customer_info
        ? [doc.customer_info]
        : [];

    const ownerMatch = owners.some((owner: any) => {
      const first = owner?.first_name?.toLowerCase() || "";
      const middle = owner?.middle_name?.toLowerCase() || "";
      const last = owner?.last_name?.toLowerCase() || "";
      const full = `${first} ${middle} ${last}`.trim();
      return (
        first.includes(searchLower) ||
        middle.includes(searchLower) ||
        last.includes(searchLower) ||
        full.includes(searchLower)
      );
    });

    // Search by document type
    const documentType = doc.file_type?.toLowerCase() || "";

    return (
      documentName.includes(searchLower) ||
      ownerMatch ||
      documentType.includes(searchLower)
    );
  });

  // Server-side pagination: total pages calculate from server count
  const totalPages = Math.ceil((caseDocumentsData?.count || 0) / filesPerPage);
  const indexOfFirstDocument = (currentPage - 1) * filesPerPage;
  // current page's documents (filtered by tab/search client-side within page)
  const currentDocuments = filteredDocuments; // already limited to current page by server

  useEffect(() => {
    // Server returns paginated object: { count, next, previous, results }
    if (caseDocumentsData && Array.isArray(caseDocumentsData.results)) {
      setCaseDocuments(caseDocumentsData.results as CaseDocumentProps[]);
    } else {
      setCaseDocuments([]);
    }
  }, [caseDocumentsData]);

  // Clear selection and reset page when active tab changes
  useEffect(() => {
    clearSelection();
    setCurrentPage(1);
  }, [activeTab]);

  // Clear selection when changing pages
  useEffect(() => {
    clearSelection();
  }, [currentPage]);

  // Reset current page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);
  const toggleBatchDeleteModal = () =>
    setBatchDeleteModalOpen(!batchDeleteModalOpen);
  const toggleUpdateModal = () => {
    setUpdateModalOpen(!updateModalOpen);
    if (updateModalOpen) {
      // Clear selected document when closing modal
      setSelectedDocumentForUpdate(null);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (fileData: CaseDocumentProps) => {
    setSelectedDocument(fileData);
    toggleDeleteModal();
  };

  const handleUpdateClick = (fileData: CaseDocumentProps) => {
    setSelectedDocumentForUpdate(fileData);
    toggleUpdateModal();
  };

  const toggleTransferDocumentModal = () =>
    setTransferDocumentModalOpen(!transferDocumentModalOpen);

  // Batch selection functions
  const handleSelectDocument = (documentAlias: string) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(documentAlias)) {
      newSelected.delete(documentAlias);
    } else {
      newSelected.add(documentAlias);
    }
    setSelectedDocuments(newSelected);
    setSelectAll(newSelected.size === currentDocuments.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocuments(new Set());
    } else {
      const allDocumentAliases = new Set(
        currentDocuments.map((doc) => doc.alias),
      );
      setSelectedDocuments(allDocumentAliases);
    }
    setSelectAll(!selectAll);
  };

  const handleBatchDelete = () => {
    if (selectedDocuments.size > 0) {
      toggleBatchDeleteModal();
    }
  };

  const clearSelection = () => {
    setSelectedDocuments(new Set());
    setSelectAll(false);
  };

  // Batch download via server (avoids CORS/auth issues)
  const handleBatchDownload = async () => {
    if (selectedDocuments.size === 0 || isDownloading) return;
    setIsDownloading(true);
    try {
      const files = caseDocuments
        .filter((doc) => selectedDocuments.has(doc.alias) && !!doc.file)
        .map((doc) => ({
          url: doc.file as string,
          name:
            doc?.name ||
            (doc.file ? doc.file.split("/").pop() : doc.alias) ||
            doc.alias,
        }));

      if (files.length === 0) {
        setIsDownloading(false);
        return;
      }

      const res = await fetch("/api/documents/batch-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });
      if (!res.ok) throw new Error("Failed to create zip");
      const blob = await res.blob();
      saveAs(blob, "documents.zip");
    } catch (err) {
      console.error("Batch download failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to create document names map
  const getDocumentNamesMap = (): Map<string, string> => {
    const nameMap = new Map<string, string>();
    caseDocuments.forEach((doc) => {
      const displayName = doc?.name
        ? doc.name
        : doc.file?.split("/").pop() || doc.alias;
      nameMap.set(doc.alias, displayName);
    });
    return nameMap;
  };

  return (
    <Col sm="12" className="box-col-12">
      <Card>
        <CardHeader>
          <Row className="align-items-center g-3">
            <Col lg="3" xl="2">
              <h3>Documents</h3>
              {selectedDocuments.size > 0 && (
                <small className="text-muted">
                  {selectedDocuments.size} selected
                </small>
              )}
            </Col>
            <Col lg="9" xl="12">
              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                <div
                  className="position-relative flex-shrink-0"
                  style={{ minWidth: "200px", maxWidth: "280px" }}
                >
                  <Input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pe-5"
                    style={{ padding: "8px 12px" }}
                  />
                  <i className="fa-solid fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>

                <div className="d-flex flex-wrap gap-2 ms-md-auto">
                  {selectedDocuments.size > 0 && (
                    <>
                      {session?.user?.role &&
                        ((session.user.is_network &&
                          (session.user.role === "DIRECTOR" ||
                            session.user.role === "COMPLIANCE")) ||
                          (!session.user.is_network &&
                            session.user.role === "DIRECTOR")) && (
                          <Button
                            color="danger"
                            size="sm"
                            onClick={handleBatchDelete}
                          >
                            <i className="fa-solid fa-trash me-1"></i>
                            Delete ({selectedDocuments.size})
                          </Button>
                        )}
                      <Button
                        color="info"
                        size="sm"
                        onClick={handleBatchDownload}
                        disabled={isDownloading}
                      >
                        <i className="fa-solid fa-download me-1"></i>
                        {isDownloading
                          ? "Preparing…"
                          : `Download (${selectedDocuments.size})`}
                      </Button>
                      <Button
                        color="warning"
                        outline
                        size="sm"
                        onClick={toggleTransferDocumentModal}
                      >
                        <TbTransfer size={16} className="me-1" />
                        Transfer ({selectedDocuments.size})
                      </Button>
                    </>
                  )}

                  <Button color="primary" size="sm" onClick={toggleModal}>
                    <TbCircleArrowUp size={16} className="me-1" />
                    Upload Document
                  </Button>
                  <Button color="secondary" size="sm" disabled>
                    <TbEye size={16} className="me-1" />
                    OCR Upload
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </CardHeader>

        {/* Tabs for file types */}
        <CardBody>
          <Row className="mb-3">
            <Col className="d-flex justify-content-center">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "8px",
                  width: "100%",
                  maxWidth: "1200px",
                }}
              >
                <Button
                  color={activeTab === "" ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => setActiveTab("")}
                  title="All"
                  className="p-2"
                >
                  <FaFolder className="me-1" />
                  All ({renderCount(allCount)})
                </Button>

                {FILE_TYPES.map((ft) => {
                  const count =
                    fileCountMap.get(ft.value) ??
                    caseDocuments.filter((d) => d.file_type === ft.value)
                      .length;
                  return (
                    <Button
                      key={ft.value}
                      color={
                        activeTab === ft.value ? "primary" : "outline-primary"
                      }
                      size="sm"
                      onClick={() => setActiveTab(ft.value)}
                      title={ft.label}
                      className="p-2"
                    >
                      <FaFolder className="me-1" />
                      {ft.label} ({renderCount(count)})
                    </Button>
                  );
                })}
              </div>
            </Col>
          </Row>
        </CardBody>

        <CardBody>
          <Row>
            {isLoading ? (
              <div className="d-flex justify-content-center my-5">
                <LoadingSpinner2 />
              </div>
            ) : (
              <>
                <Table hover responsive className="text-center">
                  <thead>
                    <tr>
                      <th>
                        <Input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="form-check-input"
                          style={
                            {
                              borderColor: "#dc3545",
                              borderWidth: "1px",
                              accentColor: "#dc3545",
                              backgroundColor: selectAll
                                ? "#dc3545"
                                : "transparent",
                              "--bs-form-check-bg": "#dc3545",
                            } as React.CSSProperties
                          }
                        />
                      </th>
                      <th>#</th>
                      <th>Document Name</th>
                      <th>Owner Name</th>
                      <th>Document Type</th>
                      <th>Created By</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDocuments.length > 0 ? (
                      currentDocuments.map((fileData, index) => (
                        <tr key={index}>
                          <td>
                            <Input
                              type="checkbox"
                              checked={selectedDocuments.has(fileData.alias)}
                              onChange={() =>
                                handleSelectDocument(fileData.alias)
                              }
                              className="form-check-input"
                              style={
                                {
                                  borderColor: "#dc3545",
                                  borderWidth: "1px",
                                  accentColor: "#dc3545",
                                  backgroundColor: selectedDocuments.has(
                                    fileData.alias,
                                  )
                                    ? "#dc3545"
                                    : "transparent",
                                  "--bs-form-check-bg": "#dc3545",
                                } as React.CSSProperties
                              }
                            />
                          </td>
                          <td>{indexOfFirstDocument + index + 1}</td>
                          <td>
                            {fileData?.name
                              ? fileData.name
                              : fileData.file?.split("/").pop() || "-"}
                          </td>
                          <td className="text-start">
                            {/* Render multiple owners as a list when customer_info is an array */}
                            {Array.isArray(fileData?.customer_info) ? (
                              <ul
                                className="mb-0"
                                style={{
                                  listStyleType: "disc",
                                  paddingLeft: "40px",
                                }}
                              >
                                {fileData.customer_info.map((owner: any) => (
                                  <li key={owner.alias || owner.email}>
                                    {owner?.title
                                      ? formatChoiceFieldValue(owner.title) +
                                        " "
                                      : ""}
                                    {owner?.first_name || ""}{" "}
                                    {owner?.middle_name
                                      ? owner.middle_name + " "
                                      : ""}
                                    {owner?.last_name || ""}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <>
                                {fileData?.customer_info?.title
                                  ? formatChoiceFieldValue(
                                      fileData.customer_info.title,
                                    ) + " "
                                  : ""}
                                {fileData?.customer_info?.first_name}{" "}
                                {fileData?.customer_info?.middle_name
                                  ? fileData.customer_info.middle_name + " "
                                  : ""}
                                {fileData?.customer_info?.last_name}
                              </>
                            )}
                          </td>
                          <td>
                            {fileData?.file_type
                              ? formatChoiceFieldValue(fileData.file_type)
                              : "-"}
                          </td>
                          <td>
                            {fileData?.created_by
                              ? `${
                                  fileData.created_by.title
                                    ? formatChoiceFieldValue(
                                        fileData.created_by.title,
                                      ) + " "
                                    : ""
                                }${fileData.created_by.first_name || ""} ${
                                  fileData.created_by.middle_name || ""
                                } ${fileData.created_by.last_name || ""}`
                              : "-"}
                          </td>
                          <td>{formatDateAndTime(fileData?.created_at)}</td>
                          <td>
                            <div className="d-flex justify-content-center gap-2 align-items-center">
                              <a
                                href={fileData?.file}
                                className="btn btn-success btn-sm"
                                target="_blank"
                                title="Download"
                                rel="noopener noreferrer"
                              >
                                <FaEye size={16} />
                              </a>
                              <Button
                                color="primary"
                                size="sm"
                                title="Update Info"
                                onClick={() => handleUpdateClick(fileData)}
                              >
                                <i className="fa-solid fa-edit"></i>
                              </Button>
                              {session?.user?.role &&
                                ((session.user.is_network &&
                                  (session.user.role === "DIRECTOR" ||
                                    session.user.role === "COMPLIANCE")) ||
                                  (!session.user.is_network &&
                                    session.user.role === "DIRECTOR")) && (
                                  <Button
                                    color="danger"
                                    size="sm"
                                    title="Delete"
                                    onClick={() => handleDeleteClick(fileData)}
                                  >
                                    <i className="fa-regular fa-trash-can"></i>
                                  </Button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center">
                          No Documents Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-between mt-3">
                  <div>
                    <span>
                      Show {currentDocuments.length} entries | Total:{" "}
                      {caseDocumentsData?.count ?? filteredDocuments.length}{" "}
                      entries
                      {searchTerm && (
                        <span className="text-muted ms-2">
                          (filtered from{" "}
                          {caseDocumentsData?.count ?? caseDocuments.length}{" "}
                          total)
                        </span>
                      )}
                    </span>
                  </div>
                  {(caseDocumentsData?.count || 0) > filesPerPage && (
                    <div className="d-flex justify-content-end mt-3">
                      <Button
                        color="primary"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <FaChevronLeft /> {/* Previous */}
                      </Button>
                      {[...Array(totalPages)].map((_, pageIndex) => (
                        <Button
                          key={pageIndex}
                          color={
                            currentPage === pageIndex + 1
                              ? "primary"
                              : "border border-primary"
                          }
                          size="sm"
                          className="mx-1"
                          onClick={() => handlePageChange(pageIndex + 1)}
                        >
                          {pageIndex + 1}
                        </Button>
                      ))}
                      <Button
                        color="primary"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <FaChevronRight /> {/* Next */}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </Row>
        </CardBody>
      </Card>
      {/* Modals  */}
      <DocumentUploadModal isOpen={modalOpen} toggle={toggleModal} />

      {selectedDocument && (
        <DocumentDeleteModal
          isOpen={deleteModalOpen}
          toggle={toggleDeleteModal}
          fileData={selectedDocument}
          case_alias={casealias?.toString()}
          fileAlias={selectedDocument.alias}
        />
      )}

      {selectedDocumentForUpdate && (
        <UpdateInfoModal
          isOpen={updateModalOpen}
          toggle={toggleUpdateModal}
          documentData={selectedDocumentForUpdate}
          caseAlias={casealias?.toString() || ""}
        />
      )}

      <BatchDeleteModal
        isOpen={batchDeleteModalOpen}
        toggle={toggleBatchDeleteModal}
        selectedDocuments={selectedDocuments}
        documentNames={getDocumentNamesMap()}
        case_alias={casealias?.toString() || ""}
        onDeleteComplete={clearSelection}
      />

      <TransferDocumentsModal
        isOpen={transferDocumentModalOpen}
        toggle={toggleTransferDocumentModal}
        selectedDocuments={selectedDocuments}
        documentNames={getDocumentNamesMap()}
        currentCaseAlias={casealias?.toString() || ""}
        allDocuments={caseDocuments}
        onTransferComplete={clearSelection}
      />
    </Col>
  );
};

export default Documents;
