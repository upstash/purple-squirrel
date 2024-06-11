"use client";

import { UploadButton } from "@/app/utils/uploadthing";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import { useState } from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";

import { locations, locationLookup } from "@/app/utils/locations";

import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";

export default function Page({ params }) {
  const [phoneNumber, setPhoneNumber] = useState(undefined);
  const [experience, setExperience] = useState(undefined);
  const [location, setLocation] = useState(undefined);

  const [linkedin, setLinkedin] = useState(undefined);
  const [github, setGithub] = useState(undefined);
  const [website, setWebsite] = useState(undefined);

  const [cover, setCover] = useState(undefined);

  const [resume, setResume] = useState(undefined);

  const [submitting, setSubmitting] = useState(false);

  const [position , setPosition] = useState("");

  useEffect(() => {
    const res = fetch('/api/positions/get-position-by-id', {
        method: 'POST',
        body: JSON.stringify({id: parseInt(params.position)}),
    })
    if (!res.ok) {
      if (res.message) {
        window.location.href = `/unavailable?message=${res.message}`;
      } else {
        window.location.href = "/unavailable?message=error";
      }
    }
    const data = res.json();
    setPosition(data.name);
  }, [setPosition, params.position])

  const formComplete = phoneNumber && experience && location && resume;

  return (
    <div className="h-screen flex justify-center bg-gradient-to-br from-blue-800 to-purple-500 pt-6">
      <div className="flex flex-col gap-3 p-6 bg-default-50 rounded-medium h-min w-4/12">
        <div className="flex flex-col gap-2">
          <div className="text-2xl pl-2">Application: {position}</div>
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
        <div className="flex flex-col gap-2 pb-2">
          <div className="text-md pl-2">Cover Note</div>
          <Textarea
            placeholder="Why do you want to work with us?"
            className=""
            variant="bordered"
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
            const data = {
                applicantInfo: {
                    name: user.fullName,
                    cover: cover,
                    contact: {
                        email: user.emailAddresses[0].emailAddress,
                        phone: phoneNumber
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
                },
                yoe: experience,
                countryCode: location
            }
            const res = await fetch("/api/apply", {
                method: "POST",
                body: JSON.stringify({data: data, positionId: parseInt(params.position)}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                setSubmitting(false);
                window.location.href = "/complete";
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
