import {Input} from "@nextui-org/input";
import {Button, ButtonGroup} from "@nextui-org/button";
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function Page() {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-initial pb-unit-2">
          <div className="bg-default-50 flex items-center rounded-xl px-unit-3 py-unit-3 h-full">
            <div className="flex-auto px-unit-1">
              <Input label="Query" size="sm"/>
            </div>
            <div className="flex-initial px-unit-1">
              <Button color="success" size="md" startContent={<SearchIcon />}>Search</Button>
            </div>
            <div className="flex-initial px-unit-1">
              <Button isIconOnly color="secondary" size="md"><BookmarkBorderIcon /></Button>
            </div>
            <div className="flex-initial px-unit-1">
              <Button isIconOnly color="secondary" size="md"><SettingsOutlinedIcon /></Button>
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