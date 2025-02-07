import React, { useState } from "react";
import { ContentCopy, CheckCircle, Mail } from "@mui/icons-material";
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
  Alert,
  IconButton,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const Payments = ({ members = [] }) => {
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [copiedFields, setCopiedFields] = useState({
    accountNumber: false,
    bankName: false,
    ifscCode: false
  });

  // Calculate total salary
  const totalSalary = members.reduce((sum, member) => sum + (member.salary || 0), 0);
  const handleClickOpen = (member) => {
    setSelectedMember(member);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMember(null);
    setCopiedFields({
      accountNumber: false,
      bankName: false,
      ifscCode: false
    });
  };

  const handleCopy = async (field, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedFields(prev => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setCopiedFields(prev => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const DetailRow = ({ label, value, field }) => (
    <div style={{ marginBottom: '1rem' }}>
      <Typography variant="caption" color="textSecondary" style={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        <Typography variant="body1" style={{ color: '#333' }}>
          {value}
        </Typography>
        <IconButton
          size="small"
          onClick={() => handleCopy(field, value)}
          color={copiedFields[field] ? "success" : "default"}
        >
          {copiedFields[field] ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
        </IconButton>
      </div>
    </div>
  );

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
              <TableCell align="center">Bank Details</TableCell>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                        <img
                          src={member.photo_url}
                          style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
                          alt=""
                        />
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
                      disabled={!member.bankDetails}
                    >
                      Show Bank Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle style={{ backgroundColor: '#1976d2', color: 'white' }}>
          Payment Details
        </DialogTitle>
        <DialogContent style={{ paddingTop: '20px', marginTop: '20px' }}>
          {selectedMember && (
            <>
              {selectedMember.bankDetails ? (
                <>
                  <Box mb={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Amount to Pay
                    </Typography>
                    <Typography variant="h4" color="primary" style={{ fontWeight: 500 }}>
                      ₹{selectedMember.salary?.toLocaleString() || '0'}
                    </Typography>
                  </Box>
                  <Divider style={{ margin: '16px 0' }} />
                  <DetailRow
                    label="Account Number"
                    value={selectedMember.bankDetails.accountNumber}
                    field="accountNumber"
                  />
                  <DetailRow
                    label="Bank Name"
                    value={selectedMember.bankDetails.bankName}
                    field="bankName"
                  />
                  <DetailRow
                    label="IFSC Code"
                    value={selectedMember.bankDetails.ifscCode}
                    field="ifscCode"
                  />
                </>
              ) : (
                <Alert severity="warning">
                  This team member hasn't added their bank details yet.
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={handleClose} color="inherit" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Payments;