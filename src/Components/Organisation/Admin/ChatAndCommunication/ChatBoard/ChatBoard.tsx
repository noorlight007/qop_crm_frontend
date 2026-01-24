import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiSend } from "react-icons/fi";
import { TbLink } from "react-icons/tb";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Input,
  InputGroup,
  Row,
} from "reactstrap";

interface ChatThread {
  id: string;
  title: string;
  client: string;
  case: string;
  description: string;
  status: "Active" | "Resolved";
  priority: "High" | "Medium" | "Low";
  lastUpdated: string;
  participants: string[];
  unread?: number;
}

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  time: string;
  content: string;
  isCurrentUser: boolean;
}

const ChatBoard: React.FC = () => {
  // Sample data for chat threads
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "1",
      title: "Tech Solutions Ltd - Application Query",
      client: "Tech Solutions Ltd",
      case: "CASE-001",
      description: "Client needs clarification on mortgage terms",
      status: "Active",
      priority: "High",
      lastUpdated: "15/01/2024",
      participants: ["Admin Team", "Sarah Johnson"],
      unread: 3,
    },
    {
      id: "2",
      title: "Document Review - Global Investments",
      client: "Global Investments",
      case: "CASE-002",
      description: "Updated documents uploaded for review",
      status: "Active",
      priority: "Medium",
      lastUpdated: "15/01/2024",
      participants: ["Admin Team", "Michael Chen"],
    },
    {
      id: "3",
      title: "Valuation Update Discussion",
      client: "Valuation Services",
      case: "CASE-003",
      description: "Valuation report received - proceeding to next stage",
      status: "Resolved",
      priority: "Low",
      lastUpdated: "14/01/2024",
      participants: ["Admin Team", "Emma Williams"],
    },
  ]);

  // Sample messages for the selected thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Admin Team",
      role: "Admin",
      time: "20:00",
      content:
        "Hi Sarah, the client is asking about the interest rate options. Can you provide some clarity?",
      isCurrentUser: false,
    },
    {
      id: "2",
      sender: "Sarah Johnson",
      role: "Adviser",
      time: "20:15",
      content:
        "Sure! I can explain the different rate options available for their loan amount. The fixed rate is 4.2% and variable starts at 3.8%.",
      isCurrentUser: true,
    },
    {
      id: "3",
      sender: "Admin Team",
      role: "Admin",
      time: "20:30",
      content:
        "Perfect! I'll relay this information to the client. They also asked about early repayment charges.",
      isCurrentUser: false,
    },
    {
      id: "4",
      sender: "Sarah Johnson",
      role: "Adviser",
      time: "20:15",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro eaque inventore cum rem vitae itaque tempora maxime placeat sint nisi!",
      isCurrentUser: true,
    },
    {
      id: "4",
      sender: "Sarah Johnson",
      role: "Adviser",
      time: "20:15",
      content:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim sunt consequatur velit.",
      isCurrentUser: true,
    },
  ]);

  const [selectedThread, setSelectedThread] = useState<string>("1");
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [priorityFilter, setPriorityFilter] = useState<string>("All Priority");

  // Get the currently selected thread
  const currentThread = threads.find((thread) => thread.id === selectedThread);

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg: ChatMessage = {
      id: (messages.length + 1).toString(),
      sender: "Sarah Johnson",
      role: "Adviser",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content: newMessage,
      isCurrentUser: true,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  // Add a ref for the chat messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Heading  */}
      <Card>
        <CardBody className="d-flex justify-content-between">
          <div>
            <h2>Internal Communication</h2>
            <small>Real-time chat system for admin-adviser coordination</small>
          </div>
          <div>
            <Badge color="danger" pill>
              3 unread
            </Badge>
          </div>
        </CardBody>
      </Card>
      {/* Chat Board  */}
      <div>
        <Row>
          {/* Left Column - Chat Threads */}
          <Col xs={12} md={4}>
            <Card className="shadow">
              <CardBody className="p-0">
                <div className="p-3 border-bottom">
                  <InputGroup>
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                      color="primary"
                      className="rounded-start-0 border-start-0"
                    >
                      <FiSearch />
                    </Button>
                  </InputGroup>
                </div>
                <div className="d-flex justify-content-between p-3 border-bottom">
                  <div className="dropdown">
                    <Input
                      type="select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Resolved</option>
                    </Input>
                  </div>
                  <div className="dropdown">
                    <Input
                      type="select"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <option>All Priority</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </Input>
                  </div>
                </div>
                <div style={{ height: "500px", overflowY: "auto" }}>
                  {threads.map((thread) => (
                    <div
                      key={thread.id}
                      className={`p-3 border-bottom ${
                        selectedThread === thread.id ? "bg-light-primary" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedThread(thread.id)}
                    >
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-1">{thread.title}</h5>
                        <div>
                          {thread.unread && (
                            <Badge color="danger" pill className="ms-2">
                              {thread.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <Badge
                            color={
                              thread.status === "Active"
                                ? "success"
                                : "secondary"
                            }
                            className="me-2"
                          >
                            {thread.status}
                          </Badge>
                          <Badge
                            color={
                              thread.priority === "High"
                                ? "danger"
                                : thread.priority === "Medium"
                                ? "warning"
                                : "info"
                            }
                          >
                            {thread.priority}
                          </Badge>
                        </div>
                        <small>{thread.lastUpdated}</small>
                      </div>
                      <p className="text-muted mb-0 small">
                        {thread.description}
                      </p>
                      <small className="text-muted">
                        {thread.participants.join(", ")}
                      </small>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Right Column - Chat Messages */}
          <Col xs={12} md={8}>
            <Card className="shadow">
              <CardBody className="p-0">
                {currentThread && (
                  <>
                    {/* Chat Header */}
                    <div className="p-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="mb-0">{currentThread.title}</h4>
                          <div>
                            <small>
                              Client: {currentThread.client} • Case:{" "}
                              {currentThread.case}
                            </small>
                            <Badge
                              color={
                                currentThread.status === "Active"
                                  ? "success"
                                  : "secondary"
                              }
                              className="ms-2"
                            >
                              {currentThread.status}
                            </Badge>
                          </div>
                        </div>
                        <Badge
                          color={
                            currentThread.priority === "High"
                              ? "danger"
                              : currentThread.priority === "Medium"
                              ? "warning"
                              : "info"
                          }
                        >
                          {currentThread.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div
                      className="chat-messages p-3"
                      style={{ height: "500px", overflowY: "auto" }}
                    >
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`mb-3 ${
                            message.isCurrentUser ? "text-end" : ""
                          }`}
                        >
                          <div
                            className={`d-inline-block p-3 rounded ${
                              message.isCurrentUser
                                ? "bg-primary text-white"
                                : "bg-light-primary"
                            }`}
                            style={{ maxWidth: "75%", textAlign: "left" }}
                          >
                            <div className="d-flex justify-content-between mb-1 gap-4">
                              <strong>{message.sender}</strong>
                              <small className="opacity-50">
                                {message.time}
                              </small>
                            </div>
                            <p className="mb-0">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      {/* Add this div as the last element in the messages container */}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-top">
                      <Form onSubmit={handleSendMessage}>
                        <div className="d-flex justify-content-between gap-1">
                          <div>
                            <Button
                              color=""
                              style={{ width: "45px", height: "43px" }}
                              onClick={() =>
                                alert("Attach file(Function undc)")
                              }
                            >
                              <TbLink size={20} />
                            </Button>
                          </div>
                          <div className="w-100">
                            <InputGroup>
                              <Input
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                              />
                              <Button
                                color="primary"
                                type="submit"
                                className="border-start-0 rounded-start-0"
                              >
                                <FiSend />
                              </Button>
                            </InputGroup>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChatBoard;
