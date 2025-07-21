interface ContactInfo {
  phone: string;
  email: string;
}

interface AddressInfo {
  street: string;
  city: string;
  zip: string;
}

interface OpeningHours {
  weekdays: string;
  weekdaysTime: string;
  weekend: string;
  weekendTime: string;
}

export interface CoffeeHouseData {
  contact: ContactInfo;
  address: AddressInfo;
  openingHours: OpeningHours;
}


export const coffeeHouseData: CoffeeHouseData = {
  contact: {
    phone: '+420 777 777 777',
    email: 'morningmistcoffee@gmail.com',
  },
  address: {
    street: 'Kolumbijská 1720/17',
    city: 'Praha 5',
    zip: '15000',
  },
  openingHours: {
    weekdays: 'Monday–Friday',
    weekdaysTime: '06:00–17:00',
    weekend: 'Saturday–Sunday',
    weekendTime: '07:00–17:00',
  },
};
