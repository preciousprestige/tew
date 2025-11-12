import React from 'react';
import './SizeGuideModal.css';

export default function SizeGuideModal({ onClose }) {
  return (
    <div className="size-guide-modal-backdrop" onClick={onClose}>
      <div className="size-guide-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Size Guide</h2>
        <p>Use this guide to pick the best fit for you:</p>
        <ul>
          <li>S: Bust 34" / Waist 26" / Hips 36"</li>
          <li>M: Bust 36" / Waist 28" / Hips 38"</li>
          <li>L: Bust 38" / Waist 30" / Hips 40"</li>
          <li>XL: Bust 40" / Waist 32" / Hips 42"</li>
        </ul>
      </div>
    </div>
  );
}
