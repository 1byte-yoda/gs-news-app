import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Avatar, Col, Layout, Row, Comment, Typography, Form, List, Input, Button } from "antd";
import moment from 'moment';
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { TOPIC } from "../../lib/graphql/queries";
import {
    getTopic as TopicData,
    getTopicVariables as TopicVariables
} from "../../lib/graphql/queries/Topic/__generated__/getTopic";
import { TopicDetails } from "./components";
import { Viewer } from "../../lib/types";
import { iconColor } from "../../lib/utils";

interface MatchParams {
  id: string;
}

interface Props {
    viewer: Viewer
}

const { Content } = Layout;
const { TextArea } = Input;
const { Paragraph } = Typography;

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
  const cmnts = [{
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: <p>{"Something"}</p>,
    datetime: moment().fromNow(),
  },{
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: <p>{"Something"}</p>,
    datetime: moment().fromNow(),
  }];

  const Editor = ({ onChange, onSubmit, submitting, value }: any) => (
    <>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  );

  if (error && viewer.token) {
    return (
      <Content className="listings">
        <ErrorBanner description="This topic may not exist or we've encountered an error. Please try again soon!" />
        <PageSkeleton />
      </Content>
    );
  }

  const topic = data ? data.topic : null;

  const topicDetailsElement = topic ? <TopicDetails topic={topic} /> : null;

  return (
    <Content className="listings">
      <Row gutter={24} justify="center">
        <Col xs={24} lg={14}>
          {topicDetailsElement}
          {
            cmnts.length > 0 && 
            <List
              dataSource={cmnts}
              header={cmnts.length > 1 ? <Paragraph style={{color: iconColor, cursor: "pointer"}}>{cmnts.length} Comments</Paragraph> : <Paragraph style={{color: iconColor, cursor: "pointer"}}>Comment</Paragraph>}
              itemLayout="horizontal"
              renderItem={(props)  => <Comment {...props} />}
            />
          }
          <Comment
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={
                <Editor
                  onChange={() => {}}
                  onSubmit={() => {}}
                  submitting={false}
                  value={''}
                />
              }
            />
        </Col>
      </Row>
    </Content>
  );
};
