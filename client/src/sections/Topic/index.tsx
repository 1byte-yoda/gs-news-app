import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Col, Layout, Row } from "antd";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { TOPIC } from "../../lib/graphql/queries";
import {
    getTopic as TopicData,
    getTopicVariables as TopicVariables,
} from "../../lib/graphql/queries/Topic/__generated__/getTopic";
import {
  TopicDetails,
  TopicCommentList,
  TopicCommentEditor
} from "./components";
import { Viewer } from "../../lib/types";


interface MatchParams {
  id: string;
}

interface Props {
    viewer: Viewer
}

const { Content } = Layout;

export const Topic = ({ viewer }: Props) => {
    const topicUrl: MatchParams = useParams();
    const { loading, data, error } = useQuery<TopicData, TopicVariables>(TOPIC, {
    variables: {
      topic_id: topicUrl.id,
      token:  viewer.token || ""
    }
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
        <ErrorBanner description="This topic may not exist or we've encountered an error. Please try again soon!" />
        <PageSkeleton />
      </Content>
    );
  }

  const topic = data ? data.topic : null;

  const topicDetailsElement = (
    topic ?
      <>
        <TopicDetails topic={topic} />
        <div id={"comments"}>
          <TopicCommentEditor
            id={viewer.id}
            avatar={viewer.avatar}
            messages={messages}
            viewer={ viewer }
            topic_id={ topic.id }
          />
        </div>
      </>
    : null
  );

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
