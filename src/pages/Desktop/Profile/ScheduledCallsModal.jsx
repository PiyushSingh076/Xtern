// components/Profile/ScheduledCallsModal.js

import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  Divider,
} from "@mui/material";
import { MdClose, MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { getDoc } from "firebase/firestore";

// Styled Components
const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 800,
  backgroundColor: "#fff",
  borderRadius: 8,
  boxShadow: 24,
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  maxHeight: "80vh", // Ensure the modal doesn't exceed the viewport height
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: "bold",
  color: "#007bff",
}));

const CloseIcon = styled(MdClose)(({ theme }) => ({
  cursor: "pointer",
  color: "#007bff",
  fontSize: "1.5rem",
}));

const ListContainer = styled(Box)(({ theme }) => ({
  overflowY: "auto",
  maxHeight: "60vh", // Adjust based on modal height
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  color: "#fff",
  backgroundColor: "#007bff",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
}));

const ScheduledCallsModal = ({
  open,
  onClose,
  loading,
  calls,
  error,
  onDeleteEvent,
}) => {
  const [callsWithRecipients, setCallsWithRecipients] = useState([]);
  const [deletingEventIds, setDeletingEventIds] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchRecipients = async () => {
      if (!calls || calls.length === 0) {
        setCallsWithRecipients([]);
        setIsFetching(false);
        return;
      }

      const updatedCalls = [];
      for (const call of calls) {
        if (call.recipientUserRef) {
          const recipientSnap = await getDoc(call.recipientUserRef);
          const recipientData = recipientSnap.exists()
            ? recipientSnap.data()
            : null;
          updatedCalls.push({ ...call, recipient: recipientData });
        } else {
          updatedCalls.push(call);
        }
      }
      setCallsWithRecipients(updatedCalls);
      setIsFetching(false); 
    };

    if (open) {
      setIsFetching(true);
      fetchRecipients();
    }

    fetchRecipients();
  }, [calls,open]);

  const handleDelete = async (call) => {
    try {
      setDeletingEventIds((prev) => [...prev, call.eventId]);
      await onDeleteEvent(call.eventId, call.id); // Assuming onDeleteEvent handles Firestore deletion too
    } catch (err) {
      console.error("Error deleting event:", err);
    } finally {
      setDeletingEventIds((prev) => prev.filter((id) => id !== call.eventId));
    }
  };

  

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="scheduled-calls-modal"
      aria-describedby="scheduled-calls-list"
    >
      <ModalContainer>
        <Header>
          <Title id="scheduled-calls-modal">Previously Scheduled Calls</Title>
          <CloseIcon onClick={onClose} />
        </Header>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && <Typography color="error">Error: {error}</Typography>}

        {!loading && !error && callsWithRecipients?.length === 0 && (
          <Typography>No previously scheduled calls found.</Typography>
        )}

        {!loading && !error && callsWithRecipients?.length > 0 && (
          <ListContainer>
            <List>
              {callsWithRecipients.map((call, index) => {
                const recipient = call.recipient;
                const dateTime = dayjs(call.scheduledDateTime);
                const isDeleting = deletingEventIds.includes(call.eventId);
                return (
                  <React.Fragment key={call.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        paddingY: 2,
                      }}
                    >
                      {/* Header: Call ID and Delete Button */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                          marginBottom: 1,
                        }}
                      >
                        <Typography variant="h6" color="text.primary">
                          {call.callId}
                        </Typography>
                        <Tooltip title="Delete Event">
                          <IconButton
                            onClick={() => handleDelete(call)}
                            disabled={isDeleting}
                            size="small"
                          >
                            {isDeleting ? (
                              <CircularProgress size={20} />
                            ) : (
                              <MdDelete color="#d32f2f" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {/* Recipient Details */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          marginBottom: 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={recipient?.photo_url || "/default-profile.png"}
                            alt={recipient?.firstName}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${recipient?.firstName || "N/A"} ${
                            recipient?.lastName || ""
                          }`}
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {recipient?.email || "N/A"} |{" "}
                              {recipient?.type || "Unknown Role"}
                            </Typography>
                          }
                        />
                      </Box>

                      {/* Call Details */}
                      <Box sx={{ width: "100%", marginBottom: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Type:</strong> {call.callType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Date:</strong>{" "}
                          {dateTime.format("D MMM YYYY, h:mm A")}
                        </Typography>
                      </Box>

                      {/* Open Event Button */}
                      {call.eventLink && (
                        <StyledButton
                          variant="contained"
                          href={call.eventLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ alignSelf: "flex-start" }}
                        >
                          Open Event
                        </StyledButton>
                      )}
                    </ListItem>
                    {index < callsWithRecipients.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </ListContainer>
        )}
      </ModalContainer>
    </Modal>
  );
};

export default ScheduledCallsModal;
