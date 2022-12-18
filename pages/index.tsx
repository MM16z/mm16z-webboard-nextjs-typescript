import {
  useRef,
  useState,
  useEffect,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import axios from "axios";

import Masonry from "react-masonry-css";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";

import PostBoxContainer from "../components/post-box-container";
import CommentBoxContainer from "../components/comment-box-container";
import HeartBtn from "../components/heartbtn";

import useAuthStore from "../state/authStore";
import getUserauth from "../hooks/getUserAuth";
import reqAuth from "../hooks/requestAuth";

import { GetServerSideProps } from "next";

import Cookies from "js-cookie";

import { PostDataType } from "../types/PostDataType";

function Home({ posts }: PostDataType) {
  const [comment, setComment] = useState(["", "", "", "", "", ""]);
  const [postlikedstate, setPostlikedstate] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const initialPostLikedCount = posts.allPosts.map(
    (post) => post.post_liked_count
  );
  const [postLikedCount, setPostLikedCount] = useState(initialPostLikedCount);

  const userIdCookie = Cookies.get("u_id");

  const heartRef = useRef(null);

  const router = useRouter();

  const useAuth = useAuthStore((state) => state.accessToken);
  const useUserId = useAuthStore((state) => state.userId);
  const useUserName = useAuthStore((state) => state.userName);

  const setAuthStore = useAuthStore((state) => state.setAccessToken);

  const routeAuth = () => {
    if (useAuth) {
      getUserauth()
        .then()
        .catch((err) => {
          if (err) {
            //call logout api to delete cookie later
            Cookies.set("u_id", "");
            setAuthStore(null);
            router.push("/");
          }
        });
    } else {
      Cookies.set("u_id", "");
      //call logout api to delete cookie later
    }
  };

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

  const pagginationHandler = (page: any) => {
    let currentPage = page.selected + 1;
    router.push({
      pathname: router.pathname,
      query: { page: currentPage },
    });
  };

  const commentSubmitHandler = async (
    e: SyntheticEvent,
    postId: number,
    index: number
  ) => {
    e.preventDefault();
    if (!useAuth) {
      alert("Please login frist");
      return router.push("login");
    }
    if ((await reqAuth()) === "noAuthorization") {
      alert("out of session");
      return router.push("login");
    }
    const payloadData = {
      postfrom: useUserName,
      postcontent: comment[index],
      postid: postId,
    };
    const response = await axios.post(
      "https://good-puce-squirrel-wear.cyclic.app/user_post_comment",
      JSON.stringify(payloadData),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.message === "emtpy content")
      return alert("Emtpy Content Pepehands");
    if (response.data.status === "error") return alert("Comment Failed");

    if (response.data.status === "ok") {
      alert("Comment Success");
      setComment((prev) => [...prev, (prev[index] = "")]);
      router.push("/");
    }
  };

  const onPostlikeHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    postId: number,
    index: number
  ) => {
    const payloadData = {
      userid: useUserId,
      postid: postId,
    };
    if (!useAuth) {
      alert("Please login frist");
      return router.push("login");
    }
    if ((await reqAuth()) === "noAuthorization") {
      alert("out of session");
      return router.push("login");
    }
    const checked = [...postlikedstate];
    if (e.target.checked === true) {
      axios.post(
        "https://good-puce-squirrel-wear.cyclic.app/user_post_liked",
        JSON.stringify(payloadData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      checked[index] = e.target.checked;
      setPostLikedCount((prev) => {
        const newCount = [...prev];
        newCount[index] = newCount[index] + 1;
        return newCount;
      });
      setPostlikedstate(checked);
    } else {
      axios.post(
        "https://good-puce-squirrel-wear.cyclic.app/user_post_unliked",
        JSON.stringify(payloadData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      checked[index] = e.target.checked;
      setPostLikedCount((prev) => {
        const newCount = [...prev];
        newCount[index] = newCount[index] - 1;
        return newCount;
      });
      setPostlikedstate(checked);
    }
  };

  useEffect(() => {
    routeAuth();
    setPostLikedCount(posts.allPosts.map((post) => post.post_liked_count));
    console.log("asd");
  }, [posts, userIdCookie]);

  return (
    <div className="home-page-container">
      <div className="userstate">
        /Home, Howdy! :D @User : {useAuth ? useUserName : "Anonymous"}
      </div>
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
                  postLikedCount={postLikedCount[index]}
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
  //will set/use secure cookie on api endpoint instend of client side cookie later
  let currentUserId = Number(context.req?.cookies?.u_id) || null;

  if (currentQuery <= 0) {
    currentQuery = 1;
  }

  const postDataOptions = {
    method: "GET",
    url: "https://good-puce-squirrel-wear.cyclic.app/user_posts",
    params: { currentQuery: currentQuery, currentUserId: currentUserId },
    withCredentials: true,
  };
  const posts = await axios.request(postDataOptions);

  return {
    props: {
      posts: posts.data,
    },
  };
};

export default Home;
