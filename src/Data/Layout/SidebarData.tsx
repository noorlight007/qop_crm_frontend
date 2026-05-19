import { MenuItem } from "@/Types/LayoutTypes";
import { BiSolidMegaphone } from "react-icons/bi";
import {
  FaBriefcase,
  FaCalculator,
  FaHistory,
  FaNetworkWired,
  FaUsers,
} from "react-icons/fa";
import { TbReport } from "react-icons/tb";

//SuperAdminMenu
const SuperAdminMenu: MenuItem[] = [
  {
    title: "Super Admin",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/super-admin/dashboard",
      },
      {
        title: "Networks",
        icon: <FaNetworkWired />,
        type: "link",
        lanClass: "lan-3",
        path: "/super-admin/networks",
      },
      {
        title: "Organisations",
        icon: <FaBriefcase />,
        type: "link",
        lanClass: "lan-3",
        path: "/super-admin/organisations",
      },
      {
        title: "Support Ticket",
        icon: "Ticket",
        type: "link",
        lanClass: "lan-3",
        path: "/super-admin/support-ticket",
      },
      {
        title: "Advertisers",
        icon: <BiSolidMegaphone />,
        type: "link",
        lanClass: "lan-3",
        path: "/super-admin/advertisers",
      },
      // {
      //   title: "Login History",
      //   icon: <FaHistory />,
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/super-admin/login-history",
      // },
    ],
  },
];

//NetworkDirectorMenu
const NetworkDirectorMenu: MenuItem[] = [
  {
    title: "Director",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/network/director/dashboard",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        children: [
          {
            title: "All Cases",
            type: "link",
            path: "/network/director/cases",
          },
          {
            title: "Leads",
            type: "link",
            path: "/network/director/leads",
          },
          {
            title: "Applicants",
            type: "link",
            path: "/network/director/applicants",
          },
          {
            title: "Reports",
            type: "link",
            path: "/network/director/reports",
          },
          {
            title: "Tasks",
            type: "link",
            path: "/network/director/tasks",
          },
        ],
      },
      {
        title: "Organisations",
        icon: <FaBriefcase />,
        type: "link",
        lanClass: "lan-3",
        path: "/network/director/organisations",
      },
      {
        title: "Users",
        icon: <FaUsers />,
        type: "sub",
        children: [
          {
            title: "Compliances",
            type: "link",
            path: "/network/director/compliances",
          },
          {
            title: "Advisers",
            type: "link",
            path: "/network/director/advisers",
          },
        ],
      },
      {
        title: "Calculators",
        icon: <FaCalculator />,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            title: "Monthly Payment",
            type: "link",
            path: "/network/director/calculators/monthly-payment-calculator",
          },
          {
            title: "Remortgage",
            type: "link",
            path: "/network/director/calculators/remortgage-calculator",
          },
          // {
          //   title: "Overpayment",
          //   type: "link",
          //   path: "/network/director/calculators/overpayment-calculator",
          // },
          {
            title: "Stamp Duty",
            type: "link",
            path: "/network/director/calculators/stamp-duty-calculator",
          },
        ],
      },
      {
        title: "Reports",
        icon: <TbReport />,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            title: "Mortgage Report",
            type: "link",
            path: "/network/director/reports/mortgage-report",
          },
        ],
      },
      {
        title: "Support Ticket",
        icon: "Ticket",
        type: "link",
        lanClass: "lan-3",
        path: "/network/director/support-ticket",
      },
      {
        title: "Login History",
        icon: <FaHistory />,
        type: "link",
        lanClass: "lan-3",
        path: "/network/director/login-history",
      },
    ],
  },
];
//NetworkNetworkComplianceMenuMenu
const NetworkComplianceMenu: MenuItem[] = [
  {
    title: "Director",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/network/director/dashboard",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        children: [
          {
            title: "All Cases",
            type: "link",
            path: "/network/director/cases",
          },
          {
            title: "Leads",
            type: "link",
            path: "/network/director/leads",
          },
          {
            title: "Applicants",
            type: "link",
            path: "/network/director/applicants",
          },
          {
            title: "Reports",
            type: "link",
            path: "/network/director/reports",
          },
          {
            title: "Tasks",
            type: "link",
            path: "/network/director/tasks",
          },
        ],
      },
      {
        title: "Organisations",
        icon: <FaBriefcase />,
        type: "link",
        lanClass: "lan-3",
        path: "/network/director/organisations",
      },
      {
        title: "Users",
        icon: <FaUsers />,
        type: "sub",
        children: [
          {
            title: "Advisers",
            type: "link",
            path: "/network/director/advisers",
          },
        ],
      },
      {
        title: "Calculators",
        icon: <FaCalculator />,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            title: "Monthly Payment",
            type: "link",
            path: "/network/director/calculators/monthly-payment-calculator",
          },
          {
            title: "Remortgage",
            type: "link",
            path: "/network/director/calculators/remortgage-calculator",
          },
          // {
          //   title: "Overpayment",
          //   type: "link",
          //   path: "/network/director/calculators/overpayment-calculator",
          // },
          {
            title: "Stamp Duty",
            type: "link",
            path: "/network/director/calculators/stamp-duty-calculator",
          },
        ],
      },
      {
        title: "Reports",
        icon: <TbReport />,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            title: "Mortgage Report",
            type: "link",
            path: "/network/director/reports/mortgage-report",
          },
        ],
      },
      {
        title: "Support Ticket",
        icon: "Ticket",
        type: "link",
        lanClass: "lan-3",
        path: "/network/director/support-ticket",
      },
      {
        title: "Login History",
        icon: <FaHistory />,
        type: "link",
        lanClass: "lan-3",
        path: "/network/director/login-history",
      },
    ],
  },
];

