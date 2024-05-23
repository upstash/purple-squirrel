export type Applicant = {
  id: number | null;

  applicantInfo: {
    name: string;
    yoe: number;
    contact: {
      email: string;
      phone: string;
    }
    countryCode: string;
    latestEducation?: {
      degree?: string;
      subject?: string;
      university?: string;
      graduation?: {
        month?: number;
        year?: number;
      }
    }
    urls?: {
      website?: string;
      linkedin?: string;
      github?: string;
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

export type Application = {
  applicationInfo: {
    date: Date;
    method: "mail" | "ps";
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
}

export type Filter = {
  positionFilter: string | null;
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