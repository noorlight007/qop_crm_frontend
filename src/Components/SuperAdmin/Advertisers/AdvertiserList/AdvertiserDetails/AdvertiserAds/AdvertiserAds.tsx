import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import {
  AdvertiserAdsData,
  AdvertiserAdsProps,
} from "@/Types/SuperAdmin/Advertisers/AdvertisersTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useEffect, useState } from "react";
import { Edit, PlusCircle, Trash } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";
import AddNewAdModal from "../Modals/AddNewAdModal";
import DeleteAdModal from "../Modals/DeleteAdModal";
import EditAdModal from "../Modals/EditAdModal";

const AdvertiserAds: React.FC<AdvertiserAdsProps> = ({
  advertiserAdsData,
  advertiserAdsLoading,
  advertiserAlias,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenAlt, setFullscreenAlt] = useState<string>("");
  const [isAddAdModalOpen, setIsAddAdModalOpen] = useState(false);
  const [isEditAdModalOpen, setIsEditAdModalOpen] = useState(false);
  const [isDeleteAdModalOpen, setIsDeleteAdModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdvertiserAdsData | null>(null);

  const advertiserAdsDataResults = Array.isArray(advertiserAdsData)
    ? advertiserAdsData
    : (advertiserAdsData?.results ?? []);

  useEffect(() => {
    if (!fullscreenImage) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreenImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenImage]);

  const openFullscreenImage = (src: string, alt: string) => {
    setFullscreenImage(src);
    setFullscreenAlt(alt);
  };

  const toggleAddAdModal = () => setIsAddAdModalOpen((prev) => !prev);
  const toggleEditAdModal = () => setIsEditAdModalOpen((prev) => !prev);
  const toggleDeleteAdModal = () => setIsDeleteAdModalOpen((prev) => !prev);
  const openEditAdModal = (ad: AdvertiserAdsData) => {
    setSelectedAd(ad);
    setIsEditAdModalOpen(true);
  };
  const openDeleteAdModal = (ad: AdvertiserAdsData) => {
    setSelectedAd(ad);
    setIsDeleteAdModalOpen(true);
  };

  const totalCount =
    !Array.isArray(advertiserAdsData) && advertiserAdsData?.count
      ? advertiserAdsData.count
      : advertiserAdsDataResults.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  useEffect(() => {
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    }
    if (currentPage < 1) {
      onPageChange(1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const isPaginationDisabled = advertiserAdsLoading || totalPages <= 1;

  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h3>Ads</h3>
          <Button color="primary" onClick={toggleAddAdModal}>
            <PlusCircle size={18} className="me-1" />
            Add New Ad
          </Button>
        </CardHeader>
        <CardBody>
          <Table responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Image</th>
                <th>Redirect URL</th>
                <th>Placement</th>
                <th>Active</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>Priority</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {advertiserAdsLoading ? (
                <tr>
                  <td colSpan={11} className="text-center">
                    <LoadingGrow />
                  </td>
                </tr>
              ) : advertiserAdsDataResults.length > 0 ? (
                advertiserAdsDataResults.map((ad: AdvertiserAdsData) => (
                  <tr key={ad.alias}>
                    <td>{ad.title}</td>
                    <td>
                      {ad.image && (
                        <img
                          src={ad.image}
                          alt={ad.title}
                          width="100"
                          height="50"
                          style={{ cursor: "zoom-in" }}
                          onClick={() =>
                            openFullscreenImage(ad.image, ad.title || "Ad")
                          }
                        />
                      )}
                    </td>
                    <td className="text-truncate">
                      <a
                        className="text_decoration_hover"
                        href={ad.redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {ad.redirect_url.length > 25
                          ? `${ad.redirect_url.slice(0, 25)}...`
                          : ad.redirect_url}
                      </a>
                    </td>
                    <td className="text-truncate">
                      {formatChoiceFieldValue(ad.placement)}
                    </td>
                    <td>{ad.is_active ? "Yes" : "No"}</td>
                    <td>{formatDateAndTime(ad.start_date)}</td>
                    <td>{formatDateAndTime(ad.end_date)}</td>
                    <td>{ad.impressions}</td>
                    <td>{ad.clicks}</td>
                    <td>{ad.priority}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => openEditAdModal(ad)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => openDeleteAdModal(ad)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center">
                    No ads found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <Row className="mt-3 align-items-center">
            <Col sm={6}>
              <div className="text-muted">
                Showing {advertiserAdsDataResults.length} entries
                {totalCount ? ` of ${totalCount}` : ""}
              </div>
            </Col>
            <Col sm={6} className="text-end">
              {!isPaginationDisabled
                ? (() => {
                    const leadsPerPage = 5;
                    return (
                      <Pagination className="d-flex justify-content-end p-2">
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink
                            first
                            onClick={() => onPageChange(1)}
                          />
                        </PaginationItem>
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink
                            previous
                            onClick={() =>
                              onPageChange(Math.max(1, currentPage - 1))
                            }
                          />
                        </PaginationItem>

                        {totalPages <= leadsPerPage ? (
                          Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                          ).map((pageNumber) => (
                            <PaginationItem
                              key={pageNumber}
                              active={pageNumber === currentPage}
                            >
                              <PaginationLink
                                onClick={() => onPageChange(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          ))
                        ) : (
                          <>
                            <PaginationItem active={currentPage === 1}>
                              <PaginationLink onClick={() => onPageChange(1)}>
                                1
                              </PaginationLink>
                            </PaginationItem>

                            {currentPage > 3 && (
                              <PaginationItem disabled>
                                <PaginationLink>...</PaginationLink>
                              </PaginationItem>
                            )}

                            {Array.from(
                              { length: 3 },
                              (_, i) => currentPage - 1 + i,
                            )
                              .filter(
                                (pageNumber) =>
                                  pageNumber > 1 && pageNumber < totalPages,
                              )
                              .map((pageNumber) => (
                                <PaginationItem
                                  key={pageNumber}
                                  active={pageNumber === currentPage}
                                >
                                  <PaginationLink
                                    onClick={() => onPageChange(pageNumber)}
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
                              <PaginationLink
                                onClick={() => onPageChange(totalPages)}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem disabled={currentPage === totalPages}>
                          <PaginationLink
                            next
                            onClick={() =>
                              onPageChange(
                                Math.min(totalPages, currentPage + 1),
                              )
                            }
                          />
                        </PaginationItem>
                        <PaginationItem disabled={currentPage === totalPages}>
                          <PaginationLink
                            last
                            onClick={() => onPageChange(totalPages)}
                          />
                        </PaginationItem>
                      </Pagination>
                    );
                  })()
                : null}
            </Col>
          </Row>
        </CardBody>
      </Card>

      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1050,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            style={{
              position: "absolute",
              top: 16,
              right: 20,
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 32,
              lineHeight: 1,
              cursor: "pointer",
              zIndex: 1060,
            }}
            aria-label="Close"
          >
            &times;
          </button>
          <img
            src={fullscreenImage}
            alt={fullscreenAlt || "Full size preview"}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      )}

      <AddNewAdModal
        isOpen={isAddAdModalOpen}
        toggleModal={toggleAddAdModal}
        advertiserAlias={advertiserAlias}
      />
      <EditAdModal
        isOpen={isEditAdModalOpen}
        toggleModal={toggleEditAdModal}
        advertiserAlias={advertiserAlias}
        adData={selectedAd}
      />
      <DeleteAdModal
        isOpen={isDeleteAdModalOpen}
        toggleModal={toggleDeleteAdModal}
        advertiserAlias={advertiserAlias}
        adData={selectedAd}
      />
    </>
  );
};

export default AdvertiserAds;
