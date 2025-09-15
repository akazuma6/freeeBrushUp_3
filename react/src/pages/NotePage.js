import Post from "../components/Post";
import React from "react";


function NotePage({ posts, onDelete }){
    return(
        <>
      {posts.map(post => (
        <Post
          key={post.id}
          post={post}
          onDelete={onDelete}
        />
      ))}
        </>
    );
}
export default NotePage;