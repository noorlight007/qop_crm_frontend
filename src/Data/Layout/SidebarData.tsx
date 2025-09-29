import { MenuItem } from "@/Types/LayoutTypes";

//NetworkOwnerMenu
const NetworkOwnerMenu: MenuItem[] = [
  {
    title: "Network Owner",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/dashboard/network",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        children: [
          {
            path: "/dashboard/network/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/dashboard/network/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/dashboard/network/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/dashboard/network/clients",
            title: "Clients",
            type: "link",
          },
          {
            path: "/dashboard/network/reports",
            title: "Reports",
            type: "link",
          },
        ],
      },
      {
        title: "Users",
        icon: "Profile",
        type: "sub",
        children: [
          {
            path: "/dashboard/network/organisations",
            title: "Organisations",
            type: "link",
          },
          {
            path: "/dashboard/network/advisers",
            title: "Registered Advisers",
            type: "link",
          },
          {
            path: "/dashboard/network/introducers",
            title: "Introducers",
            type: "link",
          },
        ],
      },
      // {
      //   title: "Reports & Tasks",
      //   type: "sub",
      //   icon: "Edit",
      //   lanClass: "lan-4",
      //   children: [
      //     {
      //       path: "/dashboard/network/usermanagement",
      //       title: "User Management",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/network/systemreports",
      //       title: "System Reports",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/network/auditlog",
      //       title: "Audit Log",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/network/securitypolicy",
      //       title: "Security Policy",
      //       type: "link",
      //     },
      //   ],
      // },
    ],
  },
];

// Network Adviser Menu
const NetworkAdviserMenu: MenuItem[] = [
  {
    title: "Network Adviser",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/dashboard/netadviser",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        children: [
          {
            path: "/dashboard/netadviser/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/dashboard/netadviser/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/dashboard/netadviser/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/dashboard/netadviser/reports",
            title: "Reports",
            type: "link",
          },
        ],
      },
      // {
      //   title: "Users",
      //   icon: "Profile",
      //   type: "sub",
      //   children: [
      //     {
      //       path: "/dashboard/netadviser/marketinghub",
      //       title: "Marketing Hub",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/netadviser/tasksandreminders",
      //       title: "Tasks & Reminders",
      //       type: "link",
      //     },
      //   ],
      // },
    ],
  },
];

// OrganisationOwnerMenu
const OrganisationOwnerMenu: MenuItem[] = [
  {
    title: "Organisation Owner",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/dashboard/organisation",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        children: [
          {
            path: "/dashboard/organisation/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/dashboard/organisation/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/dashboard/organisation/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/dashboard/organisation/clients",
            title: "Clients",
            type: "link",
          },
          {
            path: "/dashboard/organisation/reports",
            title: "Reports",
            type: "link",
          },
        ],
      },
      {
        title: "Users",
        icon: "Profile",
        type: "sub",
        children: [
          {
            path: "/dashboard/organisation/advisers",
            title: "Advisers",
            type: "link",
          },
          {
            path: "/dashboard/organisation/introducers",
            title: "Introducers",
            type: "link",
          },
          {
            path: "/dashboard/organisation/supportstaff",
            title: "Support Staff",
            type: "link",
          },
        ],
      },
      // {
      //   title: "Reports & Tasks",
      //   type: "sub",
      //   icon: "Edit",
      //   lanClass: "lan-4",
      //   children: [
      //     {
      //       path: "/dashboard/organisation/usersandroles",
      //       title: "Users & Roles",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/organisation/workflowsandintegrations",
      //       title: "Workflows & Integrations",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/organisation/systemreportsandlogs",
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
    title: "Organisation Adviser",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        lanClass: "lan-3",
        path: "/dashboard/orgadviser",
        type: "link",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            path: "/dashboard/orgadviser/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/dashboard/orgadviser/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/dashboard/orgadviser/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/dashboard/orgadviser/reports",
            title: "Reports",
            type: "link",
          },
        ],
      },
      // {
      //   title: "Users",
      //   type: "sub",
      //   icon: "Profile",
      //   lanClass: "lan-4",
      //   children: [
      //     {
      //       path: "/dashboard/orgadviser/marketinghub",
      //       title: "Marketing Hub",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/orgadviser/tasksandreminders",
      //       title: "Tasks & Reminders",
      //       type: "link",
      //     },
      //   ],
      // },
    ],
  },
];
//Or Organisation staff Menu
const OrganisationStaffMenu: MenuItem[] = [
  {
    title: "Org. Admin & Support Staff",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/dashboard/orgstaff",
      },
      {
        title: "Case Updates",
        icon: "Activity",
        type: "link",
        lanClass: "lan-3",
        path: "/dashboard/orgstaff/caseupdates",
      },
      {
        title: "Reports",
        icon: "Folder",
        type: "link",
        lanClass: "lan-3",
        path: "/dashboard/orgstaff/reports",
      },
      // {
      //   title: "Tasks & Reminders",
      //   icon: "Edit",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/dashboard/orgstaff/tasksandreminders",
      // },
      {
        title: "Adviser Clients",
        icon: "Profile",
        type: "link",
        lanClass: "lan-3",
        path: "/dashboard/orgstaff/adviserclient",
      },
      // {
      //   title: "Document Management",
      //   icon: "Paper",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/dashboard/orgstaff/documentmanagement",
      // },
      // {
      //   title: "Chat & Communication",
      //   icon: "Chat",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/dashboard/orgstaff/chatandcommunication",
      // },
      // {
      //   title: "Comments",
      //   icon: "Message",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/dashboard/orgstaff/comments",
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
        path: "/dashboard/client",
      },
    ],
  },
];

// Export all menus
export {
  ClientMenu,
  NetworkAdviserMenu,
  NetworkOwnerMenu,
  OrganisationAdviserMenu,
  OrganisationOwnerMenu,
  OrganisationStaffMenu,
};

export const getMenuByRole = (role?: string): MenuItem[] => {
  switch (role) {
    case "NETWORK_ADMIN":
      return NetworkOwnerMenu;
    case "ORGANIZATION_ADMIN":
      return OrganisationOwnerMenu;
    case "NETWORK_ADVISER":
      return NetworkAdviserMenu;
    case "ORGANIZATION_ADVISER":
      return OrganisationAdviserMenu;
    case "ORGANIZATION_SUPPORT":
      return OrganisationStaffMenu;
    case "CLIENT":
      return ClientMenu;
    default:
      return [];
  }
};

export const MenuList = (role?: string) => getMenuByRole(role);
