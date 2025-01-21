import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Grid
} from '@mui/material';
import { Plus, ArrowDownCircle, X } from 'lucide-react';
import { ENTREPRENEUR_ROLE } from "../../../constants/Roles/professionals";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useWallet from '../../../hooks/Wallet/useWallet';
import { useTransactions } from '../../../hooks/Wallet/useTransactions';

const WalletPage = () => {
  const { userData } = useFetchUserData();
  const isEntrepreneur = (userData?.type ?? "") === ENTREPRENEUR_ROLE;
  const {initiatePayment} = useTransactions()
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showRequestWithdrawModal, setShowRequestWithdrawModal] = useState(false);

  const [balance, setBalance] = useState(10);
  const {wallet, loaded} = useWallet();
  const [loading, setLoading] = useState(true);

  useEffect(( ) => {
    if(loaded === true){
      console.log(wallet.amount)
      setLoading(false)
      setBalance(wallet.amount);
    }
  }, [loaded])

  const [transactions] = useState([
    { name: "Elizabeth Lopez", service: "elizabethlopez@example.com", amount: 1000, type: "Admin" },
    { name: "Matthew Martinez", service: "mmartinez1997@example.com", amount: 2000, type: "Owner" },
    { name: "Elizabeth Hall", service: "elizabeth_hall_1998@example.com", amount: 500, type: "Owner" },
    { name: "Maria White", service: "maria.white@example.com", amount: 800, type: "Admin" },
    { name: "Elizabeth Watson", service: "ewatson@example.com", amount: 1200, type: "Admin" },
  ]);
  

  

  const AddFundsModal = ({ open, onClose, userData }) => {
    const [amount, setAmount] = useState('');
    const {initiatePayment} = useTransactions()

    const handleAddFunds = async () => {
      const addAmount = parseFloat(amount);
      
      try {
        await initiatePayment(userData.uid, addAmount);
        if (!isNaN(addAmount) && addAmount > 0) {
          setBalance((prev) => prev + addAmount);
        }
        setAmount('');
        onClose();
      } catch (error) {
        console.error('Error adding funds:', error);
      }
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Funds
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', mt: 2 }}>
            <Typography
              sx={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'text.secondary',
              }}
            >
              ₹
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              InputProps={{
                sx: { paddingLeft: '24px' },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAddFunds} variant="contained" color="primary">
            Add Funds
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const WithdrawFundsModal = ({ open, onClose, balance }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState({});

    const remainingBalance = () => {
      const withdrawAmount = parseFloat(amount) || 0;
      const remaining = balance - withdrawAmount;
      return remaining >= 0 ? remaining.toFixed(2) : '0.00';
    };
  
    const validateFields = () => {
      const newErrors = {};
      if (!accountNumber.trim()) newErrors.accountNumber = 'Account number is required.';
      if (!bankName.trim()) newErrors.bankName = 'Bank name is required.';
      if (!ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required.';
      const withdrawAmount = parseFloat(amount);
      console.log(`wa: ${withdrawAmount}, blance: ${balance}`);
      
      if (!amount.trim() || isNaN(withdrawAmount) || withdrawAmount <= 0)
        newErrors.amount = 'Enter a valid amount.';
      else if (withdrawAmount > balance)
        newErrors.amount = 'Insufficient balance.';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleWithdrawFunds = () => {
      if (validateFields()) {
        // Logic for withdrawal (e.g., API call)
        console.log({
          accountNumber,
          bankName,
          ifscCode,
          amount: parseFloat(amount),
        });
        // Clear fields and close modal
        setAccountNumber('');
        setBankName('');
        setIfscCode('');
        setAmount('');
        setErrors({});
        onClose();
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Withdraw Funds</DialogTitle>
        <DialogContent>
          {/* Account Number Input */}
          <TextField
            fullWidth
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter account number"
            error={!!errors.accountNumber}
            helperText={errors.accountNumber}
            sx={{ mb: 2, mt: 2 }}
          />
          {/* Bank Name Input */}
          <TextField
            fullWidth
            label="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Enter bank name"
            error={!!errors.bankName}
            helperText={errors.bankName}
            sx={{ mb: 2 }}
          />
          {/* IFSC Code Input */}
          <TextField
            fullWidth
            label="IFSC Code"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            placeholder="Enter IFSC code"
            error={!!errors.ifscCode}
            helperText={errors.ifscCode}
            sx={{ mb: 2 }}
          />
          {/* Amount Input */}
          <Grid container spacing={2} alignItems="center">
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="number"
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              error={!!errors.amount}
              helperText={errors.amount}
              InputProps={{
                startAdornment: (
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      marginRight: "8px",
                      color: "text.secondary",
                    }}
                  >
                    ₹
                  </Typography>
                ),
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <Box
              sx={{
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Remaining Balance
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                ₹{remainingBalance()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleWithdrawFunds} variant="contained" color="primary">
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  


  const RequestWithdrawModal = ({ open, onClose }) => {
    const [amount, setAmount] = useState('');

    const handleWithdrawFunds = () => {
      const withdrawAmount = parseFloat(amount);
      if (!isNaN(withdrawAmount) && withdrawAmount > 0 && withdrawAmount <= balance) {
        setBalance((prev) => prev - withdrawAmount);
      }
      setAmount('');
      onClose();
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Request Withdraw Funds
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', mt: 2 }}>
            <Typography
              sx={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'text.secondary',
              }}
            >
              ₹
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              InputProps={{
                sx: { paddingLeft: '24px' },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleWithdrawFunds} variant="contained" color="primary">
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    );
  };


  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Left Section */}
        <Paper sx={{ width: { xs: '100%', md: '350px' }, p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: '#f0f7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h5" fontWeight="medium">
                ₹{balance}
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight="medium">
              Wallet Balance
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<Plus size={18} />}
              onClick={() => setShowAddModal(true)}
            >
              Add Funds
            </Button>

            {!isEntrepreneur ? (
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                startIcon={<ArrowDownCircle size={18} />}
                onClick={() => setShowWithdrawModal(true)}
              >
                Withdraw
              </Button>
            ):(
              <Button
              fullWidth
              variant="outlined"
              color="inherit"
              startIcon={<ArrowDownCircle size={18} />}
              onClick={() => setShowRequestWithdrawModal(true)}
            >
              Request Withdraw
            </Button>
            )}
          </Box>
        </Paper>

        {/* Right Section */}
        <Paper sx={{ flex: 1, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="medium" sx={{ mb: 3 }}>
            Transaction History
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{transaction.service}</TableCell>
                    <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Modals */}
        <AddFundsModal userData={userData} open={showAddModal} onClose={() => setShowAddModal(false)} />
        <WithdrawFundsModal open={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} balance={balance}/>
        <RequestWithdrawModal open={showRequestWithdrawModal} onClose={() => setShowRequestWithdrawModal(false)} />

      </Box>
    </Box>
  );
};

export default WalletPage;
