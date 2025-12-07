"use client";

import React, { useState } from "react";
import { X, Home, Mail, HelpCircle } from "lucide-react";
import styles from "@/styles/ChatPopup.module.css";

interface ChatPopupProps {
  onClose: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [message, setMessage] = useState("");

  const renderContent = () => {
    switch (activeSection) {
      case "messages":
        return (
          <div className={styles.messageSection}>
            <div className={styles.messageList}>Here are your messages.</div>
            <div className={styles.messageInputContainer}>
              <input
                type="text"
                placeholder="Type your message..."
                className={styles.messageInput}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className={styles.sendButton}>Send</button>
            </div>
          </div>
        );
      case "help":
        return (
          <div>
            <input type="text" placeholder="Search for help" className={styles.popupInput} />
            <ul className={styles.popupList}>
              <li className={styles.popupListItem}>All About Sizes</li>
              <li className={styles.popupListItem}>Discounts and Promotional Codes</li>
              <li className={styles.popupListItem}>Refresher Kits</li>
              <li className={styles.popupListItem}>Frame Styles and Materials</li>
            </ul>
          </div>
        );
      case "home":
      default:
        return (
          <div>
            <p>Welcome to our help center. How can we assist you today?</p>
            <button
              className={styles.sendMessageButton}
              onClick={() => setActiveSection("messages")}
            >
              Click to Send us a message
            </button>
          </div>
        );
    }
  };

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupHeader}>
        <h2 className={styles.popupTitle}>Hi there 👋 How can we help?</h2>
        <button onClick={onClose} className={styles.popupClose}>
          <X size={18} />
        </button>
      </div>
      <div className={styles.popupBody}>{renderContent()}</div>
      <div className={styles.popupFooter}>
        <div
          className={`${styles.footerItem} ${activeSection === "home" ? styles.footerItemActive : ""}`}
          onClick={() => setActiveSection("home")}
        >
          <Home className={styles.footerIcon} size={18} />
          <span>Home</span>
        </div>
        <div
          className={`${styles.footerItem} ${activeSection === "messages" ? styles.footerItemActive : ""}`}
          onClick={() => setActiveSection("messages")}
        >
          <Mail className={styles.footerIcon} size={18} />
          <span>Messages</span>
        </div>
        <div
          className={`${styles.footerItem} ${activeSection === "help" ? styles.footerItemActive : ""}`}
          onClick={() => setActiveSection("help")}
        >
          <HelpCircle className={styles.footerIcon} size={18} />
          <span>Help</span>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
