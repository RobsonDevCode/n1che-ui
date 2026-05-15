export interface Shop {
  id: string;
  googlePlaceId: string;
  name: string;
  niche: string;
  address: string;
  latitude: number;
  longitude: number;
  voteCount: number;
  createdAt: string;
  addedByUserId: string;
  photoUrl?: string;
}
