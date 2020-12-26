import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Col, Layout, Row } from "antd";
// import { USER } from "../../lib/graphql/queries";
// import {
//   User as UserData,
//   UserVariables
// } from "../../lib/graphql/queries/User/__generated__/User";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { Viewer } from "../../lib/types";
import { UserProfile } from "./components";

interface Props {
  viewer: Viewer;
}

interface MatchParams {
  id: string;
}

const { Content } = Layout;

export const User = ({ viewer, match }: Props & RouteComponentProps<MatchParams>) => {
  const userProfileElement = true ? (
    <UserProfile  />
  ) : null;


  return (
    <Content className="user">
      <Row gutter={12} justify="center">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  );
};
