import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}