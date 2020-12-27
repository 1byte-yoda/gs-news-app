import React, { useState } from "react";
import { useScrollToTop } from "../../lib/hooks";
import { Link, Redirect, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Form, Input, Button, Layout, Typography } from "antd";
import { displaySuccessNotification } from "../../lib/utils";
import {
  updateTopic as UpdateTopicData,
  updateTopicVariables as UpdateTopicVariables,
  updateTopic_topic_update as UpdateTopicInput,
} from "../../lib/graphql/mutations/UpdateTopic/__generated__/updateTopic";
import {
  getTopic as TopicData,
  getTopicVariables as TopicVariables,
  getTopic_topic,
} from "../../lib/graphql/queries/Topic/__generated__/getTopic";
import {
  ERROR_MESSAGE,
  ERROR_TRY_SOON,
  ERROR_FORCED_LOGOUT,
  ERROR_CANT_UPDATE_TOPIC,
} from "../../lib/promptMessages/error";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { SUCCESS_UPDATE_TOPIC } from "../../lib/promptMessages/success";
import { UPDATE_TOPIC } from "../../lib/graphql/mutations";
import { TOPIC } from "../../lib/graphql/queries";
import { Viewer } from "../../lib/types";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

interface MatchParams {
  id: string;
}

const { Content } = Layout;
const { Item } = Form;
const { Text, Title } = Typography;

export const UpdateTopic = ({ viewer, setViewer }: Props) => {
  const [form] = Form.useForm();
  const [errorMsg, setErrorMsg] = useState(ERROR_MESSAGE);
  const [topic, setTopic] = useState<getTopic_topic | null>();
  const [errorDescription, setErrorDescription] = useState(ERROR_TRY_SOON);
  const topicUrl: MatchParams = useParams();
  const topic_id = topicUrl.id;
  const { error: getTopicError } = useQuery<TopicData, TopicVariables>(TOPIC, {
    variables: {
      topic_id: topicUrl.id,
      token: viewer.token || "",
    },
    onCompleted: (data) => {
      setTopic(data.topic);
    },
    onError: (data) => {
      const gqlErrors = data.graphQLErrors[0];
      if (gqlErrors) {
        const exception = gqlErrors.extensions?.exception;
        const statusCode = exception.context.info;
        const errorMessage = gqlErrors.message;
        if (statusCode === 401 && viewer.token) {
          setErrorDescription(ERROR_FORCED_LOGOUT);
          setErrorMsg(errorMessage);
          setTimeout(() => {
            setViewer({ token: null, id: null, avatar: null });
            localStorage.clear();
          }, 5000);
        } else if (statusCode !== 401 && errorMessage && viewer.token) {
          setErrorMsg(errorMessage);
        }
      }
    },
  });

  const [updateTopic, { loading, error: updateTopicError, data }] = useMutation<
    UpdateTopicData,
    UpdateTopicVariables
  >(UPDATE_TOPIC, {
    onCompleted: () => {
      displaySuccessNotification(SUCCESS_UPDATE_TOPIC);
    },
    onError: (data) => {
      const gqlErrors = data.graphQLErrors[0];
      if (gqlErrors) {
        const exception = gqlErrors.extensions?.exception;
        const statusCode = exception.context.info;
        const errorMessage = gqlErrors.message;
        if (statusCode === 401 && viewer.token) {
          setErrorDescription(ERROR_FORCED_LOGOUT);
          setErrorMsg(errorMessage);
          setTimeout(() => {
            setViewer({ token: null, id: null, avatar: null });
            localStorage.clear();
          }, 5000);
        } else {
          setErrorDescription(ERROR_CANT_UPDATE_TOPIC);
        }
      }
    },
  });

  useScrollToTop();

  const onFinish = (values: UpdateTopicInput) => {
    if (viewer.token && values.subject && values.description) {
      updateTopic({
        variables: {
          token: viewer.token,
          topic_id: topic_id,
          subject: values.subject,
          description: values.description,
        },
      });
    }
  };

  if ((getTopicError || updateTopicError) && viewer.token) {
    return (
      <Content className="listings">
        <ErrorBanner message={errorMsg} description={errorDescription} />
        <PageSkeleton />
      </Content>
    );
  }

  if (!viewer.id || !viewer.token) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            You'll have to be signed in to update a topic!
          </Title>
          <Text type="secondary">
            We only allow users who've signed in to our application to a topic.
            You can sign in at the <Link to="/login">/login</Link> page.
          </Text>
        </div>
      </Content>
    );
  }

  if (loading) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Please wait!
          </Title>
          <Text type="secondary">We're updating your topic now.</Text>
        </div>
      </Content>
    );
  }

  if (data && data.topic_update) {
    return <Redirect to={`/topic/${topic_id}`} />;
  }

  return (
    <Content className="host-content">
      {topic ? (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="host__form-header">
            <Title level={3} className="host__form-title">
              Hi! Update your topic here!
            </Title>
            <Text type="secondary">
              In this form, you are allowed to update your topic. Upon
              submission, we autogenerate the creation of random image that will
              be assigned to your topic.
            </Text>
          </div>

          <Item
            name="subject"
            initialValue={topic?.subject}
            label={<Title level={5}>Subject</Title>}
            extra="Max character count of 45"
            rules={[
              {
                required: true,
                message: "Please enter a subject for your topic!",
              },
            ]}
          >
            <Input
              maxLength={45}
              placeholder="Why eating healthy fats help boosts the brain?"
            />
          </Item>

          <Item
            name="description"
            initialValue={topic?.description}
            label={<Title level={5}>Description of your topic</Title>}
            extra="Max character count of 2000"
            rules={[
              {
                required: true,
                message: "Please enter a description for your topic!",
              },
            ]}
          >
            <Input.TextArea
              rows={12}
              maxLength={2000}
              placeholder="Healthy fatty foods can increase the health of your brain, and even lower your risk from getting alzheimer's disease."
            />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Item>
        </Form>
      ) : null}
    </Content>
  );
};
