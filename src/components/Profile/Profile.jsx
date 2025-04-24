import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Profile.css";
import LogoutButton from "../LogoutButton/LogoutButton";

const Profile = () => {
  const { user, loginWithRedirect, isAuthenticated } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        prompt: "login",
        screen_hint: "login",
      },
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setShowProfileDetails(true);
    setIsDropdownOpen(false);
  };

  return (
    <div className="profile-container">
      <div className="avatar-container" onClick={toggleDropdown}>
        {isAuthenticated ? (
          <img src={user?.picture} alt="Profile" className="profile-avatar" />
        ) : (
          <div className="default-avatar">
            <span className="avatar-text">?</span>
          </div>
        )}
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          {isAuthenticated ? (
            <>
              <div className="dropdown-item" onClick={handleProfileClick}>
                View Profile
              </div>
              <LogoutButton />
            </>
          ) : (
            <div className="dropdown-item" onClick={handleLogin}>
              Login
            </div>
          )}
        </div>
      )}

      {showProfileDetails && (
        <div className="profile-details-modal">
          <div className="profile-details-content">
            <h2>Profile Details</h2>
            <div className="profile-info">
              <img
                src={user?.picture}
                alt="Profile"
                className="profile-avatar-large"
              />
              <div className="profile-text">
                <p>
                  <strong>Name:</strong> {user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
              </div>
            </div>
            <button
              className="close-button"
              onClick={() => setShowProfileDetails(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
