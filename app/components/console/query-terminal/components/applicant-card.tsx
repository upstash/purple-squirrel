import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Link} from "@nextui-org/link";
import {Divider} from "@nextui-org/divider";
import {Textarea} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import { MarkGithubIcon } from "@primer/octicons-react";
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import {Chip} from "@nextui-org/chip";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {Tooltip} from "@nextui-org/tooltip";
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownItem} from "@nextui-org/dropdown";
import { LOCATION_LOOKUP, APPLICANT_STATUS_OPTIONS } from "@/app/constants";
import type { ApplicantCard } from "@/types";
import { useQueryTerminal } from "@/app/managers";

import { isApplicantStatus } from "@/types/validations";
import { getApplicantStatusColor } from "@/app/utils";

function checkGithubUrl(url: string) {
    const regex = /^(https?:\/\/)?(www\.)?github.com\/.+$/;
    return regex.test(url);
}

function checkLinkedInUrl(url: string) {
    const regex = /^(https?:\/\/)?(www\.)?linkedin.com\/in\/.+$/;
    return regex.test(url);
}

function checkWebsiteUrl(url: string) {
    const regex = /^(https?:\/\/)?([A-Za-z0-9-]+\.)?[A-Za-z0-9-]+\.[A-Za-z0-9-]+(\/\S*)?$/;
    return regex.test(url);
}

function checkMailAddress(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);

}

