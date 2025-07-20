import React from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';

const Container = styled.div`
  display: ${props => props.display || 'block'};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || 'auto'};
  min-height: ${props => props.minHeight || '100px'};
  max-width: ${props => props.maxWidth || 'none'};
  padding: ${props => props.padding || '20px'};
  margin: ${props => props.margin || '0'};
  border: ${props => props.border || '2px dashed #d1d5db'};
  border-radius: ${props => props.borderRadius || '8px'};
  background-color: ${props => props.backgroundColor || 'transparent'};
  background-image: ${props => props.backgroundImage || 'none'};
  background-size: ${props => props.backgroundSize || 'cover'};
  background-position: ${props => props.backgroundPosition || 'center'};
  background-repeat: ${props => props.backgroundRepeat || 'no-repeat'};
  box-shadow: ${props => props.boxShadow || 'none'};
  position: relative;
  overflow: ${props => props.overflow || 'visible'};
  
  /* Flexbox properties */
  flex-direction: ${props => props.flexDirection || 'row'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: ${props => props.alignItems || 'stretch'};
  flex-wrap: ${props => props.flexWrap || 'nowrap'};
  gap: ${props => props.gap || '0'};
  
  /* Grid properties */
  grid-template-columns: ${props => props.gridTemplateColumns || 'none'};
  grid-template-rows: ${props => props.gridTemplateRows || 'none'};
  grid-gap: ${props => props.gridGap || '0'};
  
  transition: all 0.2s ease;
  
  &.drop-target {
    border-color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
  }
  
  &:empty::before {
    content: 'Drop elements here';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #9ca3af;
    font-size: 14px;
    pointer-events: none;
    white-space: nowrap;
  }
  
  ${props => props.customStyles || ''}
`;

const ContainerLabel = styled.div`
  position: absolute;
  top: -24px;
  left: 0;
  font-size: 11px;
  color: #6b7280;
  background-color: #f9fafb;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid #e5e7eb;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 1;
`;

const ContainerElement = ({ element }) => {
  const props = element.props || {};
  const style = element.style || {};
  
  const { setNodeRef, isOver } = useDroppable({
    id: element.id,
    data: {
      type: 'container',
      element: element
    }
  });
  
  const containerProps = {
    display: style.display || props.display,
    width: style.width,
    height: style.height,
    minHeight: style.minHeight,
    maxWidth: style.maxWidth,
    padding: style.padding,
    margin: style.margin,
    border: style.border,
    borderRadius: style.borderRadius,
    backgroundColor: style.backgroundColor,
    backgroundImage: style.backgroundImage,
    backgroundSize: style.backgroundSize,
    backgroundPosition: style.backgroundPosition,
    backgroundRepeat: style.backgroundRepeat,
    boxShadow: style.boxShadow,
    overflow: style.overflow,
    flexDirection: style.flexDirection,
    justifyContent: style.justifyContent,
    alignItems: style.alignItems,
    flexWrap: style.flexWrap,
    gap: style.gap,
    gridTemplateColumns: style.gridTemplateColumns,
    gridTemplateRows: style.gridTemplateRows,
    gridGap: style.gridGap,
    customStyles: style.customStyles
  };
  
  const containerClasses = `${isOver ? 'drop-target' : ''}`;
  
  return (
    <Container
      ref={setNodeRef}
      className={containerClasses}
      {...containerProps}
    >
      <ContainerLabel>Container</ContainerLabel>
      {/* Child elements would be rendered here in a full implementation */}
    </Container>
  );
};

export default ContainerElement;