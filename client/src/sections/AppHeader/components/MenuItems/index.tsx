import React from "react";
import { Link } from "react-router-dom";
import { useApolloClient, useLazyQuery } from "@apollo/react-hooks";
import { Avatar, Button, Menu } from "antd";
import {
  FormOutlined,
  ReadOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { LOG_OUT } from "../../../../lib/graphql/queries";
import {
  userLogout,
  userLogoutVariables,
} from "../../../../lib/graphql/queries/Logout/__generated__/userLogout";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../../../lib/utils";
import { Viewer } from "../../../../lib/types";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut, {}] = useLazyQuery<userLogout, userLogoutVariables>(LOG_OUT, {
    variables: { token: viewer.token },
    onCompleted: (data) => {
      setViewer({ token: null, id: null, avatar: null });
      localStorage.clear();
      displaySuccessNotification("You've successfully logged out!");
    },
    onError: (data) => {
      const gqlErrors = data.graphQLErrors[0];
      if (gqlErrors) {
        const exception = gqlErrors.extensions?.exception;
        const statusCode = exception.context.info;
        const errorMessage = gqlErrors.message;
        if (statusCode == 401) {
          displayErrorMessage(
            errorMessage +
              " Either your access has expired or you've logged in your account on another device."
          );
          displayErrorMessage("You will be logged out in 5 seconds...");
          setTimeout(() => {
            setViewer({ token: null, id: null, avatar: null });
            localStorage.clear();
          }, 5000);
        } else if (statusCode !== 401 && errorMessage) {
          displayErrorMessage(
            "Sorry! We weren't able to log you out. Please try again later!"
          );
          displayErrorMessage(errorMessage);
        }
      } else {
        displayErrorMessage(
          "Sorry! We weren't able to log you out. Please try again later!"
        );
      }
    },
  });

  const handleLogOut = async () => {
    logOut({ variables: { token: viewer.token } });
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
      <Menu mode="horizontal" selectable={false} className="menu">
        {menuAllTopics}
        {menuItemCreateTopic}
        {subMenuLogin}
      </Menu>
    </React.Fragment>
  );
};
