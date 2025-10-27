const API_BASE_URL = '/api';

/**
 * Helper function to handle API responses
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Something went wrong');
  }
  return response.json();
};

/**
 * Helper function to make API requests
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {};
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }
  
  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
};

// ============================================
// VIDEO ENDPOINTS
// ============================================

/**
 * Create a new video
 * @param {Object} videoData - { user_id, title, description, video_url }
 * @returns {Promise} Success message object
 */
export const createVideo = async (videoData) => {
  return apiRequest('/videos', {
    method: 'POST',
    body: JSON.stringify(videoData),
  });
};

/**
 * Get all videos for a specific user
 * @param {string} userId - User ID to fetch videos for
 * @returns {Promise<{videos: Array}>} Object containing array of video objects
 */
export const getUserVideos = async (userId) => {
  return apiRequest(`/videos?user_id=${userId}`, {
    method: 'GET',
  });
};

/**
 * Get a single video by ID
 * @param {string} videoId - Video ID to fetch
 * @returns {Promise} Video object
 */
export const getVideoById = async (videoId) => {
  return apiRequest(`/videos/single?video_id=${videoId}`, {
    method: 'GET',
  });
};

/**
 * Update an existing video
 * @param {Object} updateData - { video_id, title, description }
* @returns {Promise} Success message object
 */
export const updateVideo = async (updateData) => {
  return apiRequest('/videos', {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

// ============================================
// COMMENT ENDPOINTS
// ============================================

/**
 * Create a new comment on a video
 * @param {Object} commentData - { video_id, user_id, content }
 * @returns {Promise} Success message object
 */
export const createComment = async (commentData) => {
  return apiRequest('/videos/comments', {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
};

/**
 * Get all comments for a specific video
 * @param {string} videoId - Video ID to fetch comments for
 * @returns {Promise} Object containing array of comment objects: { comments: [...] }
 */
export const getVideoComments = async (videoId) => {
  return apiRequest(`/videos/comments?video_id=${videoId}`, {
    method: 'GET',
  });
};