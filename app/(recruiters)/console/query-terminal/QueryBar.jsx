'use client'

import React from 'react';
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover";
import {Slider} from "@nextui-org/slider";
import {Tooltip} from "@nextui-org/tooltip";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Divider } from "@nextui-org/react";
import {Skeleton} from "@nextui-org/skeleton";
import { v4 as uuidv4 } from 'uuid';
import {Chip} from "@nextui-org/chip";
import {Switch} from "@nextui-org/switch";
import {ChevronDownIcon} from "@/app/utils/ChevronDownIcon";
import {ScrollShadow} from "@nextui-org/scroll-shadow";
import {Accordion, AccordionItem} from "@nextui-org/accordion";

import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import NextWeekOutlinedIcon from '@mui/icons-material/NextWeekOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import filterCoder from "@/app/utils/filterCoder";

import { locations, locationLookup } from "@/app/utils/locations";
import {capitalize} from "@/app/utils/utils";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";

const statusOptions = [
    {name: "All", uid: "All"},
    {name: "New", uid: "newApply"},
    {name: "Screening", uid: "screening"},
    {name: "Assessment", uid: "assessment"},
    {name: "Interview", uid: "interview"},
    {name: "Shortlisted", uid: "shortlisted"},
    {name: "Offer", uid: "offer"},
    {name: "Onboarding", uid: "onboarding"},
    {name: "Hired", uid: "hired"},
  ];
  
const statusSet = new Set(statusOptions.map((status) => status.uid));
statusSet.delete("All");

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

const degreeColorMap = {
    "Unknown": "default",
    "No Degree": "default",
    "Associate's": "warning",
    "Bachelor's": "success",
    "Master's": "primary",
    "Doctoral": "secondary",
};

const statusArray = Object.keys(statusColorMap);
const degreeArray = Object.keys(degreeColorMap);

const starsOptions = [
    {name: "No Filter", uid: "No Filter"},
    {name: "1+", uid: "1"},
    {name: "2+", uid: "2"},
    {name: "3+", uid: "3"},
    {name: "4+", uid: "4"},
    {name: "5+", uid: "5"},
];

const starsSet = new Set(["No Filter"]);

const eqSet = (xs, ys) =>
    xs.size === ys.size &&
    [...xs].every((x) => ys.has(x));

const inSet = (xs, ys) =>
    [...xs].every((x) => ys.has(x));

