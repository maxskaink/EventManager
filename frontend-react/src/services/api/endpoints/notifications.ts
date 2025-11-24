import axiosInstance from "../axios-instance";

async function listAllNotifications() {
    const response = await axiosInstance.get<{ notifications: API.Notification[] }>("/notification/all");
    return response.data;
}

async function listUserNotifications(user_id: number) {
    const response = await axiosInstance.get<{ notifications: API.Notification[] }>(`/notification/user/${user_id}`);
    return response.data;
}

async function listMyNotifications() {
    const response = await axiosInstance.get<{ notifications: API.Notification[] }>(`/notification/my`);
    return response.data;
}


export default {
    listAllNotifications,
    listUserNotifications,
    listMyNotifications
}
