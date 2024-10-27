import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import AdminHeader from "../shared/AdminHeader";
import ConfirmationModal from "../common/ConfirmationMoal";

const Layout = () => {
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar setConfirmationModal={setConfirmationModal}/>
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <AdminHeader />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {<Outlet />}
            </div>
          </main>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default Layout;
