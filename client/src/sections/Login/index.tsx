import React, { useState } from "react";
import { Redirect } from "react-router";
import { useMutation } from "@apollo/react-hooks";
import { Form, Input, Button, Card, Layout, Spin, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  userLogin,
  userLoginVariables,
} from "../../lib/graphql/mutations/Login/__generated__/userLogin";
import { ErrorBanner } from "../../lib/components";
import { LOG_IN } from "../../lib/graphql/mutations";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../lib/utils";
import { Viewer } from "../../lib/types";

interface Props {
  setViewer: (user_login: Viewer) => void;
  viewer: Viewer;
}

const { Content } = Layout;
const { Text, Title } = Typography;
const LOG_IN_DENIED =
  "Sorry! We weren't able to log you in. Please try again later!";

export const Login = ({ viewer, setViewer }: Props) => {
  const [errorMsg, setErrorMsg] = useState(LOG_IN_DENIED);
  const [errorDescription, setErrorDescription] = useState(LOG_IN_DENIED);
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<userLogin, userLoginVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.user_login) {
        setViewer(data.user_login);
        localStorage.setItem("token", data.user_login.token || "");
        localStorage.setItem("id", data.user_login.id || "");
        localStorage.setItem("avatar", data.user_login.avatar || "");
        displaySuccessNotification("You've successfully logged in!");
      }
    },
    onError: (data) => {
      const gqlErrors = data.graphQLErrors[0];
      const errorMessage = gqlErrors.message;
      setErrorMsg(errorMessage);
    },
  });

  if (viewer.id || viewer.token) {
    const { id: userId } = viewer;
    return <Redirect to={`/user/${userId}`} />;
  }

  const handleLogin = async (login: userLoginVariables) => {
      logIn({ variables: login });
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description={errorDescription} message={errorMsg} />
  ) : null;

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card-intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to GS News!
          </Title>
          <Text>Sign in to start getting news updates about Growsari!</Text>
        </div>
        <Form
          name="normal_login"
          className="log-in-form"
          onFinish={handleLogin}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input
              prefix={
                <UserOutlined translate="" className="site-form-item-icon" />
              }
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={
                <LockOutlined translate="" className="site-form-item-icon" />
              }
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <a className="log-in-form-forgot" href="example@example.com">
              Forgot password
            </a>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="log-in-form-button"
            >
              Sign in
            </Button>
          </Form.Item>
          <Form.Item>
            <Text>
              Or <a href="example@example.com">register now!</a>
            </Text>
          </Form.Item>
        </Form>
      </Card>
    </Content>
  );
};
