import React, { Fragment } from "react";
import { Avatar, Card, Divider, Typography } from "antd";
import { getUser as UserData } from "../../../../lib/graphql/queries/User/__generated__/getUser";

interface Props {
  user: UserData | undefined;
}

const { Paragraph, Text, Title } = Typography;

export const UserProfile = ({ user }: Props) => {
  const _user = user?.user;
  const additionalDetailsSection = (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Title level={4}>Additional Details</Title>
        <Paragraph>
          Total Topics: <Text strong>{_user?.total_topics}</Text>
        </Paragraph>
        <Paragraph>
          Total Comments: <Text strong>{_user?.total_messages}</Text>
        </Paragraph>
      </div>
    </Fragment>
  );

  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={_user?.avatar} />
        </div>
        <Divider />
        <div className="user-profile__details">
          <Title level={4}>Details</Title>
          <Paragraph>
            Name: <Text strong>{_user?.name}</Text>
          </Paragraph>
          <Paragraph>
            Contact: <Text strong>{_user?.email}</Text>
          </Paragraph>
        </div>
        {additionalDetailsSection}
      </Card>
    </div>
  );
};
