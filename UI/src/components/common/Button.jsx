import React from 'react'

function Button({name,onclickfun}) {
  return (
  <button onClick={onclickfun} className="py-1 px-4 rounded-md bg-primary text-white/80 text-md cursor-pointer">
                {name}
                </button>
            
  )
}

export default Button