import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Layout, Divider, Typography, Tooltip, Menu, Dropdown, Button, Row, Col, Modal  } from "antd";
import { CalendarOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {  getTopic_topic as TopicData } from "../../../../lib/graphql/queries/Topic/__generated__/getTopic";
import { ErrorBanner, PageSkeleton } from "../../../../lib/components";
import { iconColor, toReadableDate } from "../../../../lib/utils";

interface Props {
  topic: TopicData;
}

const { Paragraph, Title } = Typography;
const { Content } = Layout;

export const TopicDetails = ({ topic }: Props) => {
  const [expanded, setExapnded] = useState(false);
  const { id: topic_id, subject, description, created_by, updated_by, created_at, updated_at, deleted_at } = topic;
  const image = "https://picsum.photos/570";

  if (deleted_at) {
    return (
      <Content className="listings">
        <ErrorBanner description="This topic does not exists! Please try again!" />
        <PageSkeleton />
      </Content>
    );
  }

  const handleDeleteTopic = () => {
    console.log("Deleted!")
  }

  const handleExandParagraphClicked = () => {
    setExapnded(!expanded)
  }

  const deleteModalMessage = (
    <Paragraph>
      <Paragraph>You can't undo this action.</Paragraph>
      <Paragraph>Are you sure you want to delete this topic?</Paragraph>
    </Paragraph>
  )

  const deleteModalIcon = (
    <QuestionCircleOutlined translate=""/>
  );

  const showDeleteTopicModal = () => {
    Modal.confirm({
      title: 'Delete Topic',
      onOk: handleDeleteTopic,
      icon: deleteModalIcon,
      content: deleteModalMessage,
      okText: 'Confirm',
      cancelText: 'Cancel',
    });
  }

  const paragraphElipsisOptions = {
      rows: 4,
      expandable: true,
      symbol: "more",
      onExpand: handleExandParagraphClicked
  }
  
  const descriptionParagraphized = description?.split("\n\n").map(
    (sentence) => {
      return (
          <Paragraph>
          {sentence}
          </Paragraph>
      )
  });

  const UserModMenuOverLay = (
    <Menu>
      <Menu.Item onClick={showDeleteTopicModal}>
          <DeleteOutlined translate=""/> Delete
      </Menu.Item>
      <Menu.Item>
        <a href={`/topic/${topic_id}/edit`}>
          <EditOutlined translate=""/> Edit
        </a>
      </Menu.Item>
    </Menu>
  );

  const UserModMenu = () => (
    <Dropdown key="more" overlay={UserModMenuOverLay} trigger={["click"]}>
      <Button
        style={{
          border: 'none',
          padding: 0,
        }}
      >
        <EllipsisOutlined
          translate=""
          style={{
            fontSize: 25,
            color: iconColor,
            verticalAlign: 'top',
          }}
        />
      </Button>
    </Dropdown>
  );

  return (
    <div className="listing-details">
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="listing-details__image"
      />
      <div className="listing-details__information">
        <Paragraph type="secondary" ellipsis className="listing-details__city-address">
        <Row justify="space-between">
          <Col>
            <CalendarOutlined translate="" style={{ color: iconColor, paddingRight: "5px"}} />
            <Tooltip
              title={`Last updated: ${toReadableDate(updated_at)} by ${updated_by.name}`}
            >
              {toReadableDate(created_at)}
            </Tooltip>
          </Col>
          <Col>
            <UserModMenu/>
          </Col>
        </Row>
        </Paragraph>
          <Title level={3} className="listing-details__title">
            {subject}
          </Title>
      </div>
      <Divider />
      <div className="listing-details__section">
        <Link to={`/user/${created_by.id}`}>
          <Avatar src={"https://www.gravatar.com/avatar/"} size={64} />
          <Title level={2} className="listing-details__host-name">
            {created_by.name}
          </Title>
        </Link>
      </div>
      <Divider />
      <div className="listing-details__section">
        <Title level={4}>About this topic </Title>
        <Paragraph ellipsis={paragraphElipsisOptions}>
            {expanded ? descriptionParagraphized : description}
        </Paragraph>
      </div>
    </div>
  );
};
