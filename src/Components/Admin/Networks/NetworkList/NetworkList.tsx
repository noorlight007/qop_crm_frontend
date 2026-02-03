import {
  useGetNetworkListQuery,
  useUpdateNetworkMutation,
} from "@/Redux/Reducers/Admin/Networks/NetworksApi";
import { Network } from "@/Types/Admin/Networks/NetworkType";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
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
  PopoverBody,
  Row,
  Spinner,
  UncontrolledPopover,
} from "reactstrap";
import AddNetworkModal from "./Modals/AddNetworkModal";
import DeleteNetworkModal from "./Modals/DeleteNetworkModal";
import UpdateNetworkModal from "./Modals/UpdateNetworkModal";

const NetworkList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddNetworkModalOpen, setIsAddNetworkModalOpen] = useState(false);
  const [isEditNetworkModalOpen, setIsEditNetworkModalOpen] = useState(false);
  const [networkToEdit, setNetworkToEdit] = useState<Network | null>(null);
  const [isDeleteNetworkModalOpen, setIsDeleteNetworkModalOpen] =
    useState(false);
  const [networkSlugToDelete, setNetworkSlugToDelete] = useState<string | null>(
    null,
  );

  // LOGIC FIX: Track which specific network is being updated
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);

  const { data: getNetworkList, isLoading } = useGetNetworkListQuery({});
  console.log("Network List Data:", getNetworkList);
  const [updateNetwork, { isLoading: updateNetworkLoading }] =
    useUpdateNetworkMutation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleAddNetworkModal = () =>
    setIsAddNetworkModalOpen(!isAddNetworkModalOpen);
  const toggleEditNetworkModal = (network: Network | null = null) => {
    setNetworkToEdit(network);
    setIsEditNetworkModalOpen(!isEditNetworkModalOpen);
  };

  // Called by UpdateNetworkModal when user submits changes
  const handleEditNetworkSave = async (network_slug: string, payload: any) => {
    try {
      await updateNetwork({ network_slug, payload }).unwrap();
      toast.success("Network updated");
      setIsEditNetworkModalOpen(false);
      setNetworkToEdit(null);
    } catch (err: any) {
      const msg = err?.data?.detail || err?.message || "Update failed";
      toast.error(msg);
      throw err; // rethrow so modal can display field errors if needed
    }
  };
  const toggleDeleteNetworkModal = () =>
    setIsDeleteNetworkModalOpen(!isDeleteNetworkModalOpen);

  const openAddNetworkModal = () => toggleAddNetworkModal();
  const openDeleteNetworkModal = (network_slug: string) => {
    setNetworkSlugToDelete(network_slug);
    toggleDeleteNetworkModal();
  };

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

      toast.success("Profile image updated");
    } catch (err: any) {
      const msg = err?.data?.detail || err?.message || "Upload failed";
      toast.error(msg);
    } finally {
      setUploadingSlug(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
                      placeholder="Search Organisation... "
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                        🔍 You can search using Organisation Name.
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
              <Col xs="12" md="6" lg="4" className="mb-4" key={network.slug}>
                <Card className="h-100 shadow-sm border-0">
                  <Link
                    href={`/admin/networks/${network.slug}`}
                    title="Website"
                    className="text-muted position-absolute top-0 end-0 p-3"
                  >
                    <i
                      style={{ fontSize: "10px" }}
                      className="fa-solid fa-up-right-from-square"
                    ></i>
                  </Link>
                  <CardBody className="p-3">
                    <div className="d-flex gap-3">
                      <div className="flex-shrink-0 position-relative">
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
                            style={{ width: "160px", height: "80px" }}
                          >
                            <Link className="text_decoration_hover" href={`/admin/networks/${network.slug}`}>
                            <h3 className="text-white fw-bold mb-0">
                              {network.name.charAt(0).toUpperCase()}
                            </h3>
                            </Link>
                            
                          </div>
                        )}

                        <button
                          title="Change organisation logo"
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

                      <div className="flex-grow-1">
                        <h5 className="fw-bold text-dark mb-1">
                          {network.name}
                        </h5>
                        <p className="text-muted small mb-2">
                          <FaGlobe className="me-1" />
                          {network.subdomain}
                        </p>
                        <div className="mb-1">
                          <small className="text-muted d-flex align-items-center">
                            <FaEnvelope className="me-2 text-primary" />
                            <span className="text-truncate">
                              {network.email}
                            </span>
                          </small>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-flex align-items-center">
                            <FaPhone className="me-2 text-primary" />
                            {network.primary_mobile}
                          </small>
                        </div>
                      </div>
                    </div>

                    <hr className="my-3" />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        Created {formatDateAndTime(network.created_at)}
                      </small>
                    </div>

                    {/* <Row className="g-2">
                      <Col xs="6">
                        <Button
                          color="primary"
                          outline
                          size="sm"
                          block
                          className="fw-semibold"
                          onClick={() => toggleEditNetworkModal(network)}
                        >
                          Edit
                        </Button>
                      </Col>
                      <Col xs="6">
                        <Button
                          color="secondary"
                          outline
                          size="sm"
                          block
                          className="fw-semibold"
                          onClick={() => openDeleteNetworkModal(network.slug)}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row> */}
                  </CardBody>
                </Card>
              </Col>
            ))
          )}
        </Row>

        <AddNetworkModal
          isOpen={isAddNetworkModalOpen}
          toggle={toggleAddNetworkModal}
        />

        <UpdateNetworkModal
          isOpen={isEditNetworkModalOpen}
          toggle={toggleEditNetworkModal}
          network={networkToEdit}
          onSave={handleEditNetworkSave}
        />
        <DeleteNetworkModal
          isOpen={isDeleteNetworkModalOpen}
          toggle={toggleDeleteNetworkModal}
          network_slug={networkSlugToDelete}
        />
      </Container>
    </div>
  );
};

export default NetworkList;
