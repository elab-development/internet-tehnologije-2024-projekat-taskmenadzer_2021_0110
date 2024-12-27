import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'pending',
    category_id: '',
    assigned_to: '',
    deadline: '',
  });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  // Load tasks from the server
  useEffect(() => {
    fetch('http://localhost:8000/api/tasks')
      .then((response) => response.json())
      .then((data) => {
        console.log('Tasks loaded:', data.data);
        setTasks(data.data || []); // Ensure it's an array
      })
      .catch((error) => console.error('Error loading tasks:', error));

      // Preuzimanje korisnika
    fetch('http://127.0.0.1:8000/api/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Greška prilikom učitavanja korisnika:', error));

    // Preuzimanje kategorija
    fetch('http://127.0.0.1:8000/api/categories', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Greška prilikom učitavanja kategorija:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // API poziv za kreiranje zadatka
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // Dodaj autentifikaciju
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          alert('Greška prilikom kreiranja zadatka');
        } else {
          alert('Zadatak uspešno kreiran');
          setIsModalOpen(false); // Zatvaranje modala
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const statuses = ['pending', 'in_progress', 'completed']; 

  // Handle drag-and-drop
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceTasks = tasks.filter((task) => task.status === source.droppableId);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    const newStatus = destination.droppableId;
    movedTask.status = newStatus;

    // Update the task's status on the server
  fetch(`http://localhost:8000/api/tasks/${movedTask.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: movedTask.title,           
      description: movedTask.description,
      status: newStatus,
      deadline: movedTask.deadline,
      category_id: movedTask.category_id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Task updated on server:', data);
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.id === movedTask.id) {
            return { ...task, status: newStatus };
          }
          return task;
        });
      });
    })
    .catch((error) => console.error('Error updating task:', error));
  };

  return (
    <div>

<DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {tasks.length > 0 && statuses.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                className="kanban-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h3 className="kanban-title">{status.replace('_', ' ').toUpperCase()}</h3>
                {tasks
                  .filter((task) => task.status === status) // Osigurava samo zadatke sa tačnim statusom
                  .map((task, index) => (
                    <Draggable
                      key={String(task.id)}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="kanban-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p>{task.title}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>

<div className="kanban-controls">
          <button onClick={() => setIsModalOpen(true)} className="add-task-button">
            + Novi zadatak
          </button>
        </div>

      {/* Modal za kreiranje zadatka */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Kreiraj novi zadatak</h3>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="title">Naslov</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Naslov"
                value={taskData.title}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="description">Opis</label>
              <textarea
                id="description"
                name="description"
                placeholder="Opis"
                value={taskData.description}
                onChange={handleInputChange}
              ></textarea>

              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={taskData.status}
                onChange={handleInputChange}
                required
              >
                <option value="pending">Na čekanju</option>
                <option value="in_progress">U toku</option>
                <option value="completed">Završeno</option>
              </select>

              <label htmlFor="category_id">Kategorija</label>
              <select
                id="category_id"
                name="category_id"
                value={taskData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Izaberite kategoriju</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label htmlFor="assigned_to">Korisnik</label>
              <select
                id="assigned_to"
                name="assigned_to"
                value={taskData.assigned_to}
                onChange={handleInputChange}
                required
              >
                <option value="">Izaberite korisnika</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <label htmlFor="deadline">Rok</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={taskData.deadline}
                onChange={handleInputChange}
              />

              <button type="submit" className="save-button">
                Sačuvaj
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cancel-button"
              >
                Otkaži
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    

    
  );


};

export default KanbanBoard;
