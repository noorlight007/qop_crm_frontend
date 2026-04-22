import { useSession } from "next-auth/react";
import DarkMode from "./DarkMode/DarkMode";
import NotificationHeader from "./NotificationHeader/NotificationHeader";
import Profile from "./Profile/Profile";

const HeaderRight = () => {
  const { data: session } = useSession();
  return (
    <div className="nav-right">
      <ul className="header-right">
        <DarkMode />
        {session?.user?.role === "APPLICANT" ? null : <NotificationHeader />}
        <Profile />
      </ul>
    </div>
  );
};

export default HeaderRight;
