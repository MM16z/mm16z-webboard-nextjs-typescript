type CommentBoxContainer = {
    commentusername: string;
    commentcontent: string;
    isAdmin: boolean;
    handleDeleteComment: (commentId: number) => void;
};

const CommentBoxContainer = (probs: CommentBoxContainer) => {
    const {commentusername, commentcontent, isAdmin, handleDeleteComment} = probs;
    return (
        <div className="reply-box-container"
             style={{pointerEvents: isAdmin ? "all" : "none"}}
             onClick={handleDeleteComment}>
            <hr></hr>
            <span className="comment-profile-circle-line">
        <span className="comment-profile-circle-img" title="user icons">User icons created by Freepik - Flaticon</span>
      </span>
            <span className="comment-username">{commentusername}</span>
            <span className="comment-post-content">{commentcontent}</span>
            <span className="comment-delete" style={{
                fontFamily: "Silkscreen",
                color: "red",
                border: "1px solid red",
                width: "fit-content",
                display: isAdmin ? "block" : "none",
                cursor: "pointer",
            }}
            >Delete comment</span>
        </div>
    );
};

export default CommentBoxContainer;
