import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

// components
import PageTitle from "../../../components/PageTitle";
import ChatUsers from "./ChatUsers";
import ChatArea from "./ChatArea";
// dummy data
import { users } from "./data";

// ChatApp
const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(users[1]);

  /**
   * On user change
   */
  const onUserChange = user => {
    setSelectedUser(user);
  };
  return <>
      <PageTitle breadCrumbItems={[{
      label: "Apps",
      path: "/apps/chat"
    }, {
      label: "Chat",
      path: "/apps/chat",
      active: true
    }]} title={"Chat"} />

      <Row>
        <Col lg={4} xl={3}>
          <ChatUsers onUserSelect={onUserChange} />
        </Col>
        <Col lg={8} xl={9}>
          <ChatArea selectedUser={selectedUser} />
        </Col>
      </Row>
    </>;
};
export default ChatApp;