import React, { useState } from "react";
import { Mail } from "lucide-react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Payments = ({ members = [] }) => {
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleClickOpen = (member) => {
    setSelectedMember(member);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMember(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Last Paid At</TableCell>
              <TableCell align="center">Pay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No team members found
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 ">
                      <div className="size-[30px] rounded-full relative overflow-hidden" >
                        <img src={member.photo_url} className="size-full absolute left-0 top-0" alt="" />
                      </div>
                      <div>{member.display_name || "Anonymous Member"}</div>
                    </div>
                  </TableCell>
                  <TableCell>{member.email || "No email provided"}</TableCell>
                  <TableCell>₹{member.salary}</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => handleClickOpen(member)}
                    >
                      Pay now
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-blue-500 text-white">
          Payment Details
        </DialogTitle>
        <DialogContent className="space-y-4 py-6 mt-3">
          {selectedMember && (
            <>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-bold text-gray-500">
                  Account Number
                </div>
                <div className="text-lg text-gray-800">1012801254</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-bold text-gray-500">Bank Name</div>
                <div className="text-lg text-gray-800">Canara Bank</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-bold text-gray-500">IFSC Code</div>
                <div className="text-lg text-gray-800">
                  912759801278958125
                </div>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions className="px-6 py-4">
          <Button onClick={handleClose} color="secondary" variant="outlined" className="w-full sm:w-auto">
            Close
          </Button>
          <Button variant="contained" color="primary" className="w-full sm:w-auto">
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Payments;
