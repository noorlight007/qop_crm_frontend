import { Href, ImagePath } from "@/Constant";
import { logOut } from "@/services/auth/logout";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TbSettings } from "react-icons/tb";

const Profile = () => {
  const [show, setShow] = useState(false);
  const { data: session } = useSession();

  const wrapperRef = useRef<HTMLLIElement | null>(null);

  // close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        show &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) setShow(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  const handleLogout = async () => {
    localStorage.setItem("logout-event", Date.now().toString());

    await logOut();
  };

  return (
    <li className="profile-nav custom-dropdown" ref={wrapperRef}>
      <div className="user-wrap">
        <div className="user-img">
          <Image
            width={64}
            height={59}
            src={session?.user?.profile_image || `${ImagePath}/profile.png`}
            alt="user"
          />
        </div>
        <div className="user-content" onClick={() => setShow(!show)}>
          <h6>{session?.user?.name}</h6>
          <p className="mb-0 text-primary">
            <span className="bg-light-primary mt-1 px-2 py-1 rounded-5">
              {formatChoiceFieldValue(session?.user?.user_type) || "User Role"}
            </span>
            <i className="fa-solid fa-chevron-down" />
          </p>
        </div>
        <div
          className={`custom-menu overflow-hidden shadow-lg ${
            show ? "show" : ""
          }`}
        >
          <ul className="profile-body">
            <li className="d-flex">
              <Link href="/user-profile" className="d-flex gap-2">
                <i className="fa-solid fa-user-gear"></i>
                Profile
              </Link>
            </li>
            {session?.user?.user_type === "ADMIN" ||
            session?.user?.user_type === "NETWORK_DIRECTOR" ||
            session?.user?.user_type === "NETWORK_COMPLIANCE" ||
            session?.user?.user_type === "ORGANISATION_DIRECTOR" ? (
              <li className="d-flex gap-2" style={{ cursor: "pointer" }}>
                <Link href="/appearance" className="d-flex gap-2">
                  <TbSettings />
                  Appearance
                </Link>
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
    </li>
  );
};

export default Profile;
