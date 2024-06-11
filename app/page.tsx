'use client'

import { useUser } from "@clerk/clerk-react";
import React, {useState, useEffect} from 'react';
import { Divider } from '@nextui-org/react'
import {SquirrelIcon} from '@primer/octicons-react'
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { useRouter } from 'next/navigation'


export default function Page() {
    const router = useRouter()
    const { isSignedIn, user, isLoaded } = useUser();
    const [setupStatus, setSetupStatus] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/settings/get-settings")
            .then(res => res.json())
            .then(data => {
                setSetupStatus(data.setupStatus);
                setLoading(false);
            });
    }, []);

    if (!isLoaded || !user) {
      return null;
    }

    const authRole = user.publicMetadata?.role;

    if (authRole === "recruiter") {
      router.push('/console')
      return null;
    }

    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-500">
        {
          loading
          ?
            null
          :
            <div className="flex flex-col gap-3 p-6 bg-default-50 rounded-medium">
              <div className="flex items-center justify-center gap-2">
                <div className="text-secondary">
                  <SquirrelIcon size={72} className="scale-x-[-1]" />
                </div>
                <h1 className="text-5xl">Purple Squirrel</h1>
              </div>
              <Divider />
              {
                (
                  !authRole &&
                  <span>You are not authorized yet, contact your administrator.</span>
                )
              }
              {
                (
                  authRole === "admin" &&
                  (
                    !setupStatus
                    ?
                      <Button size="lg" variant="solid" color="secondary" className="w-full text-large mt-2" as={Link} href="/setup" startContent={<InputOutlinedIcon />}>Application Setup</Button>
                    :
                      <div className="flex flex-col mt-2 gap-2">
                        <Button size="lg" variant="solid" color="secondary" className="w-full text-large" as={Link} href="/console" startContent={<TerminalOutlinedIcon />}>Recruiter Console</Button>
                        <Button size="lg" variant="bordered" color="secondary" className="w-full text-large" as={Link} href="/dashboard" startContent={<AdminPanelSettingsOutlinedIcon />}>Admin Dashboard</Button>
                      </div>
                  )
                )
              }
            </div>
        }
      </div>
  )};