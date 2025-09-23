import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";

const WelcomeMessage: React.FC = () => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <h4 className="text-primary">Welcome to QOP!</h4>
      </CardHeader>
      <CardBody>
        <p className="text-muted">
          We are genuinely independent, wholly impartial and we will offer
          straightforward honest advice, given freely and without obligation
        </p>

        <p className="text-muted">
          When your own Bank has failed to offer the support you need then call
          us. We will quickly assess all the available options for you and we
          will do everything possible to find a workable and affordable business
          solution.
        </p>

        <p className="text-muted">
          We offer all our clients a true 'one stop shop' facility our core
          competence is to provide you a fully managed and professional service
          to secure the most competitive funding offer available from the entire
          market. In addition we can, if required, organize any property
          valuations, insurance and legal support necessary to complete the
          transaction. We will package and submit the personal proposal to
          ensure your funding application is positively sanctioned and approved
          with funds being made available in the fastest time possible.
        </p>

        <p className="text-muted">
          Whatever your Funding requirement we offer you a free, impartial and
          totally confidential initial consultation and we will quickly assess
          the funding options available to you. We guarantee there are no
          'up-front' fees to pay and once we have secured your Agreement in
          Principle for the required funding we will allocate a qualified and
          experienced Consultant from our team to provide you a single point of
          contact throughout and to progress your case through to Completion.
        </p>

        <p className="text-muted mb-0">
          To begin please click the button on the right to submit your
          Confidential Fact Find which will allow us to quickly find the most
          appropriate option for you.
        </p>
      </CardBody>
    </Card>
  );
};

export default WelcomeMessage;
