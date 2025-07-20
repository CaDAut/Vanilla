import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: inline-block;
  padding: ${props => props.padding || '12px 24px'};
  margin: ${props => props.margin || '0'};
  border: ${props => props.border || 'none'};
  border-radius: ${props => props.borderRadius || '4px'};
  background-color: ${props => props.backgroundColor || '#3b82f6'};
  color: ${props => props.color || '#ffffff'};
  font-size: ${props => props.fontSize || '16px'};
  font-weight: ${props => props.fontWeight || '500'};
  font-family: ${props => props.fontFamily || 'inherit'};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.boxShadow || '0 1px 3px rgba(0, 0, 0, 0.1)'};
  min-width: ${props => props.minWidth || 'auto'};
  text-align: center;
  
  &:hover {
    background-color: ${props => props.hoverBackgroundColor || '#2563eb'};
    transform: ${props => props.hoverTransform || 'translateY(-1px)'};
    box-shadow: ${props => props.hoverBoxShadow || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  ${props => props.customStyles || ''}
`;

const ButtonLink = styled.a`
  display: inline-block;
  padding: ${props => props.padding || '12px 24px'};
  margin: ${props => props.margin || '0'};
  border: ${props => props.border || 'none'};
  border-radius: ${props => props.borderRadius || '4px'};
  background-color: ${props => props.backgroundColor || '#3b82f6'};
  color: ${props => props.color || '#ffffff'};
  font-size: ${props => props.fontSize || '16px'};
  font-weight: ${props => props.fontWeight || '500'};
  font-family: ${props => props.fontFamily || 'inherit'};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.boxShadow || '0 1px 3px rgba(0, 0, 0, 0.1)'};
  min-width: ${props => props.minWidth || 'auto'};
  text-align: center;
  
  &:hover {
    background-color: ${props => props.hoverBackgroundColor || '#2563eb'};
    transform: ${props => props.hoverTransform || 'translateY(-1px)'};
    box-shadow: ${props => props.hoverBoxShadow || '0 4px 6px rgba(0, 0, 0, 0.1)'};
    text-decoration: none;
    color: ${props => props.color || '#ffffff'};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.customStyles || ''}
`;

const ButtonElement = ({ element }) => {
  const props = element.props || {};
  const style = element.style || {};
  
  const text = props.text || 'Button';
  const link = props.link || '#';
  const target = props.target || '_self';
  const type = props.type || 'button';
  const disabled = props.disabled || false;
  
  const buttonProps = {
    padding: style.padding,
    margin: style.margin,
    border: style.border,
    borderRadius: style.borderRadius,
    backgroundColor: style.backgroundColor,
    color: style.color,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontFamily: style.fontFamily,
    boxShadow: style.boxShadow,
    minWidth: style.minWidth,
    hoverBackgroundColor: style.hoverBackgroundColor,
    hoverTransform: style.hoverTransform,
    hoverBoxShadow: style.hoverBoxShadow,
    customStyles: style.customStyles
  };
  
  // If it's a link, render as anchor tag
  if (link && link !== '#') {
    return (
      <ButtonLink
        href={link}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        {...buttonProps}
      >
        {text}
      </ButtonLink>
    );
  }
  
  // Otherwise render as button
  return (
    <Button
      type={type}
      disabled={disabled}
      {...buttonProps}
    >
      {text}
    </Button>
  );
};

export default ButtonElement;