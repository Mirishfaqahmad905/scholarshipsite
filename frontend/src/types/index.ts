export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: string;
  token?: string;
}

export interface Scholarship {
  _id: string;
  title: string;
  description: string;
  hostUniversity?: string;
  degreeLevel: 'BS' | 'MS' | 'PhD';
  country: string;
  category: string;
  fundingType: 'Full' | 'Partial';
  financialCoverage?: string;
  eligibilityCriteria?: string;
  requiredDocuments?: string;
  applicationFee?: string;
  deadline: string;
  officialLink: string;
  applyLink: string;
  image: string;
  status: 'open' | 'closed';
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdAt?: string;
}

export interface Ad {
  _id: string;
  title: string;
  image: string;
  targetLink: string;
  placement:
    | 'header'
    | 'sidebar'
    | 'in-feed'
    | 'footer'
    | 'popup'
    | 'scholarship-detail-top'
    | 'scholarship-detail-bottom'
    | 'blog-sidebar'
    | 'about-page'
    | 'contact-page';
  active: boolean;
  startDate?: string;
  endDate?: string;
}

export interface Subscriber {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt?: string;
  createdAt?: string;
}

export interface NotificationLog {
  _id: string;
  scholarshipTitle: string;
  recipientCount: number;
  recipients: string[];
  sentAt: string;
  status: string;
  senderEmail?: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Country {
  _id: string;
  name: string;
}

export interface DashboardStats {
  totalScholarships: number;
  openScholarships: number;
  totalBlogs: number;
  activeAds: number;
  totalUsers: number;
  totalCountries: number;
}

export interface CustomSocialLink {
  _id?: string;
  platformName: string;
  url: string;
  icon?: string;
}

export interface SiteSettings {
  _id?: string;
  siteName: string;
  siteLink: string;
  contactEmail: string;
  whatsapp: string;
  whatsappMessage?: string;
  github: string;
  snapchat: string;
  instagram: string;
  telegram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  customLinks: CustomSocialLink[];
  updatedAt?: string;
}

