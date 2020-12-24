import React, { useState, Dispatch, SetStateAction } from "react";
import { Link, Redirect } from "react-router-dom";
import moment from "moment";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_TOPIC } from "../../../../lib/graphql/mutations/DeleteTopic";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../../../lib/utils";
import {
  Avatar,
  Layout,
  Divider,
  Typography,
  Tooltip,
  Menu,
  Dropdown,
  Button,
  Row,
  Col,
  Modal,
  Space,
} from "antd";
import {
  CalendarOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getTopic_topic as TopicData } from "../../../../lib/graphql/queries/Topic/__generated__/getTopic";
import {
  deleteTopic as deleteTopicData,
  deleteTopicVariables,
} from "../../../../lib/graphql/mutations/DeleteTopic/__generated__/deleteTopic";
import { ErrorBanner, PageSkeleton } from "../../../../lib/components";
import { iconColor } from "../../../../lib/utils";
import { Viewer } from "../../../../lib/types";

interface Props {
  topic: TopicData;
}

interface ViewerProps {
  viewer: Viewer;
  setProcessingTopic: Dispatch<SetStateAction<boolean>>;
}

const { Paragraph, Title, Text } = Typography;
const { Content } = Layout;

export const TopicDetails = ({ viewer, topic, setProcessingTopic }: Props & ViewerProps) => {
  const [expanded, setExapanded] = useState(false);
  const [counter, setCounter] = useState(0);
  const {
    id: topic_id,
    subject,
    description,
    created_by,
    updated_by,
    created_at,
    updated_at,
    deleted_at,
  } = topic;
  const [deleteTopic, { loading, data }] = useMutation<
    deleteTopicData,
    deleteTopicVariables
  >(DELETE_TOPIC, {
    onCompleted: () => {
      displaySuccessNotification("You've successfully deleted your topic!");
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to delete your topic. Please try again later."
      );
    },
  });
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
    if (viewer.token && topic_id) {
      deleteTopic({ variables: { token: viewer.token, topic_id: topic_id } });
    }
  };

  if (loading) {
    setProcessingTopic(true);
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Please wait!
          </Title>
          <Text type="secondary">We're deleting your topic now.</Text>
        </div>
      </Content>
    );
  }

  if (data && data.topic_delete) {
    return <Redirect to={`/topics`} />;
  }

  const handleExandParagraphClicked = () => {
    setCounter(!expanded ? counter + 0 : counter + 1);
    setExapanded(!expanded);
  };

  const ellipsisOptions = {
    rows: 4,
    expandable: true,
    symbol: "More",
    onExpand: handleExandParagraphClicked,
  };

  const deleteModalMessage = (
    <Paragraph>
      <Paragraph>You can't undo this action.</Paragraph>
      <Paragraph>Are you sure you want to delete this topic?</Paragraph>
    </Paragraph>
  );

  const deleteModalIcon = <QuestionCircleOutlined translate="" />;

  const showDeleteTopicModal = () => {
    Modal.confirm({
      title: "Delete Topic",
      onOk: handleDeleteTopic,
      icon: deleteModalIcon,
      content: deleteModalMessage,
      okText: "Confirm",
      cancelText: "Cancel",
    });
  };

  const descriptionParagraphized = description
    ?.split("\n\n")
    .map((sentence, index) => {
      if (index === description.split("\n\n").length - 1) {
        return (
          <Paragraph key={index}>
            {sentence}{" "}
            {expanded && <a onClick={handleExandParagraphClicked}>Less</a>}
          </Paragraph>
        );
      }
      return <Paragraph key={index}>{sentence}</Paragraph>;
    });

  const UserModMenuOverLay = (
    <Menu>
      <Menu.Item onClick={showDeleteTopicModal}>
        <DeleteOutlined translate="" /> Delete
      </Menu.Item>
      <Menu.Item>
        <a href={`/topic/${topic_id}/edit`}>
          <EditOutlined translate="" /> Edit
        </a>
      </Menu.Item>
    </Menu>
  );

  const UserModMenu =
    created_by.id === viewer.id ? (
      <Dropdown key="more" overlay={UserModMenuOverLay} trigger={["click"]}>
        <Button
          style={{
            border: "none",
            padding: 0,
          }}
        >
          <EllipsisOutlined
            translate=""
            style={{
              fontSize: 25,
              color: iconColor,
              verticalAlign: "top",
            }}
          />
        </Button>
      </Dropdown>
    ) : null;

  const updatedIndicator =
    updated_at !== created_at ? (
      <Tooltip
        title={`${moment(updated_at).format("LLL")} by ${updated_by.name}`}
      >
        <ClockCircleOutlined translate="" />
      </Tooltip>
    ) : null;

  return (
    <div className="listing-details">
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="listing-details__image"
      />
      <div className="listing-details__information">
        <Paragraph
          type="secondary"
          ellipsis
          className="listing-details__city-address"
        >
          <Row justify="space-between">
            <Col>
              <Space>
                <CalendarOutlined translate="" style={{ color: iconColor }} />
                <Tooltip title={`${moment(updated_at).format("LLL")}`}>
                  {moment(created_at).fromNow()}
                </Tooltip>
                {updatedIndicator}
              </Space>
            </Col>
            <Col>{UserModMenu}</Col>
          </Row>
        </Paragraph>
        <Title level={3} className="listing-details__title">
          {subject}
        </Title>
      </div>
      <Divider />
      <div className="listing-details__section">
        <Link to={`/user/${created_by.id}`}>
          <Avatar src={created_by.avatar} size={64} />
          <Title level={2} className="listing-details__host-name">
            {created_by.name}
          </Title>
        </Link>
      </div>
      <Divider />
      <div key={counter} className="listing-details__section">
        <Title level={4}>About this topic </Title>
        <Paragraph ellipsis={ellipsisOptions}>
          {expanded ? descriptionParagraphized : description}
        </Paragraph>
      </div>
    </div>
  );
};
