import { useGetCaseDocumentsQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/Documents/DocumentsApi";
import { CaseDocumentProps } from "@/Types/CommonComponents/SingleCaseInfo/Documents/DocumentsTypes";
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
import DocumentDeleteModal from "./Modals/DocumentDeleteModal";
import DocumentUploadModal from "./Modals/DocumentUploadModal";

const Documents: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 5;
  const [caseDocuments, setCaseDocuments] = useState<CaseDocumentProps[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<CaseDocumentProps | null>(null);
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

  //filter icon toggle
  const toggleFilterIcon = () => setFilterIcon(!filterIcon);

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (file: CaseDocumentProps) => {
    setSelectedDocument(file);
    toggleDeleteModal();
  };

  return (
    <Col sm="12" className="box-col-12">
      <Card>
        <CardHeader>
          <Row>
            <Col lg="3" sm="12">
              <h3>Documents</h3>
            </Col>
            <Col
              lg="9"
              sm="12"
              className="d-flex flex-md-row flex-xs-column justify-content-end gap-2"
            >
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
              <Button>
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
                      <th>#</th>
                      <th>Document Name</th>
                      <th>Owner Name</th>
                      <th>Document Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDocuments.length > 0 ? (
                      currentDocuments.map((file, index) => (
                        <tr key={index}>
                          <td>{indexOfFirstDocument + index + 1}</td>
                          <td>
                            {file?.name
                              ? file.name
                              : file.file?.split("/").pop() || "-"}
                          </td>
                          <td>
                            {file?.file_owner_info?.first_name}{" "}
                            {file?.file_owner_info?.last_name}
                          </td>
                          <td>
                            {file?.file_type
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
                                href={file?.file}
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
                                onClick={() => handleDeleteClick(file)}
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
                  <div className="d-flex justify-content-center mt-3">
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
          file={selectedDocument}
          case_alias={casealias?.toString()}
          fileAlias={selectedDocument.alias}
        />
      )}
    </Col>
  );
};

export default Documents;
