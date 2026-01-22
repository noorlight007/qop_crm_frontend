"use client";
import { useGetOrgUserListQuery } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/OrgUserListApi";
import { OrgAdminInfo } from "@/Types/Network/Director/Users/Organisations/OrgAdminTypes";
import LoadingSpinner from "@/app/loading";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "react-feather";
import { FaSearch } from "react-icons/fa";
import {
  Badge,
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import ViewOrgAdminModals from "./Modals/ViewOrgAdvminModals";

const OrgAdmins: React.FC = () => {
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;
  const [admins, setAdmins] = useState<OrgAdminInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stablePageSize, setStablePageSize] = useState<number>(0);
  const [isViewOrgAdminModalOpen, setIsViewOrgAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Partial<OrgAdminInfo>>({});

  const toggleViewOrgAdminModal = (admin?: Partial<OrgAdminInfo>) => {
    if (admin) {
      setSelectedAdmin(admin);
    }
    setIsViewOrgAdminModalOpen(!isViewOrgAdminModalOpen);
  };

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: adminData, isLoading } = useGetOrgUserListQuery(
    {
      organisationslug,
      params: {
        page: currentPage,
        search: searchQuery,
        role: "ORGANISATION_ADMIN",
      },
    },
    { skip: !organisationslug },
  );

  useEffect(() => {
    if (adminData) {
      const adminsArray: OrgAdminInfo[] = Array.isArray(adminData)
        ? adminData
        : adminData.results || adminData.admins;
      setAdmins(adminsArray || []);
    }
  }, [adminData]);

  // Server-side pagination: use API count and a stable page size
  const totalCount =
    adminData && !Array.isArray(adminData) ? adminData.count : admins.length;

  useEffect(() => {
    const currentLength = Array.isArray(adminData)
      ? adminData.length
      : adminData?.results?.length || 0;
    const isLastPage =
      !Array.isArray(adminData) && adminData && adminData.next === null;
    if (currentLength > 0) {
      if (stablePageSize === 0) setStablePageSize(currentLength);
      else if (!isLastPage && currentLength !== stablePageSize)
        setStablePageSize(currentLength);
    }
  }, [adminData, stablePageSize]);

  const effectivePageSize = stablePageSize || admins.length || 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / effectivePageSize));
  const currentAdmins = admins;

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card>
      <CardBody>
        <Row className="flex justify-content-between py-4">
          <Col md="3">
            <h2>Admins</h2>
          </Col>
          <Col md={3} xs="12">
            <InputGroup className="position-relative">
              <FaSearch
                className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                style={{ zIndex: 10, pointerEvents: "none" }}
              />
              <Input
                type="text"
                placeholder="Search... "
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ padding: "10px 10px 10px 25px" }}
              />
            </InputGroup>
          </Col>
          <Col md="3" xs="12" />
        </Row>
        <Row>
          <Table hover responsive>
            <thead className="thead-light">
              <tr className="text-center">
                <th className="text-start">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joining Date</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner color="primary" />
                    </div>
                  </td>
                </tr>
              ) : currentAdmins.length > 0 ? (
                currentAdmins.map((admin) => (
                  <tr key={admin.alias} className="text-center">
                    <td className="d-flex justify-content-start align-items-center gap-1 text-truncate">
                      <span
                        className="border rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                        style={{ width: 40, height: 40 }}
                      >
                        {admin?.profile_image ? (
                          <Image
                            src={admin?.profile_image}
                            alt="Profile"
                            width={35}
                            height={35}
                            className="rounded-circle"
                          />
                        ) : (
                          <User size={30} className="text-primary" />
                        )}
                      </span>
                      <span
                        className="text_decoration_hover"
                        onClick={() => toggleViewOrgAdminModal(admin)}
                        style={{ cursor: "pointer" }}
                      >
                        {admin?.name}
                      </span>
                    </td>
                    <td>{admin?.email || "-"}</td>
                    <td>
                      {admin?.phone ? (
                        <a
                          href={`tel:${admin?.phone}`}
                          className="text-black text_decoration_hover"
                        >
                          {admin?.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{admin?.joining_date ? admin.joining_date : "-"}</td>
                    <td>
                      <p className="m-0">
                        {admin.created_by
                          ? `${
                              admin.created_by?.title
                                ? formatChoiceFieldValue(
                                    admin.created_by.title,
                                  ).trim() + " "
                                : ""
                            }${admin.created_by.first_name || ""} ${
                              admin.created_by.middle_name || ""
                            } ${admin.created_by.last_name || ""}`.trim()
                          : "Not found"}
                      </p>
                      <p className="m-0 opacity-75" style={{ fontSize: "9px" }}>
                        (
                        {admin.created_by?.user_type
                          ? formatChoiceFieldValue(admin.created_by.user_type)
                          : "Not found"}
                        )
                      </p>
                    </td>
                    <td>{formatDateAndTime(admin?.created_at)}</td>
                    <td>
                      {admin?.is_active ? (
                        <Badge color="success">Approved</Badge>
                      ) : (
                        <Badge color="danger">Pending</Badge>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No admins available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Row>
        <Row>
          <div className="d-flex justify-content-between align-items-center p-3">
            <div className="px-2">
              <p className="text-primary">
                Showing{" "}
                {totalCount === 0
                  ? "0"
                  : (currentPage - 1) * effectivePageSize + 1}{" "}
                to{" "}
                {Math.min(
                  (currentPage - 1) * effectivePageSize + effectivePageSize,
                  totalCount,
                )}{" "}
                of {totalCount} Admins
              </p>
            </div>
            {totalPages > 1 && (
              <Pagination className="d-flex">
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink
                    previous
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
                )}

                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink
                    next
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  />
                </PaginationItem>
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink
                    last
                    onClick={() => setCurrentPage(totalPages)}
                  />
                </PaginationItem>
              </Pagination>
            )}
          </div>
        </Row>
      </CardBody>
      {/* Modals */}
      <ViewOrgAdminModals
        isOpen={isViewOrgAdminModalOpen}
        toggle={toggleViewOrgAdminModal}
        selectedAdmin={selectedAdmin}
      />
    </Card>
  );
};

export default OrgAdmins;
