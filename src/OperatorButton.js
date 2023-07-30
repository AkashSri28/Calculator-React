import React from 'react'
import { ACTIONS } from './Calculator'

function OperatorButton({className, dispatch, operator}) {
  return (
    <button className={`${className}`} onClick={()=>{
        dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: {operator}})
    }}>
        {operator}
    </button>
  )
}

export default OperatorButton