import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  getBlogById,
  deleteBlog,
  postComment,
  getCommnentsById,
} from "../../api/internal";
import Loader from "../../components/Loader/Loader";
import styles from "./BlogDetails.module.css";
import CommentList from "../../components/CommentList/CommentList";

function BlogDetails() {
  const [blog, setBlog] = useState([]);
  const [comments, setComments] = useState([]);
  const [blogOwner, setBlogOwner] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  const params = useParams();
  const blogId = params.id;

  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user._id);

  useEffect(() => {
    async function getBlogDetails() {
      const commentResponse = await getCommnentsById(blogId);
      if (commentResponse.status === 200) {
        setComments(commentResponse.data.data);
      }

      const blogResponse = await getBlogById(blogId);
      if (blogResponse.status === 200) {
        // Blog owner
        setBlogOwner(username === blogResponse.data.blog.authorUsername);

        setBlog(blogResponse.data.blog);
      }
    }
    getBlogDetails();
  }, [reload]);

  //   handler functions here
  const postCommentHandler = async () => {
    const data = {
      author: userId,
      blog: blogId,
      content: newComment,
    };

    const response = await postComment(data);

    if (response.status === 201) {
      setNewComment("");
      setReload(!reload);
    }
  };

  const deleteBlogHandler = async () => {
    const response = await deleteBlog(blogId);

    if (response.status === 200) {
      navigate("/");
    }
  };

  if (blog.length === 0) {
    return <Loader text="Blog Details ..." />;
  }

  return (
    <div className={styles.detailsWrapper}>
      {/* left side */}
      <div className={styles.left}>
        <h1 className={styles.title}>{blog.title}</h1>
        <div className={styles.meta}>
          <p>
            @
            {blog.authorUsername +
              " on " +
              new Date(blog.createdAt).toDateString()}
          </p>
        </div>
        <div className={styles.photo}>
          <img src={blog.photo} alt="" />
        </div>
        <p className={styles.content}>{blog.content}</p>
        {blogOwner && (
          <div className={styles.controls}>
            <button
              className={styles.editButton}
              onClick={() => {
                navigate(`/blog-update/${blog._id}`);
              }}
            >
              Edit
            </button>
            <button className={styles.deleteButton} onClick={deleteBlogHandler}>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* right side */}
      <div className={styles.right}>
        <div className={styles.commentsWrapper}>
          <CommentList comments={comments} />
          <div className={styles.postComment}>
            <input
              className={styles.input}
              placeholder="Type your comment here ..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className={styles.postCommentButton}
              onClick={postCommentHandler}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
