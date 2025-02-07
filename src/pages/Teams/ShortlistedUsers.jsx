import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Phone } from "lucide-react";
import { useInvites } from "../../hooks/Teams/useInvites";
import { auth, db } from "../../firebaseConfig";
import { useNotifications } from "../../hooks/useNotifications";
import { doc, getDoc } from "firebase/firestore";

const ShortlistedUsers = () => {
  const { fetchShortlistedUsers } = useInvites();
  const { createNotification } = useNotifications();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stipend, setStipend] = useState("");
  const [description, setDescription] = useState("");
  const [entrepreneurData, setEntrepreneurData] = useState(null);

  useEffect(() => {
    const entrepreneurId = auth.currentUser?.uid;
    if (entrepreneurId) {
      fetchShortlistedUsers(entrepreneurId).then(setUsers);
      fetchEntrepreneurDetails(entrepreneurId);
    }
  }, []);

  const fetchEntrepreneurDetails = async (entrepreneurId) => {
    try {
      const entrepreneurRef = doc(db, "users", entrepreneurId);
      const entrepreneurSnap = await getDoc(entrepreneurRef);
      if (entrepreneurSnap.exists()) {
        setEntrepreneurData(entrepreneurSnap.data());
      }
    } catch (error) {
      console.error("Error fetching entrepreneur details:", error);
    }
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setStipend("");
    setDescription("");
  };

  const handleSubscribe = async () => {
    const entrepreneurId = auth.currentUser?.uid;
    if (!entrepreneurId || !selectedUser || !entrepreneurData) {
      console.error("User not authenticated or no user selected");
      return;
    }

    try {
      await createNotification("SUBSCRIPTION", {
        entrepreneurId,
        entrepreneurFirstName: entrepreneurData.firstName || "",
        entrepreneurLastName: entrepreneurData.lastName || "",
        entrepreneurEmail: entrepreneurData.email || "",
        stipend,
        description,
      }, selectedUser.id);

      console.log(`Notification sent to ${selectedUser.display_name || "User"}`);
    } catch (error) {
      console.error("Error creating notification:", error);
    }

    handleCloseDialog();
  };

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No shortlisted users found</div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img src={user.photo_url || "/placeholder.svg"} alt={user.display_name || "User"} className="object-cover w-full h-full" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium truncate">{user.display_name || "Anonymous User"}</h3>
                <div className="flex items-center text-xs text-gray-500 space-x-2">
                  <Phone size={14} />
                  <span>{user.phone_number || "No phone number"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <Button onClick={() => handleOpenDialog(user)} size="small" variant="contained" color="primary">
                Subscribe
              </Button>
            </div>
          </div>
        ))
      )}

      {/* Dialog for entering stipend & description */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Enter Details</DialogTitle>
        <DialogContent>
          <TextField label="Stipend" fullWidth margin="dense" value={stipend} onChange={(e) => setStipend(e.target.value)} />
          <TextField label="Description" fullWidth margin="dense" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSubscribe} color="primary" variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShortlistedUsers;
