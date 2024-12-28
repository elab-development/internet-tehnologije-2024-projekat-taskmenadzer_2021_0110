const Task = ({ task, index, onEdit, provided }) => {
    return (
      <div
        className="kanban-item"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => onEdit(task)}
      >
        <p>{task.title}</p>
      </div>
    );
  };
  
  export default Task;
  