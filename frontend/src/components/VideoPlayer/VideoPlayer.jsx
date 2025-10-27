import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getVideoComments, createComment } from '../../services/api';
import { USER_ID } from '../../constants';
import { formatTimeAgo } from '../../utils';
import './VideoPlayer.css';

/**
 * VideoPlayer Component
 * Displays a video with playback controls, video information, and comments section
 */
const VideoPlayer = ({ video, onBack, onEdit }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const videoRef = useRef(null);

  const speedOptions = [0.5, 1, 1.5, 2];

  // Handle playback speed change
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSpeedMenu && !event.target.closest('.speed-control')) {
        setShowSpeedMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSpeedMenu]);

  // Fetch comments when component mounts or video changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        setCommentsError(null);
        const data = await getVideoComments(video.id);
        setComments(data.comments || []);
      } catch (err) {
        setCommentsError('Failed to load comments');
        console.error('Error fetching comments:', err);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [video.id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty');
      toast.error('Comment cannot be empty', { duration: 3000 });
      return;
    }

    const tempId = `temp_${Date.now()}`;
    const newComment = {
      id: tempId,
      video_id: video.id,
      user_id: USER_ID,
      content: commentText.trim(),
      created_at: new Date().toISOString()
    };

    try {
      setSubmittingComment(true);
      setCommentError(null);

      // Add the comment to the list immediately for better UX
      setComments(prev => [newComment, ...prev]);
      
      setCommentText('');

      await createComment({
        video_id: video.id,
        user_id: USER_ID,
        content: commentText.trim()
      });
      
      setTimeout(() => {
        toast.success('Comment added!', { duration: 3000 });
      }, 100);
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to post comment';
      setCommentError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
      console.error('Error creating comment:', err);
      
      setComments(prev => prev.filter(comment => comment.id !== tempId));
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCancel = () => {
    setCommentText('');
    setCommentError(null);
  };

  return (
    <div className="video-player-container">
      {/* Back button */}
      <button className="back-button" onClick={onBack}>
        Back to Videos
      </button>

      {/* Video player */}
      <div className="video-wrapper">
        <video 
          ref={videoRef}
          className="video-player"
          controls
          src={video.video_url}
          poster={video.thumbnail_url}
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Playback speed control */}
        <div className="speed-control">
          <button 
            className="speed-button"
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
          >
            Speed:{playbackSpeed}x
          </button>
          
          {showSpeedMenu && (
            <div className="speed-menu">
              {speedOptions.map((speed) => (
                <button
                  key={speed}
                  className={`speed-option ${playbackSpeed === speed ? 'active' : ''}`}
                  onClick={() => handleSpeedChange(speed)}
                >
                  {speed}x {speed === 1 && '(Normal)'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video information */}
      <div className="video-info-section">
        <div className="video-header">
          <h1>{video.title}</h1>
          <button className="edit-video-button" onClick={onEdit}>
            Edit
          </button>
        </div>
        <p className="video-description">{video.description}</p>
      </div>

      {/* Comments section */}
      <div className="comments-section">
        <h2 className="comments-header">
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h2>

        {/* Comment form */}
        <form className="comment-form" onSubmit={handleSubmitComment}>
          {commentError && (
            <div className="comment-error">{commentError}</div>
          )}
          
          <textarea
            className="comment-input"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={submittingComment}
            maxLength={500}
          />
          
          <div className="comment-form-actions">
            {commentText.trim() && (
              <>
                <button
                  type="button"
                  className="comment-cancel-button"
                  onClick={handleCancel}
                  disabled={submittingComment}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="comment-submit-button"
                  disabled={submittingComment}
                >
                  {submittingComment ? 'Posting...' : 'Comment'}
                </button>
              </>
            )}
          </div>
        </form>

        {/* Comments list */}
        {loadingComments ? (
          <div className="comments-loading">Loading comments...</div>
        ) : commentsError ? (
          <div className="comments-error">{commentsError}</div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">
                    {comment.user_id?.replace('_', ' ') || 'Anonymous'}
                  </span>
                  <span className="comment-date">
                    {formatTimeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;