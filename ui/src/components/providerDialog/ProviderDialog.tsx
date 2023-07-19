import { ChangeEvent, FormEvent, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

import api from "@/api";
import { ProviderForm } from "@/api/types/provider";
import {
  updateProviders,
  useTrackerContext,
} from "@/providers/TrackerProvider";

interface Props extends DialogProps {}

function ProviderDialog({ ...props }: Props) {
  const { dispatch } = useTrackerContext();
  const initialFormState = {
    name: "",
    website: "",
  };
  const initialErrorsState = {
    name: false,
    website: false,
  };
  const [form, setForm] = useState<ProviderForm>({ ...initialFormState });
  const [errors, setErrors] = useState<{
    [key in keyof ProviderForm]: boolean;
  }>({ ...initialErrorsState });

  function preSubmitValidate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors_ = { ...errors };
    (Object.keys(errors_) as (keyof ProviderForm)[]).forEach(key => {
      errors_[key] = !form[key];
    });
    if (Object.values(errors_).some(Boolean)) setErrors(errors_);
    else handleSubmit(e);
  }

  function handleChange(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    const { name, value } = e.target;
    setForm(form => ({ ...form, [name]: value }));
  }

  function getProviders() {
    api.provider
      .list()
      .then(res =>
        dispatch({
          type: updateProviders,
          payload: res.data,
        }),
      )
      .catch(err => {
        console.error(err);
        alert("A network error occurred.");
      });
  }

  function handleSubmit(e: any) {
    api.provider
      .create(form)
      .then(() => {
        getProviders();
        handleClose(e);
      })
      .catch(err => {
        console.error(err.message);
        alert("A network error occurred.");
      });
  }

  function handleClose(e: any) {
    props.onClose!(e, "backdropClick");
    setForm({ ...initialFormState });
    setErrors({ ...initialErrorsState });
  }

  return (
    <Dialog {...props}>
      <DialogTitle>Add Shop</DialogTitle>
      <form onSubmit={preSubmitValidate}>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                value={form.name}
                error={errors.name}
                helperText={errors.name && "This field is required"}
                fullWidth
                label="Name"
                name="name"
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                value={form.website}
                error={errors.website}
                helperText={errors.website && "This field is required"}
                fullWidth
                label="Website"
                name="website"
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="text"
            sx={{ color: "text.secondary" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button color="primary" variant="text" type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ProviderDialog;
