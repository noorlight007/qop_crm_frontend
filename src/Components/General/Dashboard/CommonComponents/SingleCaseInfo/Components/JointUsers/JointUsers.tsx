import { JointUserProps } from "@/Types/CommonComponents/SingleCaseInfo/JointUser/JointUserTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Spinner,
  Table,
} from "reactstrap";
import AddJointUserModal from "./Modals/AddJointUserModal";
import JointUserDeleteModal from "./Modals/JointUserDeleteModal";
import UpdateJointUserModal from "./Modals/UpdateJointUserModal";
import ViewJointUserModal from "./Modals/ViewJointUserModal";

const JointUsers: React.FC<JointUserProps> = ({ jointUserInfo, isLoading }) => {
  const { data: session } = useSession();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const toggleViewModal = () => setIsViewModalOpen(!isViewModalOpen);
  const toggleAddModal = () => setAddModalOpen(!addModalOpen);
  const toggleUpdateModal = () => setUpdateModalOpen(!updateModalOpen);
  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);

  const handleUpdateClick = (user: any) => {
    setSelectedUser(user);
    toggleUpdateModal();
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    toggleDeleteModal();
  };
  return (
    <Col sm="12" className="box-col-12">
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <h3>Joint Applicants</h3>
          <Button
            color="primary"
            onClick={toggleAddModal}
            className="d-flex justify-content-center align-items-center gap-1"
          >
            <TbCirclePlus size={18} className="me-1" />
            <span>Add Joint Applicant</span>
          </Button>
        </CardHeader>
        <CardBody className="pt-0 recent-order">
          <div className="table-responsive theme-scrollbar">
            <Table hover responsive>
              <thead>
                <tr className="text-center">
                  <th>#</th>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Relationship</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      <Spinner color="primary" />
                    </td>
                  </tr>
                ) : jointUserInfo?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      <p>No joint users available</p>
                    </td>
                  </tr>
                ) : (
                  jointUserInfo?.map((userInfo: any, index: number) => (
                    <tr key={index} className="text-center">
                      <td>{index + 1}</td>
                      <td>
                        <span
                          className="text_decoration_hover"
                          onClick={() => {
                            setSelectedUser(userInfo);
                            toggleViewModal();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {userInfo.joint_user_details?.title
                            ? formatChoiceFieldValue(
                                userInfo.joint_user_details?.title
                              )
                            : ""}{" "}
                          {userInfo.joint_user_details?.first_name}{" "}
                          {userInfo.joint_user_details?.middle_name}{" "}
                          {userInfo.joint_user_details?.last_name}
                        </span>
                      </td>
                      <td className="f-w-600">
                        <p>{userInfo.joint_user_details?.email}</p>
                      </td>
                      <td className="font-primary f-w-600">
                        <a
                          href={`tel:${userInfo.joint_user_details?.phone}`}
                          className="text-dark text_decoration_hover"
                        >
                          {userInfo.joint_user_details?.phone}
                        </a>
                      </td>
                      <td>{userInfo?.relationship || "-"}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2 align-items-center">
                          <Button
                            color="success"
                            size="sm"
                            title="Update User"
                            onClick={() => handleUpdateClick(userInfo)}
                          >
                            <i className="icon-pencil-alt"></i>
                          </Button>
                          {(session?.user?.user_type ===
                            "ORGANISATION_DIRECTOR" ||
                            session?.user?.user_type ===
                              "NETWORK_DIRECTOR") && (
                            <Button
                              color="danger"
                              size="sm"
                              title="Delete User"
                              onClick={() => handleDeleteClick(userInfo)}
                            >
                              <i className="icon-trash"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
        <AddJointUserModal isOpen={addModalOpen} toggle={toggleAddModal} />
        <ViewJointUserModal
          isOpen={isViewModalOpen}
          toggle={toggleViewModal}
          selectedUser={selectedUser}
        />
        <UpdateJointUserModal
          isOpen={updateModalOpen}
          toggle={toggleUpdateModal}
          user={selectedUser}
        />
        <JointUserDeleteModal
          isOpen={deleteModalOpen}
          toggle={toggleDeleteModal}
          selectedUser={selectedUser}
        />
      </Card>
    </Col>
  );
};

export default JointUsers;
