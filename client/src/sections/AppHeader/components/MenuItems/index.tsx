import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/react-hooks";
import { Avatar, Button, Menu } from "antd";
import {
  FormOutlined,
  ReadOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  userLogout,
  userLogoutVariables,
} from "../../../../lib/graphql/queries/Logout/__generated__/userLogout";
import { ErrorBanner } from "../../../../lib/components";
import {
  ERROR_MESSAGE,
  ERROR_CANT_LOGOUT,
  ERROR_ACCESS_REVOKED,
  ERROR_FORCED_LOGOUT,
} from "../../../../lib/promptMessages/error";
import { SUCCESS_LOGOUT } from "../../../../lib/promptMessages/success";
import { displaySuccessNotification } from "../../../../lib/utils";
import { LOG_OUT } from "../../../../lib/graphql/queries";
import { Viewer } from "../../../../lib/types";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [errorMsg, setErrorMsg] = useState(ERROR_MESSAGE);
  const [errorDescription, setErrorDescription] = useState(ERROR_CANT_LOGOUT);
  const [logOut, { error }] = useLazyQuery<userLogout, userLogoutVariables>(
    LOG_OUT,
    {
      variables: { token: viewer.token || "" },
      onCompleted: () => {
        setViewer({ token: "", id: null, avatar: null });
        localStorage.clear();
        displaySuccessNotification(SUCCESS_LOGOUT);
      },
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
              setViewer({ token: null, id: null, avatar: null });
              localStorage.clear();
            }, 5000);
          } else {
            setErrorDescription(errorMessage);
          }
        }
      },
    }
  );

  const errorBanner =
    error && viewer.token ? (
      <ErrorBanner message={errorMsg} description={errorDescription} />
    ) : null;

  const handleLogOut = async () => {
    logOut({ variables: { token: viewer.token || "" } });
  };

  const menuItemCreateTopic = (
    <Item key="/create">
      <Link to="/create">
        <FormOutlined translate="" />
        New Topic
      </Link>
    </Item>
  );

  const menuAllTopics = (
    <Item key="/topics">
      <Link to="/topics">
        <ReadOutlined translate="" />
        All Topics
      </Link>
    </Item>
  );

  const subMenuLogin = viewer.token ? (
    <SubMenu title={<Avatar src={viewer.avatar} />}>
      <Item key="/user">
        <Link to={`/user/${viewer.id}`}>
          <UserOutlined translate="" />
          Profile
        </Link>
      </Item>
      <Item key="/logout">
        <div onClick={() => handleLogOut()}>
          <LogoutOutlined translate="" />
          Log out
        </div>
      </Item>
    </SubMenu>
  ) : (
    <Item>
      <Link to="/login">
        <Button type="primary">Sign In</Button>
      </Link>
    </Item>
  );

  return (
    <React.Fragment>
      {errorBanner}
      <Menu mode="horizontal" selectable={false} className="menu">
        {menuAllTopics}
        {menuItemCreateTopic}
        {subMenuLogin}
      </Menu>
    </React.Fragment>
  );
};
