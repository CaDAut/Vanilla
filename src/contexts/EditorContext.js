import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial editor state
const initialState = {
  layouts: [],
  currentLayout: null,
  selectedElement: null,
  draggedElement: null,
  isLoading: false,
  error: null,
  history: {
    past: [],
    present: null,
    future: []
  },
  settings: {
    theme: 'light',
    autoSave: true,
    autoSaveInterval: 30000,
    showGrid: true,
    snapToGrid: true,
    gridSize: 10
  }
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_LAYOUTS: 'SET_LAYOUTS',
  SET_CURRENT_LAYOUT: 'SET_CURRENT_LAYOUT',
  UPDATE_LAYOUT: 'UPDATE_LAYOUT',
  ADD_ELEMENT: 'ADD_ELEMENT',
  UPDATE_ELEMENT: 'UPDATE_ELEMENT',
  DELETE_ELEMENT: 'DELETE_ELEMENT',
  SELECT_ELEMENT: 'SELECT_ELEMENT',
  SET_DRAGGED_ELEMENT: 'SET_DRAGGED_ELEMENT',
  MOVE_ELEMENT: 'MOVE_ELEMENT',
  UNDO: 'UNDO',
  REDO: 'REDO',
  UPDATE_HISTORY: 'UPDATE_HISTORY',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const editorReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ActionTypes.SET_LAYOUTS:
      return {
        ...state,
        layouts: action.payload,
        isLoading: false
      };

    case ActionTypes.SET_CURRENT_LAYOUT:
      return {
        ...state,
        currentLayout: action.payload,
        selectedElement: null,
        history: {
          past: [],
          present: action.payload,
          future: []
        }
      };

    case ActionTypes.UPDATE_LAYOUT:
      const updatedLayout = {
        ...state.currentLayout,
        ...action.payload
      };
      return {
        ...state,
        currentLayout: updatedLayout,
        layouts: state.layouts.map(layout =>
          layout.id === updatedLayout.id ? updatedLayout : layout
        )
      };

    case ActionTypes.ADD_ELEMENT:
      const newElement = {
        id: uuidv4(),
        type: action.payload.type,
        props: action.payload.props || {},
        children: action.payload.children || [],
        parentId: action.payload.parentId || null,
        position: action.payload.position || { x: 0, y: 0 },
        size: action.payload.size || { width: 'auto', height: 'auto' },
        style: action.payload.style || {},
        createdAt: new Date().toISOString()
      };

      const layoutWithNewElement = {
        ...state.currentLayout,
        elements: [...(state.currentLayout?.elements || []), newElement]
      };

      return {
        ...state,
        currentLayout: layoutWithNewElement,
        selectedElement: newElement.id,
        history: {
          past: [...state.history.past, state.history.present],
          present: layoutWithNewElement,
          future: []
        }
      };

    case ActionTypes.UPDATE_ELEMENT:
      if (!state.currentLayout) return state;

      const updatedElements = state.currentLayout.elements.map(element =>
        element.id === action.payload.id
          ? { ...element, ...action.payload.updates, updatedAt: new Date().toISOString() }
          : element
      );

      const layoutWithUpdatedElement = {
        ...state.currentLayout,
        elements: updatedElements
      };

      return {
        ...state,
        currentLayout: layoutWithUpdatedElement,
        history: {
          past: [...state.history.past, state.history.present],
          present: layoutWithUpdatedElement,
          future: []
        }
      };

    case ActionTypes.DELETE_ELEMENT:
      if (!state.currentLayout) return state;

      const filteredElements = state.currentLayout.elements.filter(
        element => element.id !== action.payload && element.parentId !== action.payload
      );

      const layoutWithDeletedElement = {
        ...state.currentLayout,
        elements: filteredElements
      };

      return {
        ...state,
        currentLayout: layoutWithDeletedElement,
        selectedElement: state.selectedElement === action.payload ? null : state.selectedElement,
        history: {
          past: [...state.history.past, state.history.present],
          present: layoutWithDeletedElement,
          future: []
        }
      };

    case ActionTypes.SELECT_ELEMENT:
      return {
        ...state,
        selectedElement: action.payload
      };

    case ActionTypes.SET_DRAGGED_ELEMENT:
      return {
        ...state,
        draggedElement: action.payload
      };

    case ActionTypes.MOVE_ELEMENT:
      if (!state.currentLayout) return state;

      const movedElements = state.currentLayout.elements.map(element =>
        element.id === action.payload.elementId
          ? {
              ...element,
              position: action.payload.position,
              parentId: action.payload.parentId || element.parentId,
              updatedAt: new Date().toISOString()
            }
          : element
      );

      const layoutWithMovedElement = {
        ...state.currentLayout,
        elements: movedElements
      };

      return {
        ...state,
        currentLayout: layoutWithMovedElement,
        history: {
          past: [...state.history.past, state.history.present],
          present: layoutWithMovedElement,
          future: []
        }
      };

    case ActionTypes.UNDO:
      if (state.history.past.length === 0) return state;

      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, state.history.past.length - 1);

      return {
        ...state,
        currentLayout: previous,
        history: {
          past: newPast,
          present: previous,
          future: [state.history.present, ...state.history.future]
        }
      };

    case ActionTypes.REDO:
      if (state.history.future.length === 0) return state;

      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);

      return {
        ...state,
        currentLayout: next,
        history: {
          past: [...state.history.past, state.history.present],
          present: next,
          future: newFuture
        }
      };

    case ActionTypes.UPDATE_HISTORY:
      return {
        ...state,
        history: {
          past: [...state.history.past, state.history.present],
          present: action.payload,
          future: []
        }
      };

    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    default:
      return state;
  }
};

