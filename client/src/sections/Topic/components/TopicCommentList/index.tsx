import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  List,
  Typography,
  Comment,
  Avatar,
  Button,
  Row,
  Col,
  Tooltip,
  Space,
} from "antd";
import { ClockCircleOutlined, MessageOutlined } from "@ant-design/icons";
import { getTopic_topic_messages as messagesData } from "../../../../lib/graphql/queries/Topic/__generated__/getTopic";
import { iconColor } from "../../../../lib/utils";

const { Paragraph, Text } = Typography;

export const TopicCommentList = ({ messages }: any) => {
  const [expanded, setExapanded] = useState(false);
  const [counter, setCounter] = useState(0);
  const commentCountIndicator = (totalComments: number) =>
    totalComments > 0 ? (
      <Text style={{ color: iconColor, cursor: "pointer" }}>
        <Space>
          <MessageOutlined translate="" />
          <Text>{totalComments} Comments</Text>
        </Space>
      </Text>
    ) : (
      <Text style={{ color: iconColor, cursor: "pointer" }}>Comment</Text>
    );

  const handleExandCommentClicked = () => {
    setCounter(!expanded ? counter + 0 : counter + 1);
    setExapanded(!expanded);
  };

  const commentEllipsisOptions = {
    rows: 3,
    expandable: true,
    symbol: "more",
    onExpand: handleExandCommentClicked,
  };

  const commentorAvatar = (props: any) => (
    <Link to={`/user/${props.created_by.id}`}>
      <Avatar src={props.created_by.avatar} />
    </Link>
  );

  const updatedIndicator = (
    updated_at: string,
    created_at: string,
    updated_by: string
  ) =>
    updated_at !== created_at ? (
      <Tooltip
        title={`Updated last ${moment(updated_at).format(
          "LLL"
        )} by ${updated_by}`}
      >
        <ClockCircleOutlined translate="" />
      </Tooltip>
    ) : null;

  const commentDateTime = (
    updated_at: string,
    created_at: string,
    updated_by: string
  ) => (
    <Space>
      <Tooltip title={moment(created_at).format("LLL")}>
        {moment(created_at).fromNow()}
      </Tooltip>
      {updatedIndicator(updated_at, created_at, updated_by)}
    </Space>
  );

  const commentItem = (props: messagesData) => {
    return (
      <Comment
        author={
          <Link to={`/user/${props.created_by.id}`}>
            <Text strong>{props.created_by.name}</Text>
          </Link>
        }
        avatar={commentorAvatar(props)}
        content={
          <div key={counter}>
            <Paragraph ellipsis={commentEllipsisOptions}>
              {props?.message}
            </Paragraph>
            {expanded && <a onClick={handleExandCommentClicked}>less</a>}
          </div>
        }
        datetime={commentDateTime(
          props.updated_at,
          props.created_at,
          props.updated_by.name
        )}
      />
    );
  };
  return messages.length > 0 ? (
    <>
      <List
        dataSource={messages}
        header={commentCountIndicator(messages.length)}
        itemLayout="horizontal"
        renderItem={commentItem}
      />
      <Row justify="end">
        <Col>
          <Button type="link" style={{ color: "black" }}>
            <Text strong underline>
              Load more comments
            </Text>
          </Button>
        </Col>
      </Row>
    </>
  ) : (
    commentCountIndicator(messages.length)
  );
};
