import React, { useRef } from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import { useEditor } from '../../../hooks/useEditor';
import RenderElement from '../../Elements/RenderElement';

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
`;

const CanvasToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#f8fafc'};
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#4b5563' : '#e2e8f0'};
  font-size: 12px;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const CanvasViewport = styled.div`
  flex: 1;
  overflow: auto;
  padding: 20px;
  background-color: ${props => props.theme === 'dark' ? '#111827' : '#f1f5f9'};
  position: relative;
`;

const CanvasArea = styled.div`
  min-height: 600px;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e2e8f0'};
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  &.drop-active {
    border-color: #3b82f6;
    background-color: ${props => props.theme === 'dark' ? '#1e3a8a' : '#dbeafe'};
    border-style: dashed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  color: ${props => props.theme === 'dark' ? '#6b7280' : '#9ca3af'};
  text-align: center;
  padding: 40px;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const EmptyStateDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme === 'dark' ? '#6b7280' : '#9ca3af'};
  max-width: 300px;
`;

const ElementsContainer = styled.div`
  position: relative;
  min-height: 100%;
  padding: 20px;
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: ${props => props.visible ? 0.1 : 0};
  background-image: 
    linear-gradient(to right, #ddd 1px, transparent 1px),
    linear-gradient(to bottom, #ddd 1px, transparent 1px);
  background-size: ${props => props.gridSize}px ${props => props.gridSize}px;
  transition: opacity 0.2s ease;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ZoomButton = styled.button`
  padding: 4px 8px;
  border: 1px solid ${props => props.theme === 'dark' ? '#4b5563' : '#d1d5db'};
  border-radius: 4px;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#374151'};
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#4b5563' : '#f9fafb'};
  }
`;

const ZoomLevel = styled.span`
  font-size: 12px;
  min-width: 50px;
  text-align: center;
`;

const EditorCanvas = () => {
  const { 
    currentLayout, 
    selectedElement, 
    settings, 
    actions 
  } = useEditor();
  
  const canvasRef = useRef(null);
  
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
    data: {
      type: 'canvas'
    }
  });

  const elements = currentLayout?.elements || [];
  const hasElements = elements.length > 0;

  const handleCanvasClick = (e) => {
    // Deselect element if clicking on empty canvas
    if (e.target === e.currentTarget) {
      actions.selectElement(null);
    }
  };

  const handleElementClick = (elementId, e) => {
    e.stopPropagation();
    actions.selectElement(elementId);
  };

  const handleElementDelete = (elementId) => {
    actions.deleteElement(elementId);
  };

  const canvasClasses = `${isOver ? 'drop-active' : ''}`;

  return (
    <CanvasContainer theme={settings.theme}>
      <CanvasToolbar theme={settings.theme}>
        <div>
          Canvas: {currentLayout?.name || 'Untitled Layout'}
        </div>
        <ZoomControls>
          <ZoomButton theme={settings.theme}>-</ZoomButton>
          <ZoomLevel>100%</ZoomLevel>
          <ZoomButton theme={settings.theme}>+</ZoomButton>
        </ZoomControls>
      </CanvasToolbar>

      <CanvasViewport theme={settings.theme}>
        <CanvasArea
          ref={(node) => {
            canvasRef.current = node;
            setNodeRef(node);
          }}
          className={canvasClasses}
          theme={settings.theme}
          onClick={handleCanvasClick}
        >
          <GridOverlay 
            visible={settings.showGrid} 
            gridSize={settings.gridSize} 
          />
          
          {!hasElements ? (
            <EmptyState theme={settings.theme}>
              <EmptyStateIcon>🎨</EmptyStateIcon>
              <EmptyStateTitle theme={settings.theme}>
                Start Building
              </EmptyStateTitle>
              <EmptyStateDescription theme={settings.theme}>
                Drag elements from the sidebar to begin creating your layout
              </EmptyStateDescription>
            </EmptyState>
          ) : (
            <ElementsContainer>
              {elements.map(element => (
                <RenderElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElement === element.id}
                  onClick={(e) => handleElementClick(element.id, e)}
                  onDelete={() => handleElementDelete(element.id)}
                  theme={settings.theme}
                />
              ))}
            </ElementsContainer>
          )}
        </CanvasArea>
      </CanvasViewport>
    </CanvasContainer>
  );
};

export default EditorCanvas;