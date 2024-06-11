export type Applicant = {
  applicantInfo: {
    name: string;
    cover?: string;
    contact: {
      email: string;
      phone: string;
    }
    urls?: {
      website?: string;
      linkedin?: string;
      github?: string;
    }
    notes: string;
  }


  resumeInfo: {
    uploadthing: {
      key: string;
      url: string;
    }
    fullText: string;
  }
};

export type ApplicationMetadata = {
  countryCode: string;
  status:
      | "newApply"
      | "screening"
      | "assessment"
      | "interview"
      | "shortlisted"
      | "offer"
      | "onboarding"
      | "hired";
  stars: number;
  yoe: number;
}


export type Filter = {
  positionFilter: {
    id: number;
    title: string;
  };
  countryCodeFilter: string[];
  statusFilter: string[];
  starsFilter: number;
  yoeFilter: {
    min: number;
    max: number;
  };
};