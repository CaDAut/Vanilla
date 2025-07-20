import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'large' ? '40px' : '20px'};
`;

const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  width: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '50px';
      default: return '30px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '50px';
      default: return '30px';
    }
  }};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  margin-left: 12px;
  color: #666;
  font-size: 14px;
`;

const LoadingSpinner = ({ size = 'medium', text = '', className = '' }) => {
  return (
    <SpinnerContainer size={size} className={className}>
      <Spinner size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;