import React, { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { storage } from '../../lib/storage'
import { exportUtils } from '../../lib/export'
import toast from 'react-hot-toast'

const Canvas = ({
  activeTool,
  brushSize,
  brushColor,
  boardColor,
  gridEnabled,
  onCanvasReady,
  onHistoryChange
}) => {
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const historyRef = useRef({ undo: [], redo: [] })

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight - 80, // Account for toolbar height
      backgroundColor: boardColor,
      selection: false
    })

    fabricCanvasRef.current = canvas

    // Set up drawing mode
    canvas.isDrawingMode = activeTool === 'pen'
    canvas.freeDrawingBrush.width = brushSize
    canvas.freeDrawingBrush.color = brushColor

    // Handle canvas events
    canvas.on('path:created', () => {
      saveState()
      autoSave()
    })

    canvas.on('object:added', () => {
      if (!isDrawing) {
        saveState()
        autoSave()
      }
    })

    canvas.on('mouse:down', () => setIsDrawing(true))
    canvas.on('mouse:up', () => setIsDrawing(false))

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 80
      })
      canvas.renderAll()
    }

    window.addEventListener('resize', handleResize)

    // Load saved board if exists
    loadBoard()

    // Save initial state
    saveState()

    if (onCanvasReady) {
      onCanvasReady(canvas)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.dispose()
    }
  }, [])

  // Update canvas when tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current

    // Remove existing event listeners
    canvas.off('mouse:down')
    canvas.off('mouse:up')
    canvas.off('mouse:move')

    switch (activeTool) {
      case 'pen':
        canvas.isDrawingMode = true
        canvas.selection = false
        canvas.defaultCursor = 'crosshair'
        // Reset to normal brush
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
        canvas.freeDrawingBrush.width = brushSize
        canvas.freeDrawingBrush.color = brushColor
        break
      case 'eraser':
        canvas.isDrawingMode = false
        canvas.selection = false
        canvas.defaultCursor = 'crosshair'
        setupEraserTool(canvas)
        break
      case 'text':
        canvas.isDrawingMode = false
        canvas.selection = true
        canvas.defaultCursor = 'text'
        setupTextTool(canvas)
        break
      default:
        canvas.isDrawingMode = false
        canvas.selection = true
        canvas.defaultCursor = 'default'
    }
  }, [activeTool, brushSize, brushColor])

  // Update canvas background color when boardColor changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return
    
    const canvas = fabricCanvasRef.current
    canvas.setBackgroundColor(boardColor, canvas.renderAll.bind(canvas))
    saveState()
    autoSave()
  }, [boardColor])

  // Setup eraser tool functionality
  const setupEraserTool = (canvas) => {
    let isErasing = false
    
    const handleMouseDown = (e) => {
      isErasing = true
      const pointer = canvas.getPointer(e.e)
      eraseAtPoint(canvas, pointer)
    }
    
    const handleMouseMove = (e) => {
      if (!isErasing) return
      const pointer = canvas.getPointer(e.e)
      eraseAtPoint(canvas, pointer)
    }
    
    const handleMouseUp = () => {
      if (isErasing) {
        isErasing = false
        saveState()
        autoSave()
      }
    }
    
    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)
  }
  
  // Erase objects at a specific point
  const eraseAtPoint = (canvas, pointer) => {
    const objects = canvas.getObjects()
    const eraserRadius = brushSize / 2
    
    objects.forEach(obj => {
      if (obj.excludeFromExport) return // Don't erase grid
      
      // Check if object intersects with eraser point
      const objBounds = obj.getBoundingRect()
      const distance = Math.sqrt(
        Math.pow(pointer.x - (objBounds.left + objBounds.width / 2), 2) +
        Math.pow(pointer.y - (objBounds.top + objBounds.height / 2), 2)
      )
      
      if (distance < eraserRadius + Math.max(objBounds.width, objBounds.height) / 2) {
        canvas.remove(obj)
      }
    })
    
    canvas.renderAll()
  }
  
  // Setup text tool functionality
  const setupTextTool = (canvas) => {
    const handleMouseDown = (e) => {
      const pointer = canvas.getPointer(e.e)
      addTextAtPoint(canvas, pointer)
    }
    
    canvas.on('mouse:down', handleMouseDown)
  }
  
  // Add text at a specific point
  const addTextAtPoint = (canvas, pointer) => {
    const text = new fabric.IText('Click to edit text', {
      left: pointer.x,
      top: pointer.y,
      fontFamily: 'Inter, sans-serif',
      fontSize: 20,
      fill: brushColor,
      selectable: true,
      editable: true
    })
    
    canvas.add(text)
    canvas.setActiveObject(text)
    text.enterEditing()
    text.selectAll()
    canvas.renderAll()
    
    // Save state after text is added
    text.on('editing:exited', () => {
      saveState()
      autoSave()
    })
  }
  
  // Update brush properties
  useEffect(() => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    if (canvas.freeDrawingBrush && activeTool === 'pen') {
      canvas.freeDrawingBrush.width = brushSize
      canvas.freeDrawingBrush.color = brushColor
    }
  }, [brushSize, brushColor, activeTool])

  // Handle grid toggle
  useEffect(() => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    
    if (gridEnabled) {
      addGrid(canvas)
    } else {
      removeGrid(canvas)
    }
  }, [gridEnabled])

  const addGrid = (canvas) => {
    const gridSize = 20
    const width = canvas.getWidth()
    const height = canvas.getHeight()

    // Remove existing grid
    removeGrid(canvas)

    const gridGroup = new fabric.Group([], {
      selectable: false,
      evented: false,
      excludeFromExport: true
    })

    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#374151',
        strokeWidth: 1,
        selectable: false,
        evented: false
      })
      gridGroup.addWithUpdate(line)
    }

    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#374151',
        strokeWidth: 1,
        selectable: false,
        evented: false
      })
      gridGroup.addWithUpdate(line)
    }

    canvas.add(gridGroup)
    canvas.sendToBack(gridGroup)
    canvas.renderAll()
  }

  const removeGrid = (canvas) => {
    const objects = canvas.getObjects()
    objects.forEach(obj => {
      if (obj.excludeFromExport) {
        canvas.remove(obj)
      }
    })
    canvas.renderAll()
  }

  const saveState = () => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    const state = JSON.stringify(canvas.toJSON())
    
    historyRef.current.undo.push(state)
    historyRef.current.redo = []
    
    // Limit history size
    if (historyRef.current.undo.length > 50) {
      historyRef.current.undo.shift()
    }

    if (onHistoryChange) {
      onHistoryChange({
        canUndo: historyRef.current.undo.length > 1,
        canRedo: historyRef.current.redo.length > 0
      })
    }
  }

  const undo = () => {
    if (historyRef.current.undo.length <= 1) return

    const canvas = fabricCanvasRef.current
    const currentState = historyRef.current.undo.pop()
    historyRef.current.redo.push(currentState)

    const previousState = historyRef.current.undo[historyRef.current.undo.length - 1]
    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll()
      if (onHistoryChange) {
        onHistoryChange({
          canUndo: historyRef.current.undo.length > 1,
          canRedo: historyRef.current.redo.length > 0
        })
      }
    })
  }

  const redo = () => {
    if (historyRef.current.redo.length === 0) return

    const canvas = fabricCanvasRef.current
    const state = historyRef.current.redo.pop()
    historyRef.current.undo.push(state)

    canvas.loadFromJSON(state, () => {
      canvas.renderAll()
      if (onHistoryChange) {
        onHistoryChange({
          canUndo: historyRef.current.undo.length > 1,
          canRedo: historyRef.current.redo.length > 0
        })
      }
    })
  }

  const clear = () => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    canvas.clear()
    canvas.backgroundColor = '#111827'
    
    if (gridEnabled) {
      addGrid(canvas)
    }
    
    canvas.renderAll()
    saveState()
    autoSave()
  }

  const autoSave = () => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    const boardData = {
      canvas: canvas.toJSON(),
      timestamp: new Date().toISOString()
    }

    const boardId = storage.getCurrentBoard() || `board_${Date.now()}`
    storage.saveBoard(boardId, boardData)
    storage.setCurrentBoard(boardId)
  }

  const loadBoard = () => {
    const currentBoardId = storage.getCurrentBoard()
    if (!currentBoardId) return

    const boardData = storage.getBoard(currentBoardId)
    if (!boardData || !boardData.canvas) return

    const canvas = fabricCanvasRef.current
    canvas.loadFromJSON(boardData.canvas, () => {
      canvas.renderAll()
      saveState()
      toast.success('Board loaded successfully')
    })
  }

  const exportCanvas = async (format) => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    const filename = exportUtils.generateFilename('geekboard')

    try {
      switch (format) {
        case 'png':
          await exportUtils.exportAsPNG(canvas.getElement(), filename)
          break
        case 'jpg':
          await exportUtils.exportAsJPG(canvas.getElement(), filename)
          break
        case 'pdf':
          await exportUtils.exportAsPDF(canvas.getElement(), filename)
          break
        default:
          throw new Error('Unsupported format')
      }
      toast.success(`Board exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`)
    }
  }

  // Expose methods to parent component
  React.useImperativeHandle(onCanvasReady, () => ({
    undo,
    redo,
    clear,
    exportCanvas,
    saveBoard: autoSave
  }), [])

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}

export default Canvas