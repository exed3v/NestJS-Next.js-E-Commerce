export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  images: string[];
  user?: {
    id: string;
    fullName: string | null;
  };
  createdAt: string;
  updatedAt: string;
}