export default function QueryBar({
    setApplicants,
    tableLoading,
    setTableLoading,
    queryBarLoading,
    filter,
    setFilter,
    searchSettings,
    setSearchSettings,
    tags,
    setTags,
    tagText,
    setTagText,
    cardState,
    setCardState,
    setRecentQueriesState,
    setSavedQueriesState,
    settingsModalOpen,
    setSettingsModalOpen,
    positions,
    positionSearchText,
    setPositionSearchText,
    filterModalOpen,
    setFilterModalOpen,
    locationSearchText,
    setLocationSearchText,
    positionFilterWarningMade,
    setPositionFilterWarningMade,
    warningModelOpen,
    setWarningModelOpen,
  }) {
    const itemClasses = {
        base: "py-0 w-full",
        title: "font-normal text-medium",
        trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
        indicator: "text-medium",
        content: "text-small px-2",
      };
    

    return (
            <div className="bg-default-50 rounded-medium px-unit-2 py-unit-3 h-full flex flex-col">
                <div className="flex items-center">
                    {
                        queryBarLoading
                        ?
                            <Skeleton className="flex-auto mx-unit-1 h-unit-10 rounded-medium"></Skeleton>
                        :
                            <div className="flex-auto px-unit-1 w-full">
                                <Input label={null} size="sm" radius="md" className="w-full" placeholder="Write qualities, separate with Enter Key..." classNames={{inputWrapper: "h-unit-10 bg-default-100"}} value={tagText} onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        setTags((prev) => [...prev, tagText]);
                                        setTagText('');
                                    }
                                }} onValueChange={(value) => setTagText(value)}/>
                            </div>
                    }
                    {
                        queryBarLoading
                        ?
                            <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-[5.75rem] rounded-medium"></Skeleton>
                        :
                            (
                                <div className="flex-initial px-unit-1">
                                    <Button
                                    color={searchSettings.flash ? "primary" : "secondary"}
                                    size="md"
                                    radius="md"
                                    variant="solid"
                                    className="text-md pr-5"
                                    startContent={searchSettings.flash ? <BoltIcon /> : <SearchOutlinedIcon className="text-2xl" />}
                                    onPress={async () => {
                                        if (tableLoading.status) {
                                            return;
                                        }
                                        if (tags.length === 0) {
                                            return;
                                        }
                                        if (!positionFilterWarningMade && filter.positionFilter.length === 0 && positions.length > 1) {
                                            setPositionFilterWarningMade(true);
                                            setWarningModelOpen(true);
                                            return;
                                        }
                                        setTableLoading({status: true, color: (searchSettings.flash ? "primary" : "secondary") , text: "Finding Applicants..."});
                                        try {
                                            const data = {
                                                tags: tags,
                                                filter: filterCoder(filter),
                                                searchSettings: searchSettings,
                                                rankType: searchSettings.flash ? "flash" : "deep",
                                            }
                                            const queryID = uuidv4();
                                            setRecentQueriesState((prev) => {return {...prev, recentQueries: [{id: queryID, query: tags, filter: filter}, ...prev.recentQueries]};});
                                            const [rankResponse, redisResponse] = await Promise.all([fetch((searchSettings.flash ? "/api/flash-rank" : "/api/deep-rank"), {
                                                method: "POST",
                                                headers: {
                                                "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify(data)
                                            }), fetch("/api/push-recent-query", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({id: queryID, query: tags, filter: filter})
                                            })]);
                                            const rankResponseData = await rankResponse.json();
                                            console.log(rankResponseData);
                                            if (rankResponseData.status === 200) {
                                                const rankApplicants = searchSettings.flash ? rankResponseData.flashRankedApplicants : rankResponseData.deepRankedApplicants;
                                                setApplicants(rankApplicants);
                                                const displayTripletArray = rankApplicants.filter((triplet) => triplet.id === cardState.id);
                                                if (displayTripletArray.length > 0) {
                                                    setCardState((prev) => {return {...prev, score: displayTripletArray[0].score}});
                                                } else {
                                                    if (cardState.doc && cardState.doc.notes) {
                                                        await fetch(`/api/set-applicant-notes`, {
                                                            method: "POST",
                                                            headers: {
                                                            "Content-Type": "application/json",
                                                            },
                                                            body: JSON.stringify({id: cardState.id, notes: cardState.doc.notes}),
                                                        });
                                                    }
                                                    setCardState((prev) => {return {...prev, display: false}});
                                                }
                                                setTableLoading((prev) => {return {...prev, status: false}});
                                            } else if (rankResponseData.status === 500) {
                                                console.error(rankResponseData.message);
                                            } else {
                                                console.error("Unknown error");
                                            }
                                            setTableLoading((prev) => {return {...prev, status: false}});
                                        } catch (error) {
                                        console.error(error);
                                        setTableLoading((prev) => {return {...prev, status: false}});
                                        }
                                    }}

                                    >
                                        Search
                                    </Button>
                                </div>
                            )
                    }
                    <Divider className="flex-initial mx-unit-1" orientation="vertical" />
                    {
                        queryBarLoading
                        ?
                            <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-unit-10 rounded-medium"></Skeleton>
                        :
                            (
                                <div className="flex-initial px-unit-1">
                                <Popover placement="bottom" isOpen={filterModalOpen} onOpenChange={async (open) => {
                                    setFilterModalOpen(open);
                                    /*
                                    if (!open) {
                                        await fetch("/api/save-search-settings", {
                                            method: "POST",
                                            headers: {
                                            "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(searchSettings)
                                        });
                                    }*/
                                    }}>
                                    <PopoverTrigger>
                                    <Button isIconOnly color="danger" size="md" variant="solid">
                                        <Tooltip content="Filters" color={"danger"} delay={400} closeDelay={600}>
                                        <FilterAltOutlinedIcon />
                                        </Tooltip>
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                    <div className="flex flex-col gap-2 px-1 py-2">
                                    <div className="w-full text-2xl font-bold">Filters</div>
                                    <Divider />
                                    <div className="flex flex-col w-full rounded-medium bg-default-50 p-2 shadow-md border border-default-100">
                                        <Input isClearable placeholder="Enter a position..." onClear={() => {setPositionSearchText((prev) => {return "";})}} size="sm" className="w-full" value={positionSearchText} onValueChange={(value) => setPositionSearchText((prev) => {return value;})} classNames={{inputWrapper: "h-unit-10 bg-default-100"}}></Input>
                                        {
                                            positionSearchText.length < 3
                                            ?
                                                filter.positionFilter.length === 0
                                                ?
                                                    null
                                                :
                                                    <ScrollShadow size={5} className="max-h-24 flex flex-col gap-2 mt-2">
                                                        <div className='flex flex-col'>
                                                            {filter.positionFilter.map((position) => {
                                                                return (
                                                                <Button size="sm" key={position} variant="light" color="secondary" onPress={
                                                                    () => {
                                                                    setFilter((prev) => {
                                                                        return {...prev, positionFilter: prev.positionFilter.filter((id) => {
                                                                            return id !== position;
                                                                        })};
                                                                    });
                                                                    }
                                                                }>
                                                                    <div className="flex justify-between w-full text-sm text-left">
                                                                        {position}
                                                                    </div>
                                                                </Button>
                                                                );
                                                            })}
                                                        </div>
                                                    </ScrollShadow>
                                            : 
                                                <ScrollShadow size={5} className="max-h-24 flex flex-col gap-1 mt-2">
                                                    <div className='flex flex-col'>
                                                        {positions.filter((position) => {
                                                        return position.name.toLowerCase().includes(positionSearchText.toLowerCase());
                                                        }).map((position) => {
                                                        const checked = filter.positionFilter.includes(position.name);
                                                        return (
                                                            <Button size="sm" key={position.name} variant="light" color={checked ? "secondary" : "default"} onPress={
                                                            () => {
                                                                if (checked) {
                                                                    setFilter((prev) => {
                                                                        return {...prev, positionFilter: prev.positionFilter.filter((id) => {
                                                                            return id !== position.name;
                                                                        })};
                                                                    });
                                                                } else {
                                                                    setFilter((prev) => {
                                                                        return {...prev, positionFilter: [...prev.positionFilter, position.name]};
                                                                    });
                                                                }
                                                            
                                                            }}>
                                                            <div className="flex justify-between w-full text-sm text-left">
                                                                    {position.name}
                                                                </div>
                                                            </Button>
                                                        );
                                                        })}
                                                    </div>
                                                </ScrollShadow>
                                        }
                                    </div>
                                    <Accordion
                                        showDivider={false}
                                        className="p-2 flex flex-col gap-1 w-full w-[25vw]"
                                        variant="shadow"
                                        itemClasses={itemClasses}
                                        >
                                        <AccordionItem
                                            key="1"
                                            aria-label="Location"
                                            classNames={{ subtitle: (filter.countryCodeFilter.length === 0 ? null : "text-primary")}}
                                            startContent={<PublicOutlinedIcon className="text-primary" />}
                                            subtitle={filter.countryCodeFilter.length === 0 ? "Any" : `${filter.countryCodeFilter.length} Selected`}
                                            title="Location"
                                        >
                                            <div className="flex flex-col px-1 py-2 w-full">
                                                <Input isClearable placeholder="Enter a location..." onClear={() => {setLocationSearchText((prev) => {return "";})}} size="sm" className="w-full" value={locationSearchText} onValueChange={(value) => setLocationSearchText((prev) => {return value;})} classNames={{inputWrapper: "h-unit-10 bg-default-100"}}></Input>
                                                {
                                                    locationSearchText.length < 3
                                                    ?
                                                        filter.countryCodeFilter.length === 0
                                                        ?
                                                            null
                                                        :
                                                            <ScrollShadow size={5} className="max-h-24 flex flex-col gap-2 mt-2">
                                                                <div className='flex flex-col'>
                                                                    {filter.countryCodeFilter.map((countryCode) => {
                                                                        return (
                                                                        <Button size="sm" key={countryCode} variant="light" color="primary" onPress={
                                                                            () => {
                                                                                setFilter((prev) => {
                                                                                    return {...prev, countryCodeFilter: prev.countryCodeFilter.filter((id) => {
                                                                                        return id !== countryCode;
                                                                                    })};
                                                                                });
                                                                            }
                                                                        }>
                                                                            <div className="flex justify-between w-full text-sm text-left">
                                                                                {locationLookup[countryCode]}
                                                                            </div>
                                                                        </Button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </ScrollShadow>
                                                    : 
                                                    <ScrollShadow size={5} className="max-h-24 flex flex-col gap-1 mt-2">
                                                        <div className='flex flex-col'>
                                                            {locations.filter((location) => {
                                                            return location.name.toLowerCase().includes(locationSearchText.toLowerCase());
                                                            }).map((location) => {
                                                            const checked = filter.countryCodeFilter.includes(location.iso2);
                                                            return (
                                                                <Button size="sm" key={location.iso2} variant="light" color={checked ? "primary" : "default"} onPress={
                                                                () => {
                                                                    if (checked) {
                                                                        setFilter((prev) => {
                                                                            return {...prev, countryCodeFilter: prev.countryCodeFilter.filter((id) => {
                                                                                return id !== location.iso2;
                                                                            })};
                                                                        });
                                                                    } else {
                                                                        setFilter((prev) => {
                                                                            return {...prev, countryCodeFilter: [...prev.countryCodeFilter, location.iso2]};
                                                                        });
                                                                    }
                                                                
                                                                }}>
                                                                <div className="flex justify-between w-full text-sm text-left">
                                                                        {location.name}
                                                                    </div>
                                                                </Button>
                                                            );
                                                            })}
                                                        </div>
                                                    </ScrollShadow>
                                                }
                                            </div>
                                        </AccordionItem>
                                        <AccordionItem
                                            key="2"
                                            aria-label="Status"
                                            classNames={{ subtitle: (filter.statusFilter.length === 0 ? null : "text-success")}}
                                            startContent={<NextWeekOutlinedIcon className="text-success" />}
                                            subtitle={filter.statusFilter.length === 0 ? "Any" : `${filter.statusFilter.length} Selected`}
                                            title="Status"
                                        >
                                            <div className='flex flex-col gap-2 justify-center'>
                                                <div className='flex flex-row gap-2 justify-center'>
                                                    {["newApply", "screening", "assessment", "interview"].map((key) => 
                                                        {
                                                            const noFilter = filter.statusFilter.length === 0;
                                                            const statusChecked = filter.statusFilter.includes(key);
                                                            return (
                                                                <button key={key} onClick={
                                                                    () => {
                                                                        if (noFilter) {
                                                                            setFilter((prev) => {
                                                                                return {...prev, statusFilter: statusArray.filter((id) => {
                                                                                    return id !== key;
                                                                                })};
                                                                            });
                                                                        } else {
                                                                            if (statusChecked) {
                                                                                setFilter((prev) => {
                                                                                    return {...prev, statusFilter: prev.statusFilter.filter((id) => {
                                                                                        return id !== key;
                                                                                    })};
                                                                                });
                                                                            } else {
                                                                                setFilter((prev) => {
                                                                                    return {...prev, statusFilter: (prev.statusFilter.length === 7 ? [] : [...prev.statusFilter, key])};
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                                }>
                                                                    <Chip className="capitalize" color={noFilter || statusChecked ? statusColorMap[key] : "default"} size="sm" variant={noFilter || statusChecked ? "solid" : "bordered"}>
                                                                        {key === "newApply" ? "New" : key}
                                                                    </Chip>
                                                                </button>
                                                            )
                                                        }
                                                    )}
                                                </div>
                                                <div className='flex flex-row gap-2 justify-center'>
                                                    {["shortlisted", "offer", "onboarding", "hired"].map((key) => 
                                                        {
                                                            const noFilter = filter.statusFilter.length === 0;
                                                            const statusChecked = filter.statusFilter.includes(key);
                                                            return (
                                                                <button key={key} onClick={
                                                                    () => {
                                                                        if (noFilter) {
                                                                            setFilter((prev) => {
                                                                                return {...prev, statusFilter: statusArray.filter((id) => {
                                                                                    return id !== key;
                                                                                })};
                                                                            });
                                                                        } else {
                                                                            if (statusChecked) {
                                                                                setFilter((prev) => {
                                                                                    return {...prev, statusFilter: prev.statusFilter.filter((id) => {
                                                                                        return id !== key;
                                                                                    })};
                                                                                });
                                                                            } else {
                                                                                setFilter((prev) => {
                                                                                    return {...prev, statusFilter: (prev.statusFilter.length === 7 ? [] : [...prev.statusFilter, key])};
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                                }>
                                                                    <Chip className="capitalize" color={noFilter || statusChecked ? statusColorMap[key] : "default"} size="sm" variant={noFilter || statusChecked ? "solid" : "bordered"}>
                                                                        {key === "newApply" ? "New" : key}
                                                                    </Chip>
                                                                </button>
                                                            )
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </AccordionItem>
                                        <AccordionItem
                                            key="3"
                                            aria-label="Stars"
                                            classNames={{ subtitle: (filter.starsFilter === -1 ? null : "text-warning")}}
                                            startContent={<StarBorderOutlinedIcon className="text-warning" />}
                                            subtitle={filter.starsFilter === -1 ? "Any" : `${filter.starsFilter}+`}
                                            title="Stars"
                                        >
                                            <div className='flex flex-row gap-2 justify-center'>
                                                {[-1, 1, 2, 3, 4, 5].map((key) => {
                                                    const starsChecked = filter.starsFilter === key;
                                                    return (
                                                        <button key={key} onClick={
                                                            () => {
                                                                setFilter((prev) => {
                                                                    return {...prev, starsFilter: key};
                                                                });
                                                            }
                                                        }>
                                                            <Chip color={key === -1 || !starsChecked ? "default" : "warning"} size="sm" variant={starsChecked ? "solid" : "bordered"}>
                                                                {key === -1 ? "No Filter" : `${key}+`}
                                                            </Chip>
                                                        </button>
                                                        )
                                                    }
                                                    
                                                )}
                                            </div>
                                        </AccordionItem>
                                        <AccordionItem
                                            key="4"
                                            aria-label="Experience"
                                            classNames={{ subtitle: (filter.yoeFilter.min === -1 && filter.yoeFilter.max === -1 ? null: "text-secondary")}}
                                            startContent={<WorkHistoryOutlinedIcon className="text-secondary" />}
                                            subtitle={filter.yoeFilter.min === -1 && filter.yoeFilter.max === -1 ? "Any" : `${filter.yoeFilter.min === -1 ? "Any" : filter.yoeFilter.min} - ${filter.yoeFilter.max === -1 ? "Any" : filter.yoeFilter.max}`}
                                            title="Experience"
                                        >
                                            <div className="flex gap-4 justify-center">
                                                <div className="flex gap-2 items-center justify-center">
                                                    <div>Minimum</div>
                                                    <Input size='sm' label="Years" className="w-16" type="number" value={filter.yoeFilter.min === -1 ? null : filter.yoeFilter.min} placeholder="Any" onValueChange={
                                                        (value) => {
                                                            setFilter((prev) => {
                                                                return {...prev, yoeFilter: {...prev.yoeFilter, min: (value === "" ? -1 : value)}};
                                                            });
                                                        }
                                                    }/>
                                                </div>
                                                <div className="flex gap-2 items-center justify-center">
                                                    <div>Maximum</div>
                                                    <Input size='sm' label="Years" className="w-16" type="number" value={filter.yoeFilter.max === -1 ? null : filter.yoeFilter.max} placeholder="Any" onValueChange={
                                                        (value) => {
                                                            setFilter((prev) => {
                                                                return {...prev, yoeFilter: {...prev.yoeFilter, max: (value === "" ? -1 : value)}};
                                                            });
                                                        }
                                                    }/>
                                                </div>
                                            </div>
                                        </AccordionItem>
                                        <AccordionItem
                                            key="5"
                                            aria-label="Degree"
                                            classNames={{ subtitle: ((filter.degreeFilter.length === 0 ? null: "text-foreground"))}}
                                            startContent={<AccountBalanceOutlinedIcon className="text-foreground" />}
                                            subtitle={filter.degreeFilter.length === 0 ? "Any" : `${filter.degreeFilter.length} Selected`}
                                            title="Degree"
                                        >
                                            <div className="flex flex-col gap-2 items-center">
                                                <div className='flex flex-row gap-2 justify-center'>
                                                    {["Unknown", "No Degree", "Associate's"].map((key) => 
                                                        {
                                                            const noFilter = filter.degreeFilter.length === 0;
                                                            const degreeChecked = filter.degreeFilter.includes(key);
                                                            console.log(filter.degreeFilter)
                                                            return (
                                                                <button key={key} onClick={
                                                                    () => {
                                                                        if (noFilter) {
                                                                            setFilter((prev) => {
                                                                                return {...prev, degreeFilter: degreeArray.filter((id) => {
                                                                                    return id !== key;
                                                                                })};
                                                                            });
                                                                        } else {
                                                                            if (degreeChecked) {
                                                                                setFilter((prev) => {
                                                                                    return {...prev, degreeFilter: prev.degreeFilter.filter((id) => {
                                                                                        return id !== key;
                                                                                    })};
                                                                                });
                                                                            } else {
                                                                                setFilter((prev) => {
                                                                                    return {...prev, degreeFilter: (prev.degreeFilter.length === 5 ? [] : [...prev.degreeFilter, key])};
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                                }>
                                                                    <Chip className="capitalize" color={noFilter ||degreeChecked ? degreeColorMap[key] : "default"} size="sm" variant={noFilter || degreeChecked ? "solid" : "bordered"}>
                                                                        {key}
                                                                    </Chip>
                                                                </button>
                                                            )
                                                        }
                                                    )}
                                                </div>
                                                <div className='flex flex-row gap-2 justify-center'>
                                                    {["Bachelor's", "Master's", "Doctoral"].map((key) => 
                                                        {
                                                            const noFilter = filter.degreeFilter.length === 0;
                                                            const degreeChecked = filter.degreeFilter.includes(key);
                                                            return (
                                                                <button key={key} onClick={
                                                                    () => {
                                                                        if (noFilter) {
                                                                            setFilter((prev) => {
                                                                                return {...prev, degreeFilter: degreeArray.filter((id) => {
                                                                                    return id !== key;
                                                                                })};
                                                                            });
                                                                        } else {
                                                                            if (degreeChecked) {
                                                                                setFilter((prev) => {
                                                                                    return {...prev, degreeFilter: prev.degreeFilter.filter((id) => {
                                                                                        return id !== key;
                                                                                    })};
                                                                                });
                                                                            } else {
                                                                                setFilter((prev) => {
                                                                                    return {...prev, degreeFilter: (prev.degreeFilter.length === 5 ? [] : [...prev.degreeFilter, key])};
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                                }>
                                                                    <Chip className="capitalize" color={noFilter ||degreeChecked ? degreeColorMap[key] : "default"} size="sm" variant={noFilter || degreeChecked ? "solid" : "bordered"}>
                                                                        {key}
                                                                    </Chip>
                                                                </button>
                                                            )
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </AccordionItem>
                                        <AccordionItem
                                            key="6"
                                            aria-label="Graduation"
                                            classNames={{ subtitle: ((filter.graduationDateFilter.min.year === -1 && filter.graduationDateFilter.max.year === -1 ? null: "text-danger"))}}
                                            startContent={<SchoolOutlinedIcon className="text-danger" />}
                                            subtitle={filter.graduationDateFilter.min.year === -1 && filter.graduationDateFilter.max.year === -1 ? "Any" : `${filter.graduationDateFilter.min.year === -1 ? "Any" : (filter.graduationDateFilter.min.month === -1 ? filter.graduationDateFilter.min.year : filter.graduationDateFilter.min.month + "." + filter.graduationDateFilter.min.year)} - ${filter.graduationDateFilter.max.year === -1 ? "Any" : (filter.graduationDateFilter.max.month === -1 ? filter.graduationDateFilter.max.year : filter.graduationDateFilter.max.month + "." + filter.graduationDateFilter.max.year)}`}
                                            title="Graduation"
                                        >
                                            <div className="flex flex-col gap-2 justify-center">
                                                <div className="flex gap-2 items-center justify-center">
                                                    <div>Between</div>
                                                    <Input size='sm' label="Year" className="w-20" type="number" value={filter.graduationDateFilter.min.year === -1 ? null : filter.graduationDateFilter.min.year} placeholder="Any" onValueChange={
                                                        (value) => {
                                                            setFilter((prev) => {
                                                                return {...prev, graduationDateFilter: {...prev.graduationDateFilter, min: {...prev.graduationDateFilter.min, year: (value === "" ? -1 : value)}}};
                                                            });
                                                        }
                                                    }/>
                                                    <Input size='sm' label="Month" className="w-20" type="number" value={filter.graduationDateFilter.min.month === -1 ? null : filter.graduationDateFilter.min.month} placeholder="Any" isDisabled={filter.graduationDateFilter.min.year === -1} onValueChange={
                                                        (value) => {
                                                            setFilter((prev) => {
                                                                return {...prev, graduationDateFilter: {...prev.graduationDateFilter, min: {...prev.graduationDateFilter.min, month: (value === "" ? -1 : value)}}};
                                                            });
                                                        }
                                                    }/>
                                                </div>
                                                <div className="flex gap-2 items-center justify-center">
                                                    <div>and</div>
                                                    <Input size='sm' label="Year" className="w-20" type="number" value={filter.graduationDateFilter.max.year === -1 ? null : filter.graduationDateFilter.max.year} placeholder="Any" onValueChange={
                                                        (value) => {
                                                            setFilter((prev) => {
                                                                return {...prev, graduationDateFilter: {...prev.graduationDateFilter, max: {...prev.graduationDateFilter.max, year: (value === "" ? -1 : value)}}};
                                                            });
                                                        }
                                                    }/>
                                                    <Input size='sm' label="Month" className="w-20" type="number" value={filter.graduationDateFilter.max.month === -1 ? null : filter.graduationDateFilter.max.month} placeholder="Any" isDisabled={filter.graduationDateFilter.max.year === -1} onValueChange={
                                                        (value) => {
                                                            setFilter((prev) => {
                                                                return {...prev, graduationDateFilter: {...prev.graduationDateFilter, max: {...prev.graduationDateFilter.max, month: (value === "" ? -1 : value)}}};
                                                            });
                                                        }
                                                    }/>
                                                </div>
                                            </div>
                                        </AccordionItem>
                                        </Accordion>
                                    </div>
                                    </PopoverContent>
                                </Popover>
                                </div>
                            )
                    }
                    {
                        queryBarLoading
                        ?
                            <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-unit-10 rounded-medium"></Skeleton>
                        :
                            (
                                <div className="flex-initial px-unit-1">
                                    <Button isIconOnly color="primary" size="md" variant="solid"
                                        onPress={async () => {
                                            if (tags.length === 0 || tableLoading.status) {
                                                return;
                                            }
                                            const queryID = uuidv4();
                                            setSavedQueriesState((prev) => {return {...prev, savedQueries: [{id: queryID, query: tags, filter: filter}, ...prev.savedQueries]};});
                                            await fetch("/api/save-query", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({id: queryID, query: tags, filter: filter})
                                            });
                                        }}
                                    >
                                        <Tooltip content="Save Query" color="primary" delay={400} closeDelay={600}>
                                            <BookmarkBorderIcon />
                                        </Tooltip>
                                    </Button>
                                </div>
                            )
                    }
                    {
                        queryBarLoading
                        ?
                            <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-unit-10 rounded-medium"></Skeleton>
                        :
                            (
                                <div className="flex-initial px-unit-1">
                                <Popover placement="bottom" isOpen={settingsModalOpen} onOpenChange={async (open) => {
                                    setSettingsModalOpen(open);
                                    if (!open) {
                                        await fetch("/api/save-search-settings", {
                                            method: "POST",
                                            headers: {
                                            "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(searchSettings)
                                        });
                                    }
                                    }}>
                                    <PopoverTrigger>
                                    <Button isIconOnly color="success" size="md" variant="solid">
                                        <Tooltip content="Settings" color={"success"} delay={400} closeDelay={600}>
                                        <TuneOutlinedIcon />
                                        </Tooltip>
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                    <div className="px-2 py-2 w-[33vw]">
                                        <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-center whitespace-nowrap">
                                        <div className="w-full text-2xl font-bold">Settings</div>
                                        <Switch
                                        size="lg"
                                        color="primary"
                                        isSelected={searchSettings.flash}
                                        thumbIcon={({ isSelected, className }) =>
                                            isSelected ? (
                                            <BoltIcon className={className} />
                                            ) : (
                                            <SearchOutlinedIcon className={className} />
                                            )
                                        }
                                        onValueChange={async (value) => {
                                            await fetch("/api/save-search-settings", {
                                                method: "POST",
                                                headers: {
                                                "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify(searchSettings)
                                            });
                                            setSearchSettings((prev) => {return {...prev, flash: value}});
                                        }}
                                        >
                                        </Switch>
                                        </div>
                                        <Divider />
                                        <div className={searchSettings.flash ? "text-lg text-primary-600" : "text-lg text-secondary-600"} >
                                            {searchSettings.flash
                                            ?
                                                "You are in flash mode. Flash mode is faster and cheaper, but provides less accurate results."
                                            :
                                                "You are in deep mode. Deep mode takes longer and is more costly, but provides more accurate results."
                                            }
                                        </div>
                                        <Divider />
                                        <div className= "flex gap-3">
                                            <Input type="number" label={searchSettings.flash ? "flashTopK" : "deepTopK"} placeholder="10" value={searchSettings.flash ? searchSettings.flashTopK : searchSettings.deepTopK} onValueChange={(value) => setSearchSettings((prev) => {return (searchSettings.flash) ? {...prev, flashTopK: value} : {...prev, deepTopK: value}})} />
                                            {
                                                searchSettings.flash
                                                ?
                                                    null
                                                :
                                                    <div className="text-lg text-secondary-600">
                                                        {`Estimated cost is ${searchSettings.deepTopK * 0.0015}\$ per query.`}
                                                    </div>
                                            }
                                        </div>
                                        {
                                            searchSettings.flash
                                            ?
                                                null
                                            :
                                                <Divider />
                                        }
                                        {
                                            searchSettings.flash
                                            ?
                                                null
                                            :
                                                <Slider 
                                                    label="Deep Mode Weights" 
                                                    step={0.01} 
                                                    value={searchSettings.deepWeight}
                                                    onChangeEnd={(value) => setSearchSettings((prev) => {return {...prev, deepWeight: value}})}
                                                    maxValue={1} 
                                                    minValue={0} 
                                                    defaultValue={0.5}
                                                    className="max-w-md"
                                                    color="secondary"
                                                    startContent="Similarity"
                                                    endContent="Questions"
                                                />
                                        }
                                    </div>
                                    </div>
                                    </PopoverContent>
                                </Popover>
                                </div>
                            )
                    }
                </div>
                <div className={(tags.length === 0 && filter.positionFilter.length === 0 && filter.countryCodeFilter.length === 0 && filter.statusFilter.length === 0 && filter.starsFilter === -1 && filter.yoeFilter.min === -1 && filter.yoeFilter.max === -1 && filter.degreeFilter.length === 0 && filter.graduationDateFilter.min.year === -1 && filter.graduationDateFilter.max.year === -1) ? "flex flex-wrap flex-initial gap-y-1" : "flex flex-wrap flex-initial gap-y-1 pt-unit-2"}>
                    {tags.map((tag, index) => {
                        const tagID = uuidv4();
                        return (
                            <div key={tagID} className="px-1">
                                <Chip color="secondary" size="sm" variant="dot" onClose={() => {setTags((prev) => {
                                    const newTags = [...prev];
                                    newTags.splice(index, 1);
                                    return newTags;
                                })}}>
                                    {tag}
                                </Chip>
                            </div>
                        );
                    })}
                    {filter.positionFilter.map((position) => {
                        const filterTagID = uuidv4();
                        return (
                            <div key={filterTagID} className="px-1">
                                <Chip color="danger" size="sm" variant="dot" onClose={() => {setFilter((prev) => {
                                    return {...prev, positionFilter: prev.positionFilter.filter((id) => {
                                        return id !== position;
                                    })};
                                })}}>
                                    {position}
                                </Chip>
                            </div>
                        );
                    })}
                    {filter.countryCodeFilter.map((countryCode) => {
                        const filterTagID = uuidv4();
                        return (
                            <div key={filterTagID} className="px-1">
                                <Chip color="danger" size="sm" variant="dot" onClose={() => {setFilter((prev) => {
                                    return {...prev, countryCodeFilter: prev.countryCodeFilter.filter((id) => {
                                        return id !== countryCode;
                                    })};
                                })}}>
                                    {locationLookup[countryCode]}
                                </Chip>
                            </div>
                        );
                    })}
                    {filter.statusFilter.map((status) => {
                        const filterTagID = uuidv4();
                        return (
                            <div key={filterTagID} className="px-1">
                                <Chip className="capitalize" color="danger" size="sm" variant="dot" onClose={() => {setFilter((prev) => {
                                    return {...prev, statusFilter: prev.statusFilter.filter((id) => {
                                        return id !== status;
                                    })};
                                })}}>
                                    {status === "newApply" ? "New" : status}
                                </Chip>
                            </div>
                        );
                    })}
                    {filter.starsFilter !== -1 &&
                        <div className="px-1">
                            <Chip color="danger" size="sm" variant="dot" onClose={() => {setFilter((prev) => {
                                return {...prev, starsFilter: -1};
                            })}}>
                                {`${filter.starsFilter}+`}
                            </Chip>
                        </div>
                    }
                    {(filter.yoeFilter.min !== -1 || filter.yoeFilter.max !== -1) &&
                        <div className="px-1">
                            <Chip color="danger" size="sm" variant="dot" onClose={() => {setFilter((prev) => {
                                return {...prev, yoeFilter: {min: -1, max: -1}};
                            })}}>
                                {(filter.yoeFilter.min === -1 ? `YOE <= ${filter.yoeFilter.max}` : (filter.yoeFilter.max === -1 ? `YOE >= ${filter.yoeFilter.min}` : `${filter.yoeFilter.min} <= YOE <= ${filter.yoeFilter.max}`))}
                            </Chip>
                        </div>
                    }
                    {filter.degreeFilter.map((degree) => {
                        const filterTagID = uuidv4();
                        return (
                            <div key={filterTagID} className="px-1">
                                <Chip color="danger" size="sm" variant="dot" onClose={() => {setFilter((prev) => {
                                    return {...prev, degreeFilter: prev.degreeFilter.filter((id) => {
                                        return id !== degree;
                                    })};
                                })}}>
                                    {degree}
                                </Chip>
                            </div>
                        );
                    })}
                    {(filter.graduationDateFilter.min.year !== -1 || filter.graduationDateFilter.max.year !== -1) &&
                        <div className="px-1">
                            <Chip color="danger" size="sm" variant="dot" onClose={() => {setFilter((prev) => {
                                return {...prev, graduationDateFilter: {min: {year: -1, month: -1}, max: {year: -1, month: -1}}};
                            })}}>
                                {`Graduation: ${filter.graduationDateFilter.min.year === -1 ? "Any" : (filter.graduationDateFilter.min.month === -1 ? filter.graduationDateFilter.min.year : filter.graduationDateFilter.min.month + "." + filter.graduationDateFilter.min.year)} - ${filter.graduationDateFilter.max.year === -1 ? "Any" : (filter.graduationDateFilter.max.month === -1 ? filter.graduationDateFilter.max.year : filter.graduationDateFilter.max.month + "." + filter.graduationDateFilter.max.year)}`}
                            </Chip>
                        </div>
                    }
                </div>
            </div>
    )
  }