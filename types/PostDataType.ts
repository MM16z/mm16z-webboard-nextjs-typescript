export interface PostDataType {
    posts: PostDataTypes;
    // currentPage: number;
    error?: string;
    status?: string;
}

export interface PostDataTypes {
    allPosts: AllPostsType[];
    postsCount: number;
    userPostData: UserPostDataType[];
}
export type AllPostsType = {
    post_id: number;
    post_from: string;
    post_title: string;
    post_content: string;
    post_createdat: string;
    post_liked_count: number;
    isLiked: boolean;
    comments: AllPostCommentsType[];
};

export type AllPostCommentsType = {
    comment_id: number;
    comment_from: string;
    comment_content: string;
    comment_date: string;
};

export type UserPostDataType = {
    post_id: number;
    post_from: string;
    post_title: string;
    post_content: string;
    post_createdat: string;
}