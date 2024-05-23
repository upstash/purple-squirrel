'use client'

import React, {useState, useEffect} from 'react';
import { Divider, User } from '@nextui-org/react'
import {SquirrelIcon} from '@primer/octicons-react'
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import { useUser } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'




export default function Page() {
    const router = useRouter()
    const { isSignedIn, user, isLoaded } = useUser();

    if (!isLoaded || !user) {
      return null;
    }

    if (user.publicMetadata?.role) {
      router.push('/home')
      return null;
    }

    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-500">
            <div className="flex flex-col gap-3 p-6 bg-default-50 rounded-medium">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl text-center text-default-900">Welcome to</h1>
                <div className="text-secondary">
                    <SquirrelIcon size={48} className="scale-x-[-1]" />
                </div>
                <h1 className="text-3xl">Purple Squirrel!</h1>
              </div>
              <Divider />
              <div>
                  <Button size="lg" variant="solid" color="secondary" className="w-full text-large mt-2" onClick={async () => {
                    await fetch(`/api/users/set-user-role`, {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({id: user.id, role: "applicant"}),
                    });
                    window.location.href = "/home";
                  }}>I am an Applicant</Button>
                  <Button size="lg" variant="bordered" color="secondary" className="w-full text-large mt-2" as={Link} href="/home">I am a Recruiter</Button>
              </div>
            </div>
      </div>
  )};