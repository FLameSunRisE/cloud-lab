"use client"
import React, { useState, useEffect  } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}


const TodoList: React.FC = () => {
  // 用於存儲所有的 todo
  const [todos, setTodos] = useState<Todo[]>([]);
  // 用於存儲新的 todo 輸入值
  const [newTodo, setNewTodo] = useState(''); 

  // 獲取所有的 todo
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/todos');
      console.log('response');
      console.log(response);
      const data = await response.json();
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
        const response = await fetch('http://localhost:8080/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: newTodo, description: newTodo, completed: false }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log('api/todos data');
          console.log(data);
          setTodos((prevTodos) => [...prevTodos, data.title]);
          setNewTodo('');
          fetchTodos();
        } else {
          console.error('Failed to add todo:', response.status);
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  // 處理完成/未完成 todo
  const handleToggleTodo = (index: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      if (updatedTodos[index].completed) {
        // updatedTodos[index] = updatedTodos[index].substring(2); // 移除 ✓ 標記
        console.log('移除 ✓ 標記');
        updatedTodos[index].completed = false;
      } else {
        // updatedTodos[index] = `✓ ${updatedTodos[index]}`; // 加上 ✓ 標記
        console.log('增加 ✓ 標記');
        updatedTodos[index].completed = true;
      }
      console.log('updatedTodos[index]')
      console.log(updatedTodos[index])

      // 發送更新 todo 的 API 請求
      // 使用 fetch 或其他 HTTP 客戶端庫發送 PUT 或 PATCH 請求
      // 例如：fetch('/api/todos/' + index, { method: 'PUT', body: JSON.stringify(updatedTodos[index]) })
      updateTodo(updatedTodos[index]); // 發送更新 todo 的 API 請求

      return updatedTodos;
    });
  };

  const updateTodo = async (todo: Todo) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Updated todo:', data);
        fetchTodos(); // 更新 todos
      } else {
        console.error('Failed to update todo:', response.status);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // 處理完成 todo
  const handleTodoComplete = (index: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      // updatedTodos[index] = `✓ ${updatedTodos[index]}`; // 在 todo 文字前加上 ✓ 標記完成狀態
      updatedTodos[index].completed = true; // 加上 ✓ 標記完成狀態
  
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
      // updatedTodos.splice(index, 1); // 從 todos 陣列中刪除指定索引的 todo
      
      // 發送刪除 todo 的 API 請求
      // 使用 fetch 或其他 HTTP 客戶端庫發送 DELETE 請求
      // 例如：fetch('/api/todos/' + index, { method: 'DELETE' })
      fetch(`http://localhost:8080/api/todos/${updatedTodos[index].id}`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          console.log('Todo removed successfully.');
          fetchTodos();
        } else {
          console.error('Failed to remove todo:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error removing todo:', error);
      });


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
                className={`w-full ${todo.completed ? 'line-through text-green-500' : 'text-gray-900'}`}
              >
                {todo.title}
              </p>
              {!todo.completed && ( // 如果 todo 未完成，渲染完成和移除按鈕
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
              {todo.completed && ( // 如果 todo 已完成，渲染 "Not Done" 按鈕
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