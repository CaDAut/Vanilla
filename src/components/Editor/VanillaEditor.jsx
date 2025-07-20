import React, { useEffect } from 'react';
import styled from 'styled-components';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useEditor } from '../../hooks/useEditor';
import { useDragDrop } from '../../hooks/useDragDrop';
import EditorToolbar from './Toolbar/EditorToolbar';
import EditorSidebar from './Sidebar/EditorSidebar';
import EditorCanvas from './Canvas/EditorCanvas';
import PropertiesPanel from './PropertiesPanel/PropertiesPanel';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorBoundary from '../UI/ErrorBoundary';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme === 'dark' ? '#1a1a1a' : '#f5f5f5'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#333333'};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const EditorMain = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const EditorContent = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
`;

const CanvasArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: ${props => props.theme === 'dark' ? '#2a2a2a' : '#ffffff'};
  border-left: 1px solid ${props => props.theme === 'dark' ? '#404040' : '#e0e0e0'};
  border-right: 1px solid ${props => props.theme === 'dark' ? '#404040' : '#e0e0e0'};
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 12px;
  margin: 12px;
  border: 1px solid #fcc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #c33;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  margin-left: 12px;
  
  &:hover {
    color: #a22;
  }
`;

const VanillaEditor = () => {
  const { 
    currentLayout, 
    selectedElement, 
    isLoading, 
    error, 
    settings, 
    actions 
  } = useEditor();

  const {
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    draggedElement
  } = useDragDrop();

  // Initialize editor on mount
  useEffect(() => {
    // Load initial data
    initializeEditor();
  }, []);

  const initializeEditor = async () => {
    try {
      actions.setLoading(true);
      
      // In a real implementation, you might load an existing layout
      // For now, we'll create a default empty layout
      const defaultLayout = {
        id: 'default',
        name: 'New Layout',
        elements: [],
        settings: {
          width: '100%',
          height: 'auto',
          backgroundColor: '#ffffff',
          padding: '20px'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      actions.setCurrentLayout(defaultLayout);
    } catch (err) {
      actions.setError('Failed to initialize editor: ' + err.message);
    } finally {
      actions.setLoading(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              actions.redo();
            } else {
              actions.undo();
            }
            break;
          case 's':
            event.preventDefault();
            handleSave();
            break;
          case 'd':
            event.preventDefault();
            if (selectedElement) {
              handleDuplicateElement();
            }
            break;
          default:
            break;
        }
      }
      
      // Delete key
      if (event.key === 'Delete' && selectedElement) {
        event.preventDefault();
        actions.deleteElement(selectedElement);
      }
      
      // Escape key
      if (event.key === 'Escape') {
        actions.selectElement(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElement, actions]);

  const handleSave = async () => {
    if (!currentLayout) return;
    
    try {
      actions.setLoading(true);
      // In a real implementation, save to API
      console.log('Saving layout:', currentLayout);
    } catch (err) {
      actions.setError('Failed to save layout: ' + err.message);
    } finally {
      actions.setLoading(false);
    }
  };

  const handleDuplicateElement = () => {
    if (!selectedElement || !currentLayout) return;
    
    const element = currentLayout.elements.find(el => el.id === selectedElement);
    if (element) {
      const duplicatedElement = {
        ...element,
        position: {
          x: element.position.x + 20,
          y: element.position.y + 20
        }
      };
      
      actions.addElement(duplicatedElement);
    }
  };

  const closeError = () => {
    actions.clearError();
  };

  if (isLoading) {
    return (
      <LoadingOverlay>
        <LoadingSpinner size="large" />
      </LoadingOverlay>
    );
  }

  return (
    <ErrorBoundary>
      <EditorContainer theme={settings.theme}>
        {error && (
          <ErrorMessage>
            <span>{error}</span>
            <CloseButton onClick={closeError} title="Close">
              ×
            </CloseButton>
          </ErrorMessage>
        )}
        
        <EditorToolbar onSave={handleSave} />
        
        <EditorMain>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <EditorContent>
              <EditorSidebar />
              
              <CanvasArea theme={settings.theme}>
                <EditorCanvas />
              </CanvasArea>
              
              <PropertiesPanel />
            </EditorContent>
            
            <DragOverlay>
              {draggedElement && (
                <div style={{
                  background: 'rgba(0, 123, 255, 0.1)',
                  border: '2px dashed #007bff',
                  borderRadius: '4px',
                  padding: '8px',
                  fontSize: '12px',
                  color: '#007bff',
                  minWidth: '100px',
                  textAlign: 'center'
                }}>
                  {draggedElement.type}
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </EditorMain>
      </EditorContainer>
    </ErrorBoundary>
  );
};

export default VanillaEditor;