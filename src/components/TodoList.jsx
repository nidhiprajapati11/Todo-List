import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import imge from "../assets/images/imag.png";

export default function TodoList({ todo, handleDelete, handleEdit }) {
  const [newTitle, setNewTitle] = useState(todo.title); // State to manage the new title for editing
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    fontWeight: "bold",
  };

  // Handle change in the input field for editing
  const handleChange = (e) => {
    e.preventDefault();
    if (todo.complete === true) {
      setNewTitle(todo.title);
    } else {
      todo.title = "";
      setNewTitle(e.target.value);
    }
  };

  // Handle the toggle for completion status
  const handleToggleComplete = async () => {
    if (!todo.completed) {
      setOpen(true); // Open modal

      setTimeout(async () => {
        const updatedTodo = {
          ...todo,
          completed: true,
        };
        await handleEdit(updatedTodo, newTitle); // Mark as complete
        setOpen(false); // Close modal
      }, 1000);
    } else {
      setOpen(false);
    }
  };

  // Handle the edit functionality
  return (
    <>
      <div className="mx-auto text-center  flex justify-center items-center  p-2">
        <div className="todo w-full flex items-center justify-between  bg-slate-100  rounded-sm shadow-xl p-2  max-w-md">
          <div className="flex items-center gap-2.5">
            <button onClick={handleOpen}>
              <Checkbox
                checked={todo.completed}
                color="success"
                onClose={handleClose}
                onChange={() => handleToggleComplete()}
              />
            </button>

            <input
              type="text"
              value={newTitle}
              className="list border-gray-200 border-1 p-1 rounded-sm w-full"
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2.5 items-center justify-center sm:justify-end sm:gap-1 sm:flex-row">
            <button
              className="text-green-500   items-center"
              onClick={() => handleEdit(todo, newTitle)}
            >
              <FaEdit id="i" />
            </button>
            <button
              className="text-red-500 hover:text-red-700 "
              onClick={() => handleDelete(todo.id)}
            >
              <DeleteIcon id="i" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" className="capitalize text-center ">
            congratulations !
          </Typography>

          <Typography className="flex justify-center items-center pt-2">
            <img src={imge} alt="" width={100} height={100} />
          </Typography>

          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className=" capitalize font-weight-800 text-gray-500  text-center"
          >
            successfully <br />
            you have completed the task!!
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
