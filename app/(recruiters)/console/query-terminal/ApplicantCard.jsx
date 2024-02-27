import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Link} from "@nextui-org/link";
import {Image} from "@nextui-org/image";
import {Divider} from "@nextui-org/divider";
import {Textarea} from "@nextui-org/input";
import MockApplicant from "./mockApplicant";
import {Button} from "@nextui-org/button";
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { LogoGithubIcon, MarkGithubIcon } from "@primer/octicons-react";
import {Snippet} from "@nextui-org/snippet";
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import {Chip} from "@nextui-org/chip";
import {Input} from "@nextui-org/input";
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const statusColorMap = {
    newApply: "default",
    screening: "warning",
    assessment: "warning",
    interview: "warning",
    consideration: "danger",
    offer: "secondary",
    onboarding: "success",
    hired: "success",
  };

export default function ApplicantCard() {
    return (
        <Card className="max-w-[400px] h-full">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                            <p className="text-2xl">{MockApplicant.name}</p>
                            <p className="text-small text-default-400">{MockApplicant.role} - {MockApplicant.team}</p>
                        </div>
                        <p className={(MockApplicant.score > 89) ? "text-bold text-6xl bg-gradient-to-r from-secondary to-secondary-400 bg-clip-text text-transparent" : (MockApplicant.score > 79) ? "text-bold text-6xl bg-gradient-to-r from-success to-success-300 bg-clip-text text-transparent" : (MockApplicant.score > 49) ? "text-bold text-6xl bg-gradient-to-r from-warning to-warning-300 bg-clip-text text-transparent" : "text-bold text-6xl bg-gradient-to-r from-danger to-danger-300 bg-clip-text text-transparent"}>{MockApplicant.score}</p>
                    </div>
                </div>
            </CardHeader>
            <Divider/>
            <CardBody>
                <div className="flex flex-col gap-3 h-full">
                    <div className="flex gap-2">
                        <div className="flex-auto flex flex-col gap-2">
                            <div className="flex gap-2 w-full">
                                <div className="flex-inital border-default-300 border-2 rounded-xl py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">Age</p>
                                        <p className="text-small text-bold">{MockApplicant.age}</p>
                                    </div>
                                </div>
                                <div className="flex-initial border-default-300 border-2 rounded-xl py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">YOE</p>
                                        <p className="text-small text-bold">{MockApplicant.yoe}</p>
                                    </div>
                                </div>
                                <div className="flex-auto border-default-300 border-2 rounded-xl py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">Location</p>
                                        <p className="text-small text-bold">{MockApplicant.location}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <div className="flex-inital border-default-300 border-2 rounded-xl py-1.5 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-small text-bold">{MockApplicant.degree}</p>
                                    </div>
                                </div>
                                <h1 className="flex-inital">in</h1>
                                <div className="flex-auto border-default-300 border-2 rounded-xl py-1.5 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-small text-bold">{MockApplicant.subject}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <h1 className="flex-inital pl-1">from</h1>
                                <div className="flex-auto border-default-300 border-2 rounded-xl py-1.5 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-small text-bold">{MockApplicant.university}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <div className="flex-auto border-default-300 border-2 rounded-xl py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">Email</p>
                                        <p className="text-small text-bold">{MockApplicant.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <div className="flex-auto border-default-300 border-2 rounded-xl py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">Phone</p>
                                        <p className="text-small text-bold">{MockApplicant.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-initial flex flex-col items-center gap-2">
                            <Button isIconOnly className="bg-gradient-to-r from-primary to-primary-300"><LanguageOutlinedIcon /></Button>
                            <Button isIconOnly>
                                <LinkedInIcon size={28} />
                            </Button>
                            <Button isIconOnly>
                                <MarkGithubIcon size={28} />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardBody>
            <Divider/>
            <CardFooter>
                <div className="flex flex-col h-full w-full">
                    <div className="flex items-center justify-between gap-unit-2">
                        <Chip className="capitalize" color={statusColorMap[MockApplicant.status]} size="sm" variant="flat">
                            {(MockApplicant.status === "newApply") ? "new" : MockApplicant.status}
                        </Chip>
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) =>
                                index < MockApplicant.stars ? <Button isIconOnly key={index} variant="light" size="sm"><StarOutlinedIcon key={index} className={(MockApplicant.stars === 0) ? "text-default" : "text-warning"}/></Button> : <Button isIconOnly key={index} variant="light"><StarBorderOutlinedIcon key={index} size="sm" className={(MockApplicant.stars === 0) ? "text-default" : "text-warning"}/></Button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Textarea
                            isDisabled
                            label="Notes"
                            labelPlacement="outside"
                            placeholder="Enter your description"
                            defaultValue={MockApplicant.notes}
                            className="w-full h-full"
                            />
                        <div className="flex gap-4 items-center justify-between w-full">
                            <Button color="success" className="flex-1 w-full" startContent={<CreateOutlinedIcon/>}>
                                Take Notes
                            </Button>    
                            <Button color="danger" variant="bordered" className="flex-1" startContent={<PersonOffOutlinedIcon/>}>
                                Delete Applicant
                            </Button>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}