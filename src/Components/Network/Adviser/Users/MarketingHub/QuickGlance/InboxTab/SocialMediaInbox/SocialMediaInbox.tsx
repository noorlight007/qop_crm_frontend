import getCurrencySign from "@/utils/currency";
import { BiSend } from "react-icons/bi";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { TbMessage2, TbTag, TbUser } from "react-icons/tb";
import { Badge, Button, Card, CardBody, Col, Row } from "reactstrap";

const SocialMediaInbox: React.FC = () => {
  const conversations = [
    {
      id: 1,
      name: "Emma Thompson",
      message:
        "Hi, I saw your post about first-time buyer mortgages. Can you help me?",
      time: "2 min ago",
      badge: "Lead",
      badgeColor: "success",
      unread: true,
      social: "instagram",
      initial: "E",
    },
    {
      id: 2,
      name: "Michael Chen",
      message: "Thank you for the quick response! When can we schedule a call?",
      time: "15 min ago",
      badge: "Hot Lead",
      badgeColor: "danger",
      unread: true,
      social: "facebook",
      initial: "M",
    },
    {
      id: 3,
      name: "Sarah Williams",
      message:
        "I'm looking to remortgage my property. What rates do you have available?",
      time: "1 hour ago",
      badge: "Prospect",
      badgeColor: "primary",
      unread: false,
      social: "linkedin",
      initial: "S",
    },
    {
      id: 4,
      name: "David Brown",
      message: "Great content! Do you work with buy-to-let investors?",
      time: "3 hours ago",
      badge: "Inquiry",
      badgeColor: "secondary",
      unread: false,
      social: "instagram",
      initial: "D",
    },
  ];

  const conversationDetail = {
    user: {
      name: "Emma Thompson",
      social: "instagram",
      initial: "ET",
    },
    messages: [
      {
        from: "user",
        text: "Hi, I saw your post about first-time buyer mortgages. Can you help me?",
        time: "2:30 PM",
      },
      {
        from: "agent",
        text: "Hello Emma! Absolutely, I'd be happy to help you with your first-time buyer mortgage. What's your current situation?",
        time: "2:32 PM",
      },
      {
        from: "user",
        text: `I'm looking to buy a ${getCurrencySign()}250k property and have a ${getCurrencySign()}50k deposit. I'm employed full-time with a ${getCurrencySign()}45k salary.`,
        time: "2:35 PM",
      },
      {
        from: "agent",
        text: "That sounds like a great position! With your deposit and income, you should have some excellent options. Would you like to schedule a call to discuss the best mortgage products for you?",
        time: "2:38 PM",
      },
    ],
    quickReplies: [
      "Thanks for your interest! I'd be happy to help.",
      "Let me schedule a consultation for you.",
      "I'll send you some information about our services.",
      "What's your current situation?",
      "Would you like to arrange a call?",
    ],
  };

  return (
    <>
      <Card>
        <CardBody>
          <h3>
            <TbMessage2 className="me-1" />
            Social Media Inbox
          </h3>
          <small>Manage all your social media conversations in one place</small>
        </CardBody>
      </Card>
      <div>
        <Row>
          <Col md="4">
            <Card className="shadow ">
              <CardBody className="px-0 mdx-0">
                <div className="d-flex justify-content-between mb-3 px-4 ">
                  <h5>Conversations</h5>
                  <Badge className="bg-light-dark">2 unread</Badge>
                </div>
                <div>
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`d-flex align-items-start p-2 mb-2 ${
                        conv.unread
                          ? "bg-light-dark border-l-warning border-3"
                          : ""
                      }`}
                    >
                      <div className="me-2">
                        <div
                          className="position-relative rounded-circle bg-light-dark d-flex align-items-center justify-content-center"
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        >
                          <span className="fw-semibold fs-5">
                            {conv.initial}
                          </span>
                          <span className="position-absolute bottom-0 end-0">
                            {conv.social === "facebook" && (
                              <FaFacebookF color="#1877f2" />
                            )}
                            {conv.social === "instagram" && (
                              <FaInstagram color="#e1306c" />
                            )}
                            {conv.social === "linkedin" && (
                              <FaLinkedinIn color="#0a66c2" />
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold">{conv.name}</span>
                          <small className="text-muted">{conv.time}</small>
                        </div>
                        <div className="small">{conv.message}</div>
                        <Badge
                          pill
                          className={`mt-1 bg-light-${conv.badgeColor}`}
                        >
                          {conv.badge}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="8">
            <Card className="shadow">
              <CardBody className="p-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-light-dark d-flex align-items-center justify-content-center me-3"
                      style={{ width: 48, height: 48 }}
                    >
                      <span className="fw-semibold fs-5">
                        {conversationDetail.user.initial}
                      </span>
                    </div>
                    <div>
                      <div className="fw-semibold">
                        {conversationDetail.user.name}
                      </div>
                      <div
                        className="d-flex align-items-center text-muted"
                        style={{ fontSize: 13 }}
                      >
                        <FaInstagram color="#e1306c" className="me-1" />
                        Instagram Direct
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button outline color="dark" className="me-2">
                      <TbUser className="me-1" />
                      Convert to Contact
                    </Button>
                    <Button outline color="dark">
                      <TbTag className="me-1" />
                      Tag
                    </Button>
                  </div>
                </div>
                {/* Chat Bubbles */}
                <div>
                  {conversationDetail.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`d-flex ${
                        msg.from === "agent"
                          ? "justify-content-end"
                          : "justify-content-start"
                      } mb-3`}
                    >
                      <div
                        className={`p-2 rounded-1 small ${
                          msg.from === "agent"
                            ? "bg-light-primary"
                            : "bg-light-dark"
                        }`}
                        style={{ maxWidth: 400 }}
                      >
                        {msg.text}
                        <div className="text-end">
                          <small>{msg.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Quick Replies */}
                <div className="mt-4">
                  <div className="mb-2 fw-semibold">Quick Replies:</div>
                  <div className="d-flex flex-wrap gap-2">
                    {conversationDetail.quickReplies.map((qr, idx) => (
                      <button
                        key={idx}
                        className="btn btn-light-dark border py-1"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Reply Input */}
                <div className="mt-4 d-flex align-items-center">
                  <input
                    className="form-control me-2"
                    placeholder="Type your reply..."
                    style={{ padding: "10px 10px" }}
                  />
                  <Button color="primary">
                    <BiSend size={22} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SocialMediaInbox;
