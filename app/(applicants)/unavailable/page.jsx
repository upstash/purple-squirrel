'use client'

import React, {useState, useEffect} from 'react';
import { Divider } from '@nextui-org/react'
import {SquirrelIcon} from '@primer/octicons-react'


export default function Page({
    searchParams,
  }) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-500">
        <div className="flex flex-col gap-3 p-6 bg-default-50 rounded-medium">
            <div className="flex items-center justify-center gap-2">
            <div className="text-secondary">
                <SquirrelIcon size={64} className="scale-x-[-1]" />
            </div>
            {
                (!searchParams.message || (searchParams.message === "error")) && (
                    <h1 className="text-4xl">This page is unavailable at the moment.</h1>
                )
            }
            {
                searchParams.message === "setup" && (
                    <h1 className="text-4xl">This page is currently being set up, please check back later.</h1>
                )
            }
            {
                searchParams.message === "method" && (
                    <h1 className="text-4xl">Applications through this method are currently not accepted.</h1>
                )
            }
            {
                searchParams.message === "not-found" && (
                    <h1 className="text-4xl">This position does not exist.</h1>
                )
            }
            {
                searchParams.message === "closed" && (
                    <h1 className="text-4xl">Applications are currently closed for this position.</h1>
                )
            }
            </div>
        </div>
      </div>
  )};