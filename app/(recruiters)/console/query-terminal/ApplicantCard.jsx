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
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {Tooltip} from "@nextui-org/tooltip";
import {ScrollShadow} from "@nextui-org/scroll-shadow";
import { card } from "@nextui-org/react";
import React, { use } from "react";
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import { locationLookup } from "@/app/utils/locations";

const statusColorMap = {
    newApply: "default",
    screening: "warning",
    assessment: "warning",
    interview: "warning",
    shortlisted: "danger",
    offer: "secondary",
    onboarding: "success",
    hired: "success",
  };

const statusArray = Object.keys(statusColorMap);

function checkGithubUrl(url) {
    if (!url || typeof url !== "string") {
        return false;
    }
    const regex = /^(https?:\/\/)?(www\.)?github.com\/.+$/;
    return regex.test(url);
}

function checkLinkedInUrl(url) {
    if (!url || typeof url !== "string") {
        return false;
    }
    const regex = /^(https?:\/\/)?(www\.)?linkedin.com\/in\/.+$/;
    return regex.test(url);
}

function checkWebsiteUrl(url) {
    if (!url || typeof url !== "string") {
        return false;
    }
    const regex = /^(https?:\/\/)?([A-Za-z0-9-]+\.)?[A-Za-z0-9-]+\.[A-Za-z0-9-]+(\/\S*)?$/;
    return regex.test(url);
}

function checkMailAddress(email) {
    if (!email || typeof email !== "string") {
        return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);

}

function InfoCard({
    setApplicants,
    cardState,
    setCardState,
}) {
    const applicantID = cardState.id;
    const applicantScore = Math.round(cardState.score * 100);
    const applicantDoc = cardState.doc;
    const applicantName = applicantDoc.name;
    const applicantPosition = applicantDoc.position;
    const applicantYOE = applicantDoc.yoe;
    const applicantLocation = locationLookup[applicantDoc.countryCode];
    const applicantDegree = applicantDoc.degree;
    const applicantSubject = applicantDoc.subject;
    const applicantUniversity = applicantDoc.university;
    const applicantEmail = applicantDoc.email;
    const applicantPhone = applicantDoc.phone;
    const applicantResume = applicantDoc.resumeUrl;
    const applicantWebsite = applicantDoc.websiteUrl;
    const applicantLinkedIn = applicantDoc.linkedinUrl;
    const applicantGithub = applicantDoc.githubUrl;
    const applicantStatus = applicantDoc.status;
    const applicantStars = applicantDoc.stars;
    const applicantNotes = applicantDoc.notes;
    return (
        <Card className="max-w-[400px] h-full flex flex-col shadow-none">
            <CardHeader className="flex-initial flex gap-3">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                            <p className="text-2xl">{applicantName}</p>
                            <p className="text-small text-default-400">{applicantPosition}</p>
                        </div>
                        <p className={(applicantScore > 89) ? "text-bold text-6xl bg-gradient-to-r from-secondary to-secondary-400 bg-clip-text text-transparent" : (applicantScore > 79) ? "text-bold text-6xl bg-gradient-to-r from-success to-success-300 bg-clip-text text-transparent" : (applicantScore > 49) ? "text-bold text-6xl bg-gradient-to-r from-warning to-warning-300 bg-clip-text text-transparent" : "text-bold text-6xl bg-gradient-to-r from-danger to-danger-300 bg-clip-text text-transparent"}>{applicantScore}</p>
                    </div>
                </div>
            </CardHeader>
            <Divider className="flex-initial"/>
            <CardBody className="flex-auto">
                <div className="flex flex-col gap-3 h-full">
                    <div className="flex gap-2">
                        <div className="flex-auto flex flex-col gap-2">
                            <div className="flex gap-2 w-full">
                                <div className="flex-initial border-default-200 border-2 rounded-medium py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">YOE</p>
                                        <p className="text-small text-bold">{applicantYOE}</p>
                                    </div>
                                </div>
                                <div className="flex-auto border-default-200 border-2 rounded-medium py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">Location</p>
                                        <p className="text-small text-bold">{applicantLocation}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <div className="flex-inital border-default-200 border-2 rounded-medium py-1.5 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-small text-bold">{applicantDegree}</p>
                                    </div>
                                </div>
                                <h1 className="flex-inital">in</h1>
                                <div className="flex-auto border-default-200 border-2 rounded-medium py-1.5 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-small text-bold">{applicantSubject}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <h1 className="flex-inital pl-1">from</h1>
                                <div className="flex-auto border-default-200 border-2 rounded-medium py-1.5 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-small text-bold">{applicantUniversity}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <div className="flex-auto border-default-200 border-2 rounded-medium py-1 px-3">
                                    <div className="flex min-h-3 flex-col">
                                        <p className="text-xs text-default-300">Email</p>
                                        <p className="text-small text-bold">{applicantEmail}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end w-full">
                                <div className="flex-auto border-default-200 border-2 rounded-medium py-1 px-3">
                                    <div className="flex flex-col">
                                        <p className="text-xs text-default-300">Phone</p>
                                        <p className="text-small text-bold">{applicantPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-initial flex flex-col items-center justify-between">
                            <div className="flex-initial flex flex-col items-center gap-2">
                                {
                                    applicantResume
                                    ?
                                        <Button isIconOnly isExternal href={applicantResume} as={Link} color="danger">
                                            <InsertDriveFileOutlinedIcon size={28} />
                                        </Button>
                                    :
                                        null
                                }
                                {
                                    applicantEmail && checkMailAddress(applicantEmail)
                                    ?
                                        <Button isIconOnly isExternal href={`mailto:${applicantEmail}`} as={Link} color="primary">
                                            <MailOutlineOutlinedIcon size={28} />
                                        </Button>
                                    :
                                        null
                                }
                                {
                                    applicantWebsite && checkWebsiteUrl(applicantWebsite)
                                    ?
                                        <Button isIconOnly isExternal href={`/external-ref?externalLink=${applicantWebsite}`} as={Link}><LanguageOutlinedIcon /></Button>
                                    :
                                        null
                                }
                                {
                                    applicantLinkedIn && checkLinkedInUrl(applicantLinkedIn)
                                    ?
                                        <Button isIconOnly isExternal href={applicantLinkedIn} as={Link}>
                                            <LinkedInIcon size={28} />
                                        </Button>
                                    :
                                        null
                                }
                                {
                                    applicantGithub && checkGithubUrl(applicantGithub)
                                    ?
                                        <Button isIconOnly isExternal href={applicantGithub} as={Link}>
                                            <MarkGithubIcon size={28} />
                                        </Button>
                                    :
                                        null
                                }
                            </div>
                            <Tooltip content="Delete Applicant" color={"danger"} delay={400} closeDelay={600}>
                                <Button isIconOnly color="danger" variant="bordered" size="md"
                                    onPress={async () => {
                                        await fetch(`/api/delete-applicants`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ids: [cardID]}),
                                        });
                                        if (cardState.doc && cardState.doc.notes) {
                                            await fetch(`/api/set-applicant-notes`, {
                                                method: "POST",
                                                headers: {
                                                "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({id: cardState.id, notes: cardState.doc.notes}),
                                            });
                                        }
                                        setCardState((prev) => {return {...prev, display: false};});
                                        setApplicants((prev) => {return prev.filter((triplet) => triplet.id !== applicantID);});
                                    }}
                                >
                                    <DeleteOutlinedIcon />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </CardBody>
            <Divider className="flex-initial"/>
            <CardFooter className="flex-initial">
                <div className="flex flex-col h-full w-full gap-4">
                    <div className="flex items-center justify-between gap-unit-2">
                        <Dropdown className="min-w-0 w-fit">
                            <DropdownTrigger>
                                <button>
                                    <Chip className="capitalize" color={statusColorMap[applicantStatus]} size="sm" variant="solid" endContent={<ArrowDropDownOutlinedIcon/>}>
                                        {applicantStatus === "newApply" ? "New" : applicantStatus}
                                    </Chip>
                                </button>
                            </DropdownTrigger>
                            <DropdownMenu 
                                aria-label="Single selection example"
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={new Set([applicantStatus])}
                                className="min-w-0 w-fit"
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
                                        <Chip className="capitalize" color={statusColorMap[key]} size="sm" variant="solid">
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
                    <Textarea
                        label="Notes"
                        radius="md"
                        placeholder="Enter notes..."
                        value={applicantNotes || ""}
                        onValueChange={(value) => {
                            cardState.doc.notes = value;
                            setApplicants((prevApplicants) => {
                                return prevApplicants.map((applicant) => {
                                    if (applicant.id === applicantID) {
                                        return { ...applicant, notes: value };
                                    }
                                    return applicant;
                                });
                            });
                        }}
                        className="w-full h-full"

                        />
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
                                <div className="h-8 w-20 bg-default-200 rounded-3xl"></div>
                                <div className="h-8 w-40 bg-default-200 rounded-3xl"></div>
                            </div>
                            <div className="h-4 w-40 bg-default-100 rounded-3xl"></div>
                        </div>
                        <div className="h-14 w-16 bg-default-200 rounded-medium"></div>
                    </div>
                </div>
            </CardHeader>
            <Divider/>
            <CardBody>
                <div className="flex flex-col gap-3 h-full">
                    <div className="flex gap-2 h-full">
                        <div className="flex-auto flex flex-col gap-2 h-full">
                            <div className="flex-[1_1_0%] flex gap-2 w-full">
                                <div className="flex-[1_1_0%] bg-default-100 rounded-medium py-1 px-3 h-10">

                                </div>
                                <div className="flex-[1_1_0%] bg-default-100 rounded-medium py-1 px-3 h-10">

                                </div>
                                <div className="flex-[10_1_0%] bg-default-100 rounded-medium py-1 px-3 h-10">

                                </div>
                            </div>
                            <div className="flex-[1_1_0%] flex gap-2 items-end w-full">
                                <div className="flex-[2_1_0%] bg-default-100 rounded-medium py-1.5 px-3 h-10">

                                </div>
                                <div className="flex-[1_1_0%]"></div>
                                <div className="flex-[4_1_0%] bg-default-100 rounded-medium py-1.5 px-3 h-10">

                                </div>
                            </div>
                            <div className="flex-[1_1_0%] flex gap-2 items-end w-full">
                                <div className="flex-[1_1_0%] pl-1"></div>
                                <div className="flex-[5_1_0%] bg-default-100 rounded-medium py-1.5 px-3 h-10">

                                </div>
                            </div>
                            <div className="flex-[1_1_0%] flex gap-2 items-end w-full">
                                <div className="flex-auto bg-default-100 rounded-medium py-1 px-3 h-10">

                                </div>
                            </div>
                            <div className="flex-[1_1_0%] flex gap-2 items-end w-full">
                                <div className="flex-auto bg-default-100 rounded-medium py-1 px-3 h-10">

                                </div>
                            </div>
                        </div>
                        <div className="flex-initial flex flex-col items-center gap-2 h-full">
                            <div className="h-10 w-10 bg-default-200 rounded-medium"></div>
                            <div className="h-10 w-10 bg-default-200 rounded-medium"></div>
                            <div className="h-10 w-10 bg-default-200 rounded-medium"></div>
                        </div>
                    </div>
                </div>
            </CardBody>
            <Divider/>
            <CardFooter>
                <div className="flex flex-col gap-3 h-full w-full">
                    <div className="flex items-center justify-between gap-unit-2 h-full w-full">
                        <div className="h-5 w-20 bg-default-200 rounded-medium"></div>
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) =>
                                <Button isIconOnly key={index} variant="light" size="sm">
                                    <StarOutlinedIcon key={index} className={"text-default-200"}/>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 h-full w-full">
                    <div className="flex-initial h-4 w-10 rounded-medium bg-default-100"></div>
                        <div className="flex-initial h-20 w-full rounded-medium bg-default-100"></div>
                        <div className="flex flex-initial gap-4 items-center justify-between w-full">
                            <div className="flex-[1_1_0%] h-10 w-10 bg-default-200 rounded-medium"></div>
                            <div className="flex-[1_1_0%] h-10 w-10 bg-default-200 rounded-medium"></div>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export default function ApplicantCard({
    setApplicants,
    cardState,
    setCardState,
}) {
    return (
        <div className="h-full">
            {cardState.display
                ? <InfoCard
                    setApplicants={setApplicants}
                    cardState={cardState}
                    setCardState={setCardState}
                    />
                : <EmptyCard />}
        </div>
    );
}