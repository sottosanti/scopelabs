import React, { useState, useEffect, useRef } from 'react';
import { getUserVideos } from '../../services/api';
import { USER_ID } from '../../constants';
import { formatTimeAgo } from '../../utils';
import './VideoList.css';

/**
 * VideoList Component
 * Displays a grid of user's videos with search and sorting functionality
 */
const VideoList = ({ onVideoSelect }) => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!USER_ID) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getUserVideos(USER_ID);
        const videoList = Array.isArray(data) ? data : (data.videos || []);
        setVideos(videoList);
        setFilteredVideos(videoList);
      } catch (err) {
        setError('Failed to load videos. Please try again.');
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter and sort videos whenever search query, sort option, or videos change
  useEffect(() => {
    let result = [...videos];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    setFilteredVideos(result);
  }, [searchQuery, sortBy, videos]);

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setShowFilterDropdown(false);
  };

  if (loading) {
    return (
      <div className="video-list-container">
        <div className="loading">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-list-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="video-list-container">
        <div className="empty-state">
          <h2>No videos yet</h2>
          <p>Create your first video to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-list-container">
      <div className="video-list-header">
        <h2 className="video-list-title">My Videos</h2>
        
        <div className="video-controls">
          {/* Search */}
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter/Sort */}
          <div className="filter-container" ref={filterRef}>
            <button 
              className={`filter-button ${showFilterDropdown ? 'active' : ''}`}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <span>Sort</span>
            </button>

            {showFilterDropdown && (
              <div className="filter-dropdown">
                <div className="filter-section">
                  <div className="filter-label">Sort By</div>
                  
                  <div className="filter-option">
                    <input
                      type="radio"
                      id="sort-newest"
                      name="sort"
                      value="newest"
                      checked={sortBy === 'newest'}
                      onChange={() => handleSortChange('newest')}
                    />
                    <label htmlFor="sort-newest">Newest First</label>
                  </div>

                  <div className="filter-option">
                    <input
                      type="radio"
                      id="sort-oldest"
                      name="sort"
                      value="oldest"
                      checked={sortBy === 'oldest'}
                      onChange={() => handleSortChange('oldest')}
                    />
                    <label htmlFor="sort-oldest">Oldest First</label>
                  </div>

                  <div className="filter-option">
                    <input
                      type="radio"
                      id="sort-title"
                      name="sort"
                      value="title"
                      checked={sortBy === 'title'}
                      onChange={() => handleSortChange('title')}
                    />
                    <label htmlFor="sort-title">Title (A-Z)</label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results info */}
      {searchQuery && (
        <div className="results-info">
          Found {filteredVideos.length} result{filteredVideos.length !== 1 ? 's' : ''} for "{searchQuery}"
        </div>
      )}

      {/* Video grid */}
      {filteredVideos.length === 0 ? (
        <div className="empty-state">
          <h2>No videos found</h2>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="video-grid">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="video-card"
              onClick={() => onVideoSelect(video)}
            >
              {/* Video thumbnail - using a placeholder for now */}
              <div className="video-thumbnail">
                <div className="play-icon"></div>
              </div>
              
              {/* Video info */}
              <div className="video-info">
                <div className="video-header-card">
                  <h3 className="video-title">{video.title}</h3>
                  <span className="video-time">{formatTimeAgo(video.created_at)}</span>
                </div>
                <p className="video-description">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;