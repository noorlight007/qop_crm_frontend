import LoadingSpinner from "@/app/loading";
import { useGetApplicantCaseQuery } from "@/Redux/Reducers/Applicant/ApplicantCaseApi";
import { ApplicantCaseTypes } from "@/Types/Applicant/ApplicantCaseTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import Link from "next/link";
import React from "react";
import { Card, CardBody, CardHeader, Table } from "reactstrap";

const MyApplications: React.FC = () => {
  const { data: applicantCase, isLoading } =
    useGetApplicantCaseQuery(undefined);

  if (isLoading)
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );

  return (
    <Card className="mb-4 p-0">
      <CardHeader className="bg-primary text-white d-flex align-items-center">
        <i className="fa fa-file-text me-2"></i>
        <h5 className="mb-0">My Applications</h5>
      </CardHeader>
      <CardBody className="p-0">
        <Table responsive hover borderedd className="mb-0 text-center">
          <thead>
            <tr>
              <th>Case #</th>
              <th>Create Date</th>
              <th>Case Category</th>
              <th>Stage</th>
              <th>Lead</th>
              <th>Phone Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicantCase?.results?.map((app: ApplicantCaseTypes) => (
              <tr key={app.name}>
                <td>
                  <Link
                    className="text_decoration_hover"
                    href={`/client/cases/${app.alias}`}
                  >
                    {app.name}
                  </Link>
                </td>
                <td>{formatDateAndTime(app.created_at)}</td>
                <td>
                  {app.case_category
                    ? formatChoiceFieldValue(app.case_category)
                    : "-"}
                </td>
                <td>
                  {app.case_stage
                    ? formatChoiceFieldValue(app.case_stage)
                    : "-"}
                </td>
                <td>
                  {app.lead_user.title
                    ? formatChoiceFieldValue(app.lead_user.title) + " "
                    : ""}
                  {app.lead_user.first_name
                    ? formatChoiceFieldValue(app.lead_user.first_name) + " "
                    : ""}
                  {app.lead_user.middle_name
                    ? formatChoiceFieldValue(app.lead_user.middle_name) + " "
                    : ""}
                  {app.lead_user.last_name
                    ? formatChoiceFieldValue(app.lead_user.last_name)
                    : ""}
                </td>
                <td>
                  <span className="text-dark" style={{ cursor: "pointer" }}>
                    {app.lead_user.phone || "-"}
                  </span>
                </td>
                <td>
                  <Link href={`client/${app.alias}`}>
                    <button className="btn btn-primary btn-sm">Continue</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="px-2 pb-2">
          <p className="text-success">
            Showing 1 to {applicantCase?.results?.length || 0} of{" "}
            {applicantCase?.results?.length || 0} cases
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default MyApplications;
