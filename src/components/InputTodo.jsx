import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import TodoList from "./TodoList";
import Badge from "@mui/material/Badge";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
function InputTodo() {
  // State variables
  const [title, setTitle] = useState(""); // State for the new todo title
  const [todos, setTodos] = useState([]); // State for the list of todos
  const [notification, setNotification] = useState([]); // State for notifications
  const [showCompleted, setCompleted] = useState(false); // State for completed todos

  // Fetch todos from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "notifications"),
      (snapshot) => {
        setNotification(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    );
    return () => unsubscribe();
  }, []);

  // Handle form submission to add a new todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title !== "") {
      const docRef = await addDoc(collection(db, "todos"), {
        title,
        completed: false,
      });
      // Add a notification for the new todo
      await addDoc(collection(db, "notifications"), {
        message: `New task added: ${title}`,
        timestamp: new Date(),
        read: false,
        todoId: docRef.id,
      });
      setTitle("");
    }
  };

  // Handle delete functionality
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));

    const Notification = notification.find((n) => n.todoId === id);

    if (Notification) {
      // If a notification exists for this todo
      await deleteDoc(doc(db, "notifications", Notification.id));
    }
  };

  // Handle edit functionality
  const handleEdit = async (todo, newTitle) => {
    if (newTitle !== "") {
      await updateDoc(doc(db, "todos", todo.id), {
        title: newTitle,
        completed: todo.completed,
      });
    }
  };

  // Render the component
  return (
    <div className="min-h-screen bg-black-300 mx-auto text-center  flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 py-10">
      <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-md mx-auto">
        <div className="flex text-center justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-5 ">
            My Todo List
          </h1>

          <div className="flex justify-center gap-3.5">
            <Badge
              badgeContent={notification.length}
              color="secondary"
              className="mb-4 ml-2.5 "
            >
              <NotificationImportantIcon color="primary" />
            </Badge>

            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-0.5 rounded-md hover:bg-blue-600 transition-colors duration-200 "
              onClick={() => setCompleted(!showCompleted)}
            >
              {showCompleted ? "Show Task" : "Complet Task"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex mb-6">
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className=" text-white p-3 rounded-r-md hover:bg-blue-600 transition-colors duration-200 sm:float-left bg-gradient-to-r from-blue-500 to-purple-600">
            Add Task
          </button>
        </form>
        {showCompleted
          ? todos
              .filter((todo) => todo.completed)
              .map((todo) => (
                <TodoList
                  key={todo.id}
                  todo={todo}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              ))
          : todos
              .filter((todo) => !todo.completed)
              .map((todo) => (
                <TodoList
                  key={todo.id}
                  todo={todo}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              ))}

        <div>
          <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition-colors duration-200">
            <a href="/">LogOut</a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputTodo;
