import PostBoxContainer from "../components/post-box-container";
import CommentBoxContainer from "../components/comment-box-container";
import HeartBtn from "../components/heartbtn";

import hasJWT from "../jwt_auth/hasJWT";
import getUserauth from "../jwt_auth/getUserAuth";

import axios from "axios";
import Masonry from "react-masonry-css";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import User from "../components/user";
import {
  useRef,
  useState,
  useEffect,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import { setCookie, getCookie } from "cookies-next";
import { GetServerSideProps } from "next";

import { PostDataType } from "../types/PostDataType";

function Home({ posts }: PostDataType) {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [comment, setComment] = useState(["", "", "", "", "", ""]);
  const [postlikedstate, setPostlikedstate] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const heartRef = useRef(null);
  const router = useRouter();

  const breakpointColumnsObj = {
    default: 4,
    1920: 3,
    1500: 2,
    1100: 1,
  };

  let FixWithoutRounding = (v: any, l: any) => {
    const intPart = Math.trunc(v).toString();
    const fractionPart = v.toString().slice(v.toString().indexOf(".") + 1);
    if (fractionPart.length > l) {
      return Number(intPart.concat(".", fractionPart.slice(0, l)));
    } else {
      const padded = intPart.concat(".", fractionPart.padEnd(l, "0"));
      return padded;
    }
  };

  let postsCount = posts.postsCount.all_post_count / 6;
  if (postsCount <= 1) {
    postsCount = 1;
  }

  const routeAuth = () => {
    if (hasJWT()) {
      getUserauth().then((result) => {
        if (result.data.status === "error") {
          localStorage.clear();
          window.location.href = "/";
        } else {
          setUsername(result.data.decoded.username);
          setUserId(result.data.decoded.userId);
        }
      });
    } else {
      setCookie("userId", null);
    }
  };

  const pagginationHandler = (page: any) => {
    let currentPage = page.selected + 1;
    router.push({
      pathname: router.pathname,
      query: { page: currentPage },
    });
  };

  const commentSubmitHandler = (
    e: SyntheticEvent,
    postId: number,
    index: number
  ) => {
    e.preventDefault();
    if (!hasJWT()) {
      alert("Please login frist");
      router.push("/login");
      return;
    }
    const jsondata = {
      postfrom: username,
      postcontent: comment[index],
      postid: postId,
    };
    axios
      .post(
        "https://blushing-gold-macaw.cyclic.app/user_post_comment",
        JSON.stringify(jsondata),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.status === "ok") {
          alert("Comment Success");
          window.location.href = "/";
          return;
        } else {
          if ((res.data.message = "no text")) {
            alert("Emtpy Content Pepehands");
            return;
          }
          alert("Comment Failed");
          return;
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const onPostlikeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    postId: number,
    index: number
  ) => {
    if (!hasJWT()) {
      router.push("login");
      return;
    } else {
      const checked = [...postlikedstate];
      if (e.target.checked === true) {
        const jsondata = {
          userId: userId,
          postid: postId,
        };
        axios.post(
          "https://blushing-gold-macaw.cyclic.app/user_post_liked",
          JSON.stringify(jsondata),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setPostlikedstate(checked);
      } else {
        const jsondata = {
          userId: userId,
          postId: postId,
        };
        axios.post(
          "https://blushing-gold-macaw.cyclic.app/user_post_unliked",
          JSON.stringify(jsondata),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        checked[index] = e.target.checked;
        setPostlikedstate(checked);
      }
    }
  };

  useEffect(() => {
    routeAuth();
  }, [userId]);

  return (
    <div className="home-page-container">
      <User />
      <span
        style={{
          position: "fixed",
          zIndex: "100",
          top: "93vh",
          left: "10px",
          color: "red",
          inlineSize: "350px",
          fontWeight: "bold",
        }}
      >
        Starting November 28th, 2022, Heroku free plan will no longer, website
        will shutdown.
      </span>
      <div className="masonry-warper">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {posts.allPosts.map((post, index) => {
            let postId = post.post_id;
            let likedcount = post.post_liked_count;
            return (
              <PostBoxContainer
                key={postId}
                username={post.post_from}
                title={post.post_title}
                postcontent={post.post_content}
                postdate={post.post_createdAt}
              >
                <HeartBtn
                  key={index}
                  postLikedCount={likedcount}
                  defaultChecked={
                    post.isLiked === null ? false : post.isLiked ? true : false
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onPostlikeHandler(e, postId, index);
                  }}
                  ref={heartRef}
                />
                <form
                  method="post"
                  onSubmit={(e) => {
                    commentSubmitHandler(e, postId, index);
                  }}
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
                  <button id="comment-submitbtn" type="submit">
                    Submit
                  </button>
                </form>
                {post.comments.map((comment, index) => {
                  let commentId = comment.comment_id;
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
        initialPage={0}
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let currentQuery = Number(context.query.page);
  let currentUserId = context.req.headers.cookie
    ? context.req.headers.cookie.split("=")[1]
    : null;
  if (currentQuery <= 0) {
    currentQuery = 1;
  }

  const postDataOptions = {
    method: "GET",
    url: "https://blushing-gold-macaw.cyclic.app/user_posts",
    params: { currentQuery: currentQuery, currentUserId: currentUserId },
  };
  const posts = await axios.request(postDataOptions);

  return {
    props: {
      posts: posts.data,
    },
  };
};

export default Home;
