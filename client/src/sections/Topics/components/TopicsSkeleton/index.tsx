import React from "react";
import { List, Skeleton } from "antd";
import topicLoadingCardCover from "../../assets/topic-loading-card-cover.jpg";


export const TopicsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <div>
      <Skeleton paragraph={{ rows: 1, style: { paddingLeft: "2em" }}} />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={emptyData}
        renderItem={() => (
          <List.Item extra={<Skeleton.Image style={{ width: 272, height: 255 }} />}>
            <div
              className="listing-card__details"
              style={{ backgroundImage: `url(${topicLoadingCardCover})` }}
            >
              <List.Item.Meta
                avatar={
                  <Skeleton.Avatar
                    active={false}
                    size={"default"}
                    shape={"circle"}
                  />
                }
                title={<Skeleton paragraph={{ rows: 1 }} />}
              />
              <div className="listing-card__description">
                <Skeleton
                  paragraph={{ rows: 3, style: { maxWidth: "70em" } }}
                />
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
