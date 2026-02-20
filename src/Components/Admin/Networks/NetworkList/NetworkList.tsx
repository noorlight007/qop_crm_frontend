import {
  useGetNetworkListQuery,
  useUpdateNetworkMutation,
} from "@/Redux/Reducers/Admin/Networks/NetworksApi";
import { Network } from "@/Types/Admin/Networks/NetworkType";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaCamera,
  FaEnvelope,
  FaGlobe,
  FaInfoCircle,
  FaPhone,
  FaSearch,
} from "react-icons/fa";
import { TbCirclePlus } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  InputGroup,
  Pagination,
  PaginationItem,
  PaginationLink,
  PopoverBody,
  Row,
  Spinner,
  UncontrolledPopover,
} from "reactstrap";
import AddNetworkModal from "./Modals/AddNetworkModal";

type NetworkListProps = {
  maxItems?: number;
};

const NetworkList: React.FC<NetworkListProps> = ({ maxItems }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddNetworkModalOpen, setIsAddNetworkModalOpen] = useState(false);

  // LOGIC FIX: Track which specific network is being updated
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);

  const { data: getNetworkList, isLoading } = useGetNetworkListQuery({
    search: searchQuery,
    page: currentPage,
    page_size: maxItems,
  });
  console.log("Network List Data:", getNetworkList);
  const [updateNetwork, { isLoading: updateNetworkLoading }] =
    useUpdateNetworkMutation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleAddNetworkModal = () =>
    setIsAddNetworkModalOpen(!isAddNetworkModalOpen);

  const openAddNetworkModal = () => toggleAddNetworkModal();

  // LOGIC FIX: Handle the camera click for a specific slug
  const handleProfileImageUpload = (slug: string) => {
    console.log("Uploading image for network slug:", slug);
    setUploadingSlug(slug);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !uploadingSlug) return;
    const file = files[0];

    const maxSizeInMB = 5;
    if (file.size / 1024 / 1024 > maxSizeInMB) {
      toast.error(`Image must be smaller than ${maxSizeInMB} MB`);
      return;
    }

    try {
      const formDataToSend = new FormData();
      // Using the key your backend expects
      formDataToSend.append("network.logo", file);

      // Use the uploadingSlug state we set during the click
      await updateNetwork({
        network_slug: uploadingSlug,
        payload: formDataToSend,
      }).unwrap();

      toast.success("Network logo updated successfully");
    } catch (err: any) {
      const msg = err?.data?.detail || err?.message || "Upload failed";
      toast.error(msg);
    } finally {
      setUploadingSlug(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const itemsPerPage = 12;
  // Ensure we only render up to `itemsPerPage` items even if the API returned more
  const currentNetworks = getNetworkList?.results?.slice(0, itemsPerPage) ?? [];
  const totalCount = (getNetworkList as any)?.count ?? currentNetworks.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div>
      <Container fluid>
        {/* LOGIC FIX: Single hidden input outside the map loop */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileSelected}
        />

        <Row>
          <Col xs="12">
            <Card className="px-4 border-0 shadow-sm mb-0">
              <Row className="flex justify-content-between py-4">
                <Col md="3">
                  <h4 className="mb-0 fw-bold text-dark">Networks</h4>
                </Col>
                <Col md={3} xs="12" className="mt-3 mt-md-0">
                  <InputGroup className="position-relative">
                    <FaSearch
                      className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                      style={{ zIndex: 10, pointerEvents: "none" }}
                    />
                    <Input
                      type="text"
                      placeholder="Search Network... "
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{ padding: "10px 10px 10px 25px" }}
                      className="rounded-end-1"
                    />
                    <FaInfoCircle
                      id="OrgListSearchSuggestion"
                      className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                      style={{ cursor: "pointer", zIndex: 10 }}
                    />
                    <UncontrolledPopover
                      placement="right"
                      target="OrgListSearchSuggestion"
                      trigger="hover"
                    >
                      <PopoverBody className="bg-white rounded text-dark p-3 small">
                        🔍 You can search using Network Name.
                      </PopoverBody>
                    </UncontrolledPopover>
                  </InputGroup>
                </Col>
                <Col
                  md="3"
                  xs="12"
                  className="text-md-end text-center mt-3 mt-md-0"
                >
                  <Button
                    color="primary"
                    className="px-4"
                    onClick={openAddNetworkModal}
                  >
                    <TbCirclePlus size={18} className="me-2" />
                    Add Network
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          {isLoading ? (
            <Col xs="12" className="text-center py-5">
              <Spinner color="primary" className="mb-3">
                Loading...
              </Spinner>
              <p className="mt-3 text-muted">Loading networks...</p>
            </Col>
          ) : getNetworkList?.results?.length === 0 ? (
            <Col xs="12" className="text-center py-5">
              <div className="text-muted">
                <FaSearch size={48} className="mb-3 opacity-50" />
                <h5>No networks found</h5>
                <p>
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "Click 'Add Network' to create your first network"}
                </p>
              </div>
            </Col>
          ) : (
            getNetworkList?.results?.map((network: Network) => (
              <Col xs="12" lg="6" xxl="4" className="mb-4" key={network.slug}>
                <Card className="h-100 shadow-sm border-0" style={{ position: "relative", overflow: "hidden" }}>
                  <Link
                    href={`/admin/networks/${network.slug}`}
                    title="Website"
                    className="text-muted position-absolute top-0 end-0 p-3"
                    style={{ zIndex: 5 }}
                  >
                    <i
                      style={{ fontSize: "10px" }}
                      className="fa-solid fa-up-right-from-square"
                    ></i>
                  </Link>
                  <CardBody className="p-3">
                    <div className="d-flex gap-3 flex-column flex-sm-row">
                      <div className="flex-shrink-0 position-relative d-flex justify-content-center justify-content-sm-start">
                        {network.logo ? (
                          <Image
                            src={network.logo}
                            alt={network.name}
                            width={160}
                            height={80}
                            className="rounded p-1 shadow"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            className="bg-primary bg-gradient text-center rounded d-flex align-items-center justify-content-center"
                            style={{ width: "160px", height: "80px", maxWidth: "100%" }}
                          >
                            <h3 className="text-white fw-bold mb-0">
                              {network.name.charAt(0).toUpperCase()}
                            </h3>
                          </div>
                        )}

                        <button
                          title="Change network logo"
                          className="position-absolute d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm border-0"
                          style={{
                            width: 32,
                            height: 32,
                            right: 0,
                            bottom: 0,
                            cursor: "pointer",
                          }}
                          // LOGIC FIX: Pass the specific network slug
                          onClick={() => handleProfileImageUpload(network.slug)}
                          disabled={
                            updateNetworkLoading &&
                            uploadingSlug === network.slug
                          }
                        >
                          {updateNetworkLoading &&
                          uploadingSlug === network.slug ? (
                            <Spinner size="sm" color="primary" />
                          ) : (
                            <FaCamera size={14} className="text-primary" />
                          )}
                        </button>
                      </div>

                      <div className="flex-grow-1" style={{ minWidth: 0, paddingRight: "25px" }}>
                        <h5 className="fw-bold text-dark mb-1 text-truncate" style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                          <Link
                            className="text_decoration_hover"
                            href={`/admin/networks/${network.slug}`}
                          >
                            {network.name}
                          </Link>
                        </h5>
                        <p className="text-muted small mb-2 text-truncate" style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                          <FaGlobe className="me-2" />
                          {`${"https://"}${network?.subdomain}${process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? ""}`}
                        </p>
                        <div className="mb-1">
                          <small className="text-muted d-flex align-items-center" style={{ minWidth: 0 }}>
                            <FaEnvelope className="me-2 text-primary flex-shrink-0" />
                            <span className="text-truncate" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {network.email}
                            </span>
                          </small>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-flex align-items-center" style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                            <FaPhone className="me-2 text-primary flex-shrink-0" />
                            {network.primary_mobile}
                          </small>
                        </div>
                      </div>
                    </div>

                    <hr className="my-3" />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="text-muted" style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                        <FaCalendarAlt className="me-1" />
                        Created {formatDateAndTime(network.created_at)}
                      </small>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))
          )}
        </Row>

        <Row>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 gap-3">
            <div className="px-2 text-center text-md-start">
              <p className="text-primary mb-0">
                Showing{" "}
                {totalCount === 0 ? "0" : (currentPage - 1) * itemsPerPage + 1}{" "}
                to{" "}
                {currentNetworks.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage +
                    currentNetworks.length}{" "}
                of {totalCount} Networks
              </p>
            </div>
            <Pagination className="d-flex justify-content-end p-2 mb-0 flex-wrap">
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink first onClick={() => setCurrentPage(1)} />
              </PaginationItem>
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink
                  previous
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
              </PaginationItem>

              {totalPages <= 7 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <PaginationItem
                      key={pageNumber}
                      active={pageNumber === currentPage}
                    >
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )
              ) : (
                <>
                  <PaginationItem active={currentPage === 1}>
                    <PaginationLink onClick={() => setCurrentPage(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {currentPage > 3 && (
                    <PaginationItem disabled>
                      <PaginationLink>...</PaginationLink>
                    </PaginationItem>
                  )}

                  {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                    .filter(
                      (pageNumber) => pageNumber > 1 && pageNumber < totalPages,
                    )
                    .map((pageNumber) => (
                      <PaginationItem
                        key={pageNumber}
                        active={pageNumber === currentPage}
                      >
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  {currentPage < totalPages - 2 && (
                    <PaginationItem disabled>
                      <PaginationLink>...</PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem active={currentPage === totalPages}>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  next
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </PaginationItem>
              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  last
                  onClick={() => setCurrentPage(totalPages)}
                />
              </PaginationItem>
            </Pagination>
          </div>
        </Row>

        <AddNetworkModal
          isOpen={isAddNetworkModalOpen}
          toggle={toggleAddNetworkModal}
        />
      </Container>
    </div>
  );
};

export default NetworkList;