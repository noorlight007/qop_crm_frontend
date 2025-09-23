import { DashboardCommonHeaderType } from "@/Types/DashboardType";
import { CardHeader } from "reactstrap";
import { CommonDropdown } from "./CommonDropdown";
import TabListCommonHeader from "./TabListCommonHeader";

const DashboardCommonHeader: React.FC<DashboardCommonHeaderType> = ({ title, tagClass, dropDownFalse, children, dropdownTitle, tablist }) => {
  return (
    <CardHeader className="card-no-border pb-0">
      <div className="header-top">
        <h3 className={tagClass ? tagClass : ""}>{title}</h3>
        {!dropDownFalse && <CommonDropdown dropdownTitle={dropdownTitle} />}
        {tablist && <TabListCommonHeader />}
        {children}
      </div>
    </CardHeader>
  );
};

export default DashboardCommonHeader;
