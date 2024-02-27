import {Input} from "@nextui-org/input";
import {Button, ButtonGroup} from "@nextui-org/button";
import {Tooltip} from "@nextui-org/tooltip";
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ApplicantsTable from "./ApplicantsTable";
import ApplicantCard from "./ApplicantCard";

export default function Page() {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-initial pb-unit-2">
          <div className="bg-default-50 flex items-center rounded-xl px-unit-2 py-unit-3 h-full">
            <div className="flex-auto px-unit-1">
              <Input label={null} size="sm" placeholder="Enter a query..." classNames={{inputWrapper: "h-10"}}/>
            </div>
            <div className="flex-initial px-unit-1">
              <Button color="success" size="md" startContent={<SearchIcon />}>Search</Button>
            </div>
            <div className="flex-initial px-unit-1">
              <Tooltip content="Save Query" color={"secondary"} delay={400} closeDelay={600}>
                <Button isIconOnly color="secondary" size="md"><BookmarkBorderIcon /></Button>
              </Tooltip>
            </div>
            <div className="flex-initial px-unit-1">
              <Tooltip content="Settings" color={"secondary"} delay={400} closeDelay={600}>
                <Button isIconOnly color="secondary" size="md"><SettingsOutlinedIcon /></Button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex-auto flex h-full">
          <div className="flex-[72_1_0%] pr-unit-2 pt-unit-2">
            <div className="flex flex-col bg-default-50 rounded-xl h-full p-unit-3">
              <ApplicantsTable />
            </div>
          </div>
          <div className="flex-[28_1_0%] pl-unit-2 pt-unit-2">
            <div className="bg-default-50 rounded-xl h-full p-unit-3">
              <ApplicantCard />
            </div>
          </div>
        </div>
      </div>
    )
  }
