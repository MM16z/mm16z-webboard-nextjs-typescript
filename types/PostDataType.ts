export interface PostDataType {
    posts: PostDataTypes;
    currentPage: number;
}

export interface PostDataTypes {
    allPosts: AllPostsType[];
    postsCount: { all_post_count: number };
    userPostData: UserPostDataType[];
}
export type AllPostsType = {
    post_id: number;
    post_from: string;
    post_title: string;
    post_content: string;
    post_createdAt: string;
    post_liked_count: number;
    isliked: boolean;
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
    post_createdAt: string;
}