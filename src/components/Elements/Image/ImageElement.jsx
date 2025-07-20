import React from 'react';
import styled from 'styled-components';

const Image = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: ${props => props.borderRadius || '0'};
  box-shadow: ${props => props.boxShadow || 'none'};
  filter: ${props => props.filter || 'none'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: ${props => props.hoverTransform || 'none'};
  }
  
  ${props => props.customStyles || ''}
`;

const ImagePlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 150px;
  background-color: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  flex-direction: column;
  gap: 8px;
`;

const PlaceholderIcon = styled.div`
  font-size: 24px;
  opacity: 0.6;
`;

const PlaceholderText = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const ImageElement = ({ element }) => {
  const props = element.props || {};
  const style = element.style || {};
  
  const src = props.src || '';
  const alt = props.alt || 'Image';
  const loading = props.loading || 'lazy';
  
  // If no src is provided, show placeholder
  if (!src) {
    return (
      <ImagePlaceholder>
        <PlaceholderIcon>🖼️</PlaceholderIcon>
        <div>Click to add image</div>
        <PlaceholderText>Drag & drop or click to browse</PlaceholderText>
      </ImagePlaceholder>
    );
  }
  
  const imageProps = {
    borderRadius: style.borderRadius,
    boxShadow: style.boxShadow,
    filter: style.filter,
    hoverTransform: style.hoverTransform,
    customStyles: style.customStyles
  };
  
  return (
    <Image
      src={src}
      alt={alt}
      loading={loading}
      {...imageProps}
    />
  );
};

export default ImageElement;