import { useEffect, useState, useRef, ChangeEvent } from "react";
import axios from "axios";

import useAuthStore from "../../global_state/authStore";
import getUserauth from "../../hooks/getUserAuth";
import reqAuth from "../../hooks/requestAuth";

import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import Cookies from "js-cookie";
import dayjs from "dayjs";
import { Blocks } from "react-loader-spinner";

import { PostDataType } from "../../types/PostDataType";
import refreshTokenAuth from "../../hooks/refreshTokenAuth";
import swal from "sweetalert2";

export default function Userpanel({ posts }: PostDataType) {
  const [postcontext, setPostContext] = useState("");
  const [postTitleContext, setPostTitleContext] = useState("");
  const [usereditinput, setUserEditinput] = useState(false);
  const [preveditdata, setprevEditdata] = useState("");
  const [userpostid, setPostid] = useState<number | null>(null);

  const editdataRef = useRef<HTMLTextAreaElement>(null);
  const postcontextRef = useRef<HTMLTextAreaElement>(null);
  const postTitleContextRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

  const useAuth = useAuthStore((state:any) => state.accessToken);
  const useUserName = useAuthStore((state:any) => state.userName);
  const useUserId = useAuthStore((state:any) => state.userId);

  const setAuthStore = useAuthStore((state:any) => state.setAccessToken);
  const setUserId = useAuthStore((state:any) => state.setUserId);
  const setUserName = useAuthStore((state:any) => state.setUserName);

  const [isLoading, setIsLoading] = useState(true);
  const refresh = refreshTokenAuth();

  //into seperate function later
  const verifyRefreshToken = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const routeAuth = () => {
    if (useAuth) {
      getUserauth()
        .then((response) => {
          if (useUserName) return;
          setUserId(response.data.decoded.userId);
          setUserName(response.data.decoded.username);
          Cookies.set("u_id", response.data.decoded.userId);
          router.push("userpanel");
        })
        .catch((err) => {
          if (err) {
            //call logout api to delete cookie later
            Cookies.set("u_id", "");
            setAuthStore(null);
            swal.fire({
              icon: 'error',
              title: 'xdding?',
              text: 'Out of session!',
            })
            return (window.location.href = "/");
          }
        });
    } else {
      //call logout api to delete cookie later
      Cookies.set("u_id", "");
      setAuthStore(null);
      router.push("/login");
    }
    if (useUserName === "ADMIN") {
      axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/logout`,
          JSON.stringify({}),
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
      ).then((res) => {
        if (res.status !== 204) {
          return
        }
        setUserId(null);
        setUserName(null);
        setAuthStore(null);
        Cookies.set("u_id", '');
        router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        return;
      });
    }
  };

  //scroll to top when edited on responsive(mobile etc..) later
  const onEditClickhandler = (postid: number, currentpostcontext: string) => {
    window.scrollTo(0, 0)
    setUserEditinput(true);
    setprevEditdata(currentpostcontext);
    setPostid(postid);
  };

  const onPostSubmitHandler = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!useAuth) {
      swal.fire({
        icon: 'error',
        title: 'xdding?',
        text: 'Please login frist!',
      })
      return router.push("login");
    }
    setIsLoading(true);
    if ((await reqAuth()) === "noAuthorization") {
      swal.fire({
        icon: 'error',
        title: 'xdding?',
        text: 'Out of session!',
      })
      return (window.location.href = "/");
    }
    const jsonBodydata = {
      postfrom: useUserName,
      postfromuserid: useUserId,
      posttitle: postTitleContext,
      postcontent: postcontext,
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/user_post_create`,
        JSON.stringify(jsonBodydata),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.message === "emtpy content")
          return swal.fire({
            icon: 'error',
            title: 'xdding?',
            text: 'Empty content!',
          })
        if (response.data.status === "error") return swal.fire({
          icon: 'error',
          title: 'xdding?',
          text: 'Post Failed!',
        })
        if (response.data.status === "ok") {
          swal.fire({
            icon: 'success',
            title: 'xdding?',
            text: 'Post success!',
          })
          setIsLoading(false);
          router.push("/");
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const onEdithSubmithandler = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!useAuth) {
      swal.fire({
        icon: 'error',
        title: 'xdding?',
        text: 'Please login frist!',
      })
      return router.push("login");
    }
    setIsLoading(true);
    if ((await reqAuth()) === "noAuthorization") {
      swal.fire({
        icon: 'error',
        title: 'xdding?',
        text: 'Out of session!',
      })
      return (window.location.href = "/");
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/user_post_edit`,
        JSON.stringify({
          editcontent: preveditdata,
          postid: userpostid,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        if (response.data.message === "emtpy content")
          return swal.fire({
            icon: 'error',
            title: 'xdding?',
            text: 'Empty content!',
          })
        if (response.data.status === "error") return swal.fire({
          icon: 'error',
          title: 'xdding?',
          text: 'Edit failed!',
        })
        if (response.data.status === "ok") {
          swal.fire({
            icon: 'success',
            title: 'xdding?',
            text: 'Edit success!',
          })
          setUserEditinput(false);
          setIsLoading(false);
          router.push("userpanel");
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const onDelClickhandler = async (postid: number) => {
    if (!useAuth) {
      swal.fire({
        icon: 'error',
        title: 'xdding?',
        text: 'Please login frist!',
      })
      return router.push("login");
    }
    setIsLoading(true);
    if ((await reqAuth()) === "noAuthorization") {
      swal.fire({
        icon: 'error',
        title: 'xdding?',
        text: 'Out of session!',
      })
      return (window.location.href = "/");
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/user_post_delete`,
        JSON.stringify({
          userpostid: postid,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        if (response.data.status === "error") return swal.fire({
          icon: 'error',
          title: 'xdding?',
          text: 'Delete failed!',
        })
        if (response.data.status === "ok") {
          swal.fire({
            icon: 'success',
            title: 'xdding?',
            text: 'Delete success!',
          })
          setIsLoading(false);
          router.push("userpanel");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let editinput = null;
  if (usereditinput === true) {
    editinput = (
      <section className="usereditinput-container">
        <div
          id="exit-edit"
          onClick={() => {
            setUserEditinput(false);
          }}
        >
          X
        </div>
        <form onSubmit={onEdithSubmithandler}>
          <div className="user-edit-panel-inputcontainer">
            <label htmlFor="post-text-input" id="post-text-input">
              Let's edit! :D
            </label>
            <textarea
              ref={editdataRef}
              onChange={(e) => {
                setprevEditdata(e.target.value);
              }}
              value={preveditdata}
              required
              className="post-edit-inputborder"
              id="post-edit-text-input"
              typeof="text"
            ></textarea>
            <input
              id="post-edit-submitbtn"
              type="submit"
              value="EditSubmit"
            ></input>
          </div>
        </form>
      </section>
    );
  } else {
    editinput = null;
  }

  useEffect(() => {
    !useAuth ? verifyRefreshToken() : setIsLoading(false);
    routeAuth();
    postcontextRef.current?.focus();
    console.log("meow");
  }, [useUserName]);

  return (
    <div className="userpanel-container">
      {isLoading ? (
        <Blocks
          visible={true}
          height="280"
          width="280"
          ariaLabel="blocks-loading"
          wrapperStyle={{ top: "30%" }}
          wrapperClass="blocks-wrapper-userpanel"
        />
      ) : null}
      <span id="username">HI! {useUserName} </span>
      <form onSubmit={onPostSubmitHandler}>
        <div className="user-panel-inputcontainer">
          <label htmlFor="post-text-input" style={{marginBottom:"20px"}}>Write something nice :D</label>
          <textarea
              placeholder={"Title"}
              ref={postTitleContextRef}
              onChange={(e) => {
                setPostTitleContext(e.target.value);
              }}
              value={postTitleContext}
              required
              className="post-inputborder"
              id="post-text-input"
              typeof="text"
              style={{height:"30px"}}
          ></textarea>
          <textarea
            placeholder={"Content"}
            ref={postcontextRef}
            onChange={(e) => {
              setPostContext(e.target.value);
            }}
            value={postcontext}
            required
            className="post-inputborder"
            id="post-text-input"
            typeof="text"
          ></textarea>
          <input id="post-submitbtn" type="submit" value="Post"></input>
        </div>
      </form>
      <section className="user-posts">
        <span id="user-post-text">Your recent posts</span>
        <div className="user-posts-container">
          {posts.userPostData?.map((post) => {
            let postId = post.post_id;
            let currentPostContent = post.post_content;
            return (
              <div className="post-box-container" key={postId}>
                <span className="vertical-line"></span>
                <span className="vertical-line_1"></span>
                <span className="horizontal-line"></span>
                <span className="profile-circle-line"></span>
                <button
                  id="post-edit-btn"
                  type="button"
                  onClick={() => {
                    onEditClickhandler(postId, currentPostContent);
                  }}
                >
                  EDIT
                </button>
                <button
                  id="post-delete-btn"
                  type="button"
                  onClick={() => {
                    onDelClickhandler(postId);
                  }}
                >
                  DELETE
                </button>
                <span className="username">{post.post_from}</span>
                <span className="title">{post.post_title}</span>
                <span className="line5"></span>
                <span className="line6"></span>
                <span className="post-content" style={{ marginBottom: "25px" }}>
                  {currentPostContent}
                </span>
                <span className="post-date">
                  {dayjs(post?.post_createdat).format("D MMM YYYY - HH:mm")}
                </span>
                <span className="horizontal-line_1"></span>
              </div>
            );
          })}
        </div>
      </section>
      {editinput}
      <div id="home-page-bg">
        <span id="home-page-bg-nested"></span>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let currentUserId = Number(context.req?.cookies?.u_id) || null;
  const options = {
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_API_URL}/current_user_posts`,
    params: { currentUserId: currentUserId },
  };
  const posts = await axios.request(options);

  return {
    props: {
      posts: posts.data,
    },
  };
};
