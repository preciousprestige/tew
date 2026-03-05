import React, { useState } from "react";
import "./NotificationBar.css";
export default function NotificationBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="notif-bar">
      <p className="notif-text">
        Orders take <span>3-5 working days</span>. NB: Include custom measurements at checkout.{" "}
        Shop internationally via our{" "}
        <span>contact options</span>.
      </p>
      <button className="notif-close" onClick={() => setVisible(false)}>&#x2715;</button>
    </div>
  );
}
