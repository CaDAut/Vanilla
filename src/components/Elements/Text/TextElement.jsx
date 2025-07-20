import React from 'react';
import styled from 'styled-components';

const TextContainer = styled.div`
  font-family: ${props => props.fontFamily || 'inherit'};
  font-size: ${props => props.fontSize || '16px'};
  font-weight: ${props => props.fontWeight || 'normal'};
  color: ${props => props.color || '#333333'};
  line-height: ${props => props.lineHeight || '1.5'};
  text-align: ${props => props.textAlign || 'left'};
  text-decoration: ${props => props.textDecoration || 'none'};
  letter-spacing: ${props => props.letterSpacing || 'normal'};
  word-spacing: ${props => props.wordSpacing || 'normal'};
  white-space: ${props => props.whiteSpace || 'normal'};
  min-height: 1em;
  
  ${props => props.customStyles || ''}
`;

const TextElement = ({ element }) => {
  const props = element.props || {};
  const style = element.style || {};
  
  const content = props.content || 'Text Element';
  const tag = props.tag || 'p';
  
  // Merge style properties
  const textProps = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    color: style.color,
    lineHeight: style.lineHeight,
    textAlign: style.textAlign,
    textDecoration: style.textDecoration,
    letterSpacing: style.letterSpacing,
    wordSpacing: style.wordSpacing,
    whiteSpace: style.whiteSpace,
    customStyles: style.customStyles
  };

  // Create the element with the specified tag
  const ElementTag = TextContainer.withComponent(tag);
  
  return (
    <ElementTag {...textProps}>
      {content}
    </ElementTag>
  );
};

export default TextElement;