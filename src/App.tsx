import '@fontsource/open-sans/400-italic.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/600.css'
import '@fontsource/open-sans/700.css'
import '@fontsource/open-sans/800.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600-italic.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import { useState } from 'react'
import { DevMode } from './DevMode'
import { EditorMode } from './EditorMode'

function App() {
  const [editorMode, setEditorMode] = useState(true)

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
        <button
          style={{
            cursor: 'pointer',
            background: 'white',
            color: 'black',
            border: '1px solid lightgray',
            fontWeight: 'bold',
            width: '100%',
          }}
          onClick={() => setEditorMode(!editorMode)}>
            {editorMode? "Dev 🟢" : "Editor 🔵"}
        </button>
        <button
          style={{ 
            cursor: 'pointer',
            padding: '8px',
            background: 'black', 
            color: 'white',
            marginTop: '16px', 
          }}
          onClick={toggleDarkMode}>Toggle Dark Mode</button>
      </div>
      <div style={{ display: 'flex' }}>
        {editorMode ? <EditorMode /> : <DevMode readonly={false} />}
      </div>
    </>
  )
}

export default App

function toggleDarkMode() {
  const isDarkMode = localStorage.getItem("selectedDarkMode") === "true"
  localStorage.setItem("selectedDarkMode", isDarkMode ? "false" : "true")
  window.location.reload()
}
