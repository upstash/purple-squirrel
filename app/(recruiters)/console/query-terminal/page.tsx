import {Input} from "@nextui-org/input";
import {Button, ButtonGroup} from "@nextui-org/button";
import {Tooltip} from "@nextui-org/tooltip";
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function Page() {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-initial pb-unit-2">
          <div className="bg-default-50 flex items-center rounded-xl p-unit-2 h-full">
            <div className="flex-auto px-unit-1">
              <Input label="Query" size="sm"/>
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
          <div className="flex-1 pr-unit-2 pt-unit-2">
            <div className="bg-default-50 rounded-xl h-full"></div>
          </div>
          <div className="flex-1 pl-unit-2 pt-unit-2">
            <div className="bg-default-50 rounded-xl h-full"></div>
          </div>
        </div>
      </div>
    )
  }