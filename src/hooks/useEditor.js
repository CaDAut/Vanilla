import { useCallback } from 'react';
import { useEditor as useEditorContext } from '../contexts/EditorContext';
import { layoutApi } from '../utils/api';
import { debounce } from '../utils/helpers';

/**
 * Custom hook for editor operations
 * Provides higher-level functions for common editor tasks
 */
export const useEditor = () => {
  const context = useEditorContext();
  
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }

  const { 
    currentLayout, 
    selectedElement, 
    isLoading, 
    error,
    settings,
    actions 
  } = context;

  // Auto-save functionality
  const autoSave = useCallback(
    debounce(async (layout) => {
      if (!layout || !layout.id || !settings.autoSave) return;
      
      try {
        await layoutApi.updateLayout(layout.id, {
          data: JSON.stringify(layout),
          updated_at: new Date().toISOString()
        });
        console.log('Layout auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, settings.autoSaveInterval || 30000),
    [settings.autoSave, settings.autoSaveInterval]
  );

  // Load layout from API
  const loadLayout = useCallback(async (layoutId) => {
    try {
      actions.setLoading(true);
      const layout = await layoutApi.getLayout(layoutId);
      
      // Parse layout data if it's a string
      if (typeof layout.data === 'string') {
        layout.elements = JSON.parse(layout.data).elements || [];
      }
      
      actions.setCurrentLayout(layout);
    } catch (error) {
      actions.setError('Failed to load layout: ' + error.message);
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  // Save current layout
  const saveLayout = useCallback(async () => {
    if (!currentLayout) return;
    
    try {
      actions.setLoading(true);
      
      const layoutData = {
        name: currentLayout.name,
        data: JSON.stringify({
          elements: currentLayout.elements || [],
          settings: currentLayout.settings || {}
        }),
        status: currentLayout.status || 'draft'
      };
      
      if (currentLayout.id) {
        // Update existing layout
        await layoutApi.updateLayout(currentLayout.id, layoutData);
      } else {
        // Create new layout
        const newLayout = await layoutApi.createLayout(layoutData);
        actions.updateLayout({ id: newLayout.id });
      }
      
      console.log('Layout saved successfully');
    } catch (error) {
      actions.setError('Failed to save layout: ' + error.message);
    } finally {
      actions.setLoading(false);
    }
  }, [currentLayout, actions]);

  // Create new layout
  const createNewLayout = useCallback(async (name = 'New Layout') => {
    try {
      actions.setLoading(true);
      
      const layoutData = {
        name,
        data: JSON.stringify({ elements: [], settings: {} }),
        status: 'draft'
      };
      
      const newLayout = await layoutApi.createLayout(layoutData);
      newLayout.elements = [];
      
      actions.setCurrentLayout(newLayout);
    } catch (error) {
      actions.setError('Failed to create layout: ' + error.message);
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  // Duplicate current layout
  const duplicateLayout = useCallback(async () => {
    if (!currentLayout) return;
    
    try {
      actions.setLoading(true);
      
      const layoutData = {
        name: `${currentLayout.name} (Copy)`,
        data: JSON.stringify({
          elements: currentLayout.elements || [],
          settings: currentLayout.settings || {}
        }),
        status: 'draft'
      };
      
      const newLayout = await layoutApi.createLayout(layoutData);
      newLayout.elements = currentLayout.elements || [];
      
      actions.setCurrentLayout(newLayout);
    } catch (error) {
      actions.setError('Failed to duplicate layout: ' + error.message);
    } finally {
      actions.setLoading(false);
    }
  }, [currentLayout, actions]);

  // Get selected element data
  const getSelectedElement = useCallback(() => {
    if (!selectedElement || !currentLayout) return null;
    
    return currentLayout.elements.find(el => el.id === selectedElement);
  }, [selectedElement, currentLayout]);

  // Add element with auto-save
  const addElement = useCallback((elementData) => {
    actions.addElement(elementData);
    
    // Trigger auto-save after adding element
    if (currentLayout && settings.autoSave) {
      setTimeout(() => {
        autoSave(currentLayout);
      }, 100);
    }
  }, [actions, currentLayout, settings.autoSave, autoSave]);

  // Update element with auto-save
  const updateElement = useCallback((id, updates) => {
    actions.updateElement(id, updates);
    
    // Trigger auto-save after updating element
    if (currentLayout && settings.autoSave) {
      setTimeout(() => {
        autoSave(currentLayout);
      }, 100);
    }
  }, [actions, currentLayout, settings.autoSave, autoSave]);

  // Delete element with auto-save
  const deleteElement = useCallback((id) => {
    actions.deleteElement(id);
    
    // Trigger auto-save after deleting element
    if (currentLayout && settings.autoSave) {
      setTimeout(() => {
        autoSave(currentLayout);
      }, 100);
    }
  }, [actions, currentLayout, settings.autoSave, autoSave]);

  // Export layout as JSON
  const exportLayout = useCallback(() => {
    if (!currentLayout) return;
    
    const exportData = {
      name: currentLayout.name,
      elements: currentLayout.elements || [],
      settings: currentLayout.settings || {},
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentLayout.name || 'layout'}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [currentLayout]);

  // Import layout from JSON
  const importLayout = useCallback((jsonData) => {
    try {
      const layoutData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      const importedLayout = {
        name: layoutData.name || 'Imported Layout',
        elements: layoutData.elements || [],
        settings: layoutData.settings || {},
        id: null, // Will be assigned when saved
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      actions.setCurrentLayout(importedLayout);
    } catch (error) {
      actions.setError('Failed to import layout: Invalid JSON format');
    }
  }, [actions]);

  // Clear current layout
  const clearLayout = useCallback(() => {
    const emptyLayout = {
      name: 'New Layout',
      elements: [],
      settings: {},
      id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    actions.setCurrentLayout(emptyLayout);
  }, [actions]);

  // Get layout statistics
  const getLayoutStats = useCallback(() => {
    if (!currentLayout) return null;
    
    const elements = currentLayout.elements || [];
    const elementTypes = {};
    
    elements.forEach(element => {
      elementTypes[element.type] = (elementTypes[element.type] || 0) + 1;
    });
    
    return {
      totalElements: elements.length,
      elementTypes,
      hasUnsavedChanges: false, // TODO: Implement unsaved changes detection
      lastSaved: currentLayout.updatedAt,
      created: currentLayout.createdAt
    };
  }, [currentLayout]);

  return {
    // State
    currentLayout,
    selectedElement,
    isLoading,
    error,
    settings,
    
    // Basic actions
    ...actions,
    
    // Enhanced actions
    addElement,
    updateElement,
    deleteElement,
    
    // Layout operations
    loadLayout,
    saveLayout,
    createNewLayout,
    duplicateLayout,
    exportLayout,
    importLayout,
    clearLayout,
    
    // Utilities
    getSelectedElement,
    getLayoutStats,
    
    // Auto-save
    autoSave
  };
};

export default useEditor;