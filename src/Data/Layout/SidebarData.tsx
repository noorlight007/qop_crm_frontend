import { MenuItem } from "@/Types/LayoutTypes";
import {
  FaBriefcase,
  FaCalculator,
  FaNetworkWired,
  FaUsers,
} from "react-icons/fa";

//Admin
const AdminMenu: MenuItem[] = [
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
        path: "/admin/dashboard",
      },
      {
        title: "Networks",
        icon: <FaNetworkWired />,
        type: "link",
        lanClass: "lan-3",
        path: "/admin/networks",
      },
      {
        title: "Organisations",
        icon: <FaBriefcase />,
        type: "link",
        lanClass: "lan-3",
        path: "/admin/organisations",
      },
      {
        title: "Users",
        icon: <FaUsers />,
        lanClass: "lan-3",
        children: [
          {
            title: "Directors",
            type: "link",
            path: "/admin/users/directors",
          },
          {
            title: "Compliances",
            type: "link",
            path: "/admin/users/compliances",
          },
          {
            title: "Advisers",
            type: "link",
            path: "/admin/users/advisers",
          },
          {
            title: "Admins",
            type: "link",
            path: "/admin/users/admins",
          },
          {
            title: "Introducers",
            type: "link",
            path: "/admin/users/introducers",
          },
          {
            title: "Leads",
            type: "link",
            path: "/admin/users/leads",
          },
          {
            title: "Clients",
            type: "link",
            path: "/admin/users/clients",
          },
        ],
      },
      {
        title: "Support Ticket",
        icon: "Ticket",
        type: "link",
        lanClass: "lan-3",
        path: "/admin/support-ticket",
      },
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
            path: "/network/director/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/network/director/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/network/director/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/network/director/clients",
            title: "Clients",
            type: "link",
          },
          {
            path: "/network/director/reports",
            title: "Reports",
            type: "link",
          },
        ],
      },
      {
        title: "Users",
        icon: <FaUsers />,
        type: "sub",
        children: [
          {
            path: "/network/director/organisations",
            title: "Organisations",
            type: "link",
          },
          {
            path: "/network/director/compliances",
            title: "Compliances",
            type: "link",
            children: [],
          },
          {
            path: "/network/director/advisers",
            title: "Advisers",
            type: "link",
            children: [],
          },
          {
            path: "/network/director/advisers-status",
            title: "Advisers Status",
            type: "link",
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
          {
            title: "Overpayment",
            type: "link",
            path: "/network/director/calculators/overpayment-calculator",
          },
          {
            title: "Stamp Duty",
            type: "link",
            path: "/network/director/calculators/stamp-duty-calculator",
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
      // {
      //   title: "Reports & Tasks",
      //   type: "sub",
      //   icon: "Edit",
      //   lanClass: "lan-4",
      //   children: [
      //     {
      //       path: "/network/director/usermanagement",
      //       title: "User Management",
      //       type: "link",
      //     },
      //     {
      //       path: "/network/director/systemreports",
      //       title: "System Reports",
      //       type: "link",
      //     },
      //     {
      //       path: "/network/director/auditlog",
      //       title: "Audit Log",
      //       type: "link",
      //     },
      //     {
      //       path: "/network/director/securitypolicy",
      //       title: "Security Policy",
      //       type: "link",
      //     },
      //   ],
      // },
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
            path: "/network/director/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/network/director/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/network/director/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/network/director/clients",
            title: "Clients",
            type: "link",
          },
          {
            path: "/network/director/reports",
            title: "Reports",
            type: "link",
          },
        ],
      },
      {
        title: "Users",
        icon: <FaUsers />,
        type: "sub",
        children: [
          {
            path: "/network/director/organisations",
            title: "Organisations",
            type: "link",
          },
          {
            path: "/network/director/advisers",
            title: "Registered Advisers",
            type: "link",
          },
          {
            path: "/network/director/advisers-status",
            title: "Advisers Status",
            type: "link",
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
          {
            title: "Overpayment",
            type: "link",
            path: "/network/director/calculators/overpayment-calculator",
          },
          {
            title: "Stamp Duty",
            type: "link",
            path: "/network/director/calculators/stamp-duty-calculator",
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
            path: "/network/adviser/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/network/adviser/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/network/adviser/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            title: "Clients",
            type: "link",
            path: "/network/adviser/clients",
          },
          {
            path: "/network/adviser/reports",
            title: "Reports",
            type: "link",
          },
        ],
      },
      {
        title: "Users",
        icon: <FaUsers />,
        type: "sub",
        children: [
          {
            title: "Organisations",
            path: "/network/adviser/organisations",
            type: "link",
          },
          // {
          //   path: "/network/adviser/marketinghub",
          //   title: "Marketing Hub",
          //   type: "link",
          // },
          // {
          //   path: "/network/adviser/tasksandreminders",
          //   title: "Tasks & Reminders",
          //   type: "link",
          // },
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
            path: "/network/adviser/calculators/monthly-payment-calculator",
          },
          {
            title: "Remortgage",
            type: "link",
            path: "/network/adviser/calculators/remortgage-calculator",
          },
          {
            title: "Overpayment",
            type: "link",
            path: "/network/adviser/calculators/overpayment-calculator",
          },
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
            path: "/organisation/director/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/organisation/director/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/organisation/director/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/organisation/director/clients",
            title: "Clients",
            type: "link",
          },
          {
            path: "/organisation/director/reports",
            title: "Reports",
            type: "link",
          },
        ],
      },
      {
        title: "Users",
        icon: <FaUsers />,
        type: "sub",
        children: [
          {
            path: "/organisation/director/advisers",
            title: "Advisers",
            type: "link",
          },
          {
            path: "/organisation/director/admins",
            title: "Admins",
            type: "link",
          },
          {
            path: "/organisation/director/introducers",
            title: "Introducers",
            type: "link",
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
          {
            title: "Overpayment",
            type: "link",
            path: "/organisation/director/calculators/overpayment-calculator",
          },
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
      // {
      //   title: "Reports & Tasks",
      //   type: "sub",
      //   icon: "Edit",
      //   lanClass: "lan-4",
      //   children: [
      //     {
      //       path: "/organisation/director/usersandroles",
      //       title: "Users & Roles",
      //       type: "link",
      //     },
      //     {
      //       path: "/organisation/director/workflowsandintegrations",
      //       title: "Workflows & Integrations",
      //       type: "link",
      //     },
      //     {
      //       path: "/organisation/director/systemreportsandlogs",
      //       title: "System Reports & Logs",
      //       type: "link",
      //     },
      //   ],
      // },
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
        path: "/organisation/adviser/dashboard",
        type: "link",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            path: "/organisation/adviser/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/organisation/adviser/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/organisation/adviser/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            title: "Clients",
            type: "link",
            path: "/organisation/adviser/clients",
          },
          {
            path: "/organisation/adviser/reports",
            title: "Reports",
            type: "link",
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
          {
            title: "Overpayment",
            type: "link",
            path: "/organisation/adviser/calculators/overpayment-calculator",
          },
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
      //       path: "/organisation/adviser/marketinghub",
      //       title: "Marketing Hub",
      //       type: "link",
      //     },
      //     {
      //       path: "/organisation/adviser/tasksandreminders",
      //       title: "Tasks & Reminders",
      //       type: "link",
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
            title: "Leads",
            type: "link",
            path: "/organisation/admin/leads",
          },
          {
            title: "All Cases",
            type: "link",
            path: "/organisation/admin/cases",
          },
          {
            title: "Clients",
            type: "link",
            path: "/organisation/admin/clients",
          },
          {
            title: "Reports",
            type: "link",
            path: "/organisation/admin/reports",
          },
        ],
      },
      // {
      //   title: "Tasks & Reminders",
      //   icon: "Edit",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/orgstaff/tasksandreminders",
      // },
      // {
      //   title: "Adviser Clients",
      //   icon: "Profile",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/organisation/admin/adviserclient",
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
            path: "/organisation/admin/calculators/monthly-payment-calculator",
          },
          {
            title: "Remortgage",
            type: "link",
            path: "/organisation/admin/calculators/remortgage-calculator",
          },
          {
            title: "Overpayment",
            type: "link",
            path: "/organisation/admin/calculators/overpayment-calculator",
          },
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
      // {
      //   title: "Document Management",
      //   icon: "Paper",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/organisation/admin/documentmanagement",
      // },
      // {
      //   title: "Chat & Communication",
      //   icon: "Chat",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/organisation/admin/chatandcommunication",
      // },
      // {
      //   title: "Comments",
      //   icon: "Message",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/organisation/admin/comments",
      // },
    ],
  },
];

// CLIENT Menu
const ClientMenu: MenuItem[] = [
  {
    title: "Client",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard Home",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/client/dashboard",
      },
    ],
  },
];

// Export all menus
export {
  AdminMenu,
  ClientMenu,
  NetworkAdviserMenu,
  NetworkDirectorMenu,
  OrganisationAdminMenu,
  OrganisationAdviserMenu,
  OrganisationDirectorMenu,
};

export const getMenuByRole = (role?: string): MenuItem[] => {
  switch (role) {
    case "ADMIN":
      return AdminMenu;
    case "NETWORK_DIRECTOR":
      return NetworkDirectorMenu;
    case "NETWORK_COMPLIANCE":
      return NetworkComplianceMenu;
    case "NETWORK_ADVISER":
      return NetworkAdviserMenu;
    case "ORGANISATION_DIRECTOR":
      return OrganisationDirectorMenu;
    case "ORGANISATION_ADVISER":
      return OrganisationAdviserMenu;
    case "ORGANISATION_ADMIN":
      return OrganisationAdminMenu;
    case "CLIENT":
      return ClientMenu;
    default:
      return [];
  }
};

export const MenuList = (role?: string) => getMenuByRole(role);
