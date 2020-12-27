import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import { Layout, Space, List, Avatar, Typography, Spin, Row } from "antd";
import {
  getAllTopics as TopicsData,
  getAllTopicsVariables as TopicsVariables,
  getAllTopics_topics_data,
} from "../../lib/graphql/queries/Topics/__generated__/getAllTopics";
import {
  ERROR_MESSAGE,
  ERROR_TRY_SOON,
  ERROR_FORCED_LOGOUT,
} from "../../lib/promptMessages/error";
import defaultImage from "../../lib/utils/images/default.jpg";
import { MessageOutlined } from "@ant-design/icons";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { TopicsSkeleton } from "./components/TopicsSkeleton";
import { TOPICS } from "../../lib/graphql/queries";
import { Viewer } from "../../lib/types";
import { iconColor } from "../../lib/utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

interface getAllTopics_data extends getAllTopics_topics_data {
  image: string;
}

const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;

export const Topics = ({ viewer, setViewer }: Props) => {
  const [errorMsg, setErrorMsg] = useState(ERROR_MESSAGE);
  const [page, setPage] = useState(1);
  const [errorDescription, setErrorDescription] = useState(ERROR_TRY_SOON);
  const [topics, setTopics] = useState<any>([]);
  const { data, loading, error, refetch } = useQuery<
    TopicsData,
    TopicsVariables
  >(TOPICS, {
    variables: {
      token: viewer.token || "",
      page: page,
    },
    onCompleted: (data) => {
      setTopics(topics.concat(data.topics!.data));
    },
    onError: (data) => {
      const gqlErrors = data.graphQLErrors && data.graphQLErrors?.length ? data.graphQLErrors[0] : null;
      if (gqlErrors) {
        const exception = gqlErrors.extensions?.exception;
        const statusCode = exception.context.info;
        const errorMessage = gqlErrors.message;
        if (statusCode === "401" && viewer.token) {
          setErrorMsg(errorMessage);
          setErrorDescription(ERROR_FORCED_LOGOUT);
          setTimeout(() => {
            setViewer({ token: "", id: null, avatar: null });
            localStorage.clear();
          }, 5000);
        } else if (statusCode !== "401" && errorMessage && viewer.token) {
          setErrorMsg(errorMessage);
        }
      }
    },
  });

  const handleFetchMore = () => {
    if (data!.topics?.has_next) {
      setPage(data!.topics!.next_num!);
    }
    refetch({
      token: viewer.token!,
      page: page,
    });
  };

  if (loading && page === 1 && viewer.token) {
    return (
      <Content className="listings">
        <TopicsSkeleton />
      </Content>
    );
  }

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
            You'll have to be signed in to view our topics!
          </Title>
          <Text type="secondary">
            You can sign in at the <Link to="/login">/login</Link> page to
            continue.
          </Text>
        </div>
      </Content>
    );
  }

  const topicsLoadingMore = (
    <Row justify="center">
      {loading && data?.topics?.has_next ? (
        <Spin size="large" tip="Loading" />
      ) : (
        <Text type="secondary">End of Results</Text>
      )}
    </Row>
  );

  const topicsSection =
    data?.topics?.data && data?.topics?.data?.length ? (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={topics}
        renderItem={(topic: getAllTopics_data) => (
          <List.Item
            key={topic?.id || ""}
            extra={
              <Link to={`/topic/${topic?.id}`}>
                <img width={272} alt="logo" src={defaultImage} />
              </Link>
            }
          >
            <div className="listing-card__details">
              <List.Item.Meta
                avatar={
                  <Link to={`/user/${topic?.created_by?.id}`}>
                    <Avatar src={topic?.created_by.avatar} />
                  </Link>
                }
                title={<a href={`/topic/${topic?.id}`}>{topic?.subject}</a>}
              />
              <Link to={`/topic/${topic?.id}`}>
                <div className="listing-card__description">
                  <Paragraph
                    style={{ maxWidth: "70em" }}
                    ellipsis={{ rows: 3, expandable: false }}
                  >
                    {topic?.description}
                  </Paragraph>
                </div>
              </Link>
              <div className="listing-card__dimensions listing-card__dimensions--guests">
                <Space style={{ marginBottom: "0em" }}>
                  <Link to={`/topic/${topic?.id}#comments`}>
                    <MessageOutlined
                      translate=""
                      style={{ color: iconColor, fontSize: "14px" }}
                    />
                  </Link>
                  <Link to={`/topic/${topic?.id}#comments`}>
                    <Text>{topic?.messages_count} Comments</Text>
                  </Link>
                </Space>
              </div>
            </div>
          </List.Item>
        )}
      ></List>
    ) : (
      <div>
        <Paragraph>
          Be the first person to start a <Link to="/create">Topic</Link>!
        </Paragraph>
      </div>
    );

  return (
    <Content className="listings">
      <Link to="/topics">
        <Title level={3} className="listings__title">
          Topics
        </Title>
      </Link>
      <InfiniteScroll
        initialLoad={false}
        threshold={50}
        pageStart={1}
        loadMore={handleFetchMore}
        hasMore={!loading && data?.topics?.has_next!}
        useWindow={true}
      >
        {topicsSection}
        {topicsLoadingMore}
      </InfiniteScroll>
    </Content>
  );
};
