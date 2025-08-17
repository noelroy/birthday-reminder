export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

export interface Contact {
  id: string;
  name: string;
  birthday: string;
  photo?: string;
}

export interface PeopleAPIResponse {
  connections?: {
    resourceName: string;
    names?: { displayName: string }[];
    birthdays?: { date: { month: number; day: number; year?: number } }[];
    photos?: { url: string }[];
  }[];
}
