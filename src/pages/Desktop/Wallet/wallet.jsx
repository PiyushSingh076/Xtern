import React, { useState, useEffect } from "react";
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
  Chip,
  Grid,
  Skeleton,
} from "@mui/material";
import { Plus, ArrowDownCircle, X } from "lucide-react";
import { ENTREPRENEUR_ROLE } from "../../../constants/Roles/professionals";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useWallet from "../../../hooks/Wallet/useWallet";
import { useTransactions } from "../../../hooks/Wallet/useTransactions";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

const WalletPage = () => {
  const { userData } = useFetchUserData();
  const isEntrepreneur = (userData?.type ?? "") === ENTREPRENEUR_ROLE;
  const { initiatePayment } = useTransactions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showRequestWithdrawModal, setShowRequestWithdrawModal] =
    useState(false);

  const [balance, setBalance] = useState(10);
  const { wallet, loaded, getTransactions, getAmountInWallet } = useWallet();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loaded === true) {
      console.log(wallet.amount);
      setLoading(false);
      setBalance(wallet.amount);
    }
  }, [loaded]);

  const [transactionsData, setTransactionsData] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const fetchTransactions = async (uid) => {
    const data = await getTransactions(uid);
    setTransactionsData(data);
    console.log(data);
  };
  useEffect(() => {
    if (userData) {
      fetchTransactions(userData.uid);
    }
  }, [userData]);

  useEffect(() => {
    if (loaded === true) {
      console.log(wallet);
      setLoading(false);
      setBalance(wallet.amount);
    }
  }, [loaded]);

  const AddFundsModal = ({ open, onClose, userData }) => {
    const [amount, setAmount] = useState("");
    const { initiatePayment } = useTransactions();

    const [loading, setLoading] = useState(false);
    async function paymentHandler() {
      setPageLoading(true);
      const updateAmount = await getAmountInWallet(userData.uid);
      setBalance(updateAmount);
      await fetchTransactions(userData.uid);
      setLoading(false);
      setPageLoading(false);
    }

    const handleAddFunds = async () => {
      const addAmount = parseFloat(amount);
      setLoading(true);
      try {
        await initiatePayment(userData.uid, addAmount, paymentHandler, {
          start: () => setPageLoading(true),
          stop: () => setPageLoading(false),
        });
        // console.log("Funds added successfully");
        // const updateAmount = await getAmountInWallet(userData.uid);
        // setBalance(updateAmount)

        onClose();
      } catch (error) {
        setLoading(false);
        console.error("Error adding funds:", error);
      }
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Funds</DialogTitle>
        <DialogContent>
          <Box sx={{ position: "relative", mt: 2 }}>
            <Typography
              sx={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "text.secondary",
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
                sx: { paddingLeft: "24px" },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAddFunds}
            variant="contained"
            className="flex gap-2"
            color="primary"
          >
            {loading ? (
              <>
                Please Wait
                <div className="spinner-border-sm spinner-border"></div>
              </>
            ) : (
              "Add Funds"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const WithdrawFundsModal = ({ open, onClose, balance }) => {
    const [accountNumber, setAccountNumber] = useState("");
    const [bankName, setBankName] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState({});

    const remainingBalance = () => {
      const withdrawAmount = parseFloat(amount) || 0;
      const remaining = balance - withdrawAmount;
      return remaining >= 0 ? remaining.toFixed(2) : "0.00";
    };

    const [loading, setLoading] = useState(false);
    const { requestWithdraw } = useWallet();

    const validateFields = () => {
      const newErrors = {};
      if (!accountNumber.trim())
        newErrors.accountNumber = "Account number is required.";
      if (!bankName.trim()) newErrors.bankName = "Bank name is required.";
      if (!ifscCode.trim()) newErrors.ifscCode = "IFSC code is required.";
      const withdrawAmount = parseFloat(amount);
      console.log(`wa: ${withdrawAmount}, blance: ${balance}`);

      if (!amount.trim() || isNaN(withdrawAmount) || withdrawAmount <= 0)
        newErrors.amount = "Enter a valid amount.";
      else if (withdrawAmount > balance)
        newErrors.amount = "Insufficient balance.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleWithdrawFunds = async () => {
      setPageLoading(true);
      setLoading(true);
      if (validateFields()) {
        await requestWithdraw(userData.uid, amount, {
          accountNumber,
          bankName,
          ifscCode,
        });
        await fetchTransactions(userData.uid);
        const updateAmount = await getAmountInWallet(userData.uid);
        setBalance(updateAmount);
        // Logic for withdrawal (e.g., API call)
        console.log({
          accountNumber,
          bankName,
          ifscCode,
          amount: parseFloat(amount),
        });
        // Clear fields and close modal
        setAccountNumber("");
        setBankName("");
        setIfscCode("");
        setAmount("");
        setErrors({});
        onClose();
      }
      setLoading(false);
      setPageLoading(false);
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
          <Button
            onClick={handleWithdrawFunds}
            variant="contained"
            color="primary"
          >
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const RequestWithdrawModal = ({ open, onClose }) => {
    const [amount, setAmount] = useState("");

    const handleWithdrawFunds = () => {
      const withdrawAmount = parseFloat(amount);
      if (
        !isNaN(withdrawAmount) &&
        withdrawAmount > 0 &&
        withdrawAmount <= balance
      ) {
        setBalance((prev) => prev - withdrawAmount);
      }
      setAmount("");
      onClose();
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Request Withdraw Funds</DialogTitle>
        <DialogContent>
          <Box sx={{ position: "relative", mt: 2 }}>
            <Typography
              sx={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "text.secondary",
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
                sx: { paddingLeft: "24px" },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleWithdrawFunds}
            variant="contained"
            color="primary"
          >
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box
      sx={{ p: 3, bgcolor: "#f5f5f5" }}
      className="max-h-fit overflow-hidden sm:max-h-[calc(100vh-90px)]"
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Left Section */}
        <Paper
          sx={{ width: { xs: "100%", md: "350px" }, p: 3, borderRadius: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            {pageLoading ? (
              <div className="size-[120px] items-center justify-center flex">
                <div className="spinner-border"></div>
              </div>
            ) : (
              <>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "#f0f7ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
              </>
            )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
            ) : (
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

          {transactionsData && (
            <>
              <TableContainer className="max-h-[400px] ">
                <Table stickyHeader className="relative">
                  <TableHead>
                    <TableRow>
                      <TableCell>Amount</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell className="!hidden sm:!table-cell">
                        Date
                      </TableCell>
                      <TableCell align="center">Type</TableCell>
                    </TableRow>
                  </TableHead>

                  <>
                    <TableBody>
                      {pageLoading && (
                        <>
                          <TableRow>
                            <Skeleton className="!table-cell w-[100px] mx-4 h-14"></Skeleton>
                            <Skeleton className="!table-cell w-[100px] mx-4 h-14"></Skeleton>
                            <Skeleton className="!table-cell w-[100px] mx-4 h-14"></Skeleton>
                            <Skeleton className="!table-cell w-[100px] mx-4 h-14"></Skeleton>
                          </TableRow>
                        </>
                      )}
                      {transactionsData.map((transaction, index) => (
                        <TableRow key={index} hover>
                          <TableCell>₹{transaction.amount}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="!hidden sm:!table-cell" l>
                            {transaction.date
                              ? dayjs(
                                  new Timestamp(
                                    transaction.date.seconds,
                                    transaction.date.nanoseconds
                                  ).toDate()
                                ).format("DD-MM-YYYY")
                              : "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            {transaction.type === "CREDIT" ? (
                              <Chip label="CREDIT" color="success"></Chip>
                            ) : transaction.type === "DEBIT" ? (
                              <>
                                <Chip label="DEBIT" color="error"></Chip>
                              </>
                            ) : (
                              <>
                                <Chip label="PENDING" color="info"></Chip>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>

        {/* Modals */}

        <AddFundsModal
          userData={userData}
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
        <WithdrawFundsModal
          open={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          balance={balance}
        />
        <RequestWithdrawModal
          open={showRequestWithdrawModal}
          onClose={() => setShowRequestWithdrawModal(false)}
        />
      </Box>
    </Box>
  );
};

export default WalletPage;
