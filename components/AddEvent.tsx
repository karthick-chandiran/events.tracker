import { useSWRConfig } from "swr";
import { IEventModel } from "../models/IEventModel";
import { TextField, Autocomplete, Box, Button } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import moment from "moment";
import { eventUrl } from "../common/constants";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { IValidationError } from "../models/IValidationError";
import { addEvent, updateEvent } from "../api/events";
import { resetEditEvent, setEditEvent } from "../redux/slices/events";

const getInitialData = () => ({
  eventTime: moment().format("YYYY-MM-DDTHH:mm"),
  eventTag: "General",
});
export function AddEvent() {
  const { mutate } = useSWRConfig();
  const editEvent = useAppSelector((state) => state.events.editEvent);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Partial<IEventModel>>(
    getInitialData()
  );

  const [errorData, setErrorData] = useState<Partial<IValidationError>>({});

  useEffect(() => {
    editEvent && setFormData(editEvent);
  }, [editEvent]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submitApi = editEvent ? updateEvent : addEvent;
    const newEvents = await submitApi(formData).catch((err: IValidationError) =>
      setErrorData(err)
    );

    if (newEvents?.data) {
      mutate(eventUrl, newEvents.data);
      dispatch(setEditEvent(formData as IEventModel));
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newData = { ...formData, [event.target.name]: event.target.value };
    setFormData(newData);
  };

  const onSelectChange = (value: string) => {
    const newData = { ...formData, eventTag: value };
    setFormData(newData);
  };

  const onCancelAction = () => {
    setFormData(getInitialData());
    dispatch(resetEditEvent());
  };
  return (
    <Box
      component={"form"}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
      onSubmit={onSubmit}
    >
      <TextField
        name="eventName"
        placeholder="Event Name"
        sx={{
          mb: 2,
        }}
        size="small"
        value={formData.eventName ?? ""}
        helperText={errorData?.EventName?.toString()}
        error={Boolean(errorData?.EventName)}
        onChange={onChange}
      />
      <TextField
        name="eventDescription"
        placeholder="Event Details"
        sx={{
          mb: 2,
        }}
        multiline
        rows={4}
        size="small"
        value={formData.eventDescription ?? ""}
        helperText={errorData?.EventDesc?.toString()}
        error={Boolean(errorData?.EventDesc)}
        onChange={onChange}
      />

      <Autocomplete
        options={["General", "BirthDay"]}
        value={formData.eventTag}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Event Type"
            helperText={errorData?.EventTag?.toString()}
            error={Boolean(errorData?.EventTag)}
          />
        )}
        sx={{
          mb: 2,
        }}
        size="small"
        onChange={(e, value) => onSelectChange(value as string)}
      />
      <TextField
        required
        type={"datetime-local"}
        value={formData.eventTime}
        name="eventTime"
        placeholder="Event Name"
        sx={{
          mb: 2,
        }}
        size="small"
        onChange={onChange}
      />
      <Button onClick={onCancelAction}>Cancel</Button>
      <Button type="submit" variant="contained">
        {editEvent ? "Update" : "Add"} Store
      </Button>
    </Box>
  );
}
