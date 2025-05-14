import React, { useState } from 'react';
import { DiagramData } from '../../my-diagram-lib/src/components';

interface ModalJSONProps {
  onClose: () => void;
  onImport: (data: DiagramData) => void;
}

const ModalJSON: React.FC<ModalJSONProps> = ({ onClose, onImport }) => {
  const [jsonText, setJsonText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    try {
      const data = JSON.parse(jsonText) as DiagramData;
      
      if (!Array.isArray(data.elements) || !Array.isArray(data.connections)) {
        throw new Error('Invalid JSON structure. Expected "elements" and "connections" arrays.');
      }
      
      onImport(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="json-panel-overlay" onClick={onClose}>
      <div className="json-panel">
        <div className="json-panel-header">
          <h3>Import JSON</h3>
          <button className="close-button" onClick={onClose}>x</button>
        </div>
        
        <div className="json-panel-content">
          <div className="file-upload">
            <label>Upload JSON File</label>
            <input type="file" accept=".json" onChange={handleFileUpload} />
          </div>
          
          <div className="json-textarea code">
            <label>Or paste JSON content</label>
            <textarea
              rows={10}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste JSON here..."
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="json-panel-actions">
            <button className="action-button" onClick={handleImport}>Import</button>
            <button className="action-button cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalJSON;