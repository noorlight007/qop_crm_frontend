import { useGetCaseDocumentsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Documents/DocumentsApi";
import { CaseDocumentProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/DocumentsTypes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TbCircleArrowUp, TbEye } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import BatchDeleteModal from "./Modals/BatchDeleteModal";
import DocumentDeleteModal from "./Modals/DocumentDeleteModal";
import DocumentUploadModal from "./Modals/DocumentUploadModal";

const Documents: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;
  const [caseDocuments, setCaseDocuments] = useState<CaseDocumentProps[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [batchDeleteModalOpen, setBatchDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<CaseDocumentProps | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);
  const [filterIcon, setFilterIcon] = useState(false);
  const params = useParams();
  const { casealias } = params;

  // RTK hooks
  const { data: caseDocumentsData, isLoading } = useGetCaseDocumentsQuery({
    case_alias: casealias,
  });

  const totalPages = Math.ceil(caseDocuments.length / filesPerPage);
  const indexOfLastDocument = currentPage * filesPerPage;
  const indexOfFirstDocument = indexOfLastDocument - filesPerPage;
  const currentDocuments = caseDocuments.slice(
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

  //filter icon toggle
  const toggleFilterIcon = () => setFilterIcon(!filterIcon);

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);
  const toggleBatchDeleteModal = () =>
    setBatchDeleteModalOpen(!batchDeleteModalOpen);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (fileData: CaseDocumentProps) => {
    setSelectedDocument(fileData);
    toggleDeleteModal();
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
              lg="8"
              sm="12"
              className="d-flex flex-md-row flex-xs-column justify-content-end gap-2"
            >
              {selectedDocuments.size > 0 && (
                <>
                  <Button color="danger" onClick={handleBatchDelete}>
                    <i className="fa-solid fa-trash me-1"></i>
                    Delete Selected ({selectedDocuments.size})
                  </Button>
                  <Button color="secondary" outline onClick={clearSelection}>
                    <i className="fa-solid fa-times me-1"></i>
                    Clear Selection
                  </Button>
                </>
              )}
              <Button color="success" onClick={toggleFilterIcon}>
                {filterIcon ? (
                  <i className="fa-solid fa-filter-circle-xmark"></i>
                ) : (
                  <i className="fa-solid fa-filter"></i>
                )}
              </Button>
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
            {filterIcon && (
              <Card className="shadow-lg p-3 bg-light-success">
                <Row className="g-3">
                  <Col xs="12" sm="6" md="3">
                    <Label>Document Name</Label>
                    <Input type="select" id="1" className="py-1">
                      <option value="">All</option>
                      <option value="1">Select Employee</option>
                      <option value="2">Select Employee</option>
                    </Input>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <Label>Document Owner</Label>
                    <Input type="select" id="1" className="py-1">
                      <option value="">All</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                    </Input>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <Label>Document Type</Label>
                    <Input type="select" id="2" className="py-1">
                      <option value="">All</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </Input>
                  </Col>
                  {/* Clear All Filters Button */}
                  <Col xs="12" sm="6" md="3">
                    <Label>Clear Filters</Label>
                    <Button outline color="danger" className="w-100">
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}
          </Row>
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
                          <td>
                            {fileData?.file_owner_info?.title
                              ? fileData.file_owner_info.title
                                  .charAt(0)
                                  .toUpperCase() +
                                fileData.file_owner_info.title
                                  .slice(1)
                                  .toLowerCase()
                              : ""}
                            {fileData?.file_owner_info?.title ? ". " : ""}
                            {fileData?.file_owner_info?.first_name}{" "}
                            {fileData?.file_owner_info?.middle_name
                              ? fileData.file_owner_info.middle_name + " "
                              : ""}
                            {fileData?.file_owner_info?.last_name}
                          </td>
                          <td>
                            {fileData?.file_type
                              ?.split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ")}
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

                {caseDocuments.length > filesPerPage && (
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      color="primary"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    {[...Array(totalPages)].map((_, pageIndex) => (
                      <Button
                        key={pageIndex}
                        color={
                          currentPage === pageIndex + 1
                            ? "primary"
                            : "secondary"
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
                      Next
                    </Button>
                  </div>
                )}
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
