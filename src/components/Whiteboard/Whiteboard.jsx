import React, { useState, useRef, useEffect } from 'react'
import Toolbar from './Toolbar'
import Canvas from './Canvas'
import toast from 'react-hot-toast'

const Whiteboard = () => {
  const [activeTool, setActiveTool] = useState('pen')
  const [brushSize, setBrushSize] = useState(5)
  const [brushColor, setBrushColor] = useState('#ffffff')
  const [boardColor, setBoardColor] = useState('#111827') // Default dark background
  const [gridEnabled, setGridEnabled] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const canvasMethodsRef = useRef(null)

  const handleCanvasReady = (methods) => {
    canvasMethodsRef.current = methods
  }

  const handleHistoryChange = ({ canUndo: newCanUndo, canRedo: newCanRedo }) => {
    setCanUndo(newCanUndo)
    setCanRedo(newCanRedo)
  }

  const handleUndo = () => {
    if (canvasMethodsRef.current?.undo) {
      canvasMethodsRef.current.undo()
    }
  }

  const handleRedo = () => {
    if (canvasMethodsRef.current?.redo) {
      canvasMethodsRef.current.redo()
    }
  }

  const handleClear = () => {
    if (canvasMethodsRef.current?.clear) {
      const confirmed = window.confirm('Are you sure you want to clear the entire board? This action cannot be undone.')
      if (confirmed) {
        canvasMethodsRef.current.clear()
        toast.success('Board cleared')
      }
    }
  }

  const handleExport = (format) => {
    if (canvasMethodsRef.current?.exportCanvas) {
      canvasMethodsRef.current.exportCanvas(format)
    }
  }

  const handleSave = () => {
    if (canvasMethodsRef.current?.saveBoard) {
      canvasMethodsRef.current.saveBoard()
      toast.success('Board saved successfully')
    }
  }

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl (or Cmd on Mac) is pressed
      const isCtrlOrCmd = event.ctrlKey || event.metaKey
      
      if (isCtrlOrCmd && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        if (canUndo) {
          handleUndo()
        }
      } else if (isCtrlOrCmd && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault()
        if (canRedo) {
          handleRedo()
        }
      }
    }

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [canUndo, canRedo, handleUndo, handleRedo])

  return (
    <div className="h-screen bg-dark-900">
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        brushColor={brushColor}
        setBrushColor={setBrushColor}
        boardColor={boardColor}
        setBoardColor={setBoardColor}
        gridEnabled={gridEnabled}
        setGridEnabled={setGridEnabled}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onExport={handleExport}
        onSave={handleSave}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <div className="ml-20">
        <Canvas
          activeTool={activeTool}
          brushSize={brushSize}
          brushColor={brushColor}
          boardColor={boardColor}
          gridEnabled={gridEnabled}
          onCanvasReady={handleCanvasReady}
          onHistoryChange={handleHistoryChange}
        />
      </div>
    </div>
  )
}

export default Whiteboard