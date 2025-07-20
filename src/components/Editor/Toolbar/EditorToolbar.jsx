import React from 'react';
import styled from 'styled-components';
import { useEditor } from '../../../hooks/useEditor';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${props => props.theme === 'dark' ? '#2d3748' : '#ffffff'};
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid ${props => props.theme === 'dark' ? '#4a5568' : '#d1d5db'};
  border-radius: 4px;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#374151'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#4b5563' : '#f9fafb'};
    border-color: ${props => props.theme === 'dark' ? '#6b7280' : '#9ca3af'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.primary {
    background-color: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }

  &.primary:hover {
    background-color: #2563eb;
    border-color: #2563eb;
  }
`;

const ToolbarDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: ${props => props.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
  margin: 0 8px;
`;

const LayoutTitle = styled.input`
  font-size: 16px;
  font-weight: 600;
  background: none;
  border: none;
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#374151'};
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 200px;

  &:focus {
    outline: none;
    background-color: ${props => props.theme === 'dark' ? '#374151' : '#f9fafb'};
  }
`;

const EditorToolbar = ({ onSave }) => {
  const { 
    currentLayout, 
    history, 
    settings, 
    actions 
  } = useEditor();

  const handleTitleChange = (e) => {
    if (currentLayout) {
      actions.updateLayout({ name: e.target.value });
    }
  };

  const handleUndo = () => {
    actions.undo();
  };

  const handleRedo = () => {
    actions.redo();
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log('Preview layout:', currentLayout);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export layout:', currentLayout);
  };

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return (
    <ToolbarContainer theme={settings.theme}>
      <ToolbarSection>
        {currentLayout && (
          <LayoutTitle
            value={currentLayout.name || 'Untitled Layout'}
            onChange={handleTitleChange}
            placeholder="Layout Name"
            theme={settings.theme}
          />
        )}
      </ToolbarSection>

      <ToolbarSection>
        <ToolbarButton
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          theme={settings.theme}
        >
          ↶ Undo
        </ToolbarButton>

        <ToolbarButton
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
          theme={settings.theme}
        >
          ↷ Redo
        </ToolbarButton>

        <ToolbarDivider theme={settings.theme} />

        <ToolbarButton
          onClick={handlePreview}
          title="Preview Layout"
          theme={settings.theme}
        >
          👁 Preview
        </ToolbarButton>

        <ToolbarButton
          onClick={handleExport}
          title="Export Layout"
          theme={settings.theme}
        >
          📤 Export
        </ToolbarButton>

        <ToolbarDivider theme={settings.theme} />

        <ToolbarButton
          onClick={handleSave}
          className="primary"
          title="Save Layout (Ctrl+S)"
          theme={settings.theme}
        >
          💾 Save
        </ToolbarButton>
      </ToolbarSection>
    </ToolbarContainer>
  );
};

export default EditorToolbar;