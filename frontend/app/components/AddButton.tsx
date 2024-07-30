import { Dialog, DialogTitle, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FC, Fragment, useState } from "react";
import TaskForm from "./TaskForm";

interface AddButtonProps {
  fetchTasks: () => void;
}

const AddButton: FC<AddButtonProps> = ({ fetchTasks }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <TaskForm handleClose={handleClose} fetchTasks={fetchTasks} />
      </Dialog>
    </Fragment>
  );
};

export default AddButton;
