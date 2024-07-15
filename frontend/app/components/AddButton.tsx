import { Dialog, DialogTitle, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FormEvent, Fragment, useState } from "react";
import TaskForm from "./TaskForm";

const AddButton = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Fragment>
      <Fab color="primary" aria-label="add" onClick={() => handleClickOpen()}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <TaskForm handleClose={handleClose}/>
      </Dialog>
    </Fragment>
  );
};

export default AddButton;
