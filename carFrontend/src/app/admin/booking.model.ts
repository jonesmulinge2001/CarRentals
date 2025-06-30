export interface Booking {
    id: string;
    startdate: string;
    enddate: string;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
    totalPrice: number;
    vehicle: {
      id: string;
      name: string;
      model: string;
    };
    customer?: {
      id: string;
      name: string;
      email: string;
    };
  }
  