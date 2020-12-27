import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Col, Layout, Row, Typography } from "antd";
import { USER } from "../../lib/graphql/queries";
import {
  getUser as UserData,
  getUserVariables as UserVariables,
} from "../../lib/graphql/queries/User/__generated__/getUser";
import {
  ERROR_MESSAGE,
  ERROR_ACCESS_REVOKED,
  ERROR_FORCED_LOGOUT,
  ERROR_TRY_SOON,
} from "../../lib/promptMessages/error";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { Viewer } from "../../lib/types";
import { UserProfile } from "./components";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

interface MatchParams {
  id: string;
}

const { Content } = Layout;
const { Text, Title } = Typography

export const User = ({ viewer, setViewer }: Props) => {
  const userUrl: MatchParams = useParams();
  const [errorMsg, setErrorMsg] = useState(ERROR_MESSAGE);
  const [errorDescription, setErrorDescription] = useState(ERROR_TRY_SOON);
  const { data: user, error } = useQuery<UserData, UserVariables>(USER, {
    variables: { token: viewer.token || "", id: userUrl.id },
    onError: (data) => {
      const gqlErrors = data.graphQLErrors && data.graphQLErrors?.length ? data.graphQLErrors[0] : null;
      if (gqlErrors) {
        const exception = gqlErrors.extensions?.exception;
        const statusCode = exception.context.info;
        const errorMessage = gqlErrors.message;
        if (statusCode === "401") {
          setErrorDescription(ERROR_ACCESS_REVOKED);
          setErrorMsg(ERROR_FORCED_LOGOUT);
          setTimeout(() => {
            setViewer({ token: "", id: null, avatar: null });
            localStorage.clear();
          }, 5000);
        } else {
          setErrorDescription(errorMessage);
        }
      }
    },
  });

  if (error && viewer.token) {
    return (
      <Content className="user">
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
            You'll have to be signed in to view our users!
          </Title>
          <Text type="secondary">
            You can sign in at the <Link to="/login">/login</Link> page to
            continue.
          </Text>
        </div>
      </Content>
    );
  }

  const userProfileElement = true ? <UserProfile user={user} /> : null;

  return (
    <Content className="user">
      <Row gutter={12} justify="center">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  );
};
