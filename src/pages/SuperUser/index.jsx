import { useState } from "react"
import { Search, Filter } from "lucide-react"

// Dummy data for demonstration
const dummyData = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/40?img=1",
    fullName: "John Doe",
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
    fullName: "Jane Smith",
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
    fullName: "Bob Johnson",
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
    fullName: "Alice Brown",
    role: "Basic User",
    email: "alice@example.com",
    accountDetails: "****3456",
    transactionDetails: "$100.00",
    status: "Completed",
    date: "2023-05-04",
  },
]

const SuperUserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredData = dummyData.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold  text-center">Super User Dashboard</h1>
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
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={item.avatar || "/placeholder.svg"}
                        alt={item.fullName}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <span className="font-medium text-gray-900">{item.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.accountDetails}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.transactionDetails}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-12"></div> {/* Added space below the table */}
      </div>
    </div>
  )
}

export default SuperUserDashboard

