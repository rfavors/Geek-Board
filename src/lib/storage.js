// Local storage utilities for board management
// This avoids database costs by storing boards locally

const STORAGE_KEYS = {
  BOARDS: 'geekboard_boards',
  CURRENT_BOARD: 'geekboard_current_board',
  USER_PREFERENCES: 'geekboard_preferences'
}

export const storage = {
  // Board management
  saveBoard: (boardId, boardData) => {
    try {
      const boards = storage.getAllBoards()
      boards[boardId] = {
        ...boardData,
        id: boardId,
        lastModified: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards))
      return true
    } catch (error) {
      console.error('Error saving board:', error)
      return false
    }
  },

  getBoard: (boardId) => {
    try {
      const boards = storage.getAllBoards()
      return boards[boardId] || null
    } catch (error) {
      console.error('Error getting board:', error)
      return null
    }
  },

  getAllBoards: () => {
    try {
      const boards = localStorage.getItem(STORAGE_KEYS.BOARDS)
      return boards ? JSON.parse(boards) : {}
    } catch (error) {
      console.error('Error getting all boards:', error)
      return {}
    }
  },

  deleteBoard: (boardId) => {
    try {
      const boards = storage.getAllBoards()
      delete boards[boardId]
      localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards))
      return true
    } catch (error) {
      console.error('Error deleting board:', error)
      return false
    }
  },

  // Current board state
  setCurrentBoard: (boardId) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_BOARD, boardId)
  },

  getCurrentBoard: () => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_BOARD)
  },

  // User preferences
  savePreferences: (preferences) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences))
      return true
    } catch (error) {
      console.error('Error saving preferences:', error)
      return false
    }
  },

  getPreferences: () => {
    try {
      const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
      return prefs ? JSON.parse(prefs) : {
        gridEnabled: true,
        darkMode: true,
        autoSave: true
      }
    } catch (error) {
      console.error('Error getting preferences:', error)
      return {
        gridEnabled: true,
        darkMode: true,
        autoSave: true
      }
    }
  },

  // Export functionality
  exportBoardData: (boardId) => {
    const board = storage.getBoard(boardId)
    if (!board) return null
    
    const exportData = {
      ...board,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    }
    
    return JSON.stringify(exportData, null, 2)
  },

  importBoardData: (jsonData) => {
    try {
      const boardData = JSON.parse(jsonData)
      const boardId = boardData.id || `imported_${Date.now()}`
      return storage.saveBoard(boardId, boardData)
    } catch (error) {
      console.error('Error importing board:', error)
      return false
    }
  },

  // Utility functions
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  },

  getStorageUsage: () => {
    let totalSize = 0
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        totalSize += item.length
      }
    })
    return {
      bytes: totalSize,
      kb: (totalSize / 1024).toFixed(2),
      mb: (totalSize / (1024 * 1024)).toFixed(2)
    }
  }
}