"use client"

import { useState } from "react"

const SubscriptionStats = () => {
  // Sample data
  const usersData = [
    { id: 1, name: "Musharaf Shaik", status: "active", role: "Admin" },
    { id: 2, name: "Abhishek", status: "expired", role: "Creator" },
    { id: 3, name: "Satish garu", status: "active", role: "Subscriber" },
    { id: 4, name: "Loke", status: "upcoming", role: "Moderator" },
    { id: 5, name: "Shilpa", status: "active", role: "Admin" },
    { id: 6, name: "udaya Shri", status: "expired", role: "Creator" },
    { id: 7, name: "GK", status: "active", role: "Subscriber" },
    { id: 8, name: "Rakesh", status: "upcoming", role: "Moderator" },
  ]

  const transactionsData = [
    {
      id: 1,
      user: "John Doe",
      amount: "$50",
      status: "Completed",
      date: "2025-02-19",
    },
    {
      id: 2,
      user: "Jane Smith",
      amount: "$30",
      status: "Pending",
      date: "2025-02-19",
    },
    {
      id: 3,
      user: "Alice Brown",
      amount: "$40",
      status: "Completed",
      date: "2025-02-10",
    },
    {
      id: 4,
      user: "Bob Johnson",
      amount: "$25",
      status: "Pending",
      date: "2025-02-20",
    },
  ]

  // State management
  const [filter, setFilter] = useState("totalUsers")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Filter handlers
  const handleFilterChange = (value) => {
    setFilter(value)
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Data filtering functions
  const filteredUsers = () => {
    let filtered = usersData
    if (filter === "newSubscriptions") {
      filtered = usersData.filter((user) => user.status === "active")
    } else if (filter === "expiredSubscriptions") {
      filtered = usersData.filter((user) => user.status === "expired")
    } else if (filter === "upcomingExpirations") {
      filtered = usersData.filter((user) => user.status === "upcoming")
    }
    return filtered.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  const filteredTransactions = () => {
    return selectedDate ? transactionsData.filter((tx) => tx.date === selectedDate) : transactionsData
  }

  const totalAmount = filteredTransactions().reduce((sum, tx) => {
    return sum + Number.parseFloat(tx.amount.replace("$", ""))
  }, 0)

  const totalPendingWork = filteredTransactions().filter((tx) => tx.status === "Pending").length

  // Common styles
  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    padding: "2rem",
    margin: "2rem auto",
    maxWidth: "1200px",
    width: "100%",
    border: "none",
    transition: "all 0.3s ease",
  }

  const headerStyle = {
    color: "#1565C0",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "1.8rem",
  }

  const tableHeaderStyle = {
    background: "linear-gradient(135deg, #1565C0, #42A5F5)",
    color: "white",
    padding: "14px 16px",
    fontWeight: "600",
    textAlign: "center",
    fontSize: "0.95rem",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    marginBottom: "2rem",
    border: "1px solid #e0e6ed",
  }

  const tableCellStyle = {
    padding: "14px 16px",
    textAlign: "center",
    borderBottom: "1px solid #e0e6ed",
    transition: "background-color 0.2s ease",
  }

  const buttonStyle = {
    background: "linear-gradient(90deg, #1565C0, #42A5F5)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "500",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  }

  const inputStyle = {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
    width: "100%",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
  }

  const dropdownStyle = {
    position: "relative",
    display: "inline-block",
    width: "100%",
  }

  const dropdownToggleStyle = {
    ...buttonStyle,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  }

  const dropdownMenuStyle = {
    position: "absolute",
    backgroundColor: "white",
    minWidth: "100%",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
    borderRadius: "6px",
    marginTop: "5px",
    display: isDropdownOpen ? "block" : "none",
    overflow: "hidden",
  }

  const dropdownItemStyle = {
    padding: "12px 16px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    display: "block",
    width: "100%",
    textAlign: "left",
    border: "none",
    backgroundColor: "transparent",
  }

  const statBoxStyle = {
    backgroundColor: "#f8fafd",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e0e6ed",
  }

  return (
    <div
      style={{
        backgroundColor: "#f5f8fb",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div style={cardStyle}>
        <h2 style={headerStyle}>USERS DATA</h2>

        {/* Filter Controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            gap: "1rem",
          }}
        >
          <div style={{ flex: "1 1 250px" }}>
            <h3
              style={{
                margin: "0",
                color: "#1565C0",
                fontWeight: "600",
                fontSize: "1.2rem",
              }}
            >
              Subscription Stats
            </h3>
          </div>

          <div style={{ flex: "1 1 250px" }}>
            <input
              type="text"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                ...inputStyle,
                "&:focus": {
                  borderColor: "#42A5F5",
                  boxShadow: "0 0 0 2px rgba(66, 165, 245, 0.2)",
                  outline: "none",
                },
              }}
            />
          </div>

          <div style={{ flex: "1 1 250px" }}>
            <div style={dropdownStyle}>
              <button onClick={toggleDropdown} style={dropdownToggleStyle}>
                <span>
                  {filter === "totalUsers"
                    ? "Total Users"
                    : filter === "newSubscriptions"
                      ? "New Subscriptions"
                      : filter === "expiredSubscriptions"
                        ? "Expired Subscriptions"
                        : "Upcoming Expirations"}
                </span>
                <span>▼</span>
              </button>
              <div style={dropdownMenuStyle}>
                <button
                  style={{
                    ...dropdownItemStyle,
                    "&:hover": { backgroundColor: "#f0f7ff" },
                  }}
                  onClick={() => handleFilterChange("totalUsers")}
                >
                  Total Users
                </button>
                <button
                  style={{
                    ...dropdownItemStyle,
                    "&:hover": { backgroundColor: "#f0f7ff" },
                  }}
                  onClick={() => handleFilterChange("newSubscriptions")}
                >
                  New Subscriptions
                </button>
                <button
                  style={{
                    ...dropdownItemStyle,
                    "&:hover": { backgroundColor: "#f0f7ff" },
                  }}
                  onClick={() => handleFilterChange("expiredSubscriptions")}
                >
                  Expired Subscriptions
                </button>
                <button
                  style={{
                    ...dropdownItemStyle,
                    "&:hover": { backgroundColor: "#f0f7ff" },
                  }}
                  onClick={() => handleFilterChange("upcomingExpirations")}
                >
                  Upcoming Expirations
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th
                style={{
                  ...tableHeaderStyle,
                  borderTopLeftRadius: "12px",
                }}
              >
                Name
              </th>
              <th style={tableHeaderStyle}>Status</th>
              <th
                style={{
                  ...tableHeaderStyle,
                  borderTopRightRadius: "12px",
                }}
              >
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers().map((user, index) => (
              <tr
                key={user.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafd",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#edf5ff"
                  e.currentTarget.style.boxShadow = "inset 0 0 0 1px #c2dcff"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f8fafd"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <td style={tableCellStyle}>{user.name}</td>
                <td
                  style={{
                    ...tableCellStyle,
                    fontWeight: "600",
                    color: user.status === "active" ? "#2e7d32" : user.status === "expired" ? "#c62828" : "#ed6c02",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      backgroundColor:
                        user.status === "active"
                          ? "rgba(46, 125, 50, 0.1)"
                          : user.status === "expired"
                            ? "rgba(198, 40, 40, 0.1)"
                            : "rgba(237, 108, 2, 0.1)",
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td style={tableCellStyle}>{user.role}</td>
              </tr>
            ))}
            {filteredUsers().length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    ...tableCellStyle,
                    color: "#757575",
                    padding: "2rem",
                  }}
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Transactions Section */}
        <h2 style={headerStyle}>TRANSACTIONS DATA</h2>

        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              ...statBoxStyle,
              flex: "1 1 250px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)"
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(21, 101, 192, 0.1)"
              e.currentTarget.style.borderColor = "#c2dcff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.03)"
              e.currentTarget.style.borderColor = "#e0e6ed"
            }}
          >
            <h5 style={{ margin: "0 0 8px 0", color: "#1565C0" }}>Total Transaction Amount</h5>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1565C0",
              }}
            >
              ${totalAmount.toFixed(2)}
            </span>
          </div>

          <div
            style={{
              ...statBoxStyle,
              flex: "1 1 250px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)"
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(21, 101, 192, 0.1)"
              e.currentTarget.style.borderColor = "#c2dcff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.03)"
              e.currentTarget.style.borderColor = "#e0e6ed"
            }}
          >
            <h5 style={{ margin: "0 0 8px 0", color: "#1565C0" }}>Total Pending Work</h5>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#ed6c02",
              }}
            >
              {totalPendingWork}
            </span>
          </div>

          <div
            style={{
              ...statBoxStyle,
              flex: "1 1 250px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)"
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(21, 101, 192, 0.1)"
              e.currentTarget.style.borderColor = "#c2dcff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.03)"
              e.currentTarget.style.borderColor = "#e0e6ed"
            }}
          >
            <h5 style={{ margin: "0 0 8px 0", color: "#1565C0" }}>Filter by Date</h5>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                ...inputStyle,
                width: "auto",
                borderColor: "#c2dcff",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>

        {/* Transactions Table */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th
                style={{
                  ...tableHeaderStyle,
                  borderTopLeftRadius: "12px",
                }}
              >
                User
              </th>
              <th style={tableHeaderStyle}>Amount</th>
              <th style={tableHeaderStyle}>Status</th>
              <th
                style={{
                  ...tableHeaderStyle,
                  borderTopRightRadius: "12px",
                }}
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions().length > 0 ? (
              filteredTransactions().map((tx, index) => (
                <tr
                  key={tx.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafd",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#edf5ff"
                    e.currentTarget.style.boxShadow = "inset 0 0 0 1px #c2dcff"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f8fafd"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <td style={tableCellStyle}>{tx.user}</td>
                  <td
                    style={{
                      ...tableCellStyle,
                      fontWeight: "600",
                    }}
                  >
                    <span
                      style={{
                        color: "#1565C0",
                      }}
                    >
                      {tx.amount}
                    </span>
                  </td>
                  <td
                    style={{
                      ...tableCellStyle,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        backgroundColor:
                          tx.status === "Completed" ? "rgba(46, 125, 50, 0.1)" : "rgba(237, 108, 2, 0.1)",
                        color: tx.status === "Completed" ? "#2e7d32" : "#ed6c02",
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{tx.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    ...tableCellStyle,
                    color: "#757575",
                    padding: "2rem",
                  }}
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SubscriptionStats

// original