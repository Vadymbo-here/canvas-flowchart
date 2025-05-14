import React from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const colors = [
    "#1E90FF",
    "#FF4500",
    "#32CD32",
    "#FFD700",
    "#800080",
    "#FF69B4",
    "#00CED1",
    "#8B4513"
  ];  
  

  return (
    <div className="color-picker card">
      <h4>Elements Color</h4>
      <div className="color-options">
        {colors.map((c) => (
          <div
            key={c}
            className={`color-option ${color === c ? 'active' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => onChange(c)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;