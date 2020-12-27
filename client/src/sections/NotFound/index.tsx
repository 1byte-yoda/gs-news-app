import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Empty, Layout, Typography } from "antd";
import {
  ERROR_MESSAGE,
  ERROR_PAGE_NOT_FOUND,
} from "../../lib/promptMessages/error";

const { Content } = Layout;
const { Text } = Typography;

export const NotFound = () => {
  return (
    <Content className="not-found">
      <Empty
        description={
          <Fragment>
            <Text className="not-found__description-title">
              {ERROR_MESSAGE}
            </Text>
            <Text className="not-found__description-subtitle">
              {ERROR_PAGE_NOT_FOUND}
            </Text>
          </Fragment>
        }
      />
      <Link
        to="/"
        className="not-found__cta ant-btn ant-btn-primary ant-btn-lg"
      >
        Go to Home
      </Link>
    </Content>
  );
};
