import React from 'react';
import styled from 'styled-components';
import { useEditor } from '../../../contexts/EditorContext';

const PropertiesPanelContainer = styled.div`
  width: 300px;
  background-color: ${props => props.theme === 'dark' ? '#1f2937' : '#f8fafc'};
  border-left: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e2e8f0'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#374151' : '#e2e8f0'};
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#f3f4f6' : '#374151'};
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${props => props.theme === 'dark' ? '#6b7280' : '#9ca3af'};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const PropertyGroup = styled.div`
  margin-bottom: 24px;
`;

const PropertyGroupTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#4b5563'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PropertyField = styled.div`
  margin-bottom: 12px;
`;

const PropertyLabel = styled.label`
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#6b7280'};
`;

const PropertyInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme === 'dark' ? '#4b5563' : '#d1d5db'};
  border-radius: 4px;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#374151'};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PropertyTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme === 'dark' ? '#4b5563' : '#d1d5db'};
  border-radius: 4px;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#374151'};
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PropertySelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme === 'dark' ? '#4b5563' : '#d1d5db'};
  border-radius: 4px;
  background-color: ${props => props.theme === 'dark' ? '#374151' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#e5e7eb' : '#374151'};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PropertyCheckbox = styled.input`
  margin-right: 8px;
`;

const PropertyRow = styled.div`
  display: flex;
  gap: 8px;
  
  ${PropertyField} {
    flex: 1;
    margin-bottom: 0;
  }
