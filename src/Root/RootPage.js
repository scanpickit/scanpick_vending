import React from 'react'

const RootPage = ({handleSubmit,handleLogin}) => {
  return (
    <div>
        <button onClick={handleLogin} >LOG IN</button>
        <button onClick={handleSubmit} >SIGN IN</button>
    </div>

  )
}

export default RootPage