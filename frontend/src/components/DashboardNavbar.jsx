import React from 'react';
import { useSelector } from 'react-redux'
import ProfileAvatar from './ProfileAvatar';

const DashboardNavbar = () => {

    const { user } = useSelector((state) => state.auth);


    return (

        <header className="bg-white shadow-sm p-4 flex justify-between items-center">

            <div className="flex items-center space-x-4 ml-auto">

                {user && (
                    <ProfileAvatar />
                )}

            </div>
        </header>
    );
};

export default DashboardNavbar;