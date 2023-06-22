"use client"
import React, { useState } from 'react';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<string[]>([]); // 用於存儲所有的 todo
  const [newTodo, setNewTodo] = useState(''); // 用於存儲新的 todo 輸入值

  // 處理新增 todo
  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos((prevTodos) => [...prevTodos, newTodo]); // 新增 todo 到 todos 陣列
      setNewTodo(''); // 清空新的 todo 輸入值
    }
  };

  // 處理完成/未完成 todo
  const handleToggleTodo = (index: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      if (updatedTodos[index].startsWith('✓')) {
        updatedTodos[index] = updatedTodos[index].substring(2); // 移除 ✓ 標記
      } else {
        updatedTodos[index] = `✓ ${updatedTodos[index]}`; // 加上 ✓ 標記
      }
      return updatedTodos;
    });
  };

  // 處理完成 todo
  const handleTodoComplete = (index: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      updatedTodos[index] = `✓ ${updatedTodos[index]}`; // 在 todo 文字前加上 ✓ 標記完成狀態
      return updatedTodos;
    });
  };

  // 處理移除 todo
  const handleTodoRemove = (index: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      updatedTodos.splice(index, 1); // 從 todos 陣列中刪除指定索引的 todo
      return updatedTodos;
    });
  };

  return (
    <div className="flex items-center justify-center w-full font-sans bg-gray-100 h-100">
      <div className="w-full p-6 m-4 bg-white rounded shadow lg:w-3/4 lg:max-w-lg">
        <div className="mb-4">
          <h1 className="text-gray-900">Todo List</h1>
          <div className="flex mt-4">
            <input
              className="w-full px-3 py-2 mr-4 text-gray-800 bg-gray-100 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Add Todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)} // 監聽輸入值變化，更新 newTodo 狀態
            />
            <button
              className="p-2 text-green-300 border-2 border-green-300 rounded flex-no-shrink hover:bg-indigo-800 hover:bg-green-300 hover:text-white"
              onClick={handleAddTodo} // 點擊時觸發 handleAddTodo 函數
            >
              Add
            </button>
          </div>
        </div>
        <div>
          {todos.map((todo, index) => (
            <div key={index} className="flex items-center mb-4">
              <p
                className={`w-full ${todo.startsWith('✓') ? 'line-through text-green-500' : 'text-gray-900'}`}
              >
                {todo}
              </p>
              {!todo.startsWith('✓') && ( // 如果 todo 未完成，渲染完成和移除按鈕
                <>
                  <button
                    className="p-2 ml-4 mr-2 text-green-300 border-2 border-green-600 rounded flex-no-shrink hover:bg-green-700 hover:text-white"
                    onClick={() => handleTodoComplete(index)} // 點擊時觸發 handleTodoComplete 函數
                  >
                    Done
                  </button>
                  <button
                    className="p-2 ml-2 text-red-300 border-2 border-red-300 rounded flex-no-shrink border-red hover:text-white hover:bg-red-300"
                    onClick={() => handleTodoRemove(index)} // 點擊時觸發 handleTodoRemove 函數
                  >
                    Remove
                  </button>
                </>
              )}
              {todo.startsWith('✓') && ( // 如果 todo 已完成，渲染 "Not Done" 按鈕
                <>
                  <button
                    className="p-2 ml-2 text-yellow-500 border-2 border-yellow-500 rounded flex-no-shrink hover:bg-yellow-600 hover:text-white"
                    onClick={() => handleToggleTodo(index)} // 點擊時觸發 handleToggleTodo 函數
                  >
                    NotDone
                  </button>
                  <button
                    className="p-2 ml-2 text-red-300 border-2 border-red-300 rounded flex-no-shrink border-red hover:text-white hover:bg-red-300"
                    onClick={() => handleTodoRemove(index)} // 點擊時觸發 handleTodoRemove 函數
                  >
                    Remove
                  </button>
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