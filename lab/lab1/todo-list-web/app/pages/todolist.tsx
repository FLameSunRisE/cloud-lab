"use client"
import React, { useState, useEffect  } from 'react';
import { callApi,callApiGet } from '../api/api';
import Button from '../components/Button';

// Todo 物件的介面定義
interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

// 新增按鈕的屬性介面定義
interface ActionAddButtonProps {
  onClick: () => void;
  label: string;
}

// 輸入欄位元件
const InputField: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <input
    className="w-full px-3 py-2 mr-4 text-gray-800 bg-gray-100 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400"
    placeholder="Add Todo"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

// 新增按鈕元件
const ActionAddButton: React.FC<ActionAddButtonProps> = ({ onClick, label }) => (
  <button
    className="p-2 text-green-300 border-2 border-green-300 rounded flex-no-shrink hover:bg-indigo-800 hover:bg-green-300 hover:text-white"
    onClick={onClick}
  >
    {label}
  </button>
);

// 完成按鈕元件
const ActionDoneButton: React.FC<ActionAddButtonProps> = ({ onClick, label }) => (
  <button
    className="p-2 ml-4 mr-2 text-green-300 border-2 border-green-600 rounded flex-no-shrink hover:bg-green-700 hover:text-white"
    onClick={onClick}
  >
    {label}
  </button>
);

// 未完成按鈕元件
const ActionNotDoneButton: React.FC<ActionAddButtonProps> = ({ onClick, label }) => (
  <button
    className="p-2 ml-2 text-yellow-500 border-2 border-yellow-500 rounded flex-no-shrink hover:bg-yellow-600 hover:text-white"
    onClick={onClick}
  >
    {label}
  </button>
);

// 刪除按鈕元件
const ActionDelButton: React.FC<ActionAddButtonProps> = ({ onClick, label }) => (
  <button
    className="p-2 ml-2 text-red-300 border-2 border-red-300 rounded flex-no-shrink border-red hover:text-white hover:bg-red-300"
    onClick={onClick}
  >
    {label}
  </button>
);

// TodoList 元件
const TodoList: React.FC = () => {
  // 用於存儲所有的 todo
  const [todos, setTodos] = useState<Todo[]>([]);
  // 用於存儲新的 todo 輸入值
  const [newTodo, setNewTodo] = useState(''); 

  // 獲取所有的 todo
  const fetchTodos = async () => {
    try {
      const data = await callApiGet('api/todos');
      console.log('data');
      console.log(data);
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // 在組件初次渲染時獲取 todos
  useEffect(() => {
    fetchTodos();
  }, []);

  // 處理新增 todo
  const handleAddTodo = async () => {
    if (newTodo.trim() !== '') {
      try {
        const data = await callApi('api/todos', 'POST', {
          title: newTodo,
          description: newTodo,
          completed: false,
        });
        setTodos((prevTodos) => [...prevTodos, data]);
        setNewTodo('');
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  // 處理完成/未完成 todo
  const handleToggleTodo = (index: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      // 反轉 completed 值 (✓ 標記)
      updatedTodos[index].completed = !updatedTodos[index].completed;
      console.log('updatedTodos[index]')
      console.log(updatedTodos[index])

      // 發送更新 todo 的 API 請求
      updateTodo(updatedTodos[index]);

      return updatedTodos;
    });
  };

  // 更新 todo
  const updateTodo = async (todo: Todo) => {
    try {
      const data = await callApi(`api/todos/${todo.id}`, 'PUT', todo);
      fetchTodos(); // 更新 todos
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // 刪除 todo
  const delTodo = async (todo: Todo) => {
    try {
      await callApi(`api/todos/${todo.id}`, 'DELETE', null);
      fetchTodos(); // 更新 todos
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };


  // 處理完成 todo
  const handleTodoComplete = (index: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      // 設定 completed 為 標記完成狀態(true)
      updatedTodos[index].completed = true;
  
      // 發送更新 todo 的 API 請求
      updateTodo(updatedTodos[index]); // 發送更新 todo 的 API 請求

      return updatedTodos;
    });
  };

  // 處理移除 todo
  const handleTodoRemove = (index: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      console.log('updatedTodos[index]');
      console.log(updatedTodos[index]);
      
      // 發送刪除 todo 的 API 請求
      delTodo(updatedTodos[index]);
      return updatedTodos;
    });
  };

  return (
    <div className="flex items-center justify-center w-full font-sans bg-gray-100 h-100">
      <div className="w-full p-6 m-4 bg-white rounded shadow lg:w-3/4 lg:max-w-lg">
        <div className="mb-4">
          <h1 className="text-gray-900">Todo List</h1>
          <div className="flex mt-4">
            <InputField value={newTodo} onChange={setNewTodo} />
            <ActionAddButton onClick={handleAddTodo} label="Add" />
          </div>
        </div>
        <div>
          {todos.map((todo, index) => (
            <div key={index} className="flex items-center mb-4">
              <p
                className={`w-full ${todo.completed ? 'line-through text-green-500' : 'text-gray-900'}`}
              >
                {todo.title}
              </p>
              {!todo.completed && ( // 如果 todo 未完成，渲染完成和移除按鈕
                <>
                  <ActionDoneButton onClick={() => handleTodoComplete(index)} label="Done" />
                  <ActionDelButton onClick={() => handleTodoRemove(index)} label="Remove" />
                </>
              )}
              {todo.completed && ( // 如果 todo 已完成，渲染 "Not Done" 按鈕
                <>
                  <ActionNotDoneButton onClick={() => handleToggleTodo(index)} label="NotDone" />
                  <ActionDelButton onClick={() => handleTodoRemove(index)} label="Remove" />
                </>

                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;