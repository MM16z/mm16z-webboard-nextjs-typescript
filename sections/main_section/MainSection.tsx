import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';

import PostBoxContainer from "../../components/post-box-container";
import CommentBoxContainer from "../../components/comment-box-container";
import HeartBtn from "../../components/heartbtn";

import useAuthStore from "../../store/authStore";

import ReactPaginate from "react-paginate";
import Masonry from "react-masonry-css";

import dayjs from "dayjs";
import { FixWithoutRounding } from "../../utils/FixWithoutRounding";
import { GetServerSideProps } from "next";
import axios from "axios";
import { PostDataType } from "../../types/PostDataType";
import reqAuth from "../../auth/requestAuth";
import { useRouter } from "next/router";
import swal from "sweetalert2";
import { Blocks } from "react-loader-spinner";

const breakpointColumnsObj = {
    default: 4,
    1920: 3,
    1500: 2,
    1100: 1,
};

export default function MainSection({ posts }: PostDataType) {
    const router = useRouter();

    const useAuth = useAuthStore((state: any) => state.accessToken);
    const useUserName = useAuthStore((state: any) => state.userName);
    const useUserId = useAuthStore((state: any) => state.userId);

    const [currentPage, setcurrentPage] = useState<number>(0);
    const [postLikedCounts, setPostLikedCounts] = useState<number[]>([]);
    const [comment, setComment] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    let postsCount = posts?.postsCount / 6;
    if (postsCount < 1) {
        postsCount = 1;
    }

    const onPostlikeHandler = async (
        e: React.ChangeEvent<HTMLInputElement>,
        postId: number,
        index: number
    ) => {
        const DEBOUNCE_DELAY = 1500;
        const payloadData = {
            userid: useUserId,
            postid: postId,
        };
        if (!useAuth) {
            swal.fire({
                icon: 'error',
                title: 'xdding?',
                text: 'Please login frist!',
            })
            return router.push("login");
        }
        if ((await reqAuth()) === "noAuthorization") {
            swal.fire({
                icon: 'error',
                title: 'xdding?',
                text: 'out of session!',
            })
            return (window.location.href = "/");
        }
        if (e.target.checked === true) {
            axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user_post_liked`,
                JSON.stringify(payloadData),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setPostLikedCounts((prev) => {
                const newCount = [...prev];
                newCount[index] = Number(newCount[index]) + 1;
                return newCount;
            });
        } else {
            axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user_post_unliked`,
                JSON.stringify(payloadData),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setPostLikedCounts((prev) => {
                const newCount = [...prev];
                newCount[index] = Number(newCount[index]) - 1;
                return newCount;
            });
        }
        setIsButtonDisabled(true); // Disable the button
        setTimeout(() => {
            setIsButtonDisabled(false); // Enable the button after the debounce delay
        }, DEBOUNCE_DELAY);
    };

    const commentSubmitHandler = async (
        e: SyntheticEvent,
        postId: number,
        index: number
    ) => {
        e.preventDefault();
        if (!useAuth) {
            swal.fire({
                icon: 'error',
                title: 'xdding?',
                text: 'Please login first!',
            })
            return router.push("login");
        }
        setIsLoading(true);
        window.scrollTo(0, screen.height / 2)
        if ((await reqAuth()) === "noAuthorization") {
            swal.fire({
                icon: 'error',
                title: 'xdding?',
                text: 'Out of session!',
            })
            return (window.location.href = "/");
        }
        const payloadData = {
            postfrom: useUserName,
            postcontent: comment[index],
            postid: postId,
        };
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/user_post_comment`,
            JSON.stringify(payloadData),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.data.message === "emtpy content")
            return swal.fire({
                icon: 'error',
                title: 'xdding?',
                text: 'Empty content!',
            })
        if (response.data.status === "error") return swal.fire({
            icon: 'error',
            title: 'xdding?',
            text: 'Comment failed!',
        })
        if (response.data.status === "ok") {
            swal.fire({
                icon: 'success',
                title: 'xdding?',
                text: 'Comment success!',
            })
            setIsLoading(false);
            router.push({
                pathname: router.pathname,
                query: { page: currentPage + 1 },
            });
        }
        setComment((prev) => {
            const newState = [...prev];
            newState[index] = "";
            return newState;
        });
    };

    const handleDeleteComment = async (commentId: number) => {
        swal.fire({
            title: 'Are you sure to delete this comment?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true)
                window.scrollTo(0, screen.height / 2)
                if (!useAuth) {
                    swal.fire({
                        icon: 'error',
                        title: 'xdding?',
                        text: 'Please login first!',
                    })
                    return router.push("login");
                }
                if ((await reqAuth()) === "noAuthorization") {
                    swal.fire({
                        icon: 'error',
                        title: 'xdding?',
                        text: 'Out of session!',
                    })
                    return (window.location.href = "/");
                }
                const payloadData = {
                    commentId: commentId,
                };
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/user_post_comment_delete`,
                    JSON.stringify(payloadData),
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.data.status === "error") return swal.fire({
                    icon: 'error',
                    title: 'xdding?',
                    text: 'Delete comment failed!',
                })
                if (response.data.status === "ok") {
                    swal.fire({
                        icon: 'success',
                        title: 'xdding?',
                        text: 'Delete comment success!',
                    })
                    router.push({
                        pathname: router.pathname,
                        query: { page: currentPage + 1 },
                    });
                }
                setIsLoading(false)
            }
        })
    }

    const pagginationHandler = (page: any) => {
        let currentPage = page.selected + 1;
        setcurrentPage(Math.round(currentPage));
        router.push({
            pathname: router.pathname,
            query: { page: currentPage },
        });
    };

    useEffect(() => {
        setPostLikedCounts(posts?.allPosts?.map((post) => post.post_liked_count));
        const currentParam = router.query?.page;
        if (currentParam) {
            setcurrentPage(Number(currentParam) - 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts?.allPosts, currentPage]);


    return (
        <>
            {isLoading ? (
                <Blocks
                    visible={true}
                    height="280"
                    width="280"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{ top: "40%" }}
                    wrapperClass="blocks-wrapper-home"
                />
            ) : null}
            <div className="userstate">
                /Home, Howdy! :D @User : {useAuth ? useUserName : "Anonymous"}
            </div>
            <div className="masonry-warper">
            <h2 style={{
                    marginTop: "60px", wordBreak: "break-word", whiteSpace: "-moz-pre-wrap",
                    textAlign: "center", padding: "0px 24px 0px 24px"
                }}>Register with any non-existing email to post, comment, or like.<br />
                    <span>or try an global account? email/user=admin password=1234</span></h2>

                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                    style={{ marginTop: "20px" }}
                >
                    {posts?.allPosts?.map((post, index) => {
                        return (
                            <PostBoxContainer
                                key={post.post_id}
                                username={post.post_from}
                                title={post.post_title}
                                postcontent={post.post_content}
                                postdate={dayjs(post?.post_createdat).format("D MMM YYYY - HH:mm")}
                            >
                                <HeartBtn
                                    key={index}
                                    postLikedCount={postLikedCounts[index]}
                                    defaultChecked={post.isLiked}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        onPostlikeHandler(e, post.post_id, index);
                                    }}
                                    disabled={isButtonDisabled}
                                />
                                <form
                                    method="post"
                                    onSubmit={(e) => {
                                        commentSubmitHandler(e, post.post_id, index);
                                    }}
                                // style={{ display: useAuth ? "flex" : "none", paddingBottom: "20px" }}
                                >
                                    <label htmlFor="comment-input">Type something nice :D</label>
                                    <textarea
                                        key={index}
                                        id="comment-input"
                                        name="comment"
                                        onChange={(e) => {
                                            const newCommentState = [...comment];
                                            newCommentState[index] = e.target.value;
                                            setComment(newCommentState);
                                        }}
                                        value={comment[index]}
                                        required
                                    ></textarea>
                                    <button id="comment-submitbtn" type="submit" disabled={!useAuth}>
                                        Submit
                                    </button>
                                </form>
                                {post?.comments?.map((comment, index) => {
                                    let commentId = comment.comment_id;
                                    let commentFrom = comment.comment_from;
                                    if (comment.comment_content === null) {
                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    position: "relative",
                                                    left: "20px",
                                                    top: "10px",
                                                    fontFamily: "Silkscreen, cursive",
                                                    fontSize: "14px",
                                                    opacity: "0.8",
                                                }}
                                            >
                                                No comment
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <CommentBoxContainer
                                                key={commentId}
                                                isAdmin={useUserId === 1 || commentFrom === useUserName}
                                                handleDeleteComment={() => handleDeleteComment(commentId)}
                                                commentusername={comment.comment_from}
                                                commentcontent={comment.comment_content}
                                            />
                                        );
                                    }
                                })}
                            </PostBoxContainer>
                        );
                    })}
                </Masonry>
            </div>
            <ReactPaginate
                className="paginate"
                breakLabel="..."
                nextLabel="next>"
                // initialPage={Number(param)}
                forcePage={currentPage}
                pageCount={
                    Number.isSafeInteger(postsCount)
                        ? Number(postsCount.toFixed(0))
                        : Number(FixWithoutRounding(postsCount, 0)) + 1
                }
                onPageChange={pagginationHandler}
                pageRangeDisplayed={3}
                previousLabel="<previous"
            />
            <div id="home-page-bg">
                <span id="home-page-bg-nested"></span>
            </div>
        </>
    );
}

