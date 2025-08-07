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
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
function InputTodo() {
  // State variables
  const [title, setTitle] = useState(""); // State for the new todo title
  const [todos, setTodos] = useState([]); // State for the list of todos
  const [notification, setNotification] = useState([]); // State for notifications
  const [showCompleted, setCompleted] = useState(false); // State for completed todos
  const [showNotifications, setShowNotifications] = useState(false);

  // Rainbow colors For Notifications
  const rainbowColors = [
    "#FF8A66", //  red-orange
    "#FFB347", //  orange
    "#FFDB66", //  yellow
    "#58D68D", //  green
    "#5499C7", //  blue
    "#BB8FCE", //  purple
    "#F48FB1", //  pink
  ];

  // Get color based on message
  const getColor = (message) => {
    if (!message) return "#999";
    const charCode = message.charCodeAt(0); // get first character code
    const index = charCode % rainbowColors.length;
    return rainbowColors[index];
  };

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
      collection(db, "notifications"), // Fetch Notifications From Firestore
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
        // Add a New Todo to Firestore
        title,
        completed: false,
      });
      // Add a notification for the new todo
      await addDoc(collection(db, "notifications"), {
        message: `${title}`,
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

  const notifymodal = async () => {
    setShowNotifications(!showNotifications);

    const unread = notification.filter((n) => !n.read);
    unread.forEach(async (notif) => {
      const notifRef = doc(db, "notifications", notif.id);
      await updateDoc(notifRef, { read: true });
    });
  };

  // Render the component
  return (
    <>
      <div className="min-h-screen bg-black-300 mx-auto text-center  flex flex-col justify-center items-center bg-gradient-to-r from-blue-800 to-purple-900 py-10">
        <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-md mx-auto h-auto ">
          <div className="flex text-center justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-5 underline">
              My Todo List
            </h1>

            <div className="flex justify-center gap-3.5">
              <Badge
                onClick={notifymodal}
                badgeContent={notification.filter((n) => !n.read).length}
                color="secondary"
                className="mb-4 ml-2.5 "
              >
                {showNotifications && (
                  <div className="absolute z-50 mt-2 top-5  bg-white shadow-lg rounded-md w-60 h-60 overflow-y-auto border border-gray-300">
                    <div className="p-3 font-bold border-b text-gray-700 text-left">
                      Notifications
                    </div>
                    {notification.length > 0 ? (
                      notification
                        .slice()
                        .sort(
                          (a, b) => b.timestamp?.seconds - a.timestamp?.seconds
                        )
                        .map((notif) => (
                          <Stack key={notif.id}>
                            <div className="px-4 py-3 text-sm wrap-anywhere hover:bg-gray-200 text-left font-medium capitalize flex gap-3 items-center">
                              <Avatar
                                sx={{
                                  bgcolor: getColor(notif.message),
                                  width: 36,
                                  height: 36,
                                  fontSize: "1rem",
                                  fontWeight: "bold",
                                }}
                              >
                                {notif.message?.charAt(0).toUpperCase() || "?"}
                              </Avatar>
                              {notif.message}
                            </div>
                          </Stack>
                        ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500 font-bold letter-spacing-wide ">
                        No Notifications
                      </div>
                    )}
                  </div>
                )}

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
              placeholder="Add new task..."
              className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
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
    </>
  );
}

export default InputTodo;
