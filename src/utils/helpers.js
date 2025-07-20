/**
 * Helper utility functions for Vanilla Builder
 */

// Generate unique IDs
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// Debounce function
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Format date
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// Convert CSS value to pixels
export const toPx = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 0;
  
  if (value.endsWith('px')) return numValue;
  if (value.endsWith('em')) return numValue * 16; // Assume 16px base
  if (value.endsWith('rem')) return numValue * 16; // Assume 16px base
  if (value.endsWith('%')) return numValue; // Return as-is for percentage
  
  return numValue; // Assume pixels if no unit
};

// Convert pixels to CSS value
export const fromPx = (pixels, unit = 'px') => {
  if (typeof pixels !== 'number') return pixels;
  
  switch (unit) {
    case 'em':
    case 'rem':
      return `${pixels / 16}${unit}`;
    case '%':
      return `${pixels}%`;
    default:
      return `${pixels}px`;
  }
};

// Validate CSS color
export const isValidColor = (color) => {
  if (!color) return false;
  
  // CSS color names, hex, rgb, rgba, hsl, hsla
  const colorRegex = /^(#[0-9A-Fa-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-zA-Z]+).*$/;
  return colorRegex.test(color);
};

// Parse CSS value
export const parseCssValue = (value) => {
  if (typeof value !== 'string') return { value: value, unit: '' };
  
  const match = value.match(/^(-?\d*\.?\d+)(.*)$/);
  if (!match) return { value: 0, unit: '' };
  
  return {
    value: parseFloat(match[1]),
    unit: match[2] || 'px'
  };
};

// Clamp number between min and max
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Get nested object property
export const getNestedProperty = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current !== undefined ? current : defaultValue;
};

// Set nested object property
export const setNestedProperty = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
};

// Merge objects deeply
export const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return mergeDeep(target, ...sources);
};

// Check if value is object
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Convert camelCase to kebab-case
export const camelToKebab = (str) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

// Convert kebab-case to camelCase
export const kebabToCamel = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

// Download JSON data as file
export const downloadJSON = (data, filename = 'data.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = filename;
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

// Get WordPress data from global
export const getWpData = (key, defaultValue = null) => {
  return getNestedProperty(window.vanillaBuilderData, key, defaultValue);
};

// Export all helpers
export default {
  generateId,
  deepClone,
  debounce,
  throttle,
  formatDate,
  toPx,
  fromPx,
  isValidColor,
  parseCssValue,
  clamp,
  isEmpty,
  getNestedProperty,
  setNestedProperty,
  mergeDeep,
  capitalize,
  camelToKebab,
  kebabToCamel,
  downloadJSON,
  copyToClipboard,
  getWpData
};