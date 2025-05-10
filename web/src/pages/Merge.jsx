import React, { useState } from 'react'
import axios from 'axios'

export function Merge() {
  const Header = () => {
    return (
      <header>
        <h1>Welcome to the File Merge Service!</h1>
        <p>Choose a few text files, selecting them individually</p>
      </header>
    )
  }

  const FileUpload = () => {
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState('')

    const onFileChange = (event) => {
      setFile(event.target.files[0])
      if (message) {
        setMessage('')
      }
    }

    const onFileUpload = async () => {
      if (!file) {
        setMessage('Please select a file first.')
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        setMessage('File uploaded successfully!')
        console.log('Server Response:', response.data)
      } catch (error) {
        setMessage('File upload failed. Please try again.')
        console.error('Upload Error:', error)
      }
    }

    return (
      <div>
        <h3>Select a file and click the Upload button</h3>
        <input type='file' onChange={onFileChange} />
        <button onClick={onFileUpload}>Upload</button>
        {message && <p>{message}</p>}
      </div>
    )
  }

  const FileDownload = () => {
    const downloadFile = async () => {
      try {
        const response = await axios.get('/api/download', {
          responseType: 'blob',
        })

        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', blob.type.split('/')[1])
        document.body.appendChild(link)
        link.click()

        // Clean up
        link.parentNode.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('File download failed:', error)
      }
    }

    return (
      <div>
        <h3>Tap the Download button to fetch your merged file</h3>
        <button onClick={downloadFile}>Download</button>
      </div>
    )
  }
  return (
    <div>
      <Header />
      <FileUpload />
      <FileDownload />
    </div>
  )
}
