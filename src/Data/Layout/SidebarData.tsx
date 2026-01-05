import { MenuItem } from "@/Types/LayoutTypes";

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
        path: "/dashboard/network/director",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        children: [
          {
            path: "/dashboard/network/director/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/dashboard/network/director/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/dashboard/network/director/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/dashboard/network/director/clients",
            title: "Clients",
            type: "link",
          },
          {
            path: "/dashboard/network/director/reports",
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
            path: "/dashboard/network/director/organisations",
            title: "Organisations",
            type: "link",
          },
          {
            path: "/dashboard/network/director/advisers",
            title: "Registered Advisers",
            type: "link",
            children: [],
          },
          {
            path: "/dashboard/network/director/advisers-status",
            title: "Advisers Status",
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
      //       path: "/dashboard/network/director/usermanagement",
      //       title: "User Management",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/network/director/systemreports",
      //       title: "System Reports",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/network/director/auditlog",
      //       title: "Audit Log",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/network/director/securitypolicy",
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
    title: "Adviser",
    lanClass: "lan-1",
    type: "group",
    Items: [
      {
        title: "Dashboard",
        icon: "Chart",
        type: "link",
        lanClass: "lan-3",
        path: "/dashboard/network/adviser",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        children: [
          {
            path: "/dashboard/network/adviser/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/dashboard/network/adviser/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/dashboard/network/adviser/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/dashboard/network/adviser/reports",
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
      //       path: "/dashboard/network/adviser/marketinghub",
      //       title: "Marketing Hub",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/network/adviser/tasksandreminders",
      //       title: "Tasks & Reminders",
      //       type: "link",
      //     },
      //   ],
      // },
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
        path: "/dashboard/organisation/director",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        children: [
          {
            path: "/dashboard/organisation/director/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/dashboard/organisation/director/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/dashboard/organisation/director/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/dashboard/organisation/director/clients",
            title: "Clients",
            type: "link",
          },
          {
            path: "/dashboard/organisation/director/reports",
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
            path: "/dashboard/organisation/director/advisers",
            title: "Advisers",
            type: "link",
          },
          {
            path: "/dashboard/organisation/director/admins",
            title: "Admins",
            type: "link",
          },
          {
            path: "/dashboard/organisation/director/introducers",
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
      //       path: "/dashboard/organisation/director/usersandroles",
      //       title: "Users & Roles",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/organisation/director/workflowsandintegrations",
      //       title: "Workflows & Integrations",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/organisation/director/systemreportsandlogs",
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
        path: "/dashboard/organisation/adviser",
        type: "link",
      },
      {
        title: "Cases",
        icon: "Paper",
        type: "sub",
        lanClass: "lan-3",
        children: [
          {
            path: "/dashboard/organisation/adviser/leads",
            title: "Leads",
            type: "link",
          },
          {
            path: "/dashboard/organisation/adviser/cases",
            title: "All Cases",
            type: "link",
          },
          {
            path: "/dashboard/organisation/adviser/activecases",
            title: "Active Cases",
            type: "link",
          },
          {
            path: "/dashboard/organisation/adviser/reports",
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
      //       path: "/dashboard/organisation/adviser/marketinghub",
      //       title: "Marketing Hub",
      //       type: "link",
      //     },
      //     {
      //       path: "/dashboard/organisation/adviser/tasksandreminders",
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
        path: "/dashboard/organisation/admin",
      },
      {
        title: "Cases",
        icon: "Activity",
        type: "link",
        lanClass: "lan-3",
        path: "/dashboard/organisation/admin/cases",
      },
      {
        title: "Reports",
        icon: "Folder",
        type: "link",
        lanClass: "lan-3",
        path: "/dashboard/organisation/admin/reports",
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
        path: "/dashboard/organisation/admin/adviserclient",
      },
      // {
      //   title: "Document Management",
      //   icon: "Paper",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/dashboard/organisation/admin/documentmanagement",
      // },
      // {
      //   title: "Chat & Communication",
      //   icon: "Chat",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/dashboard/organisation/admin/chatandcommunication",
      // },
      // {
      //   title: "Comments",
      //   icon: "Message",
      //   type: "link",
      //   lanClass: "lan-3",
      //   path: "/dashboard/organisation/admin/comments",
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
  NetworkDirectorMenu,
  OrganisationAdminMenu,
  OrganisationAdviserMenu,
  OrganisationDirectorMenu,
};

export const getMenuByRole = (role?: string): MenuItem[] => {
  switch (role) {
    case "NETWORK_DIRECTOR":
      return NetworkDirectorMenu;
    case "NETWORK_COMPLIANCE_ASSISTANT":
      return NetworkDirectorMenu;
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
