import React, { useState } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Col, Layout, Row, Typography } from "antd";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { TOPIC } from "../../lib/graphql/queries";
import {
  getTopic as TopicData,
  getTopicVariables as TopicVariables,
} from "../../lib/graphql/queries/Topic/__generated__/getTopic";
import { TopicDetails, TopicCommentEditor } from "./components";
import { Viewer } from "../../lib/types";
import { displayErrorMessage } from "../../lib/utils";

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;
const ERROR_DESCRIPTION = "We've encountered an error. Please try again soon!";
const ERROR_MESSAGE = "Uh oh! Something went wrong :(";

export const Topic = ({ viewer, setViewer }: Props) => {
  const topicUrl: MatchParams = useParams();
  const [processingTopic, setProcessingTopic] = useState(false);
  const [errorMsg, setErrorMsg] = useState(ERROR_MESSAGE);
  const [errorDescription, setErrorDescription] = useState(ERROR_DESCRIPTION);
  const { loading, data, error } = useQuery<TopicData, TopicVariables>(TOPIC, {
    variables: {
      topic_id: topicUrl.id,
      token: viewer.token || "",
    },
    onError: (data) => {
      const gqlErrors = data.graphQLErrors[0];
      if (gqlErrors) {
        const exception = gqlErrors.extensions?.exception;
        const statusCode = exception.context.info;
        const errorMessage = gqlErrors.message;
        if (statusCode == 401 && viewer.token) {
          setErrorDescription("You will be logged out in 5 seconds...");
          setErrorMsg(errorMessage);
          setTimeout(() => {
            setViewer({ token: null, id: null, avatar: null });
            localStorage.clear();
          }, 5000);
        } else if (statusCode !== 401 && errorMessage && viewer.token) {
          displayErrorMessage(errorMessage);
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

  // TODO: fetch comments from graphql
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

  const topic = data ? data.topic : null;

  const topicDetailsElement = topic ? (
    <>
      <TopicDetails
        viewer={viewer}
        topic={topic}
        setProcessingTopic={setProcessingTopic}
      />
      {!processingTopic ? (
        <TopicCommentEditor
          avatar={viewer.avatar}
          messages_count={data?.topic?.messages_count}
          messages={messages}
          viewer={viewer}
          topic_id={topic.id}
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
