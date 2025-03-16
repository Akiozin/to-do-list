import React, { useState, useEffect } from "react";

interface Task {
  text: string;
  completed: boolean;
  isAdding?: boolean;
  removing?: boolean;
}

const App: React.FC = () => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("Todas");

  // Carregar tarefas do localStorage ao iniciar
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Atualizar localStorage sempre que as tarefas forem alteradas
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Adicionar nova tarefa com animação
  const addTask = (): void => {
    if (task.trim() !== "") {
      const newTask: Task = { text: task, completed: false, isAdding: true };
      setTasks((prev) => [newTask, ...prev]);
      setTask("");

      // Remove o estado de "isAdding" após a animação
      setTimeout(() => {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.text === newTask.text ? { ...t, isAdding: false } : t
          )
        );
      }, 300);
    }
  };

  // Alternar entre "concluído" e "não concluído"
  const toggleTask = (index: number): void => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  // Remover tarefa com animação
  const removeTask = (index: number): void => {
    setTasks((prevTasks) =>
      prevTasks.map((t, i) => (i === index ? { ...t, removing: true } : t))
    );

    // Espera a animação antes de remover a tarefa
    setTimeout(() => {
      setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    }, 300);
  };

  // Filtragem das tarefas
  const filteredTasks = tasks.filter((t) => {
    if (filter === "Ativas") return !t.completed;
    if (filter === "Concluídas") return t.completed;
    return true;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#A9A9A9",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "50vh",
          minHeight: "60vh",
          padding: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1>To-Do List</h1>

        <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Digite sua tarefa"
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "70%",
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: "10px 15px",
              fontSize: "16px",
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            Adicionar
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontSize: "16px", marginRight: "10px" }}>
            Filtrar:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            <option value="Todas">Todas</option>
            <option value="Ativas">Ativas</option>
            <option value="Concluídas">Concluídas</option>
          </select>
        </div>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            width: "100%",
            margin: "0 auto",
          }}
        >
          {filteredTasks.map((t, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
                padding: "10px",
                border: "2px solid #ccc",
                borderRadius: "10px",
                background: t.completed ? "#d3ffd3" : "#f9f9f9",
                textDecoration: t.completed ? "line-through" : "none",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                opacity: t.removing ? 0 : 1, // Desaparece ao remover
                transform: t.removing
                  ? "translateX(-20px)"
                  : t.isAdding
                  ? "translateY(-10px)"
                  : "translateY(0)",
                animation: t.isAdding ? "fadeIn 0.3s ease forwards" : "none",
              }}
            >
              <span style={{ flex: 1, textAlign: "left", padding: "5px" }}>
                {t.text}
              </span>
              <button
                onClick={() => toggleTask(index)}
                style={{
                  marginRight: "10px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  background: t.completed ? "gray" : "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {t.completed ? "Desfazer" : "Concluir"}
              </button>
              <button
                onClick={() => removeTask(index)}
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