// Network Adviser Menu
const NetworkAdviserMenu: MenuItem[] = [
  {
    title: "Adviser",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/network/adviser/dashboard",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        children: [
          {
            title: "All Cases",
            type: "link",
            path: "/network/adviser/cases",
          },
          {
            title: "Leads",
            type: "link",
            path: "/network/adviser/leads",
          },
          {
            title: "Applicants",
            type: "link",
            path: "/network/adviser/applicants",
          },
          {
            title: "Reports",
            type: "link",
            path: "/network/adviser/reports",
          },
          {
            title: "Tasks",
            type: "link",
            path: "/network/adviser/tasks",
          },
        ],
      },
      {
        title: "Organisations",
        icon: <FaBriefcase />,
        type: "link",
        lanClass: "lan-3",
        path: "/network/adviser/organisations",
      },
      // {
      //   title: "Marketing Hub",
      //   icon: <BiBuilding />,
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/network/adviser/marketinghub",
      // },
      {
        title: "Calculators",
        icon: <FaCalculator />,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            title: "Monthly Payment",
            type: "link",
            path: "/network/adviser/calculators/monthly-payment-calculator",
          },
          {
            title: "Remortgage",
            type: "link",
            path: "/network/adviser/calculators/remortgage-calculator",
          },
          // {
          //   title: "Overpayment",
          //   type: "link",
          //   path: "/network/adviser/calculators/overpayment-calculator",
          // },
          {
            title: "Stamp Duty",
            type: "link",
            path: "/network/adviser/calculators/stamp-duty-calculator",
          },
        ],
      },
      {
        title: "Support Ticket",
        icon: "Ticket",
        type: "link",
        lanClass: "lan-3",
        path: "/network/adviser/support-ticket",
      },
    ],
  },
];

// OrganisationDirectorMenu
const OrganisationDirectorMenu: MenuItem[] = [
  {
    title: "Director",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/organisation/director/dashboard",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        children: [
          {
            title: "All Cases",
            type: "link",
            path: "/organisation/director/cases",
          },
          {
            title: "Leads",
            type: "link",
            path: "/organisation/director/leads",
          },
          {
            title: "Applicants",
            type: "link",
            path: "/organisation/director/applicants",
          },
          {
            title: "Reports",
            type: "link",
            path: "/organisation/director/reports",
          },
          {
            title: "Tasks",
            type: "link",
            path: "/organisation/director/tasks",
          },
        ],
      },
      {
        title: "Users",
        icon: <FaUsers />,
        type: "sub",
        children: [
          {
            title: "Advisers",
            type: "link",
            path: "/organisation/director/advisers",
          },
          {
            title: "Admins",
            type: "link",
            path: "/organisation/director/admins",
          },
          {
            title: "Introducers",
            type: "link",
            path: "/organisation/director/introducers",
          },
        ],
      },
      {
        title: "Calculators",
        icon: <FaCalculator />,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            title: "Monthly Payment",
            type: "link",
            path: "/organisation/director/calculators/monthly-payment-calculator",
          },
          {
            title: "Remortgage",
            type: "link",
            path: "/organisation/director/calculators/remortgage-calculator",
          },
          // {
          //   title: "Overpayment",
          //   type: "link",
          //   path: "/organisation/director/calculators/overpayment-calculator",
          // },
          {
            title: "Stamp Duty",
            type: "link",
            path: "/organisation/director/calculators/stamp-duty-calculator",
          },
        ],
      },
      {
        title: "Support Ticket",
        icon: "Ticket",
        type: "link",
        lanClass: "lan-3",
        path: "/organisation/director/support-ticket",
      },
      {
        title: "Login History",
        icon: <FaHistory />,
        type: "link",
        lanClass: "lan-3",
        path: "/organisation/director/login-history",
      },
    ],
  },
];

