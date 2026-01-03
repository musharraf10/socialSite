import { Share, Search, Settings, Calendar } from 'lucide-react';
import BarGraph from './BarGraph';
import { useState } from 'react';

// Reusable card component with a clean black and white design
const CardWrapper = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 
    transition-all duration-300 hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

const earningsData = [
  {
    _id: '67bb18cb463b532bff3522f6',
    totalAmount: 0.07,
    rank: 1,
    user: {
      username: 'musharaf',
      email: 'skmusharaf01@gmail.com',
      profilePicture:
        'https://res.cloudinary.com/dspnqdbs1/image/upload/v1740631592/blog-project/yvqpbgoxmmgxl4yu0hws.jpg',
      role: 'admin',
    },
  },
  {
    _id: '67c1597c5b4d21280d877a0d',
    totalAmount: 0.02,
    rank: 2,
    user: {
      username: 'A2',
      email: 'abcd@gmail.com',
      profilePicture: null,
      role: 'curator',
    },
  },
  {
    _id: '67bc1b276dbfa82e13e3dcac',
    totalAmount: 0,
    rank: 3,
    user: {
      username: 'shiva',
      email: 'shivaprasadgunaganti1@gmail.com',
      profilePicture:
        'https://res.cloudinary.com/dspnqdbs1/image/upload/v1740381810/blog-project/gpggdx766duxjhcsqqc4.jpg',
      role: 'curator',
    },
  },
];

const PaymentsDashboard = () => {
  const [today, setToday] = useState(123456);
  const [sixmonthsData, setSixmonthsData] = useState(54783658);
  const [monthly, setMonthly] = useState(34.56836);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm overflow-hidden border border-gray-200">
        <div className="grid grid-cols-6 h-full">
          {/* Sidebar */}
          {/* Add your sidebar here if needed */}

          {/* Main content */}
          <div className="col-span-6 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Payments Dashboard</h1>
              <div className="flex space-x-4">
                <Search />
                <Calendar />
                <Settings />
                <Share />
              </div>
            </div>

            {/* Earnings Table */}
            <CardWrapper className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Top Earners</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Rank</th>
                      <th className="py-3 px-6 text-left">Profile</th>
                      <th className="py-3 px-6 text-left">Username</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Role</th>
                      <th className="py-3 px-6 text-left">Total Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {earningsData.map((entry) => (
                      <tr
                        key={entry._id}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="py-3 px-6">{entry.rank}</td>
                        <td className="py-3 px-6">
                          {entry.user.profilePicture ? (
                            <img
                              src={entry.user.profilePicture}
                              alt={entry.user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 flex items-center justify-center rounded-full">
                              <span className="text-xs text-gray-600">N/A</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-6">{entry.user.username}</td>
                        <td className="py-3 px-6">{entry.user.email}</td>
                        <td className="py-3 px-6">{entry.user.role}</td>
                        <td className="py-3 px-6">
                          ${entry.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardWrapper>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <CardWrapper>
                <h3 className="text-lg font-semibold">Today's Earnings</h3>
                <p className="text-2xl font-bold">${today}</p>
              </CardWrapper>
              <CardWrapper>
                <h3 className="text-lg font-semibold">6 Months Earnings</h3>
                <p className="text-2xl font-bold">${sixmonthsData}</p>
              </CardWrapper>
              <CardWrapper>
                <h3 className="text-lg font-semibold">Monthly Earnings</h3>
                <p className="text-2xl font-bold">${monthly}</p>
              </CardWrapper>
            </div>

            {/* Bar Graph */}
            <CardWrapper>
              <h3 className="text-lg font-semibold mb-4">Earnings Over Time</h3>
              <BarGraph />
            </CardWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsDashboard;
