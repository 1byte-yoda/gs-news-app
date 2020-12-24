import React, { useState, SetStateAction, Dispatch } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Avatar, Comment, Form, Button, Input } from "antd";
import { CREATE_MESSAGE } from "../../../../lib/graphql/mutations";
import { TopicCommentList } from "../../components/TopicCommentList";
import { displayErrorMessage } from "../../../../lib/utils";
import { Viewer } from "../../../../lib/types";
import {
  createMessage as commentData,
  createMessageVariables as commentDataVariables,
} from "../../../../lib/graphql/mutations/CreateMessage/__generated__/createMessage";

interface CommentEditorProps {
  messages_count: number | null | undefined;
  avatar: string | null;
  messages: any;
  viewer: Viewer;
  topic_id: string;
}

const { TextArea } = Input;

export const TopicCommentEditor = ({
  messages_count,
  avatar,
  messages,
  viewer,
  topic_id
}: CommentEditorProps) => {
  const [commentValue, setCommentValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState(messages);
  const [totalMessages, setTotalMessages] = useState(messages_count);
  const [createMessage, { loading: createMessageLoading }] = useMutation<
    commentData,
    commentDataVariables
  >(CREATE_MESSAGE, {
    onCompleted: (data) => {
      setComments([data.message_create, ...comments]);
      setTotalMessages(totalMessages! + 1);
    },
    onError: (data) => {
      displayErrorMessage(data.message.replace("GraphQL error:", ""));
    },
  });

  const handleCommentValueChange = (e: any) => {
    setCommentValue(e.target.value);
  };

  const handleSubmitComment = async () => {
    if (!commentValue) {
      return;
    }
    const createVariables = {
      token: viewer.token || "",
      topic_id: topic_id,
      message: commentValue,
    };
    setSubmitting(true);
    createMessage({ variables: createVariables });
    setCommentValue("");
    setSubmitting(false);
  };

  const Editor = (
    <>
      <Form.Item>
        <TextArea
          rows={4}
          onChange={handleCommentValueChange}
          value={commentValue}
        />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          href="#comments"
          loading={submitting || createMessageLoading}
          onClick={handleSubmitComment}
          type="primary"
          style={{ float: "right" }}
        >
          Comment
        </Button>
      </Form.Item>
    </>
  );

  const CommentorAvatar = <Avatar src={avatar} />;

  return (
    <div>
      <TopicCommentList
        topic_id={topic_id}
        messages_count={totalMessages}
        messages={comments}
        setMessages={setComments}
        token={viewer.token}
      />
      <Comment avatar={CommentorAvatar} content={Editor} />
    </div>
  );
};
