import { useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'

const Start = () => {
  const navigate = useNavigate()
  const storageName = localStorage.getItem('Name')
  const [name, setName] = useState<string>(storageName ? storageName : '')
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const handleNameSubmit = () => {
    if (name.trim().length <= 0) {
      setError('There was no name provided')
      setTimeout(() => {
        setError('')
      }, 900)
    } else {
      localStorage.setItem('Name', JSON.stringify(name))
      setSuccess('Success!')
      navigate('/capycopy/loading')
    }
  }

  return (
    <>
      {storageName ? (
        <main className={'main gap-8 px-4 text-center'}>
          <h1>Hello! {storageName}!</h1>
          <p>Welcome back to CopyCapy!</p>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/capycopy/loading')}
          >
            Home
          </button>
        </main>
      ) : (
        <main className={'main gap-8 px-4 text-center'}>
          <h1>Hello!</h1>
          <p>
            Welcome to {'some random website'} ! <br />
            This is an experimental Budget Tracker app <br />
            created with Vite, React Typescript and Tailwindcss.
          </p>
          <p>To get started, please input your name below.</p>
          <Form className="flex gap-4 items-center bg-slate-500 p-4 rounded-xl">
            <input
              className={'textinput'}
              name="username"
              value={name ? name : ''}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="button" className="btn" onClick={handleNameSubmit}>
              Enter
            </button>
          </Form>
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-red-600">{success}</p>}
        </main>
      )}
    </>
  )
}

export default Start