// Create context
const EditorContext = createContext();

// Context provider component
export const EditorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Action creators
  const actions = {
    setLoading: useCallback((loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    }, []),

    setError: useCallback((error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    }, []),

    clearError: useCallback(() => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    }, []),

    setLayouts: useCallback((layouts) => {
      dispatch({ type: ActionTypes.SET_LAYOUTS, payload: layouts });
    }, []),

    setCurrentLayout: useCallback((layout) => {
      dispatch({ type: ActionTypes.SET_CURRENT_LAYOUT, payload: layout });
    }, []),

    updateLayout: useCallback((updates) => {
      dispatch({ type: ActionTypes.UPDATE_LAYOUT, payload: updates });
    }, []),

    addElement: useCallback((elementData) => {
      dispatch({ type: ActionTypes.ADD_ELEMENT, payload: elementData });
    }, []),

    updateElement: useCallback((id, updates) => {
      dispatch({ type: ActionTypes.UPDATE_ELEMENT, payload: { id, updates } });
    }, []),

    deleteElement: useCallback((id) => {
      dispatch({ type: ActionTypes.DELETE_ELEMENT, payload: id });
    }, []),

    selectElement: useCallback((id) => {
      dispatch({ type: ActionTypes.SELECT_ELEMENT, payload: id });
    }, []),

    setDraggedElement: useCallback((element) => {
      dispatch({ type: ActionTypes.SET_DRAGGED_ELEMENT, payload: element });
    }, []),

    moveElement: useCallback((elementId, position, parentId) => {
      dispatch({ 
        type: ActionTypes.MOVE_ELEMENT, 
        payload: { elementId, position, parentId } 
      });
    }, []),

    undo: useCallback(() => {
      dispatch({ type: ActionTypes.UNDO });
    }, []),

    redo: useCallback(() => {
      dispatch({ type: ActionTypes.REDO });
    }, []),

    updateSettings: useCallback((settings) => {
      dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings });
    }, [])
  };

  const value = {
    ...state,
    actions
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

// Custom hook to use the editor context
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export default EditorContext;