function InfoCard() {
    const { applicantCard, setApplicantCard, setApplicants, positions } = useQueryTerminal();
    if (!applicantCard.display) {
        return null;
    }
    const applicantID = applicantCard.id;
    const applicantScore = Math.round(applicantCard.score * 100);
    const applicant = applicantCard;
    const applicantName = applicant.applicantInfo.name;
    const applicantCover = applicant.applicantInfo.cover;
    const applicantPositionID = applicant.id;
    const applicantPositionTitle = positions.find((position) => position.id === applicant.positionId)?.name;
    const applicantYOE = applicant.yoe;
    const applicantLocation = applicant.countryCode ? LOCATION_LOOKUP[applicant.countryCode] : "Unknown";
    const applicantEmail = applicant.applicantInfo.contact.email;
    const applicantPhone = applicant.applicantInfo.contact.phone;
    const applicantResume = applicant.resumeInfo.uploadthing.url;
    const applicantWebsite = applicant.applicantInfo.urls?.website;
    const applicantLinkedIn = applicant.applicantInfo.urls?.linkedin;
    const applicantGithub = applicant.applicantInfo.urls?.github;
    const applicantStatus = applicant.status;
    const applicantStars = applicant.stars;
    const applicantNotes = applicant.applicantInfo.notes;
    return (
        <Card className="max-w-[400px] h-full flex flex-col shadow-none">
            <CardHeader className="flex-initial flex gap-3">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                            <p className="text-2xl">{applicantName}</p>
                            <p className="text-small text-default-400">{applicantPositionTitle}</p>
                        </div>
                        <p className={(applicantScore > 89) ? "text-bold text-6xl bg-gradient-to-r from-secondary to-secondary-400 bg-clip-text text-transparent" : (applicantScore > 79) ? "text-bold text-6xl bg-gradient-to-r from-success to-success-300 bg-clip-text text-transparent" : (applicantScore > 49) ? "text-bold text-6xl bg-gradient-to-r from-warning to-warning-300 bg-clip-text text-transparent" : "text-bold text-6xl bg-gradient-to-r from-danger to-danger-300 bg-clip-text text-transparent"}>{applicantScore}</p>
                    </div>
                </div>
            </CardHeader>
            <Divider className="flex-initial"/>
            <CardBody className="flex-auto">
                <div className="flex flex-col gap-3 h-full py-1">
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
                            {
                                applicantCover && applicantCover.length > 0 && (
                                    <div className="flex gap-2 items-end w-full">
                                        <div className="flex-auto border-default-200 border-2 rounded-medium py-1 px-3">
                                            <div className="flex flex-col">
                                                <p className="text-xs text-default-300">Cover Note</p>
                                                <p className="text-small text-bold">{applicantCover}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="flex-initial flex flex-col items-center justify-between">
                            <div className="flex-initial flex flex-col items-center gap-2">
                                {
                                    applicantResume
                                    ?
                                        <Button isIconOnly isExternal href={applicantResume} as={Link} color="danger">
                                            <InsertDriveFileOutlinedIcon fontSize="medium" />
                                        </Button>
                                    :
                                        null
                                }
                                {
                                    applicantEmail && checkMailAddress(applicantEmail)
                                    ?
                                        <Button isIconOnly isExternal href={`mailto:${applicantEmail}`} as={Link} color="primary">
                                            <MailOutlineOutlinedIcon fontSize="medium"  />
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
                                            <LinkedInIcon fontSize="medium"  />
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
                                <Button isIconOnly color="danger" variant="bordered" size="md" className="mt-2"
                                    onPress={async () => {
                                        await fetch(`/api/console/delete-applicants`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({applicants: [{id: applicantID, positionId: applicantPositionID}]}),
                                        });
                                        if (applicant && applicant.applicantInfo.notes) {
                                            await fetch(`/api/console/set-applicant-notes`, {
                                                method: "POST",
                                                headers: {
                                                "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({id: applicant.id, notes: applicant.applicantInfo.notes}),
                                            });
                                        }
                                        setApplicantCard({display: false});
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
                                    <Chip className="capitalize" color={getApplicantStatusColor(applicantStatus)} size="sm" variant="solid" endContent={<ArrowDropDownOutlinedIcon/>}>
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
                                        const res = await fetch(`/api/console/update-applicants-metadata`, {
                                            method: "POST",
                                            headers: {
                                              "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({applicants: [{id: applicantID, positionId: applicantPositionID, metadata: {
                                                countryCode: applicant.countryCode,
                                                status: Array.from(keys)[0],
                                                stars: applicantStars,
                                                notes: applicantNotes,
                                                yoe: applicantYOE,
                                            }}]}),
                                          });
                                        if (!res.ok) {
                                            alert("Failed to update applicant status.");
                                            return;
                                        }
                                        setApplicants((prevApplicants) => {
                                            return prevApplicants.map((applicant) => {
                                                const newStatus = Array.from(keys)[0];
                                                if (typeof newStatus === 'string' && isApplicantStatus(newStatus) && applicant.id === applicantID) {
                                                    return { ...applicant, status: newStatus };
                                                }
                                                return applicant;
                                            });
                                        });
                                        setApplicantCard((prev) => {
                                            const newStatus = Array.from(keys)[0];
                                            if (!prev.display || !(typeof newStatus === 'string') || !isApplicantStatus(newStatus)) {
                                                return prev;
                                            }
                                            return {...prev, status: newStatus};
                                        });
                                    }
                                }
                            >
                                {APPLICANT_STATUS_OPTIONS.map((key) => 
                                    <DropdownItem key={key} textValue={key === "newApply" ? "new" : key}>
                                        <Chip className="capitalize" color={getApplicantStatusColor(applicantStatus)} size="sm" variant="solid">
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
                                        const res = await fetch(`/api/console/update-applicants-metadata`, {
                                            method: "POST",
                                            headers: {
                                              "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({applicants: [{id: applicantID, positionId: applicantPositionID, metadata: {
                                                countryCode: applicant.countryCode,
                                                status: applicantStatus,
                                                stars: index + 1,
                                                notes: applicantNotes,
                                                yoe: applicantYOE,
                                            }}]}),
                                          });
                                        if (!res.ok) {
                                            alert("Failed to update applicant stars.");
                                            return;
                                        }
                                        setApplicants((prevApplicants) => {
                                            const updatedApplicants = prevApplicants.map((applicant) => {
                                                if (applicant.id === applicantID) {
                                                    return { ...applicant, stars: index + 1 };
                                                }
                                                return applicant;
                                            });
                                            return updatedApplicants;
                                        });
                                        setApplicantCard((prev) => {
                                            if (!prev.display) {
                                                return prev;
                                            }
                                            return {...prev, stars: index + 1};
                                        });
                                    }}
                                    ><StarBorderOutlinedIcon key={index} className={"text-default"}/></Button>
                                : <Button isIconOnly key={index} variant="light" size="sm"
                                    onPress={async () => {
                                        const res = await fetch(`/api/console/update-applicants-metadata`, {
                                            method: "POST",
                                            headers: {
                                              "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({applicants: [{id: applicantID, positionId: applicantPositionID, metadata: {
                                                countryCode: applicant.countryCode,
                                                status: applicantStatus,
                                                stars: index + 1,
                                                notes: applicantNotes,
                                                yoe: applicantYOE,
                                            }}]}),
                                          });
                                        if (!res.ok) {
                                            alert("Failed to update applicant stars.");
                                            return;
                                        }
                                        setApplicants((prevApplicants) => {
                                            const updatedApplicants = prevApplicants.map((applicant) => {
                                                if (applicant.id === applicantID) {
                                                    return { ...applicant, stars: index + 1 };
                                                }
                                                return applicant;
                                            });
                                            return updatedApplicants;
                                        });
                                        setApplicantCard((prev) => {
                                            if (!prev.display) {
                                                return prev;
                                            }
                                            return {...prev, stars: index + 1};
                                        });
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
                            applicant.applicantInfo.notes = value;
                            setApplicants((prevApplicants) => {
                                return prevApplicants.map((applicant) => {
                                    if (applicant.id === applicantID) {
                                        return { ...applicant, applicantInfo: { ...applicant.applicantInfo, notes: value } };
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

export function ApplicantCard() {
    const { applicantCard } = useQueryTerminal();
    return (
        <div className="h-full">
            {applicantCard.display
                ? <InfoCard />
                : <EmptyCard />}
        </div>
    );
}