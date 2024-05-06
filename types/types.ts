export type Applicant = {
  id: number | null;

  applicantInfo: {
    name: string;
    age: number;
    yoe: number;
    contact: {
      email: string;
      phone: string;
    }
    countryCode: string;
    latestEducation: {
      degree: string;
      subject: string;
      university: string;
      graduation: {
        month: number;
        year: number;
      }
    }
    urls: {
      website: string;
      linkedin: string;
      github: string;
    }
  }

  recruitmentInfo: {
    stars: number | null;
    notes: string | null;
    status:
      | "newApply"
      | "screening"
      | "assessment"
      | "interview"
      | "shortlisted"
      | "offer"
      | "onboarding"
      | "hired";
  }

  applicationInfo: {
    date: Date;
    method: "mail" | "upload";
    position: string;
    mailInfo?: {
      date: Date;
      from: string;
      subject: string;
      body: string;
    }
  }

  resumeInfo: {
    uploadthing: {
      key: string;
      url: string;
    }
    fullText: string;
  }
};

export type Filter = {
  positionFilter: string[];
  countryCodeFilter: string[];
  statusFilter: string[];
  starsFilter: number;
  yoeFilter: {
    min: number;
    max: number;
  };
  degreeFilter: string[];
  graduationDateFilter: {
    min: { year: number, month: number };
    max: { year: number, month: number };
  };
};