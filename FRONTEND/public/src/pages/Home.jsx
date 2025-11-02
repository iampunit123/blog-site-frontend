import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchFeaturedPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts?limit=6');
      setPosts(res.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts?featured=true&limit=3');
      setFeaturedPosts(res.data.posts);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
    }
  };

  const categories = [
    { name: 'Technology', icon: '💻', color: 'bg-blue-100 text-blue-600' },
    { name: 'Travel', icon: '✈️', color: 'bg-green-100 text-green-600' },
    { name: 'Food', icon: '🍕', color: 'bg-orange-100 text-orange-600' },
    { name: 'Lifestyle', icon: '🌟', color: 'bg-purple-100 text-purple-600' },
    { name: 'Health', icon: '💪', color: 'bg-red-100 text-red-600' },
    { name: 'Business', icon: '💼', color: 'bg-indigo-100 text-indigo-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white hero-pattern">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Share Your
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                Great Story
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Join thousands of writers sharing their experiences, thoughts, and creativity with the world. 
              Your next great read is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/create" 
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl"
              >
                Start Writing
              </Link>
              <a 
                href="#featured" 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition duration-300"
              >
                Explore Stories
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div 
                key={category.name}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-4`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section id="featured" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
              Featured Stories
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Handpicked stories that inspire, educate, and entertain
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <div 
                  key={post._id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden blog-card group"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{post.category}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {post.author.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-600">{post.author.name}</span>
                      </div>
                      <Link 
                        to={`/post/${post._id}`}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Latest Stories
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Fresh perspectives and new ideas from our community
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div 
                key={post._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden blog-card border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {post.author.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-600">{post.author.name}</span>
                    </div>
                    <Link 
                      to={`/post/${post._id}`}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join our community of writers and readers. Share your experiences, connect with others, 
            and make your voice heard.
          </p>
          <Link 
            to="/create"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Start Writing Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;