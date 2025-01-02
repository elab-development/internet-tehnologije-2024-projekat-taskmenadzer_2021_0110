const Task = ({ task, index, onEdit, provided }) => {
  return (
    <div
      className="kanban-item"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => onEdit(task)}
    >
      <p><strong>Naslov:</strong> {task.title}</p>
      <p><strong>Kategorija:</strong> {task.category || 'Bez kategorije'}</p>
      <p><strong>Dodeljeno:</strong> {task.assigned_to_name || 'Nije dodeljeno'}</p>
      <div>
      <strong>Fajlovi:</strong>
      {task.files && task.files.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {task.files.map((file) => (
            <li key={file.id}>
              {/* Provera da li je fajl slika */}
              {file.file_name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <div>
                  {/* Prikaz slike */}
                  <img
                    src={file.file_path}
                    alt={file.file_name}
                    style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
                    onClick={() => window.open(file.file_path, '_blank')}
                  />
                </div>
              ) : (
                // Link za fajlove koji nisu slike
                <a href={file.file_path} target="_blank" rel="noopener noreferrer">
                  {file.file_name}
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nema fajlova.</p>
      )}
    </div>
    </div>
  );

  
};

  
  export default Task;
  