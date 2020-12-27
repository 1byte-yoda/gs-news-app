import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Form, Input, Button, Layout, Typography } from "antd";
import {
  createTopic as CreateTopicData,
  createTopicVariables as CreateTopicVariables,
  createTopic_topic_create as CreateTopicInput,
} from "../../lib/graphql/mutations/CreateTopic/__generated__/createTopic";
import { displaySuccessNotification } from "../../lib/utils";
import {
  ERROR_TRY_SOON,
  ERROR_MESSAGE,
  ERROR_FORCED_LOGOUT,
  ERROR_CANT_CREATE_TOPIC,
} from "../../lib/promptMessages/error";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { CREATE_TOPIC } from "../../lib/graphql/mutations/CreateTopic";
import { Viewer } from "../../lib/types";
import { useScrollToTop } from "../../lib/hooks";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Item } = Form;
const { Text, Title } = Typography;

export const CreateTopic = ({ viewer, setViewer }: Props) => {
  const [form] = Form.useForm();
  const [errorMsg, setErrorMsg] = useState(ERROR_MESSAGE);
  const [errorDescription, setErrorDescription] = useState(ERROR_TRY_SOON);
  const [createTopic, { loading, error, data }] = useMutation<
    CreateTopicData,
    CreateTopicVariables
  >(CREATE_TOPIC, {
    onCompleted: () => {
      displaySuccessNotification("You've successfully created your topic!");
    },
    onError: (data) => {
      const gqlErrors = data.graphQLErrors && data.graphQLErrors?.length ? data.graphQLErrors[0] : null;
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
        } else {
          setErrorDescription(ERROR_CANT_CREATE_TOPIC);
        }
      }
    },
  });

  useScrollToTop();

  const onFinish = (values: CreateTopicInput) => {
    if (viewer.token && values.subject && values.description) {
      createTopic({
        variables: {
          token: viewer.token,
          subject: values.subject,
          description: values.description,
        },
      });
    }
  };

  if (error && viewer.token) {
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
            You'll have to be signed in to create a topic!
          </Title>
          <Text type="secondary">
            We only allow users who've signed in to our application to create a
            new topic. You can sign in at the <Link to="/login">/login</Link>{" "}
            page.
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
          <Text type="secondary">We're posting your topic now.</Text>
        </div>
      </Content>
    );
  }

  if (data && data.topic_create) {
    return <Redirect to={`/topic/${data.topic_create.id}`} />;
  }

  return (
    <Content className="host-content">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi! Share your thoughts!
          </Title>
          <Text type="secondary">
            In this form, you can share your thoughts by posting a topic. Upon
            submission, we autogenerate the creation of random image that will
            be assigned to your topic.
          </Text>
        </div>

        <Item
          name="subject"
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
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  );
};
