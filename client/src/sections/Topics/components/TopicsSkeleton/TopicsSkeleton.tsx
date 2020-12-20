import React from "react";
import { Alert, Divider, Skeleton } from "antd";
import "./styles/TopicsSkeleton.css";

interface Props {
    title: string;
    error?: boolean;
}

export const TopicsSkeleton = ({ title, error = false }: Props) => {
    const errorAlert = error ? (
            <Alert
                type="error"
                message="Uh oh! Something went wrong - please try again 
                later 
                :("
                className="topics-skeleton__alert"
            />
        ) : null;
    return (
        <div className="topics-skeleton">
            {errorAlert}
            <h2>{title}</h2>
            <Skeleton active paragraph={{ rows: 1 }}/>
            <Divider/>
            <Skeleton active paragraph={{ rows: 1 }}/>
            <Divider/>
            <Skeleton active paragraph={{ rows: 1 }}/>
        </div>
    )
};
