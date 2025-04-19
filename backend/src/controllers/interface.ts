export interface LoginInterface {
    userId: number,
    username: string,
    email: string,
    password?: string,
    provider?: string,
    oauth_id?: string,
    profile_image?: string,
    profile_status?: string,
    last_seen_at: Date,
    created_at: Date,
    updated_at: Date,
}

export interface GroupInterface {
    groupId: number
    groupName: string,
    adminId: number,
    created_at: Date,
    updated_at: Date,
}

export interface ChitchatMsg {
    chitchatId: number,
    message: string,
    senderId: number,
    receiverId: number,
    fileAddress?: string,
    created_at: Date,
    updated_at: Date,
}