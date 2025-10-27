import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { updateVideo } from '../../services/api';
import './VideoEdit.css';

/**
 * VideoEdit Component
 * Form modal for editing existing video title and description
 */
const VideoEdit = ({ video, onClose, onVideoUpdated }) => {
  const [formData, setFormData] = useState({
    title: video.title,
    description: video.description
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
    
    if (!formData.title.trim() || !formData.description.trim()) {
      const errorMsg = 'Title and description are required';
      setError(errorMsg);
      toast.error(errorMsg, { duration: 3000 });
      return;
    }

    if (formData.title === video.title && formData.description === video.description) {
      const errorMsg = 'No changes made';
      setError(errorMsg);
      toast.error(errorMsg, { duration: 3000 });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await updateVideo({
        video_id: video.id,
        title: formData.title.trim(),
        description: formData.description.trim()
      });

      onVideoUpdated({
        ...video,
        title: formData.title.trim(),
        description: formData.description.trim()
      });

      setTimeout(() => {
        toast.success('Video updated successfully!', { duration: 3000 });
      }, 100);
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to update video. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
      console.error('Error updating video:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-edit-form">
      <h2>Edit Video</h2>
      
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
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoEdit;