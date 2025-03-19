export interface CinemaShowTime {
  time: string;
  languages: string;
  isFull: boolean;
  isEmpty: boolean;
}

export interface Cinema {
  _id: string;
  id: number;
  name: string;
  address: string;
  distance: string;
  location: string;
  showTimes: CinemaShowTime[];
  seatsBooked: number[];
  price: number;
}

export const cinemaLocations: Cinema[] = [
  {
    _id: "67d94c77999b1d6a439e4bdc",
    id: 1,
    name: "INOX Pacific Mall, Jasola Delhi",
    address: "Bookit INOX Limited, Delhi Pacific Mall, Pacific Mall",
    distance: "11.4 km away",
    location: "Delhi-NCR",
    showTimes: [
      { time: "03:55 PM", languages: "ENGLISH", isFull: true, isEmpty: false },
      { time: "06:30 PM", languages: "HINDI", isFull: false, isEmpty: false }
    ],
    seatsBooked: [7, 14, 21, 28, 35, 42],
    price: 350
  },
  {
    _id: "67d94c77999b1d6a439e4bdd",
    id: 2,
    name: "Bookit Select City Walk Delhi",
    address: "A-51st Floor,Select City Walk Mall, District Center,Saket,Sector 6, Pushp Vihar,Delhi,NCR 110017,India",
    distance: "11.6 km away",
    location: "Delhi-NCR",
    showTimes: [
      { time: "02:15 PM", languages: "ENGLISH", isFull: false, isEmpty: true },
      { time: "05:30 PM", languages: "HINDI", isFull: false, isEmpty: false },
      { time: "08:45 PM", languages: "ENGLISH", isFull: true, isEmpty: false }
    ],
    seatsBooked: [3, 12, 15, 27, 36, 48],
    price: 380
  },
  {
    _id: "67d94c77999b1d6a439e4bde",
    id: 3,
    name: "PVR Cinemas Promenade, Vasant Kunj",
    address: "DLF Promenade Mall, Nelson Mandela Road, Vasant Kunj",
    distance: "14.2 km away",
    location: "Delhi-NCR",
    showTimes: [
      { time: "01:30 PM", languages: "ENGLISH", isFull: false, isEmpty: false },
      { time: "04:45 PM", languages: "HINDI", isFull: false, isEmpty: true },
      { time: "07:30 PM", languages: "ENGLISH", isFull: true, isEmpty: false }
    ],
    seatsBooked: [5, 10, 15, 20, 25, 30],
    price: 400
  },
  {
    _id: "67d94c77999b1d6a439e4bdf",
    id: 4,
    name: "Cinepolis Forum Chennai",
    address: "No. 183, Great Southern Trunk Rd, Virugambakkam, Chennai",
    distance: "5.3 km away",
    location: "Chennai",
    showTimes: [
      { time: "10:15 AM", languages: "TAMIL", isFull: false, isEmpty: true },
      { time: "01:30 PM", languages: "ENGLISH", isFull: false, isEmpty: false },
      { time: "04:45 PM", languages: "TAMIL", isFull: true, isEmpty: false },
      { time: "08:00 PM", languages: "ENGLISH", isFull: false, isEmpty: false }
    ],
    seatsBooked: [8, 16, 24, 32, 40, 48],
    price: 320
  },
  {
    _id: "67d94c77999b1d6a439e4be0",
    id: 5,
    name: "SPI Palazzo Nexus Mall Chennai",
    address: "Nexus Vijaya Mall, Vadapalani, Chennai",
    distance: "7.8 km away",
    location: "Chennai",
    showTimes: [
      { time: "11:30 AM", languages: "TAMIL", isFull: true, isEmpty: false },
      { time: "02:45 PM", languages: "ENGLISH", isFull: false, isEmpty: false },
      { time: "06:00 PM", languages: "TAMIL", isFull: false, isEmpty: true },
      { time: "09:15 PM", languages: "ENGLISH", isFull: false, isEmpty: false }
    ],
    seatsBooked: [2, 4, 6, 8, 10, 12],
    price: 350
  },
  {
    _id: "67d95751999b1d6a439e4c3e",
    id: 6,
    name: "Carnival Cinemas Huma Mall",
    address: "Kanjurmarg West, LBS Marg",
    distance: "9.1 km away",
    location: "Mumbai",
    showTimes: [
      { time: "12:30 PM", languages: "HINDI", isFull: false, isEmpty: true },
      { time: "03:45 PM", languages: "ENGLISH", isFull: false, isEmpty: true },
      { time: "07:00 PM", languages: "HINDI", isFull: false, isEmpty: true }
    ],
    seatsBooked: [7, 14, 21, 28, 35, 42],
    price: 320
  },
  {
    _id: "67d94c77999b1d6a439e4be2",
    id: 7,
    name: "INOX Megaplex Inorbit Mall Mumbai",
    address: "Inorbit Mall, Malad West, Mumbai",
    distance: "12.3 km away",
    location: "Mumbai",
    showTimes: [
      { time: "11:45 AM", languages: "HINDI", isFull: false, isEmpty: false },
      { time: "03:00 PM", languages: "ENGLISH", isFull: true, isEmpty: false },
      { time: "06:15 PM", languages: "HINDI", isFull: false, isEmpty: true },
      { time: "09:30 PM", languages: "ENGLISH", isFull: false, isEmpty: false }
    ],
    seatsBooked: [1, 3, 5, 7, 9, 11],
    price: 380
  }
];
