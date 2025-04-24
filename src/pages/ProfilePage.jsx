import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth0();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={user?.picture}
          alt="Profile"
          className="profile-page-avatar"
        />
        <h1>{user?.name}</h1>
        <p className="email">{user?.email}</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Name</span>
              <span className="value">{user?.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Email</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Email Verified</span>
              <span className="value">
                {user?.email_verified ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Recent Activity</h2>
          <div className="recent-searches">
            {/* Recent searches will be added here */}
            <p className="no-activity">No recent activity to show</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
