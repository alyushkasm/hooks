import React, { useEffect, useReducer, useRef } from 'react';
import axios from 'axios';

const todo = props => {
    //const [todoName, setTodoName] = useState('');
    //const [submittedTodo, setSubmittedTodo] = useState(null);
    //const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        axios.get('https://my-hooks-7b65e.firebaseio.com/todos.json')
        .then(result => {
            console.log(result);
            const todoData = result.data;
            const todos = [];
            for (const key in todoData) {
                todos.push({id: key, name: todoData[key].name});
            }
            dispatch({type: 'SET', payload: todos});
        });
        return () => {
            console.log('Cleanup');
        }
    }, []);

    // useEffect(() => {
    //     if (submittedTodo) {
    //         dispatch({type: 'ADD', payload: submittedTodo});
    //     }  
    // }, [submittedTodo]);

    const todoInputRef = useRef();

    const todoListReducer = (state, action) => {
        switch(action.type) {
            case 'ADD':
                return state.concat(action.payload);
            case 'SET':
                return action.payload;
            case 'REMOVE':
                return state.filter((todo) => todo.id !== action.payload);
            default:
                return state;
        }
    }

    const [todoList, dispatch] = useReducer(todoListReducer, []);

    // const inputChangeHandler = (event) => {
    //     setTodoName(event.target.value);
    // };

    const todoAddHandler = () => {
        const todoName = todoInputRef.current.value;
        axios.post('https://my-hooks-7b65e.firebaseio.com/todos.json', {name: todoName})
        .then(res => {
            const todoItem = { id: res.data.name, name: todoName };
            dispatch({type: 'ADD', payload: todoItem});
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }

    const todoRemoveHandler = todoId => {
        axios.delete(`https://my-hooks-7b65e.firebaseio.com/todos/${todoId}.json`)
        .then(res => {
            dispatch({type: 'REMOVE', payload: todoId});
        })
        .catch(err => console.log(err));
        
    }

    return <React.Fragment>
        <input type="text" placeholder="Todo" ref={todoInputRef} />
        <button type="button" onClick={todoAddHandler}>Add</button>
        <ul>
            {todoList.map(todo => <li key={todo.id} onClick={todoRemoveHandler.bind(this, todo.id)}>{todo.name}</li>)}
        </ul>
    </React.Fragment>
};

export default todo;