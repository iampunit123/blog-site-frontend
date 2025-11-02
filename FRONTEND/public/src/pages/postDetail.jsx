import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchRelatedPosts();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setPost(res.data);
    } catch (error) {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts?limit=3`);
      setRelatedPosts(res.data.posts.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      navigate('/');
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && post.author._id === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <img 
          src={post.coverImage} 
          alt={post.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            {post.featured && (
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                Featured
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-200 mb-6 max-w-3xl">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-sm">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-gray-700 bg-opacity-50 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span>•</span>
                <span>{post.readTime} min read</span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-700 bg-opacity-50 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-2xl shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-gray-700 text-lg">
                  {post.content}
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span 
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition duration-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Actions */}
              {isAuthor && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Post Actions</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(`/edit/${post._id}`)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Edit Post
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                    >
                      Delete Post
                    </button>
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About the Author</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{post.author.name}</p>
                  <p className="text-sm text-gray-600">Blog Writer</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Passionate writer sharing thoughts and experiences with the world.
              </p>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Stories</h3>
                <div className="space-y-4">
                  {relatedPosts.map(relatedPost => (
                    <Link 
                      key={relatedPost._id}
                      to={`/post/${relatedPost._id}`}
                      className="block group"
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={relatedPost.coverImage} 
                          alt={relatedPost.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800 group-hover:text-purple-600 transition duration-300 line-clamp-2 text-sm">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(relatedPost.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Share this story</h3>
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition duration-300">
                  Facebook
                </button>
                <button className="flex-1 bg-blue-400 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-500 transition duration-300">
                  Twitter
                </button>
                <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700 transition duration-300">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section - Placeholder */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Comments</h3>
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💬</div>
            <p className="text-gray-500 text-lg">Comments feature coming soon!</p>
            <p className="text-gray-400 text-sm mt-2">We're working on adding comments to enhance community engagement.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;