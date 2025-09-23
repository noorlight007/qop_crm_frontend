import { Href, ImagePath } from "@/Constant";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddUserModal from "./Modals/AddUserModal";

const Profile = () => {
  const [show, setShow] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  return (
    <li className="profile-nav custom-dropdown">
      <div className="user-wrap">
        <div className="user-img">
          <Image
            width={64}
            height={59}
            // src={session?.user?.profile_image || `${ImagePath}/profile.png`}
            src={
              session?.user?.profile_image
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${session.user.profile_image}`
                : `${ImagePath}/profile.png`
            }
            alt="user"
          />
        </div>
        <div className="user-content" onClick={() => setShow(!show)}>
          <h6>{session?.user?.email}</h6>
          <p className="mb-0 text-primary">
            {session?.user?.name || "User Name"}
            <i className="fa-solid fa-chevron-down" />
          </p>
        </div>
        <div
          className={`custom-menu overflow-hidden shadow-lg ${
            show ? "show" : ""
          }`}
        >
          <ul className="profile-body">
            <li
              className="d-flex gap-2 text-muted opacity-50"
              style={{ cursor: "not-allowed" }}
            >
              <i className="fa-solid fa-user-gear"></i>
              Profile
            </li>
            {session?.user?.user_type === "NETWORK_ADMIN" ||
            session?.user?.user_type === "ORGANIZATION_ADMIN" ? (
              <li
                className="d-flex gap-2"
                style={{ cursor: "pointer" }}
                onClick={handleAddUser}
              >
                <i className="fa-solid fa-circle-user"></i>
                Add user
              </li>
            ) : null}
            <li className="d-flex gap-2" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket text-danger fs-6"></i>
              <Link className="text-danger" href={Href}>
                {"Log out"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Modals */}
      <AddUserModal
        isOpen={showAddUserModal}
        toggle={() => setShowAddUserModal(false)}
      />
    </li>
  );
};

export default Profile;
