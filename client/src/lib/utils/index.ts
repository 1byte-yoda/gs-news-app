import { message, notification } from "antd";

export const iconColor = "#1890ff";

export const toReadableDate = (date: string) => {
    const jsDate = new Date(date);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric' ,
        hour: '2-digit',
        minute: '2-digit'
    };
    return jsDate.toLocaleString('default', options);
}

export const displaySuccessNotification = (message: string, description?: string) => {
    return notification["success"]({
        message,
        description,
        placement: "topLeft",
        style: {
            marginTop: 50
        }
    });
};

export const displayErrorMessage = (error: string) => {
    return message.error(error);
};
