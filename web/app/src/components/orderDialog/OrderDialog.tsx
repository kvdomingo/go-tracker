import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { GroupOrderForm } from "../../api/types/groupOrder";
import { ChangeEvent, useState } from "react";
import { Provider } from "../../api/types/provider";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

interface Props extends DialogProps {
  isEditing: boolean;
  handleSubmit: (data: GroupOrderForm) => void;
  providers: Provider[];
}

function OrderDialog({ isEditing, handleSubmit, providers, ...props }: Props) {
  const [form, setForm] = useState<GroupOrderForm>({
    order_number: "",
    item: "",
    order_date: new Date(),
    downpayment_deadline: null,
    payment_deadline: null,
    provider: null,
    status: 0,
  });
  const [errors, setErrors] = useState<{ [key in keyof GroupOrderForm]: boolean }>({
    order_number: false,
    item: false,
    order_date: false,
    downpayment_deadline: false,
    payment_deadline: false,
    provider: false,
    status: false,
  });

  function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function preSubmitValidate() {
    const errors_ = { ...errors };
    Object.keys(errors_).forEach(key => {
      errors_[key as keyof GroupOrderForm] = !!form[key as keyof GroupOrderForm];
    });
    errors_.downpayment_deadline = false;
    if (Object.values(errors_).some(Boolean)) setErrors(errors_);
    else handleSubmit(form);
  }

  return (
    <Dialog {...props}>
      <DialogTitle>{isEditing ? "Edit Order" : "Add Order"}</DialogTitle>
      <form onSubmit={preSubmitValidate}>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  value={form.item}
                  error={errors.item}
                  helperText={errors.item && "This field is required"}
                  fullWidth
                  label="Item"
                  name="item"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="filled"
                  value={form.order_number}
                  fullWidth
                  label="Order Number"
                  name="order_number"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="filled" required>
                  <InputLabel id="provider-label">Provider</InputLabel>
                  <Select
                    labelId="provider-label"
                    value={form.provider?.pk || ""}
                    label="Provider"
                    name="provider"
                    onChange={e =>
                      setForm({
                        ...form,
                        provider: providers.find(p => p.pk === e.target.value)!,
                      })
                    }
                  >
                    {providers.length === 0 && (
                      <MenuItem value="noop" disabled>
                        No providers available
                      </MenuItem>
                    )}
                    {providers.map((provider, index) => (
                      <MenuItem key={provider.pk} value={provider.pk}>
                        {provider.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <DatePicker
                  label="Order Date"
                  onChange={value =>
                    setForm({
                      ...form,
                      order_date: value,
                    })
                  }
                  value={form.order_date}
                  renderInput={params => (
                    <TextField {...params} name="order_date" variant="filled" fullWidth required />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <DatePicker
                  label="Downpayment Deadline"
                  onChange={value =>
                    setForm({
                      ...form,
                      downpayment_deadline: value,
                    })
                  }
                  value={form.downpayment_deadline}
                  renderInput={params => (
                    <TextField {...params} name="downpayment_deadline" variant="filled" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <DatePicker
                  label="Payment Deadline"
                  onChange={value =>
                    setForm({
                      ...form,
                      payment_deadline: value,
                    })
                  }
                  value={form.payment_deadline}
                  renderInput={params => (
                    <TextField {...params} name="payment_deadline" variant="filled" fullWidth required />
                  )}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
      </form>
      <DialogActions>
        <Button
          color="inherit"
          variant="text"
          sx={{ color: "text.secondary" }}
          onClick={e => props.onClose!(e, "backdropClick")}
        >
          Cancel
        </Button>
        <Button color="primary" variant="text" onClick={preSubmitValidate} type="submit">
          {isEditing ? "Save Order" : "Add Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderDialog;
