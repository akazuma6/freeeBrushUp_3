// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import PostForm from './components/PostForm';
import Post from './components/Post'
import DeleteButton from './components/DeleteButton';

const API_URL = "http://127.0.0.1:8000/api/posts/";

function App() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setPosts(res.data);
      })
      .catch(error => {
        console.error("There was an error fetching the posts!", error);
      });
  }, []); // 第2引数の[]は「最初の一回だけ実行する」という意味
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };  

  // --- ▼ここから追加▼ ---
  // 「編集」ボタンが押された時の処理
  const handleEdit = (post) => {
    setEditingPost(post);
    setEditForm({ title: post.title, content: post.content });
  };

  // 編集フォームの入力が変更された時の処理
  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // 編集フォームが送信された時の処理
  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`${API_URL}${editingPost.id}/`, editForm)
      .then(res => {
        // 画面上の投稿リストも更新
        setPosts(posts.map(p => (p.id === editingPost.id ? res.data : p)));
        setEditingPost(null); // 編集モードを終了
      })
      .catch(error => { console.error('更新に失敗しました:', error); });
  };
  // --- ▲ここまで追加▲ ---

  //deleteコンポーネントは作っても削除ロジックはApp.jsが持っておく
  const handleDelete = (postId) => {
    axios.delete(`${API_URL}${postId}/`)
      .then(() => {
        setPosts(posts.filter(post => post.id !== postId));
      })
      .catch(error => {
        console.error('投稿の削除に失敗しました:', error);
      });
  };


  return (
    <div className="App">
      <Header />
      <PostForm onPostCreated={handlePostCreated} />
      <main className="App-main">
        
         {posts.map(post => (
            <Post
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          
          {/*
          <article key={post.id} className="post-excerpt">
            <Post postTitle={post.title} postContent={post.content}/>
          
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 100)}...</p>
            
            <small>Posted on: {post.created_at}</small>
            <DeleteButton postId={post.id} onDelete={handleDelete} />

          </article>

        ))}
          */}
      </main>
    </div>
  );
}

export default App;