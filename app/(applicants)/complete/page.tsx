'use client'

import {SquirrelIcon} from '@primer/octicons-react'

export default function Page() {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-500">
        <div className="flex flex-col gap-3 p-6 bg-default-50 rounded-medium">
            <div className="flex items-center justify-center gap-2">
            <div className="text-secondary">
                <SquirrelIcon size={64} className="scale-x-[-1]" />
            </div>
            <h1 className="text-4xl">Your application is complete!</h1>
            </div>
        </div>
      </div>
  )};