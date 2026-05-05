"use client";

import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import ViewOrgUserModal from "@/Components/Common/Organisations/OrganisationDetails/Tabs/Common/Modals/ViewOrgUserModal";
import { useGetOrgUserListQuery } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgUserListApi";
import { OrgAdminInfo } from "@/Types/Common/Organisations/OrgAdminTypes";
import { OrgAdviserInfo } from "@/Types/Common/Organisations/OrgAdviserType";
import { OrgIntroducerInfo } from "@/Types/Common/Organisations/OrgIntroducerTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { User } from "react-feather";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
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
  PopoverBody,
  Row,
  Table,
  UncontrolledPopover,
} from "reactstrap";

type OrgUserRole = "ADMIN" | "INTRODUCER" | "ADVISER";

type OrgUserListColumn = {
  header: string;
  cell: (item: any) => React.ReactNode;
};

export type OrgUserListProps = {
  role: OrgUserRole;
};

const searchHelpText =
  "🔍 You can search using Name, Email Address or Phone Number.";

type OrgUserItem = OrgAdminInfo | OrgIntroducerInfo | OrgAdviserInfo;

const OrgUserList: React.FC<OrgUserListProps> = ({ role }) => {
  const params = useParams();
  const organisationslug = (params?.OrganisationSlug ||
    (params as any)?.organisationslug) as string;

  const [items, setItems] = useState<OrgUserItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stablePageSize, setStablePageSize] = useState<number>(0);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<OrgUserItem>>({});

  const title = useMemo(() => {
    switch (role) {
      case "ADMIN":
        return "Admins";
      case "INTRODUCER":
        return "Introducers";
      case "ADVISER":
        return "Advisers";
      default:
        return "Users";
    }
  }, [role]);

  const emptyMessage = useMemo(() => {
    switch (role) {
      case "ADMIN":
        return "No admins available.";
      case "INTRODUCER":
        return "No introducers available.";
      case "ADVISER":
        return "No advisers available.";
      default:
        return "No users available.";
    }
  }, [role]);

  const selectItems = useMemo(() => {
    return (data: any): OrgUserItem[] => {
      if (!data) return [];
      if (Array.isArray(data)) return data as OrgUserItem[];

      if (role === "ADMIN")
        return (data.results || data.admins || []) as OrgUserItem[];
      if (role === "INTRODUCER")
        return (data.results || data.admins || []) as OrgUserItem[];
      if (role === "ADVISER")
        return (data.results || data.advisers || []) as OrgUserItem[];

      return (data.results || data.users || []) as OrgUserItem[];
    };
  }, [role]);

  const columns = useMemo<OrgUserListColumn[]>(() => {
    const emailCol: OrgUserListColumn = {
      header: "Email",
      cell: (user) =>
        user?.email ? (
          user.email
        ) : (
          <small className="text-muted">Not Available</small>
        ),
    };

    const phoneCol: OrgUserListColumn = {
      header: "Phone",
      cell: (user) =>
        user?.phone ? (
          <span
            className={
              role === "ADVISER"
                ? "text-black text_decoration_hover"
                : "text-black"
            }
          >
            {user.phone}
          </span>
        ) : (
          <small className="text-muted">Not Available</small>
        ),
    };

    const joiningDateCol: OrgUserListColumn = {
      header: "Joining Date",
      cell: (user) =>
        user?.joining_date ? (
          user.joining_date
        ) : (
          <small className="text-muted">Not Available</small>
        ),
    };

    const createdByCol: OrgUserListColumn = {
      header: "Created By",
      cell: (user) =>
        user?.created_by == null ? (
          <small className="text-muted">Not Available</small>
        ) : (
          <>
            <p className="m-0">{user.created_by?.name || "Unknown User"}</p>
            <p className="m-0 opacity-75" style={{ fontSize: "9px" }}>
              (
              {user.created_by?.email
                ? formatChoiceFieldValue(user.created_by?.email)
                : "Not Found"}
              )
            </p>
          </>
        ),
    };

    const createdAtCol: OrgUserListColumn = {
      header: "Created At",
      cell: (user) => formatDateAndTime(user?.created_at),
    };

    const statusCol: OrgUserListColumn = {
      header: "Status",
      cell: (user) =>
        user?.is_active ? (
          <Badge color="success">Approved</Badge>
        ) : (
          <Badge color="danger">Pending</Badge>
        ),
    };

    if (role === "INTRODUCER") {
      return [
        emailCol,
        phoneCol,
        joiningDateCol,
        {
          header: "Company Name",
          cell: (user) =>
            user?.company_name ? (
              user.company_name
            ) : (
              <small className="text-muted">Not Available</small>
            ),
        },
        {
          header: "Company Address",
          cell: (user) =>
            user?.company_address ? (
              user.company_address
            ) : (
              <small className="text-muted">Not Available</small>
            ),
        },
        createdByCol,
        createdAtCol,
        statusCol,
      ];
    }

    return [
      emailCol,
      phoneCol,
      joiningDateCol,
      createdByCol,
      createdAtCol,
      statusCol,
    ];
  }, [role]);

  const openModalForUser = (user: OrgUserItem) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const toggleModal = () => {
    setIsViewModalOpen((prev) => !prev);
  };

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading } = useGetOrgUserListQuery(
    {
      organisationslug,
      params: {
        page: currentPage,
        search: searchQuery,
        role,
      },
    },
    { skip: !organisationslug },
  );

  useEffect(() => {
    if (!data) return;
    setItems(selectItems(data) || []);
  }, [data, selectItems]);

  const totalCount = useMemo(() => {
    if (
      data &&
      !Array.isArray(data) &&
      typeof (data as any).count === "number"
    ) {
      return (data as any).count as number;
    }
    return items.length;
  }, [data, items.length]);

  useEffect(() => {
    const currentLength = items.length;
    const isLastPage =
      !Array.isArray(data) &&
      data &&
      Object.prototype.hasOwnProperty.call(data, "next")
        ? (data as any).next === null
        : false;

    if (currentLength > 0) {
      if (stablePageSize === 0) setStablePageSize(currentLength);
      else if (!isLastPage && currentLength !== stablePageSize)
        setStablePageSize(currentLength);
    }
  }, [data, items.length, stablePageSize]);

  const effectivePageSize = stablePageSize || items.length || 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / effectivePageSize));

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const rowKeyFn = (item: any, index: number) =>
    item?.alias ?? item?.id ?? index;

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingGrow />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardBody>
          <Row className="flex justify-content-between py-4">
            <Col md="3">
              <h2>{title}</h2>
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
                  style={{ padding: "10px 27px 10px 25px" }}
                  className="rounded-end-1"
                />
                <FaInfoCircle
                  id={`orgUserSearchInfo-${role}`}
                  className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                  style={{ cursor: "pointer", zIndex: 10 }}
                />

                <UncontrolledPopover
                  placement="right"
                  target={`orgUserSearchInfo-${role}`}
                  trigger="hover"
                >
                  <PopoverBody className="bg-white rounded text-dark p-3 small">
                    {searchHelpText}
                  </PopoverBody>
                </UncontrolledPopover>
              </InputGroup>
            </Col>
            <Col md="3" xs="12" />
          </Row>

          <Row>
            <Table hover responsive>
              <thead className="thead-light">
                <tr className="text-center">
                  <th className="text-start">Name</th>
                  {columns.map((c) => (
                    <th key={c.header}>{c.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={rowKeyFn(item, index)} className="text-center">
                      <td>
                        <div className="d-flex justify-content-start align-items-center gap-1 text-truncate">
                          <span
                            className="border rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                            style={{ width: 40, height: 40 }}
                          >
                            {(item as any)?.profile_image ? (
                              <Image
                                src={(item as any).profile_image as string}
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
                            onClick={() => openModalForUser(item)}
                            style={{ cursor: "pointer" }}
                          >
                            {(item as any)?.name ?? "-"}
                          </span>
                        </div>
                      </td>
                      {columns.map((c) => (
                        <td key={c.header}>{c.cell(item)}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={1 + columns.length} className="text-center">
                      {emptyMessage}
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
                  of {totalCount} {title}
                </p>
              </div>

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
            </div>
          </Row>
        </CardBody>
      </Card>

      <ViewOrgUserModal
        isOpen={isViewModalOpen}
        toggle={toggleModal}
        role={role}
        selectedUser={selectedUser}
      />
    </>
  );
};

export default OrgUserList;
