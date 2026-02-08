import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks){
      return JSON.parse(savedTasks);
    } else {
      return [{
        id: Date.now(),
        text:  "Это ваша первая заметка! ✨\nМожете её отредактировать или удалить.",
        completed: false
      }];
    }
  });

  const [editingText, setEditingText] = useState("");
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addInputValue = () => {
    if (inputValue.trim() !== ""){
      setTasks([...tasks, {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      }]);
      setInputValue("");
    } 
  };  


  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const completeToggleTask = (id) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? {
          ...task,
          completed: !task.completed
        } 
        : task
    ));
  }


  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  }

  const saveEdit = () =>{
    if (editingText.trim() === ""){
      cancelEdit();
      return
    }

    setTasks(tasks.map(task =>
      task.id === editingId ? 
      {...task, text: editingText.trim()} 
      : task
    ));

    setEditingId(null);
    setEditingText("");
  }

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  }


  return (
    <>
      <div className="container">
          <div className="add-task">
              <input 
                type="text"
                placeholder="Добавьте заметку 📝"
                spellCheck="false"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addInputValue()}
              />

              <button
                onClick={addInputValue}
              >+</button>
          </div>

          <div className="added-task">
              <ul className="task-list">
              {tasks.length === 0 ? (
                  <li className="zero-task">У вас нет заметок</li>
                ) : (
                  tasks
                  .sort((a, b) => {
                    if (a.completed === b.completed){
                      return a.id - b.id
                    }
                    return a.completed ? 1 : -1;
                  })
                  .map((val) => (
                    <li key={val.id}
                    className={val.completed ? 'completed' : ''}>
                      {editingId === val.id ? (
                        <>
                            <input 
                              type="text" 
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) => {
                                 if (e.key === 'Enter'){
                                  saveEdit()
                                }
                                if (e.key === 'Escape') {
                                  cancelEdit()
                                }
                              }}
                              className='edit-input'
                              autoFocus
                            />

                            <div className="right-button">
                              <button
                                onClick={saveEdit}
                                className='save'
                              >
                                💾
                              </button>
                              <button
                                onClick={cancelEdit} 
                                className='cancel'
                              >
                                ❌
                              </button>
                            </div>
                        </>
                      ) : (
                        <>
                          <div className="left-button">
                            <button
                              onClick={() => completeToggleTask(val.id)}
                              className='complete'
                            >
                              {val.completed ? "❌" : "✅"}
                            </button>
                          </div>

                          <p
                            onDoubleClick={() => startEditing(val.id, val.text)}
                          >
                            {val.text}
                          </p>

                          <div className="right-button">
                            <button
                              onClick={() => startEditing(val.id, val.text)}
                              className='edit'
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteTask(val.id)}
                              className='delete'
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))
                )}
              </ul>
          </div>
      </div>
    </>
  )
}

export default App
