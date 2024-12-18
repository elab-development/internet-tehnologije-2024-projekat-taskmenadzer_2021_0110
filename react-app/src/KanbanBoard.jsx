import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);

  // Load tasks from the server
  useEffect(() => {
    fetch('http://localhost:8000/api/tasks')
      .then((response) => response.json())
      .then((data) => {
        console.log('Tasks loaded:', data.data);
        setTasks(data.data || []); // Ensure it's an array
      })
      .catch((error) => console.error('Error loading tasks:', error));
  }, []);

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
  );
};

export default KanbanBoard;
