import { useGetCaseDocumentsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Documents/DocumentsApi";
import { CaseDocumentProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/DocumentsTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { saveAs } from "file-saver";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TbCircleArrowUp, TbEye } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import BatchDeleteModal from "./Modals/BatchDeleteModal";
import DocumentDeleteModal from "./Modals/DocumentDeleteModal";
import DocumentUploadModal from "./Modals/DocumentUploadModal";
import UpdateInfoModal from "./Modals/UpdateInfoModal";

const Documents: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;
  const [caseDocuments, setCaseDocuments] = useState<CaseDocumentProps[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [batchDeleteModalOpen, setBatchDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<CaseDocumentProps | null>(null);
  const [selectedDocumentForUpdate, setSelectedDocumentForUpdate] =
    useState<CaseDocumentProps | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const params = useParams();
  const { casealias } = params;

  // RTK hooks
  const { data: caseDocumentsData, isLoading } = useGetCaseDocumentsQuery({
    case_alias: casealias,
  });

  // Filter documents based on search term
  const filteredDocuments = caseDocuments.filter((doc) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    // Search by document name
    const documentName = doc.name?.toLowerCase() || "";

    // Search by owner name (support array of owners or single owner)
    const owners = Array.isArray(doc.file_owner_info)
      ? doc.file_owner_info
      : doc.file_owner_info
      ? [doc.file_owner_info]
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

  const totalPages = Math.ceil(filteredDocuments.length / filesPerPage);
  const indexOfLastDocument = currentPage * filesPerPage;
  const indexOfFirstDocument = indexOfLastDocument - filesPerPage;
  const currentDocuments = filteredDocuments.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  useEffect(() => {
    if (caseDocumentsData) {
      setCaseDocuments(caseDocumentsData as CaseDocumentProps[]);
    }
  }, [caseDocumentsData]);

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
        currentDocuments.map((doc) => doc.alias)
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
          <Row>
            <Col lg="4" sm="12">
              <h3>Documents</h3>
              {selectedDocuments.size > 0 && (
                <small className="text-muted">
                  {selectedDocuments.size} document(s) selected
                </small>
              )}
            </Col>
            <Col
              sm="12"
              className="d-flex flex-md-row flex-xs-column justify-content-end gap-2"
            >
              {selectedDocuments.size > 0 && (
                <>
                  <Button color="danger" onClick={handleBatchDelete}>
                    <i className="fa-solid fa-trash me-1"></i>
                    Delete Selected ({selectedDocuments.size})
                  </Button>
                  <Button
                    color="info"
                    onClick={handleBatchDownload}
                    disabled={isDownloading}
                  >
                    <i className="fa-solid fa-download me-1"></i>
                    {isDownloading
                      ? "Preparing…"
                      : `Download Selected (${selectedDocuments.size})`}
                  </Button>
                  <Button color="secondary" outline onClick={clearSelection}>
                    <i className="fa-solid fa-times me-1"></i>
                    Clear Selection
                  </Button>
                </>
              )}
              <div className="position-relative" style={{ minWidth: "250px" }}>
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pe-5"
                  style={{ padding: "10px" }}
                />
                <i className="fa-solid fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
              </div>
              <Button color="primary" onClick={toggleModal}>
                <TbCircleArrowUp size={18} className="me-1" />
                Upload Document
              </Button>
              <Button disabled>
                <TbEye size={18} className="me-1" />
                OCR Upload
              </Button>
            </Col>
          </Row>
        </CardHeader>

        <CardBody>
          <Row>
            {isLoading ? (
              <div className="d-flex justify-content-center my-5">
                <Spinner color="primary" />
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
                                    fileData.alias
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
                            {/* Render multiple owners as a list when file_owner_info is an array */}
                            {Array.isArray(fileData?.file_owner_info) ? (
                              <ul
                                className="mb-0"
                                style={{
                                  listStyleType: "disc",
                                  paddingLeft: "40px",
                                }}
                              >
                                {fileData.file_owner_info.map((owner: any) => (
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
                                {fileData?.file_owner_info?.title
                                  ? formatChoiceFieldValue(
                                      fileData.file_owner_info.title
                                    ) + " "
                                  : ""}
                                {fileData?.file_owner_info?.first_name}{" "}
                                {fileData?.file_owner_info?.middle_name
                                  ? fileData.file_owner_info.middle_name + " "
                                  : ""}
                                {fileData?.file_owner_info?.last_name}
                              </>
                            )}
                          </td>
                          <td>
                            {fileData?.file_type
                              ? formatChoiceFieldValue(fileData.file_type)
                              : "-"}
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2 align-items-center">
                              <a
                                href={fileData?.file}
                                className="btn btn-success btn-sm"
                                target="_blank"
                                title="Download"
                                rel="noopener noreferrer"
                              >
                                <i className="fa-solid fa-download"></i>
                              </a>
                              <button
                                className="btn btn-primary btn-sm"
                                title="Update Info"
                                onClick={() => handleUpdateClick(fileData)}
                              >
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                title="Delete"
                                onClick={() => handleDeleteClick(fileData)}
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
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
                      {filteredDocuments.length} entries
                      {searchTerm && (
                        <span className="text-muted ms-2">
                          (filtered from {caseDocuments.length} total)
                        </span>
                      )}
                    </span>
                  </div>
                  {filteredDocuments.length > filesPerPage && (
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
    </Col>
  );
};

export default Documents;
