import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);

  // Učitavanje zadataka sa servera
  useEffect(() => {
    fetch('http://localhost:8000/api/tasks')
      .then((response) => response.json())
      .then((data) => {
        console.log('Tasks loaded:', data.data); // Proverite format podataka
        setTasks(data.data);
      })
      .catch((error) => console.error('Greška:', error));
  }, []);
  
  const statuses = ['pending', 'in_progress', 'completed'];

  // Funkcija za rukovanje promenom pozicija
  const handleDragEnd = (result) => {
    const { source, destination } = result;
  
    if (!destination) return;
  
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);
  
    // Use the droppableId directly
    const newStatus = destination.droppableId;
    movedTask.status = newStatus;
  
    // Update the server
    fetch(`http://localhost:8000/api/tasks/${movedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Task updated on server:', data);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === movedTask.id ? { ...task, status: newStatus } : task
          )
        );
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">

      {statuses.map((status) => (
  <Droppable droppableId={status} key={status}>
    {(provided) => (
      <div
        className="kanban-column"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <h3 className="kanban-title">{status.replace('_', ' ').toUpperCase()}</h3>
        {tasks
          .filter((task) => task.status === status)
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
  );
};

export default KanbanBoard;
