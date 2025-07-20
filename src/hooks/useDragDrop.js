import { useState, useCallback } from 'react';
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable';
import { useEditor as useEditorContext } from '../contexts/EditorContext';

export const useDragDrop = () => {
  const { actions } = useEditorContext();
  const [draggedElement, setDraggedElement] = useState(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    
    // Determine what's being dragged
    if (active.data.current?.type === 'element') {
      // Dragging an existing element
      setDraggedElement(active.data.current.element);
      actions.setDraggedElement(active.data.current.element);
    } else if (active.data.current?.type === 'component') {
      // Dragging a new component from sidebar
      setDraggedElement({
        type: active.id,
        isNew: true
      });
      actions.setDraggedElement({
        type: active.id,
        isNew: true
      });
    }
  }, [actions]);

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) return;

    // Handle dragging over canvas or containers
    if (over.data.current?.type === 'canvas' || over.data.current?.type === 'container') {
      // Visual feedback can be handled here
      // For example, highlighting drop zones
    }
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    // Clear dragged element state
    setDraggedElement(null);
    actions.setDraggedElement(null);

    if (!over) return;

    // Calculate drop position
    const dropPosition = calculateDropPosition(event, over);
    
    if (active.data.current?.type === 'component') {
      // Adding a new component
      handleAddNewElement(active.id, dropPosition, over);
    } else if (active.data.current?.type === 'element') {
      // Moving an existing element
      handleMoveExistingElement(active.data.current.element, dropPosition, over);
    }
  }, [actions]);

  const calculateDropPosition = (event, over) => {
    const { delta, activatorEvent } = event;
    
    // Get the drop target's bounding rect
    const overRect = over.rect;
    
    // Calculate position relative to the drop target
    let x = activatorEvent.clientX - overRect.left + delta.x;
    let y = activatorEvent.clientY - overRect.top + delta.y;
    
    // Ensure position is not negative
    x = Math.max(0, x);
    y = Math.max(0, y);
    
    return { x, y };
  };

  const handleAddNewElement = (elementType, position, over) => {
    // Get default properties for the element type
    const elementDefaults = getElementDefaults(elementType);
    
    // Determine parent container
    const parentId = over.data.current?.type === 'container' ? over.id : null;
    
    // Create new element data
    const elementData = {
      type: elementType,
      position,
      parentId,
      props: elementDefaults.props,
      style: elementDefaults.style,
      size: elementDefaults.size
    };
    
    actions.addElement(elementData);
  };

  const handleMoveExistingElement = (element, position, over) => {
    // Determine new parent container
    const newParentId = over.data.current?.type === 'container' ? over.id : null;
    
    // Move the element
    actions.moveElement(element.id, position, newParentId);
  };

  const getElementDefaults = (elementType) => {
    const defaults = {
      text: {
        props: {
          content: 'Text Element',
          tag: 'p'
        },
        style: {
          fontSize: '16px',
          color: '#333333',
          fontFamily: 'inherit'
        },
        size: {
          width: 'auto',
          height: 'auto'
        }
      },
      image: {
        props: {
          src: '',
          alt: 'Image',
          loading: 'lazy'
        },
        style: {
          display: 'block',
          maxWidth: '100%',
          height: 'auto'
        },
        size: {
          width: '200px',
          height: 'auto'
        }
      },
      button: {
        props: {
          text: 'Button',
          link: '#',
          target: '_self'
        },
        style: {
          backgroundColor: '#007bff',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          padding: '12px 24px',
          fontSize: '16px',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block'
        },
        size: {
          width: 'auto',
          height: 'auto'
        }
      },
      container: {
        props: {
          display: 'block'
        },
        style: {
          display: 'block',
          minHeight: '100px',
          border: '2px dashed #cccccc',
          borderRadius: '4px',
          padding: '20px'
        },
        size: {
          width: '100%',
          height: 'auto'
        }
      }
    };

    return defaults[elementType] || defaults.text;
  };

  // Utility function to check if an element can be dropped in a container
  const canDropInContainer = (elementType, containerId) => {
    // Add logic here to prevent invalid nesting
    // For example, containers might not be allowed inside text elements
    return true;
  };

  // Utility function to get valid drop targets for an element
  const getValidDropTargets = (elementType) => {
    // Return array of valid drop target types
    return ['canvas', 'container'];
  };

  return {
    sensors,
    draggedElement,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    canDropInContainer,
    getValidDropTargets,
    getElementDefaults
  };
};