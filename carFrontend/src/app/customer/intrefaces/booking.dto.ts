export interface Booking {
    id: string;
    userId: string;
    vehicleId: string;
    vehicle?: Vehicle;
    startdate: string;
    enddate: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
  }
  
  export interface Vehicle {
    id: string;
    title: string;
    name: string;
    description: string;
    pricePerHour: number;
    category: string;
    location: string;
    available: boolean;
    imageUrl: string;
  }
  