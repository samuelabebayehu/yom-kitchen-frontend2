'use client'
import React, { useEffect, useState } from 'react';
import withAuth from '@/lib/auth';

interface OrderByStatus {
  status: string;
  count: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    ordersByStatus: [] as OrderByStatus[],
    pendingOrders: 0,
    revenueToday: 0,
    totalClients: 0,
    totalMenus: 0,
    totalOrders: 0
  });

  useEffect(() => {
    const axiosInstance = withAuth();
    const fetchStats = async () => {
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/stats`);
      const data = await response.data;
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
      <p>Yom Kitchen Admin Dashboard!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl">{stats.totalOrders}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Order by status</h2>
          {stats.ordersByStatus?stats.ordersByStatus.map((orderStatus, index) => (
            <p key={index} className="text-2xl">{orderStatus.status}: {orderStatus.count}</p>
          )):0}
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Pending Orders</h2>
          <p className="text-2xl">{stats.pendingOrders}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Revenue Today</h2>
          <p className="text-2xl">{stats.revenueToday}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Available Menus</h2>
          <p className="text-2xl">{stats.totalMenus}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Total Clients</h2>
          <p className="text-2xl">{stats.totalClients}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;