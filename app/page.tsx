'use client'

import React, {useState, useEffect} from 'react';
import { Divider } from '@nextui-org/react'
import {SquirrelIcon} from '@primer/octicons-react'
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';



export default function Page() {
    const [setupStatus, setSetupStatus] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/get-setup-status")
            .then(res => res.json())
            .then(data => {
                setSetupStatus(data);
                console.log(data);
                setLoading(false);
            });
    }, []);

    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-500">
        {
          loading
          ?
            null
          :
            <div className="flex flex-col gap-3 p-6 bg-default-50 rounded-medium">
              {
                !setupStatus
                ?
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-3xl text-center text-default-900">Welcome to</h1>
                    <div className="text-secondary">
                        <SquirrelIcon size={48} className="scale-x-[-1]" />
                    </div>
                    <h1 className="text-3xl">Purple Squirrel!</h1>
                  </div>
                :
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-secondary">
                      <SquirrelIcon size={72} className="scale-x-[-1]" />
                    </div>
                    <h1 className="text-5xl">Purple Squirrel</h1>
                  </div>
              }
              <Divider />
                  <Button size="lg" variant="solid" color="secondary" className="w-full text-large mt-2" as={Link} href="/home" startContent={<InputOutlinedIcon />}>Applicants</Button>
                  <Button size="lg" variant="solid" color="secondary" className="w-full text-large mt-2" as={Link} href="/home" startContent={<InputOutlinedIcon />}>Recruiters</Button>
            </div>
        }
      </div>
  )};