import React from 'react'
import {
  Pen,
  Eraser,
  Undo,
  Redo,
  Type,
  Grid,
  Download,
  Save,
  LogOut,
  Settings,
  Minus,
  Plus,
  Paintbrush,
  Clipboard
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Toolbar = ({
  activeTool,
  setActiveTool,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  boardColor,
  setBoardColor,
  gridEnabled,
  setGridEnabled,
  onUndo,
  onRedo,
  onClear,
  onExport,
  onSave,
  canUndo,
  canRedo
}) => {
  const { signOut, demoMode, exitDemoMode } = useAuth()

  const colors = [
    '#ffffff', // White
    '#000000', // Black
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#8b5cf6', // Purple
    '#f97316', // Orange
    '#ec4899', // Pink
    '#6b7280'  // Gray
  ]

  const boardColors = [
    { color: '#ef4444', name: 'Red' },
    { color: '#10b981', name: 'Green' },
    { color: '#f59e0b', name: 'Yellow' },
    { color: '#000000', name: 'Black' },
    { color: '#ffffff', name: 'White' },
    { color: '#3b82f6', name: 'Blue' },
    { color: '#ec4899', name: 'Pink' },
    { color: '#8b5cf6', name: 'Purple' },
    { color: '#6b7280', name: 'Grey' },
    { color: '#f97316', name: 'Orange' }
  ]

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'text', icon: Type, label: 'Text' }
  ]

  const exportOptions = [
    { format: 'png', label: 'PNG' },
    { format: 'jpg', label: 'JPG' },
    { format: 'pdf', label: 'PDF' }
  ]

  return (
    <>
      {/* Top Header Bar */}
      <div className="bg-dark-800 border-b border-dark-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo and Board name */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">
              The <span className="text-primary-500">Geek-Board</span>
            </h1>
            <div className="h-6 w-px bg-dark-600"></div>
            <input
              type="text"
              placeholder="Untitled Board"
              className="bg-transparent text-white placeholder-dark-400 border-none outline-none text-lg font-medium"
            />
          </div>

          {/* Right side - Export and user actions */}
          <div className="flex items-center gap-2">
            {/* Export dropdown */}
            <div className="relative group">
              <button className="toolbar-button bg-primary-600 hover:bg-primary-700">
                <Download className="w-5 h-5" />
                <span className="ml-2 text-sm">Export</span>
              </button>
              <div className="absolute right-0 top-full mt-2 bg-dark-700 rounded-lg shadow-xl border border-dark-600 py-2 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {exportOptions.map((option) => (
                  <button
                    key={option.format}
                    onClick={() => onExport(option.format)}
                    className="w-full px-4 py-2 text-left text-white hover:bg-dark-600 transition-colors duration-200"
                  >
                    Export as {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={onSave}
              className="toolbar-button bg-green-600 hover:bg-green-700"
              title="Save board"
            >
              <Save className="w-5 h-5" />
            </button>

            {/* Settings */}
            <button className="toolbar-button" title="Settings">
              <Settings className="w-5 h-5" />
            </button>

            {/* Demo Mode Indicator */}
            {demoMode && (
              <div className="px-3 py-2 bg-primary-600 rounded-lg text-white text-sm font-medium">
                Demo Mode
              </div>
            )}

            {/* Logout / Exit Demo */}
            <button
              onClick={demoMode ? exitDemoMode : signOut}
              className="toolbar-button hover:bg-red-600"
              title={demoMode ? "Exit demo mode" : "Sign out"}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Left Vertical Sidebar */}
      <div className="fixed left-0 top-[73px] bottom-0 w-20 bg-dark-800 border-r border-dark-700 flex flex-col items-center py-4 gap-4 z-40">
        {/* Tools */}
        <div className="flex flex-col items-center gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                  activeTool === tool.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                }`}
                title={tool.label}
              >
                <Icon className="w-6 h-6" />
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="w-8 h-px bg-dark-600"></div>

        {/* Brush size */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
            className="w-8 h-8 rounded bg-dark-700 hover:bg-dark-600 flex items-center justify-center text-white"
            title="Decrease brush size"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-white text-xs font-medium">{brushSize}px</span>
          <button
            onClick={() => setBrushSize(Math.min(50, brushSize + 1))}
            className="w-8 h-8 rounded bg-dark-700 hover:bg-dark-600 flex items-center justify-center text-white"
            title="Increase brush size"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-8 h-px bg-dark-600"></div>

        {/* Brush Colors */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <Paintbrush className="w-4 h-4 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setBrushColor(color)}
                className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
                  brushColor === color ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={`Brush Color: ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-8 h-px bg-dark-600"></div>

        {/* Board Colors */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <Clipboard className="w-4 h-4 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-1">
            {boardColors.map((colorObj) => (
              <button
                key={colorObj.color}
                onClick={() => setBoardColor(colorObj.color)}
                className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
                  boardColor === colorObj.color ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'
                }`}
                style={{ backgroundColor: colorObj.color }}
                title={`Board Color: ${colorObj.name}`}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-8 h-px bg-dark-600"></div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
              canUndo 
                ? 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white' 
                : 'bg-dark-800 text-gray-600 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
              canRedo 
                ? 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white' 
                : 'bg-dark-800 text-gray-600 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo className="w-5 h-5" />
          </button>
          <button
            onClick={() => setGridEnabled(!gridEnabled)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
              gridEnabled 
                ? 'bg-primary-600 text-white' 
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
            }`}
            title="Toggle grid"
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}

export default Toolbar