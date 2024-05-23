"use client";

import { UploadButton } from "@/app/utils/uploadthing";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import { useState } from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'

import { locations, locationLookup } from "@/app/utils/locations";

import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";

export default function Page() {
    const router = useRouter()
  const { isSignedIn, user, isLoaded } = useUser();

  const [phoneNumber, setPhoneNumber] = useState(undefined);
  const [experience, setExperience] = useState(undefined);
  const [location, setLocation] = useState(undefined);

  const [latestDegree, setLatestDegree] = useState(new Set([]));
  const [latestSubject, setLatestSubject] = useState(undefined);
  const [latestInstitution, setLatestInstitution] = useState(undefined);
  const [latestGraduationYear, setLatestGraduationYear] = useState(undefined);
  const [latestGraduationMonth, setLatestGraduationMonth] = useState(new Set([]));

  const [linkedin, setLinkedin] = useState(undefined);
  const [github, setGithub] = useState(undefined);
  const [website, setWebsite] = useState(undefined);

  const [resume, setResume] = useState(undefined);

  const [submitting, setSubmitting] = useState(false);

  if (!isLoaded) {
    return null;
  }

  const formComplete = phoneNumber && experience && location && resume;

  return (
    <div className="h-screen flex justify-center bg-gradient-to-br from-blue-800 to-purple-500 pt-6">
      <div className="flex flex-col gap-3 p-6 bg-default-50 rounded-medium h-min w-4/12">
        <div className="flex flex-col gap-2">
          <div className="text-2xl pl-2">Complete Your Profile</div>
          <Input
            isRequired
            label="Phone Number"
            type="tel"
            size="sm"
            variant="bordered"
            value={phoneNumber}
            onValueChange={(value) => {
              setPhoneNumber(value);
            }}
          />
          <div className="flex flex-row gap-2">
            <Input
              isRequired
              label="Years of Experience"
              type="number"
              size="sm"
              variant="bordered"
              value={experience}
              onValueChange={(value) => {
                setExperience(value);
              }}
            />
            <Autocomplete
              isRequired
              label="Location"
              size="sm"
              variant="bordered"
              selectedKey={location}
              onSelectionChange={(key) => {
                setLocation(key);
              }}
            >
              {locations.map((location) => (
                <AutocompleteItem key={location.iso2} value={location.iso2}>
                  {location.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-md pl-2">Education</div>
          <div className="flex flex-row gap-2">
            <Select
              label="Degree"
              selectedKeys={latestDegree}
              onSelectionChange={setLatestDegree}
              size="sm"
              variant="bordered"
              className="w-52"
            >
              {["Associate's", "Bachelor's", "Master's", "Doctoral"].map(
                (degree) => (
                  <SelectItem key={degree} value={degree}>
                    {degree}
                  </SelectItem>
                )
              )}
            </Select>
            <Input
              className="w-full"
              label="Subject"
              type="text"
              size="sm"
              variant="bordered"
              value={latestSubject}
              onValueChange={(value) => {
                setLatestSubject(value);
              }}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Input
              label="Institution"
              type="text"
              size="sm"
              variant="bordered"
              value={latestInstitution}
              onValueChange={(value) => {
                setLatestInstitution(value);
              }}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Select
              label="Graduation Month"
              selectedKey={latestGraduationMonth}
              onSelectionChange={setLatestGraduationMonth}
              size="sm"
              variant="bordered"
            >
              {[
                { name: "January", value: 1 },
                { name: "February", value: 2 },
                { name: "March", value: 3 },
                { name: "April", value: 4 },
                { name: "May", value: 5 },
                { name: "June", value: 6 },
                { name: "July", value: 7 },
                { name: "August", value: 8 },
                { name: "September", value: 9 },
                { name: "October", value: 10 },
                { name: "November", value: 11 },
                { name: "December", value: 12 },
              ].map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Graduation Year"
              type="number"
              size="sm"
              variant="bordered"
              value={latestGraduationYear}
              onValueChange={(value) => {
                setLatestGraduationYear(value);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pb-2">
          <div className="text-md pl-2">URLs</div>
          <Input
            label="LinkedIn"
            type="url"
            size="sm"
            variant="bordered"
            value={linkedin}
            onValueChange={(value) => {
              setLinkedin(value);
            }}
          />
          <Input
            label="GitHub"
            type="url"
            size="sm"
            variant="bordered"
            value={github}
            onValueChange={(value) => {
              setGithub(value);
            }}
          />
          <Input
            label="Website"
            type="url"
            size="sm"
            variant="bordered"
            value={website}
            onValueChange={(value) => {
              setWebsite(value);
            }}
          />
        </div>
        <UploadButton
          endpoint="pdfUploader"
          className="ut-button:w-full"
          content={{
            button({ ready }) {
              if (ready) return <div>Upload Resume</div>;
              return "Loading...";
            },
          }}
          onClientUploadComplete={(res) => {
            // Do something with the response
            setResume(res[0]);
          }}
          onUploadError={(error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
        <Button
          isDisabled={!formComplete}
          isLoading={submitting}
          size="md"
          variant="solid"
          color="secondary"
          className="w-full text-large rounded-md"
          onClick={async () => {
            setSubmitting(true);
            const profile = {
                id: user.id,
                applicantInfo: {
                    name: user.fullName,
                    yoe: experience,
                    contact: {
                        email: user.emailAddresses[0].emailAddress,
                        phone: phoneNumber
                    },
                    countryCode: location,
                    latestEducation: {
                        degree: Array.from(latestDegree)[0],
                        subject: latestSubject,
                        university: latestInstitution,
                        graduation: {
                            month: Array.from(latestGraduationMonth)[0],
                            year: latestGraduationYear
                        }
                    },
                    urls: {
                        website: website,
                        linkedin: linkedin,
                        github: github
                    }
                },
                resumeInfo: {
                    uploadthing: {
                        key: resume.key,
                        url: resume.url
                    }
                }
            }
            const res = await fetch("/api/application/create-applicant", {
                method: "POST",
                body: JSON.stringify(profile),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                setSubmitting(false);
                window.location.href = "/home";
            } else {
                alert("Something went wrong.");
            }
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
