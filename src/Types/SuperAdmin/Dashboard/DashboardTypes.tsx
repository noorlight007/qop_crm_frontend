export type OverviewCard = {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  loadingSpinnerColor:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "light"
    | "dark";
};