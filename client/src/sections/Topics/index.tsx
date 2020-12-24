import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Layout, Space, List, Avatar, Typography } from "antd";
import { MessageOutlined } from '@ant-design/icons';
import { ErrorBanner } from "../../lib/components";
import { TopicsSkeleton } from "./components/TopicsSkeleton"
import { TOPICS } from "../../lib/graphql/queries";
import {
  getAllTopics as TopicsData,
  getAllTopicsVariables as TopicsVariables
} from "../../lib/graphql/queries/Topics/__generated__/getAllTopics";
import { Viewer } from "../../lib/types";
import { iconColor } from "../../lib/utils";

interface Props {
    viewer: Viewer,
}

interface PageProp {
    page: number
}

const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;

const PAGE_LIMIT = 8;

export const Topics = ({ viewer, page }: Props & PageProp) => {
  const { data, error, loading, fetchMore } = useQuery<TopicsData, TopicsVariables>(TOPICS, {
    variables: {
      token: viewer.token || "",
      page: page
    }
  });
  if (loading) {
    return (
      <Content className="listings">
        <TopicsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="We either couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common keywords." />
        <TopicsSkeleton />
      </Content>
    );
  }

    const topicsSectionAntd = 
        data?.topics?.data && data?.topics?.data?.length ? (
            <List
                itemLayout="vertical"
                size="large"
                dataSource={data.topics.data}
                renderItem={topic => (
                <List.Item
                    key={topic?.id || ""}
                    extra={
                        <Link to={`/topic/${topic?.id}`}>
                            <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            />
                        </Link>
                    }
                >
                    <div className="listing-card__details">
                        <List.Item.Meta
                            avatar={<Link to={`/user/${topic?.created_by?.id}`}><Avatar src={topic?.created_by.avatar} /></Link>}
                            title={<a href={`/topic/${topic?.id}`}>{topic?.subject}</a>}
                        />
                        <Link to={`/topic/${topic?.id}`}>
                            <div className="listing-card__description">
                                <Paragraph
                                    style={{maxWidth: "70em"}}
                                    ellipsis={{rows: 3, expandable: false}}
                                >
                                    {topic?.description}
                                </Paragraph>
                            </div>
                        </Link>
                        <div className="listing-card__dimensions listing-card__dimensions--guests">
                            <Space style={{ marginBottom: "0em" }}>
                                <Link to={`/topic/${topic?.id}#comments`}>
                                    <MessageOutlined translate="" style={{ color: iconColor, fontSize: "14px" }} />
                                </Link>
                                <Link to={`/topic/${topic?.id}#comments`}>
                                    <Text>{topic?.messages_count} Comments</Text>
                                </Link>
                            </Space>
                        </div>
                    </div>
                </List.Item>
                )}
            />
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
      {topicsSectionAntd}
    </Content>
  );
};
