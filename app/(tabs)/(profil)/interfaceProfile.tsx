export interface UserProfileInterface {
    id: string;
    email: string;
    first_name: string;
    name: string;
    profile_photo: string;
    question: Array<{
        id: string;
        question: string;
        method: string;
        gender: string;
        q_order: string;
        userAnswer: string;
        answers: Array<{
            id: string;
            answer: string;
            text: string;
        }>;
    }>;
    blockedProfiles: string[];
    payout: number;
    pendingPayout: number;
    gender: string;
    app: string;
    superlike: string;
    guest: string;
    bio_url: string | null;
    moderator: string | null;
    subscribe: string;
    facebook_id: string;
    profile_photo_big: string;
    random_photo: string;
    unreadMessagesCount: string;
    story: string;
    stories: string[];
    total_photos: string;
    total_photos_public: string;
    total_photos_private: string;
    total_likers: string;
    total_nolikers: string;
    mylikes: string;
    totalLikes: number;
    likes_percentage: number;
    galleria: Array<{
        image: string;
        photoId: string;
        private: string;
    }>;
    total_likes: string;
    extended: {
        uid: string;
        field1: string | null;
        field2: string | null;
        field3: string | null;
        field4: string | null;
        field5: string | null;
        field6: string | null;
        field7: string | null;
        field8: string | null;
        field9: string | null;
        field10: string | null;
    };
    interest: string[];
    status_info: number;
    status: string;
    city: string;
    email_verified: string;
    country: string;
    age: string;
    paypal: string | null;
    phone: string;
    sms_verification: string;
    sms_verified: string;
    country_code: string;
    lang_prefix: string;
    rnd_f: string[];
    lat: string;
    lng: string;
    birthday: string;
    registerReward: string;
    last_access: string;
    admin: string;
    username: string;
    lang: string;
    language: string;
    looking: string;
    premium: number;
    newFans: string;
    newVisits: string;
    totalVisits: string;
    totalMyLikes: string;
    totalFans: string;
    totalMatches: number;
    ip: string;
    premium_check: number;
    verified: string;
    popular: string;
    credits: string;
    link: string;
    online: string;
    fake: string;
    join_date: string;
    bio: string;
    meet: string;
    discover: string;
    s_gender: string;
    s_radius: string;
    s_age: string;
    twitter_id: string | null;
    google_id: string | null;
    instagram_id: string | null;
    online_day: string;
    slike: string;
    sage: string;
    photos: Array<{
        id: string;
        thumb: string;
        photo: string;
        approved: string;
        profile: string;
        private: string;
        blocked: string;
    }>;
    notification: {
        fan: {
            email: string;
            push: string;
            inapp: string;
        };
        match_me: {
            email: string;
            push: string;
            inapp: string;
        };
        near_me: {
            email: string;
            push: string;
            inapp: string;
        };
        message: {
            email: string;
            push: string;
            inapp: string;
        };
    };
}