//Or Organisation adviser Menu
const OrganisationAdviserMenu: MenuItem[] = [
  {
    title: "Adviser",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        lanClass: "lan-3",
        type: "link",
        path: "/organisation/adviser/dashboard",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            title: "All Cases",
            type: "link",
            path: "/organisation/adviser/cases",
          },
          {
            title: "Leads",
            type: "link",
            path: "/organisation/adviser/leads",
          },
          {
            title: "Applicants",
            type: "link",
            path: "/organisation/adviser/applicants",
          },
          {
            title: "Reports",
            type: "link",
            path: "/organisation/adviser/reports",
          },
          {
            title: "Tasks",
            type: "link",
            path: "/organisation/adviser/tasks",
          },
        ],
      },
      {
        title: "Calculators",
        icon: <FaCalculator />,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            title: "Monthly Payment",
            type: "link",
            path: "/organisation/adviser/calculators/monthly-payment-calculator",
          },
          {
            title: "Remortgage",
            type: "link",
            path: "/organisation/adviser/calculators/remortgage-calculator",
          },
          // {
          //   title: "Overpayment",
          //   type: "link",
          //   path: "/organisation/adviser/calculators/overpayment-calculator",
          // },
          {
            title: "Stamp Duty",
            type: "link",
            path: "/organisation/adviser/calculators/stamp-duty-calculator",
          },
        ],
      },
      {
        title: "Support Ticket",
        icon: "Ticket",
        type: "link",
        lanClass: "lan-3",
        path: "/organisation/adviser/support-ticket",
      },

      // {
      //   title: "Users",
      //   type: "sub",
      //   icon: "Profile",
      //   lanClass: "lan-4",
      //   children: [
      //     {
      //       title: "Marketing Hub",
      //       type: "link",
      //       path: "/organisation/adviser/marketinghub",
      //     },
      //   ],
      // },
    ],
  },
];
//Or Organisation Admin Menu
const OrganisationAdminMenu: MenuItem[] = [
  {
    title: "Admin",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/organisation/admin/dashboard",
      },
      {
        title: "Cases",
        icon: "Activity",
        type: "link",
        lanClass: "lan-3",

        children: [
          {
            title: "All Cases",
            type: "link",
            path: "/organisation/admin/cases",
          },
          {
            title: "Leads",
            type: "link",
            path: "/organisation/admin/leads",
          },
          {
            title: "Applicants",
            type: "link",
            path: "/organisation/admin/applicants",
          },
          {
            title: "Reports",
            type: "link",
            path: "/organisation/admin/reports",
          },
          {
            title: "Tasks",
            type: "link",
            path: "/organisation/admin/tasks",
          },
        ],
      },
      {
        title: "Calculators",
        icon: <FaCalculator />,
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            title: "Monthly Payment",
            type: "link",
            path: "/organisation/admin/calculators/monthly-payment-calculator",
          },
          {
            title: "Remortgage",
            type: "link",
            path: "/organisation/admin/calculators/remortgage-calculator",
          },
          // {
          //   title: "Overpayment",
          //   type: "link",
          //   path: "/organisation/admin/calculators/overpayment-calculator",
          // },
          {
            title: "Stamp Duty",
            type: "link",
            path: "/organisation/admin/calculators/stamp-duty-calculator",
          },
        ],
      },
      {
        title: "Support Ticket",
        icon: "Ticket",
        type: "link",
        lanClass: "lan-3",
        path: "/organisation/admin/support-ticket",
      },
    ],
  },
];

// APPLICANT Menu
const ApplicantMenu: MenuItem[] = [
  {
    title: "Applicant",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard Home",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/applicant/dashboard",
      },
    ],
  },
];

// Export all menus
export {
  ApplicantMenu,
  NetworkAdviserMenu,
  NetworkDirectorMenu,
  OrganisationAdminMenu,
  OrganisationAdviserMenu,
  OrganisationDirectorMenu,
  SuperAdminMenu,
};

export const getMenuByRole = (
  role?: string,
  isNetwork?: boolean,
): MenuItem[] => {
  if (!role) return [];

  if (role === "APPLICANT") return ApplicantMenu;

  if (role === "SUPER_ADMIN") {
    return SuperAdminMenu;
  }

  if (role === "DIRECTOR") {
    return isNetwork ? NetworkDirectorMenu : OrganisationDirectorMenu;
  }

  if (role === "ADVISER") {
    return isNetwork ? NetworkAdviserMenu : OrganisationAdviserMenu;
  }

  if (role === "ADMIN") {
    return OrganisationAdminMenu;
  }

  if (role === "COMPLIANCE" && isNetwork) {
    return NetworkComplianceMenu;
  }

  return [];
};

export const MenuList = (role?: string, isNetwork?: boolean) =>
  getMenuByRole(role, isNetwork);
