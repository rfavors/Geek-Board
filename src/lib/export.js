import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const exportUtils = {
  // Export canvas as PNG
  exportAsPNG: async (canvas, filename = 'geekboard') => {
    try {
      const dataURL = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return true
    } catch (error) {
      console.error('Error exporting as PNG:', error)
      return false
    }
  },

  // Export canvas as JPG
  exportAsJPG: async (canvas, filename = 'geekboard') => {
    try {
      const dataURL = canvas.toDataURL('image/jpeg', 0.9)
      const link = document.createElement('a')
      link.download = `${filename}.jpg`
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return true
    } catch (error) {
      console.error('Error exporting as JPG:', error)
      return false
    }
  },

  // Export canvas as PDF
  exportAsPDF: async (canvas, filename = 'geekboard') => {
    try {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`${filename}.pdf`)
      return true
    } catch (error) {
      console.error('Error exporting as PDF:', error)
      return false
    }
  },

  // Export using html2canvas (fallback method)
  exportElementAsPNG: async (element, filename = 'geekboard') => {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#111827',
        scale: 2,
        useCORS: true
      })
      
      const dataURL = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return true
    } catch (error) {
      console.error('Error exporting element as PNG:', error)
      return false
    }
  },

  // Export board data as JSON
  exportBoardData: (boardData, filename = 'geekboard-data') => {
    try {
      const dataStr = JSON.stringify(boardData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.download = `${filename}.json`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error('Error exporting board data:', error)
      return false
    }
  },

  // Import board data from JSON file
  importBoardData: () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      
      input.onchange = (event) => {
        const file = event.target.files[0]
        if (!file) {
          reject(new Error('No file selected'))
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const boardData = JSON.parse(e.target.result)
            resolve(boardData)
          } catch (error) {
            reject(new Error('Invalid JSON file'))
          }
        }
        reader.onerror = () => reject(new Error('Error reading file'))
        reader.readAsText(file)
      }
      
      input.click()
    })
  },

  // Get canvas from Fabric.js canvas
  getFabricCanvasElement: (fabricCanvas) => {
    return fabricCanvas.getElement()
  },

  // Generate filename with timestamp
  generateFilename: (prefix = 'geekboard') => {
    const now = new Date()
    const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, '-')
    return `${prefix}-${timestamp}`
  }
}