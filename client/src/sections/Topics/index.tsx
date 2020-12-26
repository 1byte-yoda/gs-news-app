import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Layout, Space, List, Avatar, Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { TopicsSkeleton } from "./components/TopicsSkeleton";
import { TOPICS } from "../../lib/graphql/queries";
import {
  getAllTopics as TopicsData,
  getAllTopicsVariables as TopicsVariables,
} from "../../lib/graphql/queries/Topics/__generated__/getAllTopics";
import { Viewer } from "../../lib/types";
import { iconColor } from "../../lib/utils";
import { displayErrorMessage } from "../../lib/utils";

interface Props {
  viewer: Viewer;
  page: number;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;
const ERROR_DESCRIPTION = "We've encountered an error. Please try again soon!";
const ERROR_MESSAGE = "Uh oh! Something went wrong :(";

export const Topics = ({ viewer, setViewer, page }: Props) => {
  const [errorMsg, setErrorMsg] = useState(ERROR_MESSAGE);
  const [errorDescription, setErrorDescription] = useState(ERROR_DESCRIPTION);
  const { data, loading, error } = useQuery<TopicsData, TopicsVariables>(
    TOPICS,
    {
      variables: {
        token: viewer.token || "",
        page: page,
      },
      onError: (data) => {
        const gqlErrors = data.graphQLErrors[0];
        if (gqlErrors) {
          const exception = gqlErrors.extensions?.exception;
          const statusCode = exception.context.info;
          const errorMessage = gqlErrors.message;
          if (statusCode == 401 && viewer.token) {
            setErrorMsg(errorMessage);
            setErrorDescription("You will be logged out in 5 seconds...");
            setTimeout(() => {
              setViewer({ token: null, id: null, avatar: null });
              localStorage.clear();
            }, 5000);
          } else if (statusCode !== 401 && errorMessage && viewer.token) {
            displayErrorMessage(errorMessage);
          }
        }
      },
    }
  );

  if (loading) {
    return (
      <Content className="listings">
        <TopicsSkeleton />
      </Content>
    );
  }

  if (error && viewer.token) {
    return (
      <Content className="listings">
        <ErrorBanner message={errorMsg} description={errorDescription} />
        <PageSkeleton />
      </Content>
    );
  }

  if (error && !viewer.token) {
    return <Redirect to="/login" />;
  }

  if (!viewer.id || !viewer.token) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            You'll have to be signed in to view our topics!
          </Title>
          <Text type="secondary">
            You can sign in at the <Link to="/login">/login</Link> page to
            continue.
          </Text>
        </div>
      </Content>
    );
  }

  const topicsSectionAntd =
    data?.topics?.data && data?.topics?.data?.length ? (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={data.topics.data}
        renderItem={(topic) => (
          <List.Item
            key={topic?.id || ""}
            extra={
              <Link to={`/topic/${topic?.id}`}>
                <img
                  width={272}
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
              </Link>
            }
          >
            <div className="listing-card__details">
              <List.Item.Meta
                avatar={
                  <Link to={`/user/${topic?.created_by?.id}`}>
                    <Avatar src={topic?.created_by.avatar} />
                  </Link>
                }
                title={<a href={`/topic/${topic?.id}`}>{topic?.subject}</a>}
              />
              <Link to={`/topic/${topic?.id}`}>
                <div className="listing-card__description">
                  <Paragraph
                    style={{ maxWidth: "70em" }}
                    ellipsis={{ rows: 3, expandable: false }}
                  >
                    {topic?.description}
                  </Paragraph>
                </div>
              </Link>
              <div className="listing-card__dimensions listing-card__dimensions--guests">
                <Space style={{ marginBottom: "0em" }}>
                  <Link to={`/topic/${topic?.id}#comments`}>
                    <MessageOutlined
                      translate=""
                      style={{ color: iconColor, fontSize: "14px" }}
                    />
                  </Link>
                  <Link to={`/topic/${topic?.id}#comments`}>
                    <Text>{topic?.messages_count} Comments</Text>
                  </Link>
                </Space>
              </div>
            </div>
          </List.Item>
        )}
      />
    ) : (
      <div>
        <Paragraph>
          Be the first person to start a <Link to="/create">Topic</Link>!
        </Paragraph>
      </div>
    );
  return (
    <Content className="listings">
      <Link to="/topics">
        <Title level={3} className="listings__title">
          Topics
        </Title>
      </Link>
      {topicsSectionAntd}
    </Content>
  );
};
