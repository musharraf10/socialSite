import { useState } from 'react';

const dummyEarnings = {
  totalCommissions: 256890.45,
  pendingPayouts: 12450.30,
  totalTransactions: 4521,
  monthlyTrends: [
    { month: 'Jan', amount: 42500 },
    { month: 'Feb', amount: 38900 },
    { month: 'Mar', amount: 45600 },
    { month: 'Apr', amount: 52300 },
    { month: 'May', amount: 48700 },
    { month: 'Jun', amount: 55890 },
  ]
};

const dummySubscriptions = [
  { id: 1, user: 'john.doe@example.com', plan: 'Premium', status: 'Active', revenue: 2499.99, subscribers: 250 },
  { id: 2, user: 'sarah.smith@example.com', plan: 'Pro', status: 'Active', revenue: 1899.99, subscribers: 190 },
  { id: 3, user: 'mike.brown@example.com', plan: 'Basic', status: 'Cancelled', revenue: 899.99, subscribers: 90 },
];

const dummyTransactions = [
  { id: 1, date: '2024-01-15', user: 'john.doe@example.com', amount: 99.99, commission: 20.00, type: 'View Commission', status: 'Paid' },
  { id: 2, date: '2024-01-14', user: 'sarah.smith@example.com', amount: 149.99, commission: 30.00, type: 'Subscription Commission', status: 'Pending' },
  { id: 3, date: '2024-01-13', user: 'mike.brown@example.com', amount: 79.99, commission: 16.00, type: 'View Commission', status: 'Processing' },
];

const dummyContentStats = [
  { id: 1, user: 'john.doe@example.com', posts: 45, totalViews: 150000, commission: 3000.00 },
  { id: 2, user: 'sarah.smith@example.com', posts: 32, totalViews: 98000, commission: 1960.00 },
  { id: 3, user: 'mike.brown@example.com', posts: 28, totalViews: 85000, commission: 1700.00 },
];

