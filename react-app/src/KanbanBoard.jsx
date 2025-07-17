import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';
import Task from './Task'; 
import { useNavigate } from 'react-router-dom';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [selectedTask, setSelectedTask] = useState(null); 
  const [role, setRole] = useState(null);
  const navigate = useNavigate(); 
  const [searchParams, setSearchParams] = useState({
    title: '',
    status: '',
    category_id: '',
  });

  const [file, setFile] = useState(null);

  
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
      const updatedTask = tasks.find((t) => t.id === task.id);
      console.log(updatedTask)
      
      if (updatedTask) {
        setTaskData({
          id: updatedTask.id,
          title: updatedTask.title || '',
          description: updatedTask.description || '',
          status: updatedTask.status || 'pending',
          category_id: updatedTask.category_id || '',
          assigned_to: updatedTask.assigned_to || '',
          deadline: updatedTask.deadline || '',
        });
        setIsEditing(true);
        setIsModalOpen(true);
      } else {
        alert('Zadatak nije pronađen u listi.');
      }
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
      alert('Morate biti prijavljeni da biste videli ovu stranicu.');
      navigate('/prijava');
      return;
    }
  
    const userRole = localStorage.getItem('user_role');
    setRole(userRole);
  
    // Učitaj korisnike i zadatke samo jednom
    if (users.length === 0 && tasks.length === 0) {
      const fetchUsers = fetch('http://127.0.0.1:8000/api/users', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => response.json());
  
      const fetchTasks = fetch('http://localhost:8000/api/tasks?per_page=70', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => response.json());
  
      Promise.all([fetchUsers, fetchTasks])
      .then(([usersData, tasksData]) => {
        setUsers(usersData);
    
        const enrichedTasks = tasksData.data.map((task) => {
          const assignedUser = usersData.find((user) => user.id === task.assigned_to);
          const category = categories.find((cat) => cat.id === task.category_id); 
    
          return {
            ...task,
            assigned_to_name: assignedUser
              ? `${assignedUser.name || ''} ${assignedUser.surname || ''}`.trim()
              : 'Nije dodeljeno',
            category: category ? category.name : 'Bez kategorije', 
          };
        });
    
        setTasks(enrichedTasks);
      })
      .catch((error) => console.error('Greška prilikom učitavanja podataka:', error));
    }
  
    // Preuzimanje kategorija
    if (categories.length === 0) {
      fetch('http://127.0.0.1:8000/api/categories', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setCategories(data))
        .catch((error) => console.error('Greška prilikom učitavanja kategorija:', error));
    }
  }, [navigate, users.length, tasks.length, categories.length,isModalOpen]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
  
    if (!file) {
      alert('Molimo izaberite fajl pre otpremanja.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tasks/upload/${taskData.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`, 
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Uploaded file:', data.file);
        window.location.reload();
        // Opciono: osveži listu fajlova zadatka ili uradi neku drugu akciju
      } else {
        const errorData = await response.json();
        alert(`Greška: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Greška prilikom otpremanja fajla:', error);
      alert('Došlo je do greške prilikom otpremanja fajla.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', taskData.title);
    formData.append('description', taskData.description);
    formData.append('status', taskData.status);
    formData.append('category_id', taskData.category_id);
    formData.append('assigned_to', taskData.assigned_to);
    formData.append('deadline', taskData.deadline);
  
    if (file) {
      formData.append('file', file);
    }
  
    const url = isEditing
      ? `http://localhost:8000/api/tasks/${taskData.id}`
      : 'http://localhost:8000/api/tasks';
  
    const method = isEditing ? 'PUT' : 'POST';
  
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        category_id: taskData.category_id,
        assigned_to: taskData.assigned_to,
        deadline: taskData.deadline,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          alert('Greška prilikom čuvanja zadatka');
        } else {
          alert(isEditing ? 'Zadatak uspešno izmenjen' : 'Zadatak uspešno kreiran');
          setTasks((prevTasks) => {
            if (isEditing) {
              // Zameni postojeći zadatak u listi
              return prevTasks.map((task) =>
                task.id === data.id ? { ...task, ...data } : task
              );
            } else {
              // Dodaj novi zadatak u listu
              return [...prevTasks, data];
            }
          });
          console.log("LINIJA225")
          console.log(data)
          // Ažuriraj `taskData` kako bi se prikazao tačan sadržaj u modal-u
          if (isEditing) {
            setTaskData({
              id: data.id,
              title: data.title,
              description: data.description,
              status: data.status,
              category_id: Number(data.category_id),
              assigned_to: data.user_id,
              deadline: data.deadline,
            });
          }
          window.location.reload();
          setIsModalOpen(false);
        }
      })
      .catch((error) => console.error('Error:', error));
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
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    },
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

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const fetchTasks = () => {
    const queryParams = new URLSearchParams(searchParams).toString();
    fetch(`http://localhost:8000/api/tasks?${queryParams}&per_page=70`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched tasks:', data);
        if (data && data.data) {
          setTasks(data.data); // Uverite se da je ovo niz
        }
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <div>
         
      <div className="kanban-controls">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Pretraga po naslovu"
            value={searchParams.title}
            onChange={handleSearchChange}
          />
          <select
            name="status"
            value={searchParams.status}
            onChange={handleSearchChange}
          >
            <option value="">Sve</option>
            <option value="pending">Na čekanju</option>
            <option value="in_progress">U toku</option>
            <option value="completed">Završeno</option>
          </select>
          <select
            name="category_id"
            value={searchParams.category_id}
            onChange={handleSearchChange}
          >
            <option value="">Sve kategorije</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit">Pretraži</button>
        </form>
        {role === 'manager' && (
        <button className="modern-add-task-button" onClick={openAddTaskModal}>
          + Dodaj task
        </button>
      )}
      </div>

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
            <form onSubmit={handleFormSubmit} encType="multipart/form-data">
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
              <form encType="multipart/form-data">
                <label htmlFor="file">Dodaj fajl</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="button" onClick={handleFileUpload} className="upload-button">
                  Otpremi fajl
                </button>
              </form>
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
