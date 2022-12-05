import {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  TextareaHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";
import hasJWT from "../../jwt_auth/hasJWT";
import getUserauth from "../../jwt_auth/getUserAuth";
import { useRouter } from "next/router";
import axios from "axios";
import { setCookie } from "cookies-next";
import { PostDataType } from "../../types/PostDataType";
import { GetServerSideProps } from "next";

type UserpanelType = {
  postid: number;
  currentpostcontext: string;
};

export default function Userpanel({ posts }: PostDataType) {
  const [username, setUsername] = useState<string | null>(null);
  const [postcontext, setPostContext] = useState("");
  const [usereditinput, setUserEditinput] = useState(false);
  const [preveditdata, setprevEditdata] = useState("");
  const [userId, setUserId] = useState(null);
  const [userpostid, setPostid] = useState<number | null>(null);

  const editdataRef = useRef<HTMLTextAreaElement>(null);
  const postcontextRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

  const routeAuth = () => {
    if (hasJWT()) {
      getUserauth().then((result) => {
        if (result.data.status === "error") {
          localStorage.clear();
          window.location.href = "/";
        } else {
          setUsername(result.data.decoded.username);
          const currentPath = router.pathname;
          router.push({
            pathname: currentPath,
            query: {
              currentUser: result.data.decoded.username,
            },
          });
          setUserId(result.data.decoded.userId);
          setCookie("userId", userId);
        }
      });
    } else {
      setUsername("Anomymous");
      setCookie("userId", null);
      alert("Login frist!");
      router.push("/login");
    }
  };

  const onEditClickhandler = (postid: number, currentpostcontext: string) => {
    setUserEditinput(true);
    setprevEditdata(currentpostcontext);
    setPostid(postid);
  };

  const onPostSubmitHandler = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postcontextRef.current?.value.trim() === "") {
      alert("NO TEXT Pepehands");
      return;
    }
    const jsonBodydata = {
      postfrom: username,
      posttitle: "(Post Title Input Incoming...)",
      postcontent: postcontext,
    };
    axios
      .post(
        "https://blushing-gold-macaw.cyclic.app/user_post_create",
        JSON.stringify(jsonBodydata),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.status === "ok") {
          alert("Post Success");
          window.location.href = "/";
          return;
        } else {
          if ((res.data.message = "no text")) {
            alert("Emtpy Content Pepehands");
            return;
          }
          alert("Post Failed");
          return;
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const onEdithSubmithandler = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editdataRef.current?.value.trim() === "") {
      alert("NO TEXT Pepehands");
      return;
    }
    axios
      .post(
        "https://blushing-gold-macaw.cyclic.app/user_post_edit",
        JSON.stringify({
          editcontent: preveditdata,
          postid: userpostid,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.status === "ok") {
          alert("Edit Success");
          window.location.href = "/userpanel";
          return;
        } else {
          if ((res.data.message = "no text")) {
            alert("Emtpy Content Pepehands");
            return;
          }
          alert("Post Failed");
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDelClickhandler = (postid: number) => {
    axios
      .post(
        "https://blushing-gold-macaw.cyclic.app/user_post_delete",
        JSON.stringify({
          userpostid: postid,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.status === "ok") {
          alert("Delete Success");
          window.location.href = "/userpanel";
          return;
        } else {
          alert("Delete Failed");
          return;
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
  }

  useEffect(() => {
    routeAuth();
    postcontextRef.current?.focus();
  }, [userId]);

  return (
    <div className="userpanel-container">
      <span id="username">HI! {username} </span>
      <form onSubmit={onPostSubmitHandler}>
        <div className="user-panel-inputcontainer">
          <label htmlFor="post-text-input">Write something nice :D</label>
          <textarea
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
          {posts.userPostData.map((post) => {
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
                <span className="post-date">{post.post_createdAt}</span>
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
  let currentUser = context.query.currentUser;
  const options = {
    method: "GET",
    url: "https://blushing-gold-macaw.cyclic.app/user_posts",
    params: { currentUser: currentUser },
  };
  const posts = await axios.request(options);

  return {
    props: {
      posts: posts.data,
    },
  };
};
