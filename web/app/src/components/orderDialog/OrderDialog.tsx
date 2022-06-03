import {
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
import { GroupOrderBody, GroupOrderForm, OrderStatus, ReverseOrderStatus } from "../../api/types/groupOrder";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import TrackerContext from "../../contexts/TrackerContext";
import api from "../../api";
import { updateOrders } from "../../providers/TrackerProvider";
import moment from "moment";

interface Props extends DialogProps {
  editing: string;
}

function OrderDialog({ editing, ...props }: Props) {
  const { state, dispatch } = useContext(TrackerContext);
  const initialFormState = {
    order_number: "",
    item: "",
    order_date: moment(new Date()),
    downpayment_deadline: null,
    payment_deadline: null,
    provider: null,
    status: 0,
  };
  const initialErrorsState = {
    order_number: false,
    item: false,
    order_date: false,
    downpayment_deadline: false,
    payment_deadline: false,
    provider: false,
    status: false,
  };

  const [form, setForm] = useState<GroupOrderForm>({ ...initialFormState });
  const [errors, setErrors] = useState<{ [key in keyof GroupOrderForm]: boolean }>({ ...initialErrorsState });

  useEffect(() => {
    if (editing) {
      const init_ = state.orders.find(o => o.pk === editing)!;
      const editingInitialFormState: GroupOrderForm = {
        ...state.orders.find(o => o.pk === editing)!,
        order_date: moment(init_.order_date),
        downpayment_deadline: init_.downpayment_deadline ? moment(init_.downpayment_deadline) : null,
        payment_deadline: moment(init_.payment_deadline),
      };
      delete editingInitialFormState.pk;
      setForm(editingInitialFormState);
    }
  }, [editing, state.orders]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(form => ({ ...form, [name]: value }));
  }

  function preSubmitValidate(e: any) {
    const errors_ = { ...errors };
    (Object.keys(errors_) as (keyof GroupOrderForm)[]).forEach(key => {
      if (typeof form[key] === "number") {
        errors_[key] = (form[key] as number) < 0;
      } else {
        errors_[key] = !form[key];
      }
    });
    errors_.downpayment_deadline = false;
    if (Object.values(errors_).some(Boolean)) setErrors(errors_);
    else editing ? handleUpdateOrder(e) : handleSubmit(e);
  }

  function handleClose(e: any) {
    props.onClose!(e, "backdropClick");
    setForm({ ...initialFormState });
    setErrors({ ...initialErrorsState });
  }

  function getOrders() {
    api.groupOrder
      .list()
      .then(res =>
        dispatch({
          type: updateOrders,
          payload: res.data,
        }),
      )
      .catch(err => {
        console.error(err.message);
        alert("A network error occurred.");
      });
  }

  function handleSubmit(e: any) {
    const form_: GroupOrderBody = {
      ...form,
      order_date: form.order_date!.unix().valueOf() * 1000,
      downpayment_deadline: form.downpayment_deadline ? form.downpayment_deadline.unix().valueOf() * 1000 : null,
      payment_deadline: form.payment_deadline!.unix().valueOf() * 1000,
    };
    api.groupOrder
      .create(form_)
      .then(() => {
        getOrders();
        handleClose(e);
      })
      .catch(err => {
        console.error(err.message);
        alert("A network error occurred.");
      });
  }

  function handleUpdateOrder(e: any) {
    const form_: GroupOrderBody = {
      ...form,
      order_date: form.order_date!.unix().valueOf() * 1000,
      downpayment_deadline: form.downpayment_deadline ? form.downpayment_deadline.unix().valueOf() * 1000 : null,
      payment_deadline: form.payment_deadline!.unix().valueOf() * 1000,
    };
    api.groupOrder
      .update(editing, form_)
      .then(() => {
        getOrders();
        handleClose(e);
      })
      .catch(err => console.error(err));
  }

  return (
    <Dialog {...props}>
      <DialogTitle>{editing ? "Edit Order" : "Add Order"}</DialogTitle>
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
                  error={errors.order_number}
                  helperText={errors.order_number && "This field is required"}
                  fullWidth
                  label="Order Number"
                  name="order_number"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="filled" required error={errors.provider}>
                  <InputLabel id="provider-label">Provider</InputLabel>
                  <Select
                    labelId="provider-label"
                    value={form.provider?.pk || ""}
                    label="Provider"
                    name="provider"
                    onChange={e =>
                      setForm({
                        ...form,
                        provider: state.providers.find(p => p.pk === e.target.value)!,
                      })
                    }
                  >
                    {state.providers.length === 0 && (
                      <MenuItem value="noop" disabled>
                        No providers available
                      </MenuItem>
                    )}
                    {state.providers.map(provider => (
                      <MenuItem key={provider.pk} value={provider.pk}>
                        {provider.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  disableFuture
                  label="Order Date"
                  onChange={value =>
                    setForm({
                      ...form,
                      order_date: value,
                    })
                  }
                  value={form.order_date}
                  renderInput={params => (
                    <TextField
                      {...params}
                      name="order_date"
                      variant="filled"
                      fullWidth
                      required
                      error={errors.order_date}
                      helperText={errors.order_date && "This field is required"}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
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
                  disablePast
                />
              </Grid>
              <Grid item xs={6}>
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
                    <TextField
                      {...params}
                      name="payment_deadline"
                      variant="filled"
                      fullWidth
                      required
                      error={errors.payment_deadline}
                      helperText={errors.payment_deadline && "This field is required"}
                    />
                  )}
                  disablePast
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="filled" required error={errors.status}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={form.status}
                    label="Status"
                    name="status"
                    onChange={e =>
                      setForm({
                        ...form,
                        status: parseInt(e.target.value as string),
                      })
                    }
                  >
                    {ReverseOrderStatus.map((status, index) => (
                      <MenuItem key={status.label} value={index as OrderStatus}>
                        {status.label.replace(/_/g, " ")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
      </form>
      <DialogActions>
        <Button color="inherit" variant="text" sx={{ color: "text.secondary" }} onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary" variant="text" onClick={preSubmitValidate} type="submit">
          {editing ? "Update Order" : "Add Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderDialog;
