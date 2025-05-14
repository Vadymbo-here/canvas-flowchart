import React, { useCallback, useState } from 'react';
import { DiagramPanel, DiagramData } from '../my-diagram-lib/src/components';
import { useStore } from './store';
import './App.css';

import ColorPicker from './components/ColorPicker';
import SettingSection from './components/SettingSection';
import ModalJSON from './components/ModalJSON';
import { unstable_batchedUpdates } from 'react-dom';

const App: React.FC = () => {
  const {
    elements,
    connections,
    mainColor,
    selectedElementId,
    setElements,
    setConnections,
    setColor,
    setSelectedElementId,
    addElement
  } = useStore();

  const [isModalJSONOpen, setIsModalJSONOpen] = useState<boolean>(false);

  const handleAddRectangle = useCallback(() => {
    addElement({
      id: `element-${Date.now()}`,
      type: 'rectangle',
      position: { x: 120, y: 100 },
      size: { width: 120, height: 80 },
      text: `Obj ${elements.length + 1}`,
    });
  }, [addElement, elements.length]);

  const handleExportJson = useCallback(() => {
    const blob = new Blob(
      [JSON.stringify({ elements, connections }, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: 'diagram.json' }).click();
    URL.revokeObjectURL(url);
  }, [elements, connections]);

  const handleImportJson = useCallback((data: DiagramData) => {
    unstable_batchedUpdates(() => {
      setElements(data.elements);
      setConnections(data.connections);
      setIsModalJSONOpen(false);
    });
  }, [setElements, setConnections]);

  return (
    <div className="app">

      <header className="app-header">
        <h1>Diagram editor</h1>
        <div className="settings-panel">
          <ColorPicker color={mainColor} onChange={setColor} />
        </div>
      </header>

      <div className="app-content">
        <div className="canvas-container">
          <DiagramPanel
            elements={elements}
            connections={connections}
            mainColor={mainColor}
            onElementsChange={setElements}
            onConnectionsChange={setConnections}
            onElementSelect={setSelectedElementId}
            selectedElementId={selectedElementId}
          />
        </div>
        <div className="card">
          <h3>Settings</h3>
          <SettingSection
            onAddRectangle={handleAddRectangle}
            onExportJson={handleExportJson}
            onImportJson={() => setIsModalJSONOpen(true)}
          />

          {isModalJSONOpen && (
            <ModalJSON
              onClose={() => setIsModalJSONOpen(false)}
              onImport={handleImportJson}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;