import Link from "next/link";
import React from "react";
import { TbEye } from "react-icons/tb";
import { Card, CardBody, CardHeader } from "reactstrap";

const RecentActivity: React.FC = () => {
  const activities = [
    {
      title: "Mortgage Completion",
      description: "Smith Family - £320,000 residential mortgage",
      company: "ABC Mortgage Solutions",
      timeAgo: "30 minutes ago",
      icon: "fa-regular fa-circle-check",
      bgColor: "bg-success bg-opacity-10",
    },
    {
      title: "New Application Submitted",
      description: "Johnson Property - £450,000 buy-to-let mortgage",
      company: "Premier Finance Advisors",
      timeAgo: "2 hours ago",
      icon: "fa-regular fa-file-lines",
      bgColor: "bg-primary bg-opacity-10",
    },
    {
      title: "Application Pending",
      description: "Williams Family - £275,000 first-time buyer mortgage",
      company: "Home Secure Financial",
      timeAgo: "5 hours ago",
      icon: "fa-regular fa-clock",
      bgColor: "bg-warning bg-opacity-10",
    },
    {
      title: "Application Pending",
      description: "Williams Family - £275,000 first-time buyer mortgage",
      company: "Home Secure Financial",
      timeAgo: "5 hours ago",
      icon: "fa-regular fa-clock",
      bgColor: "bg-warning bg-opacity-10",
    },
    {
      title: "Application Pending",
      description: "Williams Family - £275,000 first-time buyer mortgage",
      company: "Home Secure Financial",
      timeAgo: "5 hours ago",
      icon: "fa-regular fa-clock",
      bgColor: "bg-warning bg-opacity-10",
    },
    {
      title: "Application Pending",
      description: "Williams Family - £275,000 first-time buyer mortgage",
      company: "Home Secure Financial",
      timeAgo: "5 hours ago",
      icon: "fa-regular fa-clock",
      bgColor: "bg-warning bg-opacity-10",
    },
    {
      title: "Application Pending",
      description: "Williams Family - £275,000 first-time buyer mortgage",
      company: "Home Secure Financial",
      timeAgo: "5 hours ago",
      icon: "fa-regular fa-clock",
      bgColor: "bg-warning bg-opacity-10",
    },
  ];

  return (
    <Card className="shadow-sm mb-3">
      <CardHeader className="bg-white border-bottom d-flex justify-content-between">
        <h4 className="mb-0 fw-bold">Recent Activity</h4>
        <Link href="#" className="text_decoration_hover">
          <TbEye size={18} className="me-1" />
          View all activity
        </Link>
      </CardHeader>
      <CardBody className="p-0 overflow-auto" style={{ maxHeight: "350px" }}>
        {activities.map((activity, index) => (
          <div key={index} className="p-3 border-bottom">
            <div className="d-flex gap-3">
              <div
                className={`${activity.bgColor} rounded-circle p-2 d-flex align-items-center justify-content-center`}
                style={{ width: "32px", height: "32px" }}
              >
                <i className={activity.icon}></i>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-1">{activity.title}</h6>
                <p className="mb-1 text-muted small">{activity.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 text-muted small">{activity.company}</p>
                  <span className="text-muted small">{activity.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default RecentActivity;
