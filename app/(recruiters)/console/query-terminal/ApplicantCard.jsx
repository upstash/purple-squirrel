import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Link} from "@nextui-org/link";
import {Image} from "@nextui-org/image";
import {Divider} from "@nextui-org/divider";
import {Textarea} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { LogoGithubIcon, MarkGithubIcon } from "@primer/octicons-react";
import {Snippet} from "@nextui-org/snippet";
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import {Chip} from "@nextui-org/chip";
import {Input} from "@nextui-org/input";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { card } from "@nextui-org/react";
import React, { use } from "react";
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";

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

const statusArray = Object.keys(statusColorMap);

function InfoCard({cardID, tableInfo, setTableInfo, cardScore, setDisplayCard, setApplicantIDs}) {
    const applicantName = tableInfo[cardID].name;
    const applicantRole = tableInfo[cardID].role;
    const applicantTeam = tableInfo[cardID].team;
    const applicantAge = tableInfo[cardID].age;
    const applicantYOE = tableInfo[cardID].yoe;
    const applicantLocation = tableInfo[cardID].location;
    const applicantDegree = tableInfo[cardID].degree;
    const applicantSubject = tableInfo[cardID].subject;
    const applicantUniversity = tableInfo[cardID].university;
    const applicantEmail = tableInfo[cardID].email;
    const applicantPhone = tableInfo[cardID].phone;
    const applicantWebsite = tableInfo[cardID].websiteUrl;
    const applicantLinkedIn = tableInfo[cardID].linkedinUrl;
    const applicantGithub = tableInfo[cardID].githubUrl;
    const applicantStatus = tableInfo[cardID].status;
    const applicantStars = tableInfo[cardID].stars;
    const applicantNotes = tableInfo[cardID].notes;
    const applicantNotesSaved = tableInfo[cardID].notesSaved;

    return (
        <Card className="max-w-[400px] h-full">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                            <p className="text-2xl">{applicantName}</p>
                            <p className="text-small text-default-400">{applicantRole} - {applicantTeam}</p>
                        </div>
                        <p className={(cardScore > 89) ? "text-bold text-6xl bg-gradient-to-r from-secondary to-secondary-400 bg-clip-text text-transparent" : (cardScore > 79) ? "text-bold text-6xl bg-gradient-to-r from-success to-success-300 bg-clip-text text-transparent" : (cardScore > 49) ? "text-bold text-6xl bg-gradient-to-r from-warning to-warning-300 bg-clip-text text-transparent" : "text-bold text-6xl bg-gradient-to-r from-danger to-danger-300 bg-clip-text text-transparent"}>{cardScore}</p>
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
                                        <p className="text-small text-bold">{applicantAge}</p>
                                    </div>
                                </div>
                                <div className="flex-initial border-default-300 border-2 rounded-xl py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">YOE</p>
                                        <p className="text-small text-bold">{applicantYOE}</p>
                                    </div>
                                </div>
                                <div className="flex-auto border-default-300 border-2 rounded-xl py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">Location</p>
                                        <p className="text-small text-bold">{applicantLocation}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <div className="flex-inital border-default-300 border-2 rounded-xl py-1.5 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-small text-bold">{applicantDegree}</p>
                                    </div>
                                </div>
                                <h1 className="flex-inital">in</h1>
                                <div className="flex-auto border-default-300 border-2 rounded-xl py-1.5 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-small text-bold">{applicantSubject}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <h1 className="flex-inital pl-1">from</h1>
                                <div className="flex-auto border-default-300 border-2 rounded-xl py-1.5 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-small text-bold">{applicantUniversity}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <div className="flex-auto border-default-300 border-2 rounded-xl py-1 px-3">
                                    <div className="flex min-h-3 flex-col">
                                        <p className="text-xs text-default-300">Email</p>
                                        <p className="text-small text-bold">{applicantEmail}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <div className="flex-auto border-default-300 border-2 rounded-xl py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">Phone</p>
                                        <p className="text-small text-bold">{applicantPhone}</p>
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
                        <Dropdown>
                            <DropdownTrigger>
                                <Button 
                                    variant="light" 
                                    radius="xl"
                                    className="capitalize"
                                    size="sm"
                                    color="default"
                                >
                                    <Chip className="capitalize" color={statusColorMap[applicantStatus]} size="sm" variant="flat">
                                        {applicantStatus === "newApply" ? "New" : applicantStatus}
                                    </Chip>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu 
                                aria-label="Single selection example"
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={new Set([applicantStatus])}
                                onSelectionChange={
                                    async (keys) => {
                                        await fetch(`/api/set-applicant-status`, {
                                            method: "POST",
                                            headers: {
                                              "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({id: cardID, status: Array.from(keys)[0]}),
                                          });
                                        setTableInfo((prevTableInfo) => {
                                            const updatedTableInfo = { ...prevTableInfo };
                                            updatedTableInfo[cardID].status = Array.from(keys)[0];
                                            return updatedTableInfo;
                                        });
                                    }
                                }
                            >
                                {statusArray.map((key) => 
                                    <DropdownItem key={key} textValue={key === "newApply" ? "new" : key}>
                                        <Chip className="capitalize" color={statusColorMap[key]} size="sm" variant="flat">
                                            {key === "newApply" ? "New" : key}
                                        </Chip>
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) =>
                                (!applicantStars)
                                ? <Button isIconOnly key={index} variant="light" size="sm"
                                    onPress={async () => {
                                        await fetch(`/api/set-applicant-stars`, {
                                            method: "POST",
                                            headers: {
                                              "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({id: cardID, stars: index + 1}),
                                          });
                                        setTableInfo((prevTableInfo) => {
                                            const updatedTableInfo = { ...prevTableInfo };
                                            updatedTableInfo[cardID].stars = index + 1;
                                            return updatedTableInfo;
                                        })
                                    }}
                                    ><StarBorderOutlinedIcon key={index} className={"text-default"}/></Button>
                                : <Button isIconOnly key={index} variant="light" size="sm"
                                    onPress={async () => {
                                        await fetch(`/api/set-applicant-stars`, {
                                            method: "POST",
                                            headers: {
                                              "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({id: cardID, stars: index + 1}),
                                          });
                                        setTableInfo((prevTableInfo) => {
                                            const updatedTableInfo = { ...prevTableInfo };
                                            updatedTableInfo[cardID].stars = index + 1;
                                            return updatedTableInfo;
                                        })
                                    }}
                                    ><StarOutlinedIcon key={index} className={(applicantStars > index) ? "text-warning" : "text-default"}/></Button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Textarea
                            isDisabled={applicantNotesSaved}
                            label="Notes"
                            labelPlacement="outside"
                            placeholder="Enter your description"
                            value={tableInfo[cardID].notes || ""}
                            onValueChange={(value) => {
                                setTableInfo((prevTableInfo) => {
                                    const updatedTableInfo = { ...prevTableInfo };
                                    updatedTableInfo[cardID].notes = value;
                                    return updatedTableInfo;
                                });
                            }}
                            className="w-full h-full"

                            />
                        <div className="flex gap-4 items-center justify-between w-full">
                            {
                                applicantNotesSaved
                                ? <Button color="success" variant="bordered" className="flex-1 w-full" startContent={<CreateOutlinedIcon/>}
                                    onPress={() => {
                                        setTableInfo((prevTableInfo) => {
                                            const updatedTableInfo = { ...prevTableInfo };
                                            updatedTableInfo[cardID].notesSaved = false;
                                            return updatedTableInfo;
                                        })
                                    }}>
                                    Take Notes
                                    </Button>
                                : <Button color="success" className="flex-1 w-full" startContent={<CheckOutlinedIcon/>}
                                    onPress={async () => {
                                        await fetch(`/api/set-applicant-notes`, {
                                            method: "POST",
                                            headers: {
                                              "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({id: cardID, notes: tableInfo[cardID].notes}),
                                          });
                                        setTableInfo((prevTableInfo) => {
                                            const updatedTableInfo = { ...prevTableInfo };
                                            updatedTableInfo[cardID].notesSaved = true;
                                            return updatedTableInfo;
                                        })
                                    }}>
                                    Save Notes
                                    </Button>
                            }
                            <Button color="danger" variant="bordered" className="flex-1" startContent={<PersonOffOutlinedIcon/>}
                                onPress={async () => {
                                    await fetch(`/api/delete-applicants`, {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({ids: [cardID]}),
                                    });
                                    setDisplayCard(false);
                                    setApplicantIDs((prevApplicantIDs) => prevApplicantIDs.filter((pair) => pair.id !== cardID));
                                    setTableInfo(prevTableInfo => {
                                        const updatedTableInfo = { ...prevTableInfo };
                                        delete updatedTableInfo[cardID];
                                        return updatedTableInfo;
                                    });
                                  }}
                            >
                                Delete Applicant
                            </Button>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

function EmptyCard() {
    return (
        <Card className="max-w-[400px] h-full">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <div className="h-8 w-20 bg-default-300 rounded-3xl"></div>
                                <div className="h-8 w-40 bg-default-300 rounded-3xl"></div>
                            </div>
                            <div className="h-4 w-40 bg-default-200 rounded-3xl"></div>
                        </div>
                        <div className="h-14 w-16 bg-default-300 rounded-xl"></div>
                    </div>
                </div>
            </CardHeader>
            <Divider/>
            <CardBody>
                <div className="flex flex-col gap-3 h-full">
                    <div className="flex gap-2 h-full">
                        <div className="flex-auto flex flex-col gap-2 h-full">
                            <div className="flex-[1_1_0%] flex gap-2 w-full">
                                <div className="flex-[1_1_0%] bg-default-200 rounded-xl py-1 px-3 h-10">

                                </div>
                                <div className="flex-[1_1_0%] bg-default-200 rounded-xl py-1 px-3 h-10">

                                </div>
                                <div className="flex-[10_1_0%] bg-default-200 rounded-xl py-1 px-3 h-10">

                                </div>
                            </div>
                            <div className="flex-[1_1_0%] flex gap-2 items-end w-full">
                                <div className="flex-[2_1_0%] bg-default-200 rounded-xl py-1.5 px-3 h-10">

                                </div>
                                <div className="flex-[1_1_0%]"></div>
                                <div className="flex-[4_1_0%] bg-default-200 rounded-xl py-1.5 px-3 h-10">

                                </div>
                            </div>
                            <div className="flex-[1_1_0%] flex gap-2 items-end w-full">
                                <div className="flex-[1_1_0%] pl-1"></div>
                                <div className="flex-[5_1_0%] bg-default-200 rounded-xl py-1.5 px-3 h-10">

                                </div>
                            </div>
                            <div className="flex-[1_1_0%] flex gap-2 items-end w-full">
                                <div className="flex-auto bg-default-200 rounded-xl py-1 px-3 h-10">

                                </div>
                            </div>
                            <div className="flex-[1_1_0%] flex gap-2 items-end w-full">
                                <div className="flex-auto bg-default-200 rounded-xl py-1 px-3 h-10">

                                </div>
                            </div>
                        </div>
                        <div className="flex-initial flex flex-col items-center gap-2 h-full">
                            <div className="h-10 w-10 bg-default-300 rounded-xl"></div>
                            <div className="h-10 w-10 bg-default-300 rounded-xl"></div>
                            <div className="h-10 w-10 bg-default-300 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </CardBody>
            <Divider/>
            <CardFooter>
                <div className="flex flex-col gap-3 h-full w-full">
                    <div className="flex items-center justify-between gap-unit-2 h-full w-full">
                        <div className="h-5 w-20 bg-default-300 rounded-xl"></div>
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) =>
                                <StarOutlinedIcon key={index} size="sm" className={"text-default-400"}/>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 h-full w-full">
                    <div className="flex-initial h-4 w-10 rounded-xl bg-default-200"></div>
                        <div className="flex-initial h-20 w-full rounded-lg bg-default-200"></div>
                        <div className="flex flex-initial gap-4 items-center justify-between w-full">
                            <div className="flex-[1_1_0%] h-10 w-10 bg-default-300 rounded-xl"></div>
                            <div className="flex-[1_1_0%] h-10 w-10 bg-default-300 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export default function ApplicantCard({displayCard, setDisplayCard, cardID, tableInfo, setTableInfo, cardScore, setApplicantIDs}) {
    return (
        <div>
            {displayCard ? <InfoCard cardID={cardID} tableInfo={tableInfo} setTableInfo={setTableInfo} cardScore={cardScore} setDisplayCard={setDisplayCard} setApplicantIDs={setApplicantIDs} /> : <EmptyCard/>}
        </div>
    );
}