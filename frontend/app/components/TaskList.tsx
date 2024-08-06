import React, { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Container,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../interfaces/Task";
import AddButton from "./AddButton";
import LongDescription from "./LongDescription";
import EditTaskForm from "./EditTaskForm";
import dayjs from "dayjs";

const API_URL = "http://localhost:3000/task";

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const TaskList: React.FC = () => {
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    todo: { id: "todo", title: "Todo", tasks: [] },
    inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
    done: { id: "done", title: "Done", tasks: [] },
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(API_URL, { params: { userId } });
      const newColumns = {
        todo: {
          ...columns.todo,
          tasks: data.filter((task: Task) => task.status === "todo"),
        },
        inProgress: {
          ...columns.inProgress,
          tasks: data.filter((task: Task) => task.status === "inProgress"),
        },
        done: {
          ...columns.done,
          tasks: data.filter((task: Task) => task.status === "done"),
        },
      };
      setColumns(newColumns);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const deleteTask = async (id: string, columnId: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedColumns = { ...columns };
      updatedColumns[columnId].tasks = updatedColumns[columnId].tasks.filter(
        (task) => task._id !== id
      );
      setColumns(updatedColumns);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

    if (source.droppableId !== destination.droppableId) {
      movedTask.status = destination.droppableId;
      axios
        .put(`${API_URL}/${movedTask._id}`, { status: movedTask.status })
        .catch((error) => console.error("Error updating task status:", error));
    }

    destColumn.tasks.splice(destination.index, 0, movedTask);
    setColumns({
      ...columns,
      [sourceColumn.id]: sourceColumn,
      [destColumn.id]: destColumn,
    });
  };

  const handleClickOpen = (task: Task) => {
    setSelectedTask(task);
  };

  const handleClose = () => {
    setSelectedTask(null);
  };

  const handleClickOpenEditForm = () => {
    setOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    setSelectedTask(null);
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      minWidth: "300px",
      width: "auto",
      maxWidth: "600px",
    },
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const formatDueDate = (date: string) => {
    return dayjs(date).format("MMM D, YYYY h:mm A");
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container
          maxWidth="xl"
          sx={{ my: 5, display: "flex", justifyContent: "space-between" }}
        >
          {Object.values(columns).map((column) => (
            <Box
              key={column.id}
              width="30%"
              sx={{
                backgroundColor:
                  column.id === "todo"
                    ? "#ffcccb"
                    : column.id === "inProgress"
                      ? "#ffffcc"
                      : "#90EE90",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center" }}
              >
                {column.title}
              </Typography>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ minHeight: "300px" }}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 2 }}
                            onClick={() => handleClickOpen(task)}
                          >
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {task.title}
                              </Typography>
                              <Typography variant="body1">
                                <LongDescription
                                  content={task.description}
                                  limit={70}
                                />
                              </Typography>
                              {task.deadline && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mt: 1,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <AccessTimeIcon
                                    sx={{ fontSize: "small", mr: 0.5 }}
                                  />
                                  Due: {formatDueDate(task.deadline)}
                                </Typography>
                              )}
                            </CardContent>
                            <CardActions>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "end",
                                  width: "100%",
                                  mx: 2,
                                }}
                              >
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    deleteTask(task._id, column.id);
                                  }}
                                >
                                  <DeleteIcon sx={{ color: "#FF6666" }} />
                                </IconButton>
                              </Box>
                            </CardActions>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Container>
      </DragDropContext>
      <AddButton fetchTasks={fetchTasks} />

      {selectedTask && (
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={Boolean(selectedTask)}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {selectedTask.title}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers sx={{ mx: 1 }}>
            <Typography gutterBottom>{selectedTask.description}</Typography>
            {selectedTask.deadline && (
              <Typography
                variant="body2"
                sx={{ mt: 2, display: "flex", alignItems: "center" }}
              >
                <AccessTimeIcon sx={{ fontSize: "small", mr: 0.5 }} />
                Due: {formatDueDate(selectedTask.deadline)}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                mt: 2,
              }}
            >
              <IconButton
                edge="start"
                aria-label="edit"
                onClick={handleClickOpenEditForm}
              >
                <EditIcon sx={{ color: "#3399ff" }} />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() =>
                  deleteTask(selectedTask._id, selectedTask.status)
                }
              >
                <DeleteIcon sx={{ color: "#FF6666" }} />
              </IconButton>
            </Box>
          </DialogContent>
        </BootstrapDialog>
      )}

      <Dialog open={openEditForm} onClose={handleCloseEditForm}>
        <DialogTitle>Edit Task</DialogTitle>
        {selectedTask && (
          <EditTaskForm
            taskId={selectedTask._id}
            title={selectedTask.title}
            description={selectedTask.description}
            status={selectedTask.status}
            deadline={selectedTask.deadline}
            handleClose={handleCloseEditForm}
            fetchTasks={fetchTasks}
          />
        )}
      </Dialog>
    </>
  );
};

export default TaskList;
