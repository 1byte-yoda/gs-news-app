import React, { Fragment } from "react";
import { Avatar, Card, Divider, Typography } from "antd";
// import { User as UserData } from "../../../../lib/graphql/queries/User/__generated__/User";

// interface Props {
//   user: UserData["user"];
//   viewerIsUser: boolean;
// }

const { Paragraph, Text, Title } = Typography;

export const UserProfile = ({ user, viewerIsUser }: any) => {
  const additionalDetailsSection = true ? (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Title level={4}>Additional Details</Title>
        <Paragraph>
          Total Topics: <Text strong>91</Text>
        </Paragraph>
        <Paragraph>
          Total Comments: <Text strong>10</Text>
        </Paragraph>
      </div>
    </Fragment>
  ) : null;

  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={window.localStorage.getItem("avatar")} />
        </div>
        <Divider />
        <div className="user-profile__details">
          <Title level={4}>Details</Title>
          <Paragraph>
            Name: <Text strong>{"SAMPLE NAME"}</Text>
          </Paragraph>
          <Paragraph>
            Contact: <Text strong>{"SAMPLE EMAIL"}</Text>
          </Paragraph>
        </div>
        {additionalDetailsSection}
      </Card>
    </div>
  );
};
