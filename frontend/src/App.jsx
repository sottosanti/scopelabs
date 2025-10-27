import React, { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import VideoList from './components/VideoList/VideoList';
import VideoUpload from './components/VideoUpload/VideoUpload';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import VideoEdit from './components/VideoEdit/VideoEdit';
import SplashPage from './components/SplashPage/SplashPage';
import './App.css';

/**
 * Main App Component
 * Manages application state, routing between views, and handles modals for video upload/edit
 */
function App() {
  const [showSplash, setShowSplash] = useState(!localStorage.getItem('userId'));
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);

  // Get user information
  const userId = localStorage.getItem('userId') || '';
  const userName = userId
    .split('_')
    .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');
  const userInitials = userId
    .split('_')
    .map(name => name.charAt(0).toUpperCase())
    .join('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleBackToList = () => {
    setSelectedVideo(null);
  };

  const handleOpenUpload = () => {
    setShowUploadForm(true);
  };

  const handleCloseUpload = () => {
    setShowUploadForm(false);
  };

  const handleVideoUploaded = () => {
    setShowUploadForm(false);
    // Force VideoList to re-fetch by changing the key
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenEdit = () => {
    setShowEditForm(true);
  };

  const handleCloseEdit = () => {
    setShowEditForm(false);
  };

  const handleVideoEdited = (updatedVideo) => {
    setSelectedVideo(updatedVideo);
    setShowEditForm(false);
    // Refresh the list to show updated info
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Don't render anything if splash should be shown
  if (showSplash) {
    return <SplashPage onComplete={handleSplashComplete} />;
  }

  return (
    <div className="App">
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4caf50',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#f44336',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Header/Navbar */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-logo">EduWatch</h1>
            
            <div className="header-right">
              <button 
                className="upload-button"
                onClick={handleOpenUpload}
              >
                + Upload Video
              </button>
              
              {/* Profile dropdown */}
              <div className="profile-container" ref={profileRef}>
                <button 
                  className="profile-button"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  {userInitials}
                </button>
                
                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <div className="profile-info">
                      <div className="profile-name">{userName}</div>
                    </div>
                    <button 
                      className="logout-button"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="app-main">
        {selectedVideo ? (
          <VideoPlayer 
            video={selectedVideo}
            onBack={handleBackToList}
            onEdit={handleOpenEdit}
          />
        ) : (
          <VideoList key={refreshKey} onVideoSelect={handleVideoSelect} />
        )}
      </main>

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="modal-overlay" onClick={handleCloseUpload}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <VideoUpload 
              onClose={handleCloseUpload}
              onVideoCreated={handleVideoUploaded}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && selectedVideo && (
        <div className="modal-overlay" onClick={handleCloseEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <VideoEdit 
              video={selectedVideo}
              onClose={handleCloseEdit}
              onVideoUpdated={handleVideoEdited}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;