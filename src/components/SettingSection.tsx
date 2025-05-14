import React from 'react';

interface SettingSectionProps {
  onAddRectangle: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
}

const SettingSection: React.FC<SettingSectionProps> = ({ onAddRectangle, onExportJson, onImportJson }) => {
  return (
    <div className='toolbar'>
      <button className="btn-inverted" onClick={onAddRectangle}>
        Add Rectangle
      </button>
      <button className="toolbar-button" onClick={onExportJson}>
        Export JSON
      </button>
      <button className="toolbar-button" onClick={onImportJson}>
        Import JSON
      </button>
    </div>
  );
};

export default SettingSection;
