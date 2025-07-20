import React from 'react';
import styled from 'styled-components';
import TextElement from './Text/TextElement';
import ImageElement from './Image/ImageElement';
import ButtonElement from './Button/ButtonElement';
import ContainerElement from './Container/ContainerElement';

const ElementWrapper = styled.div`
  position: absolute;
  left: ${props => props.position.x}px;
  top: ${props => props.position.y}px;
  width: ${props => props.size.width === 'auto' ? 'auto' : props.size.width};
  height: ${props => props.size.height === 'auto' ? 'auto' : props.size.height};
  cursor: pointer;
  transition: all 0.15s ease;
  
  &.selected {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  &:hover:not(.selected) {
    outline: 1px solid #94a3b8;
    outline-offset: 1px;
  }
`;

const ElementControls = styled.div`
  position: absolute;
  top: -32px;
  right: -2px;
  display: flex;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.2s ease;
  z-index: 10;
`;

const ControlButton = styled.button`
  border: none;
  background: none;
  padding: 4px 6px;
  cursor: pointer;
  font-size: 12px;
  color: #64748b;
  transition: all 0.15s ease;
  
  &:hover {
    background-color: #f1f5f9;
    color: #334155;
  }
  
  &.delete:hover {
    background-color: #fee2e2;
    color: #dc2626;
  }
`;

const RenderElement = ({ 
  element, 
  isSelected, 
  onClick, 
  onDelete, 
  theme 
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    // TODO: Implement duplicate functionality
    console.log('Duplicate element:', element.id);
  };

  const renderElementByType = () => {
    switch (element.type) {
      case 'text':
        return <TextElement element={element} />;
      case 'image':
        return <ImageElement element={element} />;
      case 'button':
        return <ButtonElement element={element} />;
      case 'container':
        return <ContainerElement element={element} />;
      default:
        return (
          <div style={{ 
            padding: '12px', 
            border: '1px dashed #ccc', 
            borderRadius: '4px',
            background: '#f9fafb'
          }}>
            Unknown element: {element.type}
          </div>
        );
    }
  };

  return (
    <ElementWrapper
      position={element.position || { x: 0, y: 0 }}
      size={element.size || { width: 'auto', height: 'auto' }}
      className={isSelected ? 'selected' : ''}
      onClick={handleClick}
      style={element.style || {}}
    >
      <ElementControls visible={isSelected}>
        <ControlButton
          onClick={handleDuplicate}
          title="Duplicate"
        >
          📋
        </ControlButton>
        <ControlButton
          onClick={handleDelete}
          className="delete"
          title="Delete"
        >
          🗑️
        </ControlButton>
      </ElementControls>
      
      {renderElementByType()}
    </ElementWrapper>
  );
};

export default RenderElement;