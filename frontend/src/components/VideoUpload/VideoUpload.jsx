import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createVideo } from '../../services/api';
import { USER_ID } from '../../constants';
import './VideoUpload.css';

/**
 * VideoUpload Component
 * Form modal for creating and uploading new videos with title, description, and URL
 */
const VideoUpload = ({ onClose, onVideoCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.video_url.trim()) {
      setError('All fields are required');
      toast.error('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createVideo({
        user_id: USER_ID,
        title: formData.title.trim(),
        description: formData.description.trim(),
        video_url: formData.video_url.trim()
      });

      onVideoCreated();
      
      setTimeout(() => {
        toast.success('Video uploaded successfully!', { duration: 3000 });
      }, 100);
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to create video. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
      console.error('Error creating video:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-upload-form">
      <h2>Upload New Video</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter video title"
            disabled={loading}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter video description"
            disabled={loading}
            rows={4}
            maxLength={500}
          />
        </div>

        <div className="form-group">
          <label htmlFor="video_url">Video URL *</label>
          <input
            type="url"
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="https://example.com/video.mp4"
            disabled={loading}
          />
          <small className="field-hint">
            Enter a direct video URL
          </small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Video'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoUpload;