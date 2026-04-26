import React, { useState } from "react";

function ForumPage() {
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

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Izzati",
      text: "Can someone explain the difference between supervised and unsupervised learning?",
      time: new Date().toISOString(),
      replies: [
        {
          text: "Supervised learning uses labeled data, while unsupervised learning uses unlabeled data.",
          time: new Date().toISOString(),
        },
      ],
    },
    {
      id: 2,
      author: "Alia",
      text: "I found Python practice quizzes really helpful for revision.",
      time: new Date().toISOString(),
      replies: [
        {
          text: "Yes, especially for syntax and logic questions.",
          time: new Date().toISOString(),
        },
      ],
    },
  ]);

  const [newAuthor, setNewAuthor] = useState("");
  const [newPost, setNewPost] = useState("");
  const [replyInputs, setReplyInputs] = useState({});

  const handleAddPost = () => {
    if (newAuthor.trim() === "" || newPost.trim() === "") return;

    const newEntry = {
      id: Date.now(),
      author: newAuthor,
      text: newPost,
      time: new Date().toISOString(),
      replies: [],
    };

    setPosts([newEntry, ...posts]);
    setNewAuthor("");
    setNewPost("");
  };

  const handleReplyChange = (postId, value) => {
    setReplyInputs({
      ...replyInputs,
      [postId]: value,
    });
  };

  const handleAddReply = (postId) => {
    const replyText = replyInputs[postId];
    if (!replyText || replyText.trim() === "") return;

    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            replies: [
              ...post.replies,
              {
                text: replyText,
                time: new Date().toISOString(),
              },
            ],
          }
        : post
    );

    setPosts(updatedPosts);
    setReplyInputs({
      ...replyInputs,
      [postId]: "",
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
          <input
            className="custom-input"
            type="text"
            placeholder="Enter your name"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
          <textarea
            className="custom-textarea"
            placeholder="Write your post here"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
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
                  Posted {formatTimeAgo(post.time)}
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
                    <p className="content-text">{reply.text}</p>
                    <p className="small-text">
                      Replied {formatTimeAgo(reply.time)}
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