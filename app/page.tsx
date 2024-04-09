import { Divider } from '@nextui-org/react'
import {SquirrelIcon} from '@primer/octicons-react'
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";

export default function Page() {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col gap-3 p-6 bg-default-50 rounded-xl">
          <div className="flex items-center justify-start gap-2">
            <div className="text-secondary">
              <SquirrelIcon size={72} className="scale-x-[-1]" />
            </div>
            <h1 className="text-5xl">Purple Squirrel</h1>
          </div>
          <Divider />
          <Button size="lg" color="secondary" className="mt-2" as={Link} href="/console">Proceed to Console</Button>
        </div>
      </div>
  )};