import React from "react";
import { Redirect } from "react-router";
import { useMutation } from "@apollo/react-hooks"
import {
    Form,
    Input,
    Button,
    Card,
    Layout,
    Spin,
    Typography
} from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {
    userLogin,
    userLoginVariables
} from "../../lib/graphql/mutations/Login/__generated__/userLogin";
import { ErrorBanner } from "../../lib/components";
import { LOG_IN } from "../../lib/graphql/mutations";
import {
    displaySuccessNotification,
    displayErrorMessage
} from "../../lib/utils";
import { Viewer } from "../../lib/types";


interface Props {
    setViewer: (user_login: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = ({ setViewer }: Props) => {
    const [
        logIn,
        { data: logInData, loading: logInLoading, error: logInError }
    ] = useMutation<userLogin, userLoginVariables>(LOG_IN, {
        onCompleted: data => {
            if (data && data.user_login) {
                setViewer(data)
                displaySuccessNotification("You've successfully logged in!");
            }
        }
    });
    const handleLogin = async (login: userLoginVariables) => {
        try {
            logIn({ variables: login })
        } catch {
            displayErrorMessage("Sorry! We weren't able to log you in. Please try again later!");
        }
    };

    if (logInLoading) {
        return (
            <Content className="log-in">
                <Spin size="large" tip="Logging you in..." />
            </Content>
        );
    }

    if (logInData && logInData.user_login) {
        return <Redirect to="/topics" />;
    }

    const logInErrorBannerElement = logInError ? (
        <ErrorBanner
            description="Sorry! We weren't able to log you in. Please try again later!"
        />
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
                        rules={[{ required: true, message: 'Please input your Email!' }]}
                    >
                        <Input prefix={<UserOutlined translate="" className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined translate="" className="site-form-item-icon" />}
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
                        <Button type="primary" htmlType="submit" className="log-in-form-button">
                            Sign in
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Text>Or <a href="example@example.com">register now!</a></Text>
                    </Form.Item>
                </Form>
            </Card>
        </Content>
    )
};
