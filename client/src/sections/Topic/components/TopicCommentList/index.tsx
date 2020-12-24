import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useQuery } from "@apollo/react-hooks";
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
  Spin,
} from "antd";
import { ClockCircleOutlined, MessageOutlined } from "@ant-design/icons";
import { MESSAGES } from "../../../../lib/graphql/queries/Messages";
import {
  getMessages_messages_data,
  getMessages,
  getMessagesVariables as MessagesVariables,
} from "../../../../lib/graphql/queries/Messages/__generated__/getMessages";
import { iconColor } from "../../../../lib/utils";

const { Paragraph, Text } = Typography;

interface MessagesData {
  has_next: boolean | null;
  next_num: number | null;
  data: getMessages_messages_data[];
}

export const TopicCommentList = ({
  topic_id,
  messages_count,
  messages,
  setMessages,
  token,
}: any) => {
  const [expanded, setExapanded] = useState(false);
  const [counter, setCounter] = useState(0);
  const [page, setPage] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const { error: commentsError, refetch: refetchComments, data } = useQuery<
    getMessages,
    MessagesVariables
  >(MESSAGES, {
    variables: {
      topic_id: topic_id,
      token: token || "",
      page: page,
    },
    onCompleted: (data) => {
      if (data.messages?.data && page > 1) {
        setMessages(messages.concat(data.messages.data));
        setCommentsLoading(false);
        console.log(data)
      }
    },
  });

  const commentCountIndicator = (totalComments: number) =>
    totalComments > 0 ? (
      <Text style={{ color: iconColor, cursor: "pointer" }}>
        <Space>
          <MessageOutlined translate="" />
          <Text strong>{totalComments} Comments</Text>
        </Space>
      </Text>
    ) : (
      <Text strong style={{ color: iconColor, cursor: "pointer" }}>
        Comment
      </Text>
    );

  const handleExandCommentClicked = () => {
    setCounter(!expanded ? counter + 0 : counter + 1);
    setExapanded(!expanded);
  };

  const handleLoadMoreComments = () => {
    if (data?.messages?.has_next) {
      setCommentsLoading(true);
      setPage(data!.messages!.next_num!);
      refetchComments();
    }
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

  const commentItem = (props: getMessages_messages_data) => {
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

  const moreComments = data?.messages?.has_next ? (
    <Row justify="end">
      <Col>
        <Button
          type="link"
          style={{ color: "black" }}
          loading={commentsLoading}
          onClick={handleLoadMoreComments}
        >
          <Text strong underline>
            Load more comments
          </Text>
        </Button>
      </Col>
    </Row>
  ) : null;
  return messages_count > 0 ? (
    <>
      <List
        dataSource={messages}
        header={commentCountIndicator(messages_count)}
        itemLayout="horizontal"
        renderItem={commentItem}
        loadMore={moreComments}
        loading={commentsLoading}
      />
    </>
  ) : (
    commentCountIndicator(messages_count)
  );
};
