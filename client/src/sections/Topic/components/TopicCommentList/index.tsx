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
} from "antd";
import { ClockCircleOutlined, MessageOutlined } from "@ant-design/icons";
import { MESSAGES } from "../../../../lib/graphql/queries/Messages";
import {
  getMessages_messages_data,
  getMessages,
  getMessagesVariables as MessagesVariables,
} from "../../../../lib/graphql/queries/Messages/__generated__/getMessages";

const { Paragraph, Text } = Typography;

export const TopicCommentList = ({
  topic_id,
  messages_count,
  messages,
  setMessages,
  token,
}: any) => {
  const [page, setPage] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const { refetch: refetchComments, data } = useQuery<
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
      }
    },
  });

  const commentCountIndicator = (totalComments: number) => (
    <div id={"comments"}>
      {totalComments > 0 ? (
        <Text>
          <Space>
            <MessageOutlined translate="" />
            <Text>
              {`${
                totalComments > 1
                  ? `${totalComments} Comments`
                  : `${totalComments} Comment`
              }`}{" "}
            </Text>
          </Space>
        </Text>
      ) : (
        <Text>Comment</Text>
      )}
    </div>
  );

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
          <div>
            <Paragraph ellipsis={commentEllipsisOptions}>
              {props?.message}
            </Paragraph>
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

  const moreComments = (
    <Row style={{ marginTop: "5px" }} justify="space-between">
      <Col>
        <Button
          type="text"
          style={{ cursor: "text", backgroundColor: "transparent" }}
        >{`${messages.length} of ${messages_count}`}</Button>
      </Col>
      {data?.messages?.has_next ? (
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
      ) : null}
    </Row>
  );

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
