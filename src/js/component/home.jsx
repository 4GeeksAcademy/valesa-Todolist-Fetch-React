import React, { useState, useEffect } from "react";

//Imports FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(-1);

  // Add Tasks
  function handleNewTask(e) {
    if (e.key === "Enter" && e.target.value != "") {
      // Frontend
      setTodos(todos.concat({ label: e.target.value, done: false }));
      // Add in database - Backend
      let aux = todos.concat({ label: e.target.value, done: false }); // Array auxiliar para prevenir el delay en el fetch y lo paso como parámetro
      setTodoList(aux);
      setInputValue("");
    }
  }

  // Delete Tasks
  function handleEraseTask(id) {
    if (hoverIndex === id) {
      // Frontend
      setTodos(todos.filter((item, index) => index !== id));
    }
    // Delete in database - Backend
    let aux = todos.filter((item, index) => index !== id); // Array auxiliar para prevenir el delay en el fetch y lo paso como parámetro
    setTodoList(aux);
  }

  // Counter Tasks
  function TasksCounter() {
    if (todos.length === 0) return "No pending tasks";
    else if (todos.length === 1) return "You have 1 pending task";
    else return "You have " + todos.length + " pending tasks";
  }

  // Function for the button to clear all the todo list
  function clearList() {
    setTodos([]); // Frontend
    setTodoList([]); // Backend
  }

  // Fetch  GET API
  function getTodoList() {
    fetch(
      "https://fake-todo-list-52f9a4ed80ce.herokuapp.com/todos/user/valesa185"
    )
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log(err));
  }

  // Recarga el ToDo List a cada recarga de la página
  useEffect(() => {
    getTodoList();
  }, []);

  // (Add & Delete) Update the API with fetch
  function setTodoList(lista) {
    fetch(
      "https://fake-todo-list-52f9a4ed80ce.herokuapp.com/todos/user/valesa185",
      {
        method: "PUT",
        body: JSON.stringify(lista),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((resp) => {
        console.log(resp.ok); // si es true entonces ok
        console.log(resp.status); // devolverá códigos de estado
        console.log(resp.text()); // devolverá el objeto obtenido
        return resp.json(); // parsea el resultado como json
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        // manejo de errores
        console.log(error);
      });
  }

  return (
    <div className="container">
      <h1>Todo List</h1>

      <ul>
        {/** Input de tareas */}
        <li>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyDown={(e) => {
              handleNewTask(e);
            }}
            placeholder="What needs to be done?"
          />
        </li>

        {/** Elemento tarea nueva, y eliminar (icon) */}
        {todos.map((tarea, index) => (
          <li
            key={index}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(-1)}
          >
            {tarea.label}
            {/* Icono delete */}
            {hoverIndex === index && (
              <FontAwesomeIcon
                className="iconDelete"
                icon={faTrashAlt}
                onClick={() => {
                  handleEraseTask(index);
                }}
              />
            )}
          </li>
        ))}
      </ul>

      <div>{TasksCounter()}</div>

      <button
        className="btn btn-danger mt-2"
        onClick={() => {
          clearList();
        }}
      >
        Delete All Tasks
      </button>
    </div>
  );
};

export default Home;
