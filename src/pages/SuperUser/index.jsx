import { useEffect, useState } from "react";
import { Search, Filter, ClipboardIcon, Copy } from "lucide-react";
import { useTransactions } from "../../hooks/Wallet/useTransactions";
import useFetchUserData from "../../hooks/Auth/useFetchUserData";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import toast from "react-hot-toast";

// Dummy data for demonstration
const dummyData = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/40?img=1",
    firstName: "John Doe",
    role: "Premium User",
    email: "john@example.com",
    accountDetails: "****1234",
    transactionDetails: "$500.00",
    status: "Pending",
    date: "2023-05-01",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/40?img=2",
    firstName: "Jane Smith",
    role: "Basic User",
    email: "jane@example.com",
    accountDetails: "****5678",
    transactionDetails: "$250.00",
    status: "Approved",
    date: "2023-05-02",
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/40?img=3",
    firstName: "Bob Johnson",
    role: "Premium User",
    email: "bob@example.com",
    accountDetails: "****9012",
    transactionDetails: "$750.00",
    status: "Rejected",
    date: "2023-05-03",
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/40?img=4",
    firstName: "Alice Brown",
    role: "Basic User",
    email: "alice@example.com",
    accountDetails: "****3456",
    transactionDetails: "$100.00",
    status: "Completed",
    date: "2023-05-04",
  },
];

const SuperUserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { fetchWithdrawals } = useTransactions();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState(null);
  const { userData } = useFetchUserData();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  async function approveWithdrawal(transaction) {
    setLoadingModal(true);
    try {
      await updateDoc(doc(db, "transactions", transaction.id), {
        status: "APPROVED",
      });
      setTransactions((prev) => {
        return prev.map((item) => {
          if (item.id === transaction.id) {
            return {
              ...item,
              status: "APPROVED",
            };
          }
          return item;
        });
      });
      toast.success("Withdrawal request approved successfully!");
    } catch (error) {
      toast.error("Error occurred, please try again");
    } finally {
      setModalOpen(false);
      setLoadingModal(false);
    }
  }

  async function rejectWithdrawal(transaction) {
    setLoadingModal(true);
    try {
      await updateDoc(doc(db, "transactions", transaction.id), {
        status: "REJECTED",
      });
      setTransactions((prev) => {
        return prev.map((item) => {
          if (item.id === transaction.id) {
            return {
              ...item,
              status: "REJECTED",
            };
          }
          return item;
        });
      });
      toast.success("Withdrawal rejected successfully");
    } catch (error) {
      toast.error("Error occurred, please try again");
    } finally {
      setModalOpen(false);
      setLoadingModal(false);
    }
  }

  function handleOpenModal(item) {
    console.log(item);
    setModalOpen(true);
    setModalData(item);
  }

  const copyToClipboard = (display,text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(display + " copied to clipboard");
    }).catch((error) => {
      toast.error("Failed to copy");
    });
  };

  useEffect(() => {
    async function handleFetchWithdrawals() {
      setLoading(true);
      const data = await fetchWithdrawals();
      setTransactions(data);
      setLoading(false);
    }
    if (userData) {
      if (userData.type === "superuser" || userData.role === "superuser") {
        handleFetchWithdrawals();
      } else if (userData.type !== "superuser") {
        navigate("/");
        return;
      }
    }
  }, [userData]);

  const filteredTransactions = transactions?.filter((item) => {
    const matchesSearch =
      item.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const navigate = useNavigate();

  return (
    <>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalData && (
          <>
            <DialogTitle>{`View transaction`}</DialogTitle>
            <DialogContent sx={{ width: { xs: "100%", sm: "500px" } }}>
              <div className="flex gap-4">
                <div
                  onClick={() => navigate(`/profile/${modalData.user.uid}`)}
                  className="flex flex-col justify-center items-center rounded-md hover:bg-gray-200 cursor-pointer p-2 "
                >
                  <img
                    src={modalData.user.photo_url}
                    className="size-[100px] rounded-full aspect-square"
                    alt=""
                  />
                  <div>{`${modalData.user.firstName} ${modalData.user.lastName}`}</div>
                  <Chip label={modalData.user.type}></Chip>
                  <Button
                    variant="contained"
                    className="mt-2"
                    onClick={() => navigate(`/profile/${modalData.user.uid}`)}
                  >
                    Go to profile
                  </Button>
                </div>
                <div className="flex flex-col items-stretch gap-2">
                  <div>Amount: ₹{modalData.amount}</div>
                  <div className="text-base font-bold text-black/70">
                    Bank Details
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-bold flex gap-2 text-black/50">
                      Account Number
                    </div>
                    <div className="flex gap-2 items-center">
                      <IconButton onClick={() => copyToClipboard("Account number",modalData.details.accountNumber)}>
                        <Copy size={14} ></Copy>
                      </IconButton>
                      {modalData.details.accountNumber}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-black/50">
                      Bank Name
                    </div>
                    <div className="flex gap-2 items-center">
                      <IconButton onClick={() => copyToClipboard("Bank name",modalData.details.bankName)}>
                        <Copy size={14} ></Copy>
                      </IconButton>
                      {modalData.details.bankName}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-black/50">
                      IFSC Code
                    </div>
                    <div className="flex gap-2 items-center">
                      <IconButton onClick={() => copyToClipboard("IFSC code",modalData.details.ifscCode)}>
                        <Copy size={14} ></Copy>
                      </IconButton>
                      {modalData.details.ifscCode}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={loadingModal}
                onClick={() => rejectWithdrawal(modalData)}
                variant="contained"
                sx={{ bgcolor: "error.main" }}
              >
                Reject
              </Button>
              <Button
                disabled={loadingModal}
                onClick={() => approveWithdrawal(modalData)}
                variant="contained"
                sx={{ bgcolor: "success.main" }}
              >
                Approve and save as paid
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <div className="flex justify-center min-h-screen bg-gray-100 py-12">
        <div className="container maxw-full mx-auto px-4">
          <h1 className="text-3xl font-bold  text-center">
            Super User Dashboard
          </h1>
          <div className="mb-8 mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center w-full sm:w-auto">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <select
                className="w-full sm:w-auto border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                {/* <option value="Completed">Completed</option> */}
              </select>
            </div>
          </div>
          {loading ? (
            <div className="w-full flex items-center justify-center p-20">
              <div className="spinner-border spinner-border-sm"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                {filteredTransactions && (
                  <>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>

                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>

                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction Details
                          </th>
                          <th
                            align="center"
                            className="px-6 py-3 text-center text-xs  font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.map((item) => (
                          <tr
                            onClick={() => handleOpenModal(item)}
                            className="cursor-pointer hover:bg-gray-100"
                            key={item.id}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex shrink-0 items-center">
                                <img
                                  src={
                                    item.user.photo_url || "/placeholder.svg"
                                  }
                                  alt={item.user.firstName}
                                  className="aspect-square h-10 shrink-0 rounded-full mr-3"
                                />
                                <span className="font-medium text-gray-900">
                                  {item.user.firstName}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.user.email}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{item.amount}
                              {/* {`Bank: ${item.details.bankName}, A/C: ${item.details.accountNumber}, IFSC: ${item.details.ifscCode}`} */}
                            </td>

                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs text-center w-full flex items-center justify-center leading-5 font-semibold rounded-full ${
                                  item.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : item.status === "APPROVED"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "REJECTED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                item.date.seconds * 1000
                              ).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </>
          )}
          <div className="h-12"></div> {/* Added space below the table */}
        </div>
      </div>
    </>
  );
};

export default SuperUserDashboard;
