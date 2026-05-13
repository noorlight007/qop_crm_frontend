"use client";
import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";

import {
  useGetNetworkMembersQuery,
  useUpdateNetworkMemberMutation,
} from "@/Redux/Reducers/SuperAdmin/Networks/NetworkMembersApi";
import {
  NetworkMemberProps,
  NetworkMemberType,
} from "@/Types/SuperAdmin/Networks/NetworkMemberTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { User } from "react-feather";
import { FaChevronDown, FaInfoCircle, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
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
import DeleteNetworkMemberModal from "./Modals/DeleteNetworkMemberModal";
import UpdateNetworkMemberModal from "./Modals/UpdateNetworkMemberModal";
import ViewNetworkMemberModal from "./Modals/ViewNetworkMemberModal";

const searchHelpText =
  "🔍 You can search using Name, Email Address or Phone Number.";

const statusOptions = [
  { value: true, label: "Approved" },
  { value: false, label: "Pending" },
];

const statusColorMap = {
  true: "success",
  false: "danger",
};

const NetworkMembers: React.FC<NetworkMemberProps> = ({ role }) => {
  const params = useParams();
  const { data: session } = useSession();
  const networkslug = (params?.NetworkSlug ||
    (params as any)?.networkslug) as string;

  const [items, setItems] = useState<NetworkMemberType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stablePageSize, setStablePageSize] = useState<number>(0);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<
    Partial<NetworkMemberType>
  >({});

  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {},
  );

  const toggleDropdown = (userAlias: string | undefined) => {
    if (!userAlias) return;

    setDropdownOpen((prev) => ({
      ...prev,
      [userAlias]: !prev[userAlias],
    }));
  };

  const [updateNetworkMembers, { isLoading: isUpdateStatusLoading }] =
    useUpdateNetworkMemberMutation();

  const title = useMemo(() => {
    switch (role) {
      case "COMPLIANCE":
        return "Compliances";
      case "ADVISER":
        return "Advisers";
      default:
        return "Users";
    }
  }, [role]);

  const emptyMessage = useMemo(() => {
    switch (role) {
      case "COMPLIANCE":
        return "No compliances available.";
      case "ADVISER":
        return "No advisers available.";
      default:
        return "No users available.";
    }
  }, [role]);

  const selectItems = useMemo(() => {
    return (data: any): NetworkMemberType[] => {
      if (!data) return [];
      if (Array.isArray(data)) return data as NetworkMemberType[];

      if (role === "COMPLIANCE")
        return (data.results || data.compliances || []) as NetworkMemberType[];
      if (role === "ADVISER")
        return (data.results || data.advisers || []) as NetworkMemberType[];

      return (data.results || data.users || []) as NetworkMemberType[];
    };
  }, [role]);

  const colSpan = role === "COMPLIANCE" ? 10 : 8;

  const openModalForMember = (member: NetworkMemberType) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  const toggleModal = () => {
    setIsViewModalOpen((prev) => !prev);
  };

  const toggleUpdateModal = () => {
    setIsUpdateModalOpen((prev) => !prev);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen((prev) => !prev);
  };

  const openUpdateModal = (member: NetworkMemberType) => {
    setSelectedMember(member);
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (member: NetworkMemberType) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = async (
    userAlias: string | undefined,
    newStatus: boolean,
  ) => {
    if (!userAlias) return;

    try {
      await updateNetworkMembers({
        network_slug: networkslug,
        member_alias: userAlias,
        payload: { is_active: newStatus },
      }).unwrap();

      toast.success("Status updated successfully!");

      // Refetch the members list to update the UI
      refetch();

      setDropdownOpen((prev) => ({
        ...prev,
        [userAlias]: false,
      }));
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const {
    data: memberData,
    isLoading,
    refetch,
  } = useGetNetworkMembersQuery(
    {
      network_slug: networkslug,
      params: {
        page: currentPage,
        search: searchQuery,
        role,
      },
    },
    { skip: !networkslug },
  );

  useEffect(() => {
    if (!memberData) return;
    setItems(selectItems(memberData) || []);
  }, [memberData, selectItems]);

  const totalCount = useMemo(() => {
    if (
      memberData &&
      !Array.isArray(memberData) &&
      typeof (memberData as any).count === "number"
    ) {
      return (memberData as any).count as number;
    }
    return items.length;
  }, [memberData, items.length]);

  useEffect(() => {
    const currentLength = items.length;
    const isLastPage =
      !Array.isArray(memberData) &&
      memberData &&
      Object.prototype.hasOwnProperty.call(memberData, "next")
        ? (memberData as any).next === null
        : false;

    if (currentLength > 0) {
      if (stablePageSize === 0) setStablePageSize(currentLength);
      else if (!isLastPage && currentLength !== stablePageSize)
        setStablePageSize(currentLength);
    }
  }, [memberData, items.length, stablePageSize]);

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
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joining Date</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item: NetworkMemberType, index) => (
                    <tr key={index} className="text-center">
                      <td>
                        <div className="d-flex justify-content-start align-items-center gap-1 text-truncate">
                          <span
                            className="border rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                            style={{ width: 40, height: 40 }}
                          >
                            {item?.profile_image ? (
                              <Image
                                src={item.profile_image as string}
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
                            onClick={() => openModalForMember(item)}
                            style={{ cursor: "pointer" }}
                          >
                            {item?.name ?? "-"}
                          </span>
                        </div>
                      </td>

                      <td>
                        {item?.email ? (
                          item.email
                        ) : (
                          <small className="text-muted">Not Available</small>
                        )}
                      </td>

                      <td>
                        {item?.phone ? (
                          item.phone
                        ) : (
                          <small className="text-muted">Not Available</small>
                        )}
                      </td>

                      <td>
                        {item?.joining_date ? (
                          item.joining_date
                        ) : (
                          <small className="text-muted">Not Available</small>
                        )}
                      </td>

                      <td>
                        {item?.created_by == null ? (
                          <small className="text-muted">Not Available</small>
                        ) : (
                          <>
                            <p className="m-0">
                              {item.created_by?.name || "Unknown User"}
                            </p>
                            <p
                              className="m-0 opacity-75"
                              style={{ fontSize: "9px" }}
                            >
                              (
                              {item.created_by?.email
                                ? formatChoiceFieldValue(item.created_by?.email)
                                : "Not Found"}
                              )
                            </p>
                          </>
                        )}
                      </td>

                      <td>{formatDateAndTime(item?.created_at)}</td>

                      <td>
                        {session?.user?.role === "SUPER_ADMIN" ? (
                          <div style={{ position: "relative" }}>
                            <Dropdown
                              isOpen={
                                item?.alias
                                  ? dropdownOpen[item.alias] || false
                                  : false
                              }
                              toggle={() => toggleDropdown(item?.alias)}
                            >
                              <DropdownToggle
                                tag="span"
                                style={{ cursor: "pointer" }}
                                caret={false}
                              >
                                <Badge
                                  color={
                                    (item as any)?.is_active
                                      ? "success"
                                      : "danger"
                                  }
                                  className="d-flex justify-content-center align-items-center gap-1"
                                  style={{ cursor: "pointer" }}
                                >
                                  <span>
                                    {(item as any)?.is_active
                                      ? "Approved"
                                      : "Pending"}
                                  </span>
                                  <FaChevronDown size={10} />
                                </Badge>
                              </DropdownToggle>

                              <DropdownMenu
                                className="shadow-sm py-2"
                                style={{
                                  minWidth: "140px",
                                  zIndex: 1050,
                                }}
                                container="body"
                              >
                                {statusOptions.map((option) => {
                                  const isActive =
                                    (item as any)?.is_active === option.value;
                                  const colorClass =
                                    statusColorMap[
                                      option.value.toString() as
                                        | "true"
                                        | "false"
                                    ];

                                  return (
                                    <DropdownItem
                                      key={option.value.toString()}
                                      onClick={() =>
                                        handleStatusChange(
                                          item?.alias,
                                          option.value,
                                        )
                                      }
                                      className="d-flex align-items-center gap-3 px-3 py-2"
                                      active={isActive}
                                      disabled={isUpdateStatusLoading}
                                      style={{
                                        backgroundColor: isActive
                                          ? "rgba(0,0,0,0.05)"
                                          : "transparent",
                                      }}
                                    >
                                      <span
                                        className={`rounded-circle bg-${colorClass}`}
                                        style={{ width: "8px", height: "8px" }}
                                      />
                                      <span
                                        className={isActive ? "fw-bold" : ""}
                                      >
                                        {option.label}
                                      </span>
                                      {isActive && (
                                        <span className="ms-auto">✓</span>
                                      )}
                                    </DropdownItem>
                                  );
                                })}
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        ) : (
                          <Badge
                            color={
                              (item as any)?.is_active ? "success" : "danger"
                            }
                            className="d-flex justify-content-center align-items-center gap-1"
                          >
                            <span>
                              {(item as any)?.is_active
                                ? "Approved"
                                : "Pending"}
                            </span>
                          </Badge>
                        )}
                      </td>

                      <td>
                        <div className="d-flex justify-content-center gap-2 align-items-center">
                          <Button
                            color="primary"
                            size="sm"
                            title="Update User"
                            onClick={() => openUpdateModal(item)}
                          >
                            <i className="icon-pencil-alt"></i>
                          </Button>
                          {session?.user?.role === "SUPER_ADMIN" && (
                            <Button
                              color="danger"
                              size="sm"
                              title="Delete User"
                              onClick={() => openDeleteModal(item)}
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
                    <td colSpan={colSpan} className="text-center">
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

      <ViewNetworkMemberModal
        isOpen={isViewModalOpen}
        toggle={toggleModal}
        role={role}
        selectedMember={selectedMember}
      />

      <UpdateNetworkMemberModal
        isOpen={isUpdateModalOpen}
        toggle={toggleUpdateModal}
        networkslug={networkslug}
        role={role}
        selectedMember={selectedMember}
      />

      <DeleteNetworkMemberModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        networkslug={networkslug}
        role={role}
        selectedMember={selectedMember}
      />
    </>
  );
};

export default NetworkMembers;
