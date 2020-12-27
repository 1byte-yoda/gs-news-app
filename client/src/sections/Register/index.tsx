import React, { useState } from "react";
import { Redirect } from "react-router";
import { useMutation } from "@apollo/react-hooks";
import { Form, Input, Button, Card, Layout, Spin, Typography } from "antd";
import {
  userRegister,
  userRegisterVariables,
} from "../../lib/graphql/mutations/Register/__generated__/userRegister";
import {
  ERROR_LOG_IN_DENIED,
  ERROR_MESSAGE,
} from "../../lib/promptMessages/error";
import { SUCCESS_REGISTER } from "../../lib/promptMessages/success";
import { ErrorBanner } from "../../lib/components";
import { REGISTER } from "../../lib/graphql/mutations";
import { displaySuccessNotification } from "../../lib/utils";
import { Viewer } from "../../lib/types";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  viewer: Viewer;
}

interface userRegisterInput extends userRegisterVariables {
  firstName?: string;
  lastName?: string;
}

export const Register = ({ viewer }: Props) => {
  const [errorMsg, setErrorMsg] = useState(ERROR_MESSAGE);
  const [register, { data, loading, error }] = useMutation<
    userRegister,
    userRegisterVariables
  >(REGISTER, {
    onCompleted: (data) => {
      if (data && data.user_register) {
        displaySuccessNotification(SUCCESS_REGISTER);
      }
    },
    onError: (data) => {
      const gqlErrors = data.graphQLErrors[0];
      if (gqlErrors) {
        const errorMessage = gqlErrors.message;
        setErrorMsg(errorMessage);
      }
    },
  });

  const handleLRegister = async (values: userRegisterInput) => {
    const name = `${values.firstName} ${values.lastName}`;
    const input = {
      ...values,
      name: name,
    };
    delete input.firstName;
    delete input.lastName;
    register({ variables: input });
  };

  if (loading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Creating your account..." />
      </Content>
    );
  }

  if (viewer.id || viewer.token) {
    const { id: userId } = viewer;
    return <Redirect to={`/user/${userId}`} />;
  }

  if (data && data.user_register) {
    return <Redirect to="/login" />;
  }

  const registerErrorBannerElement = error ? (
    <ErrorBanner description={ERROR_LOG_IN_DENIED} message={errorMsg} />
  ) : null;

  return (
    <Content className="log-in">
      {registerErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card-intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="grinning-face">
              😃
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Register
          </Title>
          <Text>Be part of GS News and be a Growsarian!</Text>
        </div>
        <Form
          name="normal_login"
          className="log-in-form"
          onFinish={handleLRegister}
        >
          <Form.Item
            name="firstName"
            rules={[
              { required: true, message: "Please input your First Name!" },
            ]}
          >
            <Input
              placeholder="Juan"
            />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[
              { required: true, message: "Please input your Last Name!" },
            ]}
          >
            <Input
              placeholder="Tamad"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input
              placeholder="jose@samplemail.com"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your Password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The two passwords that you entered do not match!"
                  );
                },
              }),
            ]}
          >
            <Input
              type="password"
              placeholder="Confirm password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="log-in-form-button"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Content>
  );
};
