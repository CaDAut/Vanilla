import React from 'react';
import styled from 'styled-components';
import { useDraggable } from '@dnd-kit/core';
import { useEditor } from '../../../hooks/useEditor';

const SidebarContainer = styled.div`
  width: 280px;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#f8fafc'};
  border-right: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e2e8f0'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e2e8f0'};
`;

const SidebarTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#374151'};
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const ElementsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ElementItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#ffffff'};
  border: 1px solid ${props => props.theme === 'dark' ? '#4b5563' : '#e5e7eb'};
  border-radius: 8px;
  cursor: grab;
  transition: all 0.15s ease;
  user-select: none;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#4b5563' : '#f9fafb'};
    border-color: ${props => props.theme === 'dark' ? '#6b7280' : '#d1d5db'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.95);
  }
`;

const ElementIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.8;
`;

const ElementLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#6b7280'};
  text-align: center;
`;

const ElementDescription = styled.div`
  font-size: 11px;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#9ca3af'};
  text-align: center;
  margin-top: 4px;
  opacity: 0.8;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#4b5563'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Define available elements
const elements = [
  {
    id: 'text',
    label: 'Text',
    icon: '📝',
    description: 'Add text content'
  },
  {
    id: 'image',
    label: 'Image',
    icon: '🖼️',
    description: 'Insert an image'
  },
  {
    id: 'button',
    label: 'Button',
    icon: '🔘',
    description: 'Call-to-action button'
  },
  {
    id: 'container',
    label: 'Container',
    icon: '📦',
    description: 'Layout container'
  }
];

const DraggableElement = ({ element, theme }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    data: {
      type: 'component',
      element: element
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1
  } : undefined;

  return (
    <ElementItem
      ref={setNodeRef}
      style={style}
      theme={theme}
      {...listeners}
      {...attributes}
    >
      <ElementIcon>{element.icon}</ElementIcon>
      <ElementLabel theme={theme}>{element.label}</ElementLabel>
      <ElementDescription theme={theme}>{element.description}</ElementDescription>
    </ElementItem>
  );
};

const EditorSidebar = () => {
  const { settings } = useEditor();

  return (
    <SidebarContainer theme={settings.theme}>
      <SidebarHeader theme={settings.theme}>
        <SidebarTitle theme={settings.theme}>Elements</SidebarTitle>
      </SidebarHeader>

      <SidebarContent>
        <SectionTitle theme={settings.theme}>Basic Elements</SectionTitle>
        <ElementsGrid>
          {elements.map(element => (
            <DraggableElement
              key={element.id}
              element={element}
              theme={settings.theme}
            />
          ))}
        </ElementsGrid>

        {/* Future sections can be added here */}
        {/* 
        <SectionTitle theme={settings.theme} style={{ marginTop: '24px' }}>
          Layout Elements
        </SectionTitle>
        <ElementsGrid>
          // More elements...
        </ElementsGrid>
        */}
      </SidebarContent>
    </SidebarContainer>
  );
};

export default EditorSidebar;