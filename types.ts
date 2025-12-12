export interface Attendee {
  id: string;
  name: string;
  nickname: string;
  avatarIndex: number;
  message: string;
  isSignature: boolean;
  joinedAt: number;
  status: 'attending' | 'declined'; // New field for attendance
}

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string; // New field for photo description
}