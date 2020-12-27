import React from "react";
import { Link } from "react-router-dom";
import { Card, Typography } from "antd";
import { MessageOutlined }  from "@ant-design/icons";
import { iconColor } from "../../utils";
import {
    getAllTopics_topics_data as TopicsData
  } from "../../../lib/graphql/queries/Topics/__generated__/getAllTopics";

interface Props {
  topic: TopicsData | null
}

const { Text } = Typography;

export const TopicCard = ({ topic }: Props) => {
  const image = "https://res.cloudinary.com/tiny-house/image/upload/v1560645376/mock/Los%20Angeles/los-angeles-listing-7_qapmfv.jpg";
  return (
    <Link to={`/topic/${topic?.id}`}>
      <Card
        hoverable
        cover={
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="listing-card__cover-img"
          />
        }
      >
        <div className="listing-card__details">
          <div className="listing-card__description">
            <Text strong ellipsis className="listing-card__title">
              {topic?.subject}
            </Text>
            <Text ellipsis className="listing-card__address">
              {topic?.description?.split(".")[0]}
            </Text>
          </div>
          <div className="listing-card__dimensions listing-card__dimensions--guests">
            <MessageOutlined translate="" style={{ color: iconColor, paddingRight: "5px", fontSize: "14px" }} />
            <Text>{topic?.messages?.length} Comments</Text>
          </div>
        </div>
      </Card>
    </Link>
  );
};
