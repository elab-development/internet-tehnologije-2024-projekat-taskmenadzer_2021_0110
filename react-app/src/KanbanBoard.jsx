import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';
import Task from './Task'; 
import { useNavigate } from 'react-router-dom';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Razlikovanje kreiranja i izmene
  const [selectedTask, setSelectedTask] = useState(null); // Za trenutno izabrani task
  const [role, setRole] = useState(null);
  const navigate = useNavigate(); 
  
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'pending',
    category_id: '',
    assigned_to: '',
    deadline: '',
  });

  const handleDeleteTask = () => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj zadatak?')) {
      fetch(`http://localhost:8000/api/tasks/${taskData.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setTasks((prevTasks) =>
              prevTasks.filter((task) => task.id !== taskData.id)
            );
            alert('Zadatak je uspešno obrisan.');
            setIsModalOpen(false);
          } else {
            alert('Greška prilikom brisanja zadatka.');
          }
        })
        .catch((error) => console.error('Error deleting task:', error));
    }
  };

  const openAddTaskModal = () => {
    setTaskData({
      title: '',
      description: '',
      status: 'pending',
      category_id: '',
      assigned_to: '',
      deadline: '',
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    if (role === 'manager') {
      const assignedUser = users.find((user) => user.id === task.assigned_to);
      setTaskData({
        ...task,
        category_id: task.category_id || '',
        assigned_to: assignedUser ? assignedUser.id : '', // Postavi id korisnika ako postoji
      });
      setIsEditing(true);
      setIsModalOpen(true);
    } else {
      alert('Nemate dozvolu za izmenu zadataka.');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
      // Ako auth_token ne postoji, preusmeri korisnika na stranicu za prijavu
      alert('Morate biti prijavljeni da biste videli ovu stranicu.');
      navigate('/prijava'); 
      return;
    }

    const userRole = localStorage.getItem('user_role'); 
    setRole(userRole);
    
    fetch('http://localhost:8000/api/tasks?per_page=70')
      .then((response) => response.json())
      .then((data) => {
        console.log('Tasks loaded:', data.data);
        setTasks(data.data || []); // Da se osiguramo da je niz
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
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Izmena postojećeg zadatka
      fetch(`http://localhost:8000/api/tasks/${taskData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
        .then((response) => response.json())
        .then((updatedTask) => {
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
          );
          setIsModalOpen(false);
        })
        .catch((error) => console.error('Error saving task:', error));
    } else {
      // Kreiranje novog zadatka
      fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(taskData),
      })
        .then((response) => response.json())
        .then((newTask) => {
          if (newTask.errors) {
            alert('Greška prilikom kreiranja zadatka');
          } else {
            alert('Zadatak uspešno kreiran');
            const completeTask = {
              ...newTask,
              category_id: newTask.category_id || taskData.category_id,
              assigned_to: newTask.assigned_to || taskData.assigned_to,
            };
  
            // Povezivanje korisnika sa `assigned_to`
            if (completeTask.assigned_to) {
              const assignedUser = users.find(
                (user) => user.id === completeTask.assigned_to
              );
              if (assignedUser) {
                completeTask.assigned_to = assignedUser.id; // Samo `id` za konzistentnost
              }
            }
  
            setTasks((prevTasks) => [...prevTasks, completeTask]);
            setIsModalOpen(false);
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  };


  const handleModalSave = () => {
    fetch(`http://localhost:8000/api/tasks/${selectedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedTask),
    })
      .then((response) => response.json())
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === selectedTask.id ? selectedTask : task))
        );
        setIsModalOpen(false);
      })
      .catch((error) => console.error('Error saving task:', error));
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
          {role === 'manager' && (
        <button className="modern-add-task-button" onClick={openAddTaskModal}>
          + Dodaj task
        </button>
      )}

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
                        <Task
                          task={task}
                          index={index}
                          onEdit={openEditTaskModal}
                          provided={provided}
                        />
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

      {/* Modal za kreiranje zadatka */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Izmeni zadatak' : 'Kreiraj novi zadatak'}</h3>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="title">Naslov</label>
              <input
                type="text"
                id="title"
                name="title"
                value={taskData.title}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="description">Opis</label>
              <textarea
                id="description"
                name="description"
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
                {isEditing ? 'Sačuvaj izmene' : 'Kreiraj'}
              </button>
              
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cancel-button"
              >
                Otkaži
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleDeleteTask}
                  className="delete-button"
                >
                  Obriši
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
    

    
  );


};

export default KanbanBoard;
