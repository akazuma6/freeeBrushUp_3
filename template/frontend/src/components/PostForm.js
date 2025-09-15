import React, { useState } from 'react';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/posts/";

function PostForm({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // フォーム送信時のページリロードを防止
    
    // axiosを使ってPOSTリクエストを送信
    axios.post(API_URL, { title, content })
      .then(res => {
        // alert('新しい記事が投稿されました！');
        onPostCreated(res.data); // 親コンポーネントに新しい投稿データを渡す
        setTitle(''); // フォームの入力内容をクリア
        setContent(''); // フォームの入力内容をクリア
      })
      .catch(error => {
        console.error('投稿に失敗しました:', error);
      });
  };

    return (
    <form onSubmit={handleSubmit} className="post-form">
      <h3>Create a New Post</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <p></p>
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
        <p></p>
      <button type="submit">Post</button>
    </form>
  );
}

export default PostForm;