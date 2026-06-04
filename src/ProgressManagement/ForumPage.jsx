import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";

import { db } from "../firebase";

function ForumPage({ onBack }) {
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postTime = new Date(dateString);
    const diffMs = now - postTime;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const [posts, setPosts] = useState([]);
  useEffect(() => {
  const q = query(
    collection(db, "forumPosts"),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const postsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setPosts(postsData);
  });

  return () => unsubscribe();
}, []);

  const [newPost, setNewPost] = useState("");
  const [replyInputs, setReplyInputs] = useState({});

  const handleAddPost = async () => {
  if (newPost.trim() === "") return;

  const author =
    localStorage.getItem("name") ||
    localStorage.getItem("loggedInUser") ||
    "Student";

  await addDoc(collection(db, "forumPosts"), {
    author,
    text: newPost,
    createdAt: serverTimestamp(),
    replies: []
  });

  setNewPost("");
};

  const handleReplyChange = (postId, value) => {
    setReplyInputs({
      ...replyInputs,
      [postId]: value,
    });
  };

  const handleAddReply = async (postId) => {
  const replyText = replyInputs[postId];

  if (!replyText || replyText.trim() === "") return;

  const author =
    localStorage.getItem("name") ||
    localStorage.getItem("loggedInUser") ||
    "Student";

  const postRef = doc(db, "forumPosts", postId);

  await updateDoc(postRef, {
    replies: arrayUnion({
      author,
      text: replyText,
      createdAt: new Date().toISOString()
    })
  });

  setReplyInputs({
    ...replyInputs,
    [postId]: ""
  });
  };

  return (
    <div className="page-wrapper">

      <div className="hero-section">
        <h2 className="main-title">Discussion Forum</h2>
        <p className="subtitle-text">
          Students can create posts and reply to others.
        </p>
      </div>

      <div className="dashboard-card purple-card">
        <h3 className="section-title purple-title">Create Post</h3>
        <div className="divider purple-divider"></div>

        <div className="form-group">

          <textarea
            placeholder="Write your post here"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              minHeight: "140px",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              color: "#111827",
              backgroundColor: "#ffffff",
              resize: "vertical",
              outline: "none",
              position: "relative",
              zIndex: 9999
            }}
          />

          <button className="primary-btn" onClick={handleAddPost}>
            Post Discussion
          </button>
        </div>
      </div>

      <div className="forum-list">
        {posts.map((post) => (
          <div className="dashboard-card white-card" key={post.id}>
            <div className="forum-post-header">
              <div className="forum-avatar">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="card-title">{post.author}</h3>
                <p className="small-text">
                  Posted {post.createdAt?.toDate ? formatTimeAgo(post.createdAt.toDate()) : "Just now"}
                </p>
              </div>
            </div>

            <p className="content-text">{post.text}</p>

            <div className="reply-section">
              <h4 className="reply-title">Replies</h4>

              {post.replies.length === 0 ? (
                <p className="small-text">No replies yet.</p>
              ) : (
                post.replies.map((reply, index) => (
                  <div className="reply-box" key={index}>
                    <p className="content-text">
                      <strong>{reply.author}:</strong> {reply.text}
                    </p>
                    <p className="small-text">
                      Replied {formatTimeAgo(reply.createdAt)}
                    </p>
                  </div>
                ))
              )}

              <div className="reply-form">
                <input
                  className="custom-input"
                  type="text"
                  placeholder="Write a reply"
                  value={replyInputs[post.id] || ""}
                  onChange={(e) => handleReplyChange(post.id, e.target.value)}
                />
                <button
                  className="secondary-btn"
                  onClick={() => handleAddReply(post.id)}
                >
                  Add Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForumPage;