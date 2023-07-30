import React,{useReducer} from 'react'
import './App.css';
import DigitButton from './DigitButton';
import OperatorButton from './OperatorButton';

export const ACTIONS ={
    ADD_DIGIT:'add-digit',
    CLEAR_ALL:'clear-all',
    REMOVE_DIGIT: 'remove-digit',
    CHOOSE_OPERATION: 'choose-operation',
    EVALUATE:'evaluate'
}

function reducer(state, {type, payload}){
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if(state.flag){
                return{
                    ...state,
                    currOperand: payload.digit,
                    flag: false
                }
            }
            if(payload.digit === "0" && state.currOperand === "0"){
                return state
            }
            if(payload.digit === "." && state.currOperand.includes(".")){
                return state
            }
            return{
                ...state,
                currOperand:`${state.currOperand||''}${payload.digit}`
            }
        
        case ACTIONS.CHOOSE_OPERATION:
            if (state.prevOperand === null && state.currOperand === null) {
                return state
            }
            if (state.currOperand === null) {
                return{
                    ...state,
                    operator: payload.operator
                }
            }
            if (state.prevOperand === null) {
                return{
                    ...state,
                    operator: payload.operator,
                    prevOperand: state.currOperand,
                    currOperand: null,
                }
                
            }
            return{
                ...state,
                prevOperand: evaluate(state),
                currOperand: null,
                operator: payload.operator
            }

        case ACTIONS.CLEAR_ALL:
            return {
                prevOperand: null,
                currOperand: null,
                operator: null
            }
        
        case ACTIONS.EVALUATE:
            if (state.prevOperand === null || state.currOperand === null) {
                return state
            }
            return{
                ...state,
                currOperand: evaluate(state),
                prevOperand: null,
                operator: null,
                flag: true
            }
        
        case ACTIONS.REMOVE_DIGIT:
            if (state.currOperand === null) {
                return state
            }
            if(state.flag){
                return{
                    ...state,
                    currOperand: null,
                    flag: false
                }
            }
            return{
                ...state,
                currOperand: state.currOperand.slice(0, -1)
            }

        default:
            break;
    }

}

function evaluate({prevOperand, currOperand, operator}){
    const prev = parseFloat(prevOperand)
    const curr = parseFloat(currOperand)
    if(isNaN(prev) || isNaN(curr)){
        return ""
    }
    let result="";
    switch (operator) {
        case "+":
            result = prev+curr            
            break;
        case "-":
            result = prev-curr            
            break;
        case "*":
            result = prev*curr            
            break;
        case "/":
            result = prev/curr            
            break;
        default:
            break;
    }
    return result.toString();
}

const initialState = {
    prevOperand: null,
    currOperand: null,
    operator: null
}

const option = {"en-us": {maximumFractionDigits: 0}}
const numberFormatter = new Intl.NumberFormat("en-us", option)

function formatOperand(operand){
    if(operand === null){
        return
    }
    const [integer, decimal] = operand.split(".")  
    if(decimal === undefined){
        return numberFormatter.format(integer)
    }
    return `${numberFormatter.format(integer)}.${decimal}`
}

function Calculator() {
    const [state, dispatch] = useReducer(reducer,
        initialState
    )
  return (
    <div className='calculator'>
        <div className='output'>
            <div className='prev-operand'>{formatOperand(state.prevOperand)} {state.operator}</div>
            <div className='curr-operand'>{formatOperand(state.currOperand)}</div>
        </div>

        <button className="span-two" onClick={()=>{
            dispatch({type: ACTIONS.CLEAR_ALL})}}>AC</button>
        <button onClick={()=>{
            dispatch({type: ACTIONS.REMOVE_DIGIT})}}>DEL</button>
        <OperatorButton dispatch={dispatch} operator="/"/>

        <DigitButton dispatch={dispatch} digit="1"/>
        <DigitButton dispatch={dispatch} digit="2"/>
        <DigitButton dispatch={dispatch} digit="3"/>
        <OperatorButton dispatch={dispatch} operator="*"/>

        <DigitButton dispatch={dispatch} digit="4"/>
        <DigitButton dispatch={dispatch} digit="5"/>
        <DigitButton dispatch={dispatch} digit="6"/>
        <OperatorButton dispatch={dispatch} operator="+"/>

        <DigitButton dispatch={dispatch} digit="7"/>
        <DigitButton dispatch={dispatch} digit="8"/>
        <DigitButton dispatch={dispatch} digit="9"/>
        <OperatorButton dispatch={dispatch} operator="-"/>
       
        <DigitButton dispatch={dispatch} digit="."/>
        <DigitButton dispatch={dispatch} digit="0"/>

        <button className="span-two" onClick={()=>{
            dispatch({type: ACTIONS.EVALUATE})}
        }>=</button>
    </div>
  )
}

export default Calculator