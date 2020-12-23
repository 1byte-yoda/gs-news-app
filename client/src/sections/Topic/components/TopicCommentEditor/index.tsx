import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks"
import {
    Avatar,
    Comment,
    Form,
    Button,
    Input 
} from "antd";
import { CREATE_MESSAGE } from "../../../../lib/graphql/mutations";
import { TopicCommentList } from "../../components/TopicCommentList";
import { displayErrorMessage } from "../../../../lib/utils";
import { Viewer } from "../../../../lib/types";
import {
    createMessage as commentData,
    createMessageVariables as commentDataVariables
} from "../../../../lib/graphql/mutations/CreateMessage/__generated__/createMessage";

interface CommentEditorProps {
    id: string | null;
    avatar: string | null;
    messages: any;
    viewer: Viewer;
    topic_id: string;
}

const { TextArea } = Input;

export const TopicCommentEditor = ({id, avatar, messages, viewer, topic_id}: CommentEditorProps) => {
    const [commentValue, setCommentValue] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [comments, setComments] = useState(messages);
    const [createMessage] = useMutation<commentData, commentDataVariables>(CREATE_MESSAGE, {
        onCompleted: (data) => {
            if (data && data.message_create) {
                setComments( [...comments, data.message_create] );
            }
        },
        onError: data => {
            displayErrorMessage(data.message.split(":")[1]);
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
            message: commentValue
        };
        setSubmitting(true);
        createMessage({ variables: createVariables });
        setCommentValue("");
        setSubmitting(false);
    };

    const Editor = (
        <>
            <Form.Item>
                <TextArea rows={4} onChange={handleCommentValueChange} value={commentValue} />
            </Form.Item>
            <Form.Item>
                <Button
                    htmlType="submit"
                    loading={submitting}
                    onClick={handleSubmitComment}
                    type="primary"
                    style={{ float: "right" }}
                >
                    Comment
                </Button>
            </Form.Item>
        </>
    );

    const CommentorAvatar = (
        <Avatar src={avatar} />
    );

    return (
        <div>
            <TopicCommentList messages={comments}/>
            <Comment
                avatar={CommentorAvatar}
                content={Editor}
            />
        </div>
    );
};