import {
  List,
  ListItem,
  ListItemButton,
  Box,
  Typography,
  Chip,
} from "@mui/material";

import useSWR from "swr";
import { getEvents } from "../api/events";
import { eventUrl } from "../common/constants";
import { IEventModel } from "../models/IEventModel";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setEditEvent } from "../redux/slices/events";

export function Events() {
  const { data } = useSWR(eventUrl, getEvents);
  const dispatch = useAppDispatch();
  const editEvent = useAppSelector((state) => state.events.editEvent);
  const onItemClick = (editEvent: IEventModel) => () => {
    dispatch(setEditEvent(editEvent));
  };

  return (
    <div>
      <h1> Events </h1>
      {(data?.length === 0 || !data) && <p> No Events</p>}
      <Box sx={{ overflow: "auto" }}>
        <List>
          {data?.map((event) => (
            <ListItem key={event.id} onClick={onItemClick(event)}>
              <ListItemButton
                color="primary"
                selected={editEvent?.id === event.id}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body1">{event.eventName}</Typography>
                  <Chip label={event.eventTag} size="small" />
                  <Typography variant="body2">
                    {event.eventDescription}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
}