const dummyPaymentMethods = [
  { id: 1, type: 'Bank Transfer', account: '**** 1234', status: 'Primary' },
  { id: 2, type: 'PayPal', account: 'admin@example.com', status: 'Active' },
  { id: 3, type: 'Stripe', account: '**** 5678', status: 'Active' },
];

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#ffffff',
      padding: '20px',
    },
    content: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '25px',
    },
    header: {
      color: '#1565C0',
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '25px',
      paddingBottom: '15px',
    },
    tabContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '25px',
      flexWrap: 'wrap',
    },
    tab: {
      padding: '12px 24px',
      background: '#f0f7ff',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      color: '#1565C0',
    },
    activeTab: {
      background: '#1565C0',
      color: 'white',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0',
      background: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    th: {
      padding: '15px',
      textAlign: 'left',
      background: '#f0f7ff',
      color: '#1565C0',
      fontWeight: '600',
    },
    td: {
      padding: '15px',
      color: '#333',
    },
    button: {
      padding: '8px 16px',
      background: '#1565C0',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background 0.3s',
    },
    chart: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '10px',
      height: '200px',
      padding: '20px',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    bar: {
      flex: 1,
      background: '#42A5F5',
      transition: 'height 0.3s',
      position: 'relative',
      borderRadius: '4px 4px 0 0',
    },
  };

  const renderOverview = () => (
    <div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={{ color: '#1565C0', marginBottom: '10px' }}>Total Commissions</h3>
          <p style={{ fontSize: '24px', color: '#333' }}>${dummyEarnings.totalCommissions.toLocaleString()}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={{ color: '#1565C0', marginBottom: '10px' }}>Pending Payouts</h3>
          <p style={{ fontSize: '24px', color: '#333' }}>${dummyEarnings.pendingPayouts.toLocaleString()}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={{ color: '#1565C0', marginBottom: '10px' }}>Total Transactions</h3>
          <p style={{ fontSize: '24px', color: '#333' }}>{dummyEarnings.totalTransactions.toLocaleString()}</p>
        </div>
      </div>

      <h3 style={{ color: '#1565C0', marginBottom: '15px' }}>Monthly Earnings Trend</h3>
      <div style={styles.chart}>
        {dummyEarnings.monthlyTrends.map((data) => (
          <div
            key={data.month}
            style={{
              ...styles.bar,
              height: `${(data.amount / 60000) * 100}%`,
            }}
          >
            <div style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', color: '#333' }}>
              {data.month}
            </div>
            <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', color: '#1565C0' }}>
              ${(data.amount / 1000).toFixed(1)}k
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Plan</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Revenue</th>
            <th style={styles.th}>Subscribers</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dummySubscriptions.map((sub) => (
            <tr key={sub.id}>
              <td style={styles.td}>{sub.user}</td>
              <td style={styles.td}>{sub.plan}</td>
              <td style={styles.td}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: sub.status === 'Active' ? '#e3f2fd' : '#ffebee',
                  color: sub.status === 'Active' ? '#1565C0' : '#c62828',
                }}>
                  {sub.status}
                </span>
              </td>
              <td style={styles.td}>${sub.revenue}</td>
              <td style={styles.td}>{sub.subscribers}</td>
              <td style={styles.td}>
                <button style={styles.button}>Manage</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTransactions = () => (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Commission</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td style={styles.td}>{transaction.date}</td>
              <td style={styles.td}>{transaction.user}</td>
              <td style={styles.td}>${transaction.amount}</td>
              <td style={styles.td}>${transaction.commission}</td>
              <td style={styles.td}>{transaction.type}</td>
              <td style={styles.td}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: 
                    transaction.status === 'Paid' ? '#e8f5e9' :
                    transaction.status === 'Pending' ? '#fff3e0' : '#f3e5f5',
                  color:
                    transaction.status === 'Paid' ? '#2e7d32' :
                    transaction.status === 'Pending' ? '#ef6c00' : '#6a1b9a',
                }}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContentStats = () => (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Total Posts</th>
              <th style={styles.th}>Total Views</th>
              <th style={styles.th}>Commission Earned</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyContentStats.map((stat) => (
              <tr key={stat.id}>
                <td style={styles.td}>{stat.user}</td>
                <td style={styles.td}>{stat.posts}</td>
                <td style={styles.td}>{stat.totalViews.toLocaleString()}</td>
                <td style={styles.td}>${stat.commission.toLocaleString()}</td>
                <td style={styles.td}>
                  <button style={styles.button}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div>
      <div style={styles.statsGrid}>
        {dummyPaymentMethods.map((method) => (
          <div key={method.id} style={styles.statCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#1565C0', marginBottom: '10px' }}>{method.type}</h3>
                <p style={{ color: '#666' }}>Account: {method.account}</p>
                <p style={{ 
                  color: method.status === 'Primary' ? '#2e7d32' : '#1565C0',
                  marginTop: '5px'
                }}>
                  {method.status}
                </p>
              </div>
              <button style={styles.button}>Edit</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button style={{
          ...styles.button,
          background: '#42A5F5',
          padding: '12px 24px',
        }}>
          Add New Payment Method
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.header}>Commission & Payment Management</h1>

        <div style={styles.tabContainer}>
          <div
            style={{ ...styles.tab, ...(activeTab === 'overview' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </div>
          <div
            style={{ ...styles.tab, ...(activeTab === 'subscriptions' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('subscriptions')}
          >
            Subscriptions
          </div>
          <div
            style={{ ...styles.tab, ...(activeTab === 'transactions' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </div>
          <div
            style={{ ...styles.tab, ...(activeTab === 'content-stats' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('content-stats')}
          >
            Content Stats
          </div>
          <div
            style={{ ...styles.tab, ...(activeTab === 'payment-methods' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('payment-methods')}
          >
            Payment Methods
          </div>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'content-stats' && renderContentStats()}
        {activeTab === 'payment-methods' && renderPaymentMethods()}
      </div>
    </div>
  );
}

export default App;