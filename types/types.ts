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
      location: string;
      countryCode: string;
      latestEducation: {
        ongoing: boolean;
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
        | "consideration"
        | "offer"
        | "onboarding"
        | "hired";
    }

    applicationInfo: {
      date: Date;
      method: "mail" | "upload";
      team: string;
      role: string;
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
      partExists: {
        education: boolean;
        experience: boolean;
        projects: boolean;
      }
      fullText: string;
    }
  };