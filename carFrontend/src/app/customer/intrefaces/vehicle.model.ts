export interface Vehicle {
  id: string;
  name: string;
  title: string;
  description: string;
  pricePerHour: number;
  category: string;
  available: boolean;
  location: string;
  imageUrl: string;
  fuelCapacity?: string;
  transmission?: string;
  seatingCapacity?: string;
}
