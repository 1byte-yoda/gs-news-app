import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link, Redirect, useParams } from "react-router-dom";
import { Col, Layout, Row, Typography } from "antd";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import {
  getTopic as TopicData,
  getTopicVariables as TopicVariables,
} from "../../lib/graphql/queries/Topic/__generated__/getTopic";
import {
  ERROR_MESSAGE,
  ERROR_TRY_SOON,
  ERROR_FORCED_LOGOUT,
} from "../../lib/promptMessages/error";
import { TopicDetails, TopicCommentEditor } from "./components";
import { TOPIC } from "../../lib/graphql/queries";
import { Viewer } from "../../lib/types";

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Topic = ({ viewer, setViewer }: Props) => {
  const topicUrl: MatchParams = useParams();
  const [processingTopic, setProcessingTopic] = useState(false);
  const [errorMsg, setErrorMsg] = useState(ERROR_MESSAGE);
  const [errorDescription, setErrorDescription] = useState(ERROR_TRY_SOON);
  const { loading, data, error } = useQuery<TopicData, TopicVariables>(TOPIC, {
    variables: {
      topic_id: topicUrl.id,
      token: viewer.token || "",
    },
    onError: (data) => {
      const gqlErrors = data.graphQLErrors ? data.graphQLErrors[0] : null;
      if (gqlErrors) {
        const exception = gqlErrors.extensions?.exception;
        const statusCode = exception.context.info;
        const errorMessage = gqlErrors.message;
        if (statusCode === "401" && viewer.token) {
          setErrorDescription(ERROR_FORCED_LOGOUT);
          setErrorMsg(errorMessage);
          setTimeout(() => {
            setViewer({ token: "", id: null, avatar: null });
            localStorage.clear();
          }, 5000);
        } else if (statusCode !== 401 && errorMessage && viewer.token) {
          setErrorMsg(errorMessage);
        }
      }
    },
  });

  if (loading) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    );
  }

  const messages = data?.topic ? data?.topic?.messages : null;

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

  const topicDetailsElement = data?.topic ? (
    <>
      <TopicDetails
        viewer={viewer}
        topic={data?.topic}
        setProcessingTopic={setProcessingTopic}
      />
      {!processingTopic ? (
        <TopicCommentEditor
          avatar={viewer.avatar}
          messages_count={data?.topic?.messages_count}
          messages={messages}
          viewer={viewer}
          topic_id={data?.topic.id}
        />
      ) : null}
    </>
  ) : null;

  return (
    <Content className="listings">
      <Row gutter={24} justify="center">
        <Col xs={24} lg={14}>
          {topicDetailsElement}
        </Col>
      </Row>
    </Content>
  );
};