`;

const PropertiesPanel = () => {
  const { 
    currentLayout, 
    selectedElement, 
    settings, 
    actions 
  } = useEditor();

  const selectedElementData = selectedElement && currentLayout
    ? currentLayout.elements.find(el => el.id === selectedElement)
    : null;

  const handlePropertyChange = (property, value) => {
    if (!selectedElement) return;
    
    actions.updateElement(selectedElement, {
      [property]: value
    });
  };

  const handleStyleChange = (styleProperty, value) => {
    if (!selectedElement) return;
    
    const currentStyle = selectedElementData?.style || {};
    
    actions.updateElement(selectedElement, {
      style: {
        ...currentStyle,
        [styleProperty]: value
      }
    });
  };

  const handlePropsChange = (propProperty, value) => {
    if (!selectedElement) return;
    
    const currentProps = selectedElementData?.props || {};
    
    actions.updateElement(selectedElement, {
      props: {
        ...currentProps,
        [propProperty]: value
      }
    });
  };

  const renderElementProperties = () => {
    if (!selectedElementData) return null;

    const { type, props = {}, style = {} } = selectedElementData;

    switch (type) {
      case 'text':
        return (
          <>
            <PropertyGroup>
              <PropertyGroupTitle theme={settings.theme}>Content</PropertyGroupTitle>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Text Content</PropertyLabel>
                <PropertyTextarea
                  theme={settings.theme}
                  value={props.content || ''}
                  onChange={(e) => handlePropsChange('content', e.target.value)}
                  placeholder="Enter text content..."
                />
              </PropertyField>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>HTML Tag</PropertyLabel>
                <PropertySelect
                  theme={settings.theme}
                  value={props.tag || 'p'}
                  onChange={(e) => handlePropsChange('tag', e.target.value)}
                >
                  <option value="p">Paragraph</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="h4">Heading 4</option>
                  <option value="h5">Heading 5</option>
                  <option value="h6">Heading 6</option>
                  <option value="span">Span</option>
                  <option value="div">Div</option>
                </PropertySelect>
              </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
              <PropertyGroupTitle theme={settings.theme}>Typography</PropertyGroupTitle>
              <PropertyRow>
                <PropertyField>
                  <PropertyLabel theme={settings.theme}>Font Size</PropertyLabel>
                  <PropertyInput
                    theme={settings.theme}
                    type="text"
                    value={style.fontSize || '16px'}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="16px"
                  />
                </PropertyField>
                <PropertyField>
                  <PropertyLabel theme={settings.theme}>Font Weight</PropertyLabel>
                  <PropertySelect
                    theme={settings.theme}
                    value={style.fontWeight || 'normal'}
                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="lighter">Lighter</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="600">600</option>
                    <option value="700">700</option>
                    <option value="800">800</option>
                    <option value="900">900</option>
                  </PropertySelect>
                </PropertyField>
              </PropertyRow>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Color</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="color"
                  value={style.color || '#333333'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                />
              </PropertyField>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Text Align</PropertyLabel>
                <PropertySelect
                  theme={settings.theme}
                  value={style.textAlign || 'left'}
                  onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </PropertySelect>
              </PropertyField>
            </PropertyGroup>
          </>
        );

      case 'button':
        return (
          <>
            <PropertyGroup>
              <PropertyGroupTitle theme={settings.theme}>Content</PropertyGroupTitle>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Button Text</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="text"
                  value={props.text || ''}
                  onChange={(e) => handlePropsChange('text', e.target.value)}
                  placeholder="Button text..."
                />
              </PropertyField>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Link URL</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="url"
                  value={props.link || ''}
                  onChange={(e) => handlePropsChange('link', e.target.value)}
                  placeholder="https://example.com"
                />
              </PropertyField>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Link Target</PropertyLabel>
                <PropertySelect
                  theme={settings.theme}
                  value={props.target || '_self'}
                  onChange={(e) => handlePropsChange('target', e.target.value)}
                >
                  <option value="_self">Same Window</option>
                  <option value="_blank">New Window</option>
                </PropertySelect>
              </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
              <PropertyGroupTitle theme={settings.theme}>Style</PropertyGroupTitle>
              <PropertyRow>
                <PropertyField>
                  <PropertyLabel theme={settings.theme}>Background</PropertyLabel>
                  <PropertyInput
                    theme={settings.theme}
                    type="color"
                    value={style.backgroundColor || '#3b82f6'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  />
                </PropertyField>
                <PropertyField>
                  <PropertyLabel theme={settings.theme}>Text Color</PropertyLabel>
                  <PropertyInput
                    theme={settings.theme}
                    type="color"
                    value={style.color || '#ffffff'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                  />
                </PropertyField>
              </PropertyRow>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Border Radius</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="text"
                  value={style.borderRadius || '4px'}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  placeholder="4px"
                />
              </PropertyField>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Padding</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="text"
                  value={style.padding || '12px 24px'}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  placeholder="12px 24px"
                />
              </PropertyField>
            </PropertyGroup>
          </>
        );

      case 'image':
        return (
          <>
            <PropertyGroup>
              <PropertyGroupTitle theme={settings.theme}>Image</PropertyGroupTitle>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Image URL</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="url"
                  value={props.src || ''}
                  onChange={(e) => handlePropsChange('src', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </PropertyField>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Alt Text</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="text"
                  value={props.alt || ''}
                  onChange={(e) => handlePropsChange('alt', e.target.value)}
                  placeholder="Describe the image..."
                />
              </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
              <PropertyGroupTitle theme={settings.theme}>Style</PropertyGroupTitle>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Border Radius</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="text"
                  value={style.borderRadius || '0'}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  placeholder="0"
                />
              </PropertyField>
            </PropertyGroup>
          </>
        );

      case 'container':
        return (
          <>
            <PropertyGroup>
              <PropertyGroupTitle theme={settings.theme}>Layout</PropertyGroupTitle>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Display</PropertyLabel>
                <PropertySelect
                  theme={settings.theme}
                  value={style.display || 'block'}
                  onChange={(e) => handleStyleChange('display', e.target.value)}
                >
                  <option value="block">Block</option>
                  <option value="flex">Flex</option>
                  <option value="grid">Grid</option>
                  <option value="inline-block">Inline Block</option>
                </PropertySelect>
              </PropertyField>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Min Height</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="text"
                  value={style.minHeight || '100px'}
                  onChange={(e) => handleStyleChange('minHeight', e.target.value)}
                  placeholder="100px"
                />
              </PropertyField>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Padding</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="text"
                  value={style.padding || '20px'}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  placeholder="20px"
                />
              </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
              <PropertyGroupTitle theme={settings.theme}>Background</PropertyGroupTitle>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Background Color</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="color"
                  value={style.backgroundColor || '#transparent'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                />
              </PropertyField>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Border</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="text"
                  value={style.border || '2px dashed #d1d5db'}
                  onChange={(e) => handleStyleChange('border', e.target.value)}
                  placeholder="2px dashed #d1d5db"
                />
              </PropertyField>
              <PropertyField>
                <PropertyLabel theme={settings.theme}>Border Radius</PropertyLabel>
                <PropertyInput
                  theme={settings.theme}
                  type="text"
                  value={style.borderRadius || '8px'}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  placeholder="8px"
                />
              </PropertyField>
            </PropertyGroup>
          </>
        );

      default:
        return (
          <PropertyGroup>
            <PropertyGroupTitle theme={settings.theme}>Unknown Element</PropertyGroupTitle>
            <p>No properties available for this element type.</p>
          </PropertyGroup>
        );
    }
  };

  return (
    <PropertiesPanelContainer theme={settings.theme}>
      <PanelHeader theme={settings.theme}>
        <PanelTitle theme={settings.theme}>
          {selectedElementData ? `${selectedElementData.type} Properties` : 'Properties'}
        </PanelTitle>
      </PanelHeader>

      <PanelContent>
        {!selectedElementData ? (
          <EmptyState theme={settings.theme}>
            <EmptyStateIcon>⚙️</EmptyStateIcon>
            <EmptyStateText>
              Select an element to edit its properties
            </EmptyStateText>
          </EmptyState>
        ) : (
          renderElementProperties()
        )}
      </PanelContent>
    </PropertiesPanelContainer>
  );
};

export default PropertiesPanel;