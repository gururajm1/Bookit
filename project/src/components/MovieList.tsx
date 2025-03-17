import { useState, useMemo, useRef, useEffect } from 'react';
import MovieCard from './MovieCard';

// Movie interface
interface Movie {
  id: string;
  title: string;
  image: string;
  language: string;
  certification: string;
  genres: string[];
  isNewRelease?: boolean;
  releaseDate?: string;
}

// Cache manager using sessionStorage for temporary persistence
const createSearchCache = () => {
  return {
    get: (query: string) => {
      try {
        const cached = sessionStorage.getItem(`search:${query}`);
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    },
    set: (query: string, results: Movie[]) => {
      try {
        sessionStorage.setItem(`search:${query}`, JSON.stringify(results));
      } catch {
        // Handle storage errors silently
      }
    },
    clear: () => {
      try {
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('search:')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch {
        // Handle storage errors silently
      }
    }
  };
};

const ROWS_PER_LOAD = 3;
const MOVIES_PER_ROW = 5;

const MovieList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Delhi-NCR");
  const [visibleRows, setVisibleRows] = useState(ROWS_PER_LOAD);
  const observerTarget = useRef<HTMLDivElement>(null);
  const searchCache = useMemo(() => createSearchCache(), []);

  // Movie data
  const movies = useMemo(() => [
    // Hindi Movies
    {
      id: "dunki",
      title: "Dunki",
      image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd",
      language: "Hindi",
      certification: "U/A",
      genres: ["Comedy", "Drama"],
      isNewRelease: true
    },
    {
      id: "animal",
      title: "Animal",
      image: "https://images.unsplash.com/photo-1543536448-1e76fc2795bf",
      language: "Hindi",
      certification: "A",
      genres: ["Action", "Crime", "Drama"],
      isNewRelease: true
    },
    {
      id: "tiger-3",
      title: "Tiger 3",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Thriller"],
      isNewRelease: true
    },
    {
      id: "fighter",
      title: "Fighter",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Drama"],
      isNewRelease: true
    },
    {
      id: "sam-bahadur",
      title: "Sam Bahadur",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434",
      language: "Hindi",
      certification: "U/A",
      genres: ["Biography", "Drama", "War"],
      isNewRelease: true
    },
    {
      id: "12th-fail",
      title: "12th Fail",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
      language: "Hindi",
      certification: "U/A",
      genres: ["Drama", "Biography"],
      isNewRelease: true
    },
    {
      id: "rocky-aur-rani",
      title: "Rocky Aur Rani Kii Prem Kahaani",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Drama", "Family"],
      isNewRelease: false
    },
    {
      id: "pathaan",
      title: "Pathaan",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Thriller"],
      isNewRelease: false
    },
    {
      id: "jawan",
      title: "Jawan",
      image: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Thriller"],
      isNewRelease: false
    },
    {
      id: "gadar-2",
      title: "Gadar 2",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Drama", "Period"],
      isNewRelease: false
    },

    // Tamil Movies
    {
      id: "leo",
      title: "Leo",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Tamil",
      certification: "U/A",
      genres: ["Action", "Crime", "Thriller"],
      isNewRelease: true
    },
    {
      id: "jailer",
      title: "Jailer",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Tamil",
      certification: "U/A",
      genres: ["Action", "Drama"],
      isNewRelease: true
    },
    {
      id: "captain-miller",
      title: "Captain Miller",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Tamil",
      certification: "U/A",
      genres: ["Action", "Period", "Adventure"],
      releaseDate: "April 2024"
    },
    {
      id: "japan",
      title: "Japan",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Tamil",
      certification: "U/A",
      genres: ["Action", "Comedy"],
      isNewRelease: true
    },
    {
      id: "ps2",
      title: "Ponniyin Selvan 2",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Tamil",
      certification: "U/A",
      genres: ["Historical", "Drama", "Action"],
      isNewRelease: false
    },
    {
      id: "viduthalai",
      title: "Viduthalai Part 1",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
      language: "Tamil",
      certification: "U/A",
      genres: ["Drama", "Action"],
      isNewRelease: false
    },
    {
      id: "maaveeran",
      title: "Maaveeran",
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
      language: "Tamil",
      certification: "U/A",
      genres: ["Action", "Drama"],
      isNewRelease: false
    },
    {
      id: "por-thozil",
      title: "Por Thozil",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      language: "Tamil",
      certification: "U/A",
      genres: ["Crime", "Thriller"],
      isNewRelease: false
    },
    {
      id: "vaathi",
      title: "Vaathi",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Tamil",
      certification: "U/A",
      genres: ["Drama"],
      isNewRelease: false
    },
    {
      id: "varisu",
      title: "Varisu",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Tamil",
      certification: "U/A",
      genres: ["Drama", "Family"],
      isNewRelease: false
    },

    // Telugu Movies
    {
      id: "salaar",
      title: "Salaar Part 1: Ceasefire",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Drama"],
      isNewRelease: true
    },
    {
      id: "rrr",
      title: "RRR",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Drama", "Historical"],
      isNewRelease: false
    },
    {
      id: "pushpa",
      title: "Pushpa: The Rise",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Crime", "Drama"],
      isNewRelease: false
    },
    {
      id: "hi-nanna",
      title: "Hi Nanna",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
      language: "Telugu",
      certification: "U/A",
      genres: ["Drama", "Romance"],
      isNewRelease: true
    },
    {
      id: "bhagavanth-kesari",
      title: "Bhagavanth Kesari",
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Drama"],
      isNewRelease: true
    },
    {
      id: "skn",
      title: "Sir/Vaathi",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      language: "Telugu",
      certification: "U/A",
      genres: ["Drama"],
      isNewRelease: false
    },
    {
      id: "baby",
      title: "Baby",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Telugu",
      certification: "U/A",
      genres: ["Drama", "Romance"],
      isNewRelease: false
    },
    {
      id: "custody",
      title: "Custody",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Thriller"],
      isNewRelease: false
    },
    {
      id: "dasara",
      title: "Dasara",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Drama"],
      isNewRelease: false
    },
    {
      id: "waltair-veerayya",
      title: "Waltair Veerayya",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Comedy"],
      isNewRelease: false
    },

    // Malayalam Movies
    {
      id: "kannur-squad",
      title: "Kannur Squad",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Action", "Crime", "Thriller"],
      isNewRelease: true
    },
    {
      id: "2018",
      title: "2018",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Drama", "Disaster"],
      isNewRelease: true
    },
    {
      id: "kasargold",
      title: "Kasargold",
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Crime", "Thriller"],
      isNewRelease: true
    },
    {
      id: "romancham",
      title: "Romancham",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Comedy", "Horror"],
      isNewRelease: false
    },
    {
      id: "christopher",
      title: "Christopher",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Action", "Crime", "Thriller"],
      isNewRelease: false
    },
    {
      id: "iratta",
      title: "Iratta",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Crime", "Drama", "Thriller"],
      isNewRelease: false
    },
    {
      id: "nanpakal",
      title: "Nanpakal Nerathu Mayakkam",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Drama"],
      isNewRelease: false
    },
    {
      id: "thuramukham",
      title: "Thuramukham",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Drama", "Historical"],
      isNewRelease: false
    },
    {
      id: "kerala-story",
      title: "The Kerala Story",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Malayalam",
      certification: "A",
      genres: ["Drama"],
      isNewRelease: false
    },
    {
      id: "kala",
      title: "Kala",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Action", "Drama", "Thriller"],
      isNewRelease: false
    },

    // Tamil Horror Movies
    {
      id: "chandramukhi-2",
      title: "Chandramukhi 2",
      image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd",
      language: "Tamil",
      certification: "U/A",
      genres: ["Horror", "Comedy"],
      isNewRelease: true
    },
    {
      id: "ghost",
      title: "Ghost",
      image: "https://images.unsplash.com/photo-1543536448-1e76fc2795bf",
      language: "Tamil",
      certification: "U/A",
      genres: ["Horror", "Thriller"],
      isNewRelease: true
    },
    {
      id: "pisasu-2",
      title: "Pisasu 2",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb",
      language: "Tamil",
      certification: "U/A",
      genres: ["Horror", "Thriller"],
      isNewRelease: false
    },
    {
      id: "connect",
      title: "Connect",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0",
      language: "Tamil",
      certification: "U/A",
      genres: ["Horror", "Thriller"],
      isNewRelease: false
    },
    {
      id: "aranmanai-4",
      title: "Aranmanai 4",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434",
      language: "Tamil",
      certification: "U/A",
      genres: ["Horror", "Comedy"],
      releaseDate: "April 2024"
    },
    {
      id: "kanchana-4",
      title: "Kanchana 4",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
      language: "Tamil",
      certification: "U/A",
      genres: ["Horror", "Comedy"],
      releaseDate: "June 2024"
    },
    {
      id: "pizza-3",
      title: "Pizza 3",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
      language: "Tamil",
      certification: "U/A",
      genres: ["Horror", "Thriller"],
      releaseDate: "May 2024"
    },
    {
      id: "demonte-colony-2",
      title: "Demonte Colony 2",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
      language: "Tamil",
      certification: "U/A",
      genres: ["Horror"],
      isNewRelease: false
    },
    {
      id: "mohini-2",
      title: "Mohini 2",
      image: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53",
      language: "Tamil",
      certification: "U/A",
      genres: ["Horror", "Thriller"],
      releaseDate: "July 2024"
    },
    {
      id: "maya-2",
      title: "Maya 2",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
      language: "Tamil",
      certification: "U/A",
      genres: ["Horror", "Thriller"],
      releaseDate: "August 2024"
    },

    // Hindi Horror Movies
    {
      id: "bhool-bhulaiyaa-3",
      title: "Bhool Bhulaiyaa 3",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Hindi",
      certification: "U/A",
      genres: ["Horror", "Comedy"],
      releaseDate: "May 2024"
    },
    {
      id: "phone-bhoot-2",
      title: "Phone Bhoot 2",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Hindi",
      genres: ["Horror", "Comedy"],
      certification: "U/A",
      releaseDate: "June 2024"
    },
    {
      id: "stree-2",
      title: "Stree 2",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Hindi",
      certification: "U/A",
      genres: ["Horror", "Comedy"],
      releaseDate: "August 2024"
    },
    {
      id: "roohi-2",
      title: "Roohi 2",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Hindi",
      certification: "U/A",
      genres: ["Horror", "Comedy"],
      releaseDate: "October 2024"
    },
    {
      id: "naina",
      title: "Naina",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Hindi",
      certification: "A",
      genres: ["Horror"],
      isNewRelease: true
    },
    {
      id: "dybbuk-2",
      title: "Dybbuk 2",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
      language: "Hindi",
      certification: "A",
      genres: ["Horror", "Thriller"],
      releaseDate: "July 2024"
    },
    {
      id: "1920-returns",
      title: "1920 Returns",
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
      language: "Hindi",
      certification: "A",
      genres: ["Horror", "Period"],
      releaseDate: "September 2024"
    },
    {
      id: "pari-2",
      title: "Pari 2",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      language: "Hindi",
      certification: "A",
      genres: ["Horror", "Supernatural"],
      releaseDate: "November 2024"
    },
    {
      id: "raaz-5",
      title: "Raaz 5",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Hindi",
      certification: "A",
      genres: ["Horror", "Thriller"],
      releaseDate: "December 2024"
    },
    {
      id: "haunting-of-bombay",
      title: "Haunting of Bombay",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Hindi",
      certification: "A",
      genres: ["Horror"],
      releaseDate: "July 2024"
    },

    // Malayalam Horror Movies
    {
      id: "neelavelicham",
      title: "Neelavelicham",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Horror", "Drama"],
      isNewRelease: true
    },
    {
      id: "bramayugam",
      title: "Bramayugam",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Malayalam",
      certification: "A",
      genres: ["Horror", "Period"],
      isNewRelease: true
    },
    {
      id: "romancham",
      title: "Romancham",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Horror", "Comedy"],
      isNewRelease: false
    },
    {
      id: "bhoothakaalam-2",
      title: "Bhoothakaalam 2",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Horror", "Thriller"],
      releaseDate: "June 2024"
    },
    {
      id: "ezra-2",
      title: "Ezra 2",
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Horror", "Thriller"],
      releaseDate: "August 2024"
    },
    {
      id: "cold-case-2",
      title: "Cold Case 2",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Horror", "Crime"],
      releaseDate: "September 2024"
    },
    {
      id: "jallikattu-2",
      title: "Jallikattu 2",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Malayalam",
      certification: "A",
      genres: ["Horror", "Thriller"],
      releaseDate: "October 2024"
    },
    {
      id: "adam",
      title: "Adam",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Horror", "Mystery"],
      releaseDate: "July 2024"
    },
    {
      id: "aakasha-ganga-3",
      title: "Aakasha Ganga 3",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Horror"],
      releaseDate: "November 2024"
    },
    {
      id: "maniyarayile-jinnu",
      title: "Maniyarayile Jinnu",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Horror", "Fantasy"],
      releaseDate: "December 2024"
    },

    // Telugu Horror Movies
    {
      id: "karthikeya-3",
      title: "Karthikeya 3",
      image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd",
      language: "Telugu",
      certification: "U/A",
      genres: ["Horror", "Mystery", "Thriller"],
      releaseDate: "May 2024"
    },
    {
      id: "masooda-2",
      title: "Masooda 2",
      image: "https://images.unsplash.com/photo-1543536448-1e76fc2795bf",
      language: "Telugu",
      certification: "U/A",
      genres: ["Horror", "Thriller"],
      releaseDate: "July 2024"
    },
    {
      id: "gruham-2",
      title: "Gruham 2",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb",
      language: "Telugu",
      certification: "U/A",
      genres: ["Horror", "Supernatural"],
      releaseDate: "August 2024"
    },
    {
      id: "raju-gari-gadhi-4",
      title: "Raju Gari Gadhi 4",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0",
      language: "Telugu",
      certification: "U/A",
      genres: ["Horror", "Comedy"],
      releaseDate: "September 2024"
    },
    {
      id: "anando-brahma-2",
      title: "Anando Brahma 2",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434",
      language: "Telugu",
      certification: "U/A",
      genres: ["Horror", "Comedy"],
      releaseDate: "October 2024"
    },
    {
      id: "avunu-3",
      title: "Avunu 3",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
      language: "Telugu",
      certification: "A",
      genres: ["Horror"],
      releaseDate: "June 2024"
    },
    {
      id: "premakatha-chitram-3",
      title: "Premakatha Chitram 3",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
      language: "Telugu",
      certification: "U/A",
      genres: ["Horror", "Comedy", "Romance"],
      releaseDate: "November 2024"
    },
    {
      id: "geethanjali-2",
      title: "Geethanjali 2",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
      language: "Telugu",
      certification: "U/A",
      genres: ["Horror", "Romance"],
      releaseDate: "December 2024"
    },
    {
      id: "chandramukhi-3-telugu",
      title: "Chandramukhi 3",
      image: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53",
      language: "Telugu",
      certification: "U/A",
      genres: ["Horror", "Drama"],
      releaseDate: "March 2024"
    },
    {
      id: "maya-mall",
      title: "Maya Mall",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
      language: "Telugu",
      certification: "U/A",
      genres: ["Horror", "Thriller"],
      isNewRelease: true
    },

    // Hindi Romance Movies
    {
      id: "rocky-aur-rani-2",
      title: "Rocky Aur Rani 2",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Drama", "Family"],
      releaseDate: "May 2024"
    },
    {
      id: "singham-again",
      title: "Singham Again",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Action"],
      releaseDate: "Independence Day 2024"
    },
    {
      id: "metro-in-dino",
      title: "Metro In Dino",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Drama"],
      releaseDate: "March 2024"
    },
    {
      id: "yodha",
      title: "Yodha",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Action"],
      releaseDate: "March 2024"
    },
    {
      id: "love-story-2050",
      title: "Love Story 2050",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Sci-Fi"],
      releaseDate: "2024"
    },
    {
      id: "aashiqui-3",
      title: "Aashiqui 3",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Musical"],
      releaseDate: "2024"
    },
    {
      id: "satyaprem-ki-katha-2",
      title: "Satyaprem Ki Katha 2",
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Drama"],
      releaseDate: "2024"
    },
    {
      id: "tu-jhoothi-main-makkaar-2",
      title: "Tu Jhoothi Main Makkaar 2",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Comedy"],
      releaseDate: "2024"
    },
    {
      id: "kho-gaye-hum-kahan",
      title: "Kho Gaye Hum Kahan",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Drama"],
      isNewRelease: true
    },
    {
      id: "dhak-dhak",
      title: "Dhak Dhak",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Hindi",
      certification: "U/A",
      genres: ["Romance", "Adventure"],
      isNewRelease: true
    },

    // Tamil Romance Movies
    {
      id: "love-today-2",
      title: "Love Today 2",
      image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd",
      language: "Tamil",
      certification: "U/A",
      genres: ["Romance", "Comedy"],
      releaseDate: "Valentine's Day 2024"
    },
    {
      id: "vaaranam-aayiram-2",
      title: "Vaaranam Aayiram 2",
      image: "https://images.unsplash.com/photo-1543536448-1e76fc2795bf",
      language: "Tamil",
      certification: "U/A",
      genres: ["Romance", "Drama"],
      releaseDate: "April 2024"
    },
    {
      id: "96-part-2",
      title: "96 Part 2",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb",
      language: "Tamil",
      certification: "U/A",
      genres: ["Romance", "Drama"],
      releaseDate: "May 2024"
    },
    {
      id: "vinnaithaandi-varuvaaya-2",
      title: "Vinnaithaandi Varuvaaya 2",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0",
      language: "Tamil",
      certification: "U/A",
      genres: ["Romance", "Musical"],
      releaseDate: "June 2024"
    },
    {
      id: "kaatru-veliyidai-2",
      title: "Kaatru Veliyidai 2",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434",
      language: "Tamil",
      certification: "U/A",
      genres: ["Romance", "Drama"],
      releaseDate: "July 2024"
    },
    {
      id: "ok-kanmani-2",
      title: "OK Kanmani 2",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
      language: "Tamil",
      certification: "U/A",
      genres: ["Romance", "Drama"],
      releaseDate: "August 2024"
    },
    {
      id: "mayakkam-enna-2",
      title: "Mayakkam Enna 2",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
      language: "Tamil",
      certification: "U/A",
      genres: ["Romance", "Musical", "Drama"],
      releaseDate: "September 2024"
    },
    {
      id: "mouna-ragam-2",
      title: "Mouna Ragam 2",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
      language: "Tamil",
      certification: "U/A",
      genres: ["Romance", "Family", "Drama"],
      releaseDate: "October 2024"
    },
    {
      id: "sita-ramam-tamil-2",
      title: "Sita Ramam 2",
      image: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53",
      language: "Tamil",
      certification: "U/A",
      genres: ["Romance", "Period", "Drama"],
      releaseDate: "November 2024"
    },
    {
      id: "kadhal-kottai-2",
      title: "Kadhal Kottai 2",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
      language: "Tamil",
      certification: "U/A",
      genres: ["Romance"],
      releaseDate: "December 2024"
    },

    // Telugu Romance Movies
    {
      id: "sita-ramam-2",
      title: "Sita Ramam 2",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Telugu",
      certification: "U/A",
      genres: ["Romance", "Period", "Drama"],
      releaseDate: "March 2024"
    },
    {
      id: "majili-2",
      title: "Majili 2",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Telugu",
      certification: "U/A",
      genres: ["Romance", "Drama"],
      releaseDate: "April 2024"
    },
    {
      id: "fidaa-2",
      title: "Fidaa 2",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Telugu",
      certification: "U/A",
      genres: ["Romance", "Comedy"],
      releaseDate: "May 2024"
    },
    {
      id: "geetha-govindam-2",
      title: "Geetha Govindam 2",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Telugu",
      certification: "U/A",
      genres: ["Romance", "Comedy"],
      releaseDate: "June 2024"
    },
    {
      id: "ninnu-kori-2",
      title: "Ninnu Kori 2",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Telugu",
      certification: "U/A",
      genres: ["Romance", "Drama"],
      releaseDate: "July 2024"
    },
    {
      id: "rx-100-2",
      title: "RX 100 2",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
      language: "Telugu",
      certification: "U/A",
      genres: ["Romance", "Action", "Drama"],
      releaseDate: "August 2024"
    },
    {
      id: "love-story-2",
      title: "Love Story 2",
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
      language: "Telugu",
      certification: "U/A",
      genres: ["Romance", "Drama"],
      releaseDate: "September 2024"
    },
    {
      id: "premam-2",
      title: "Premam 2",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      language: "Telugu",
      certification: "U/A",
      genres: ["Romance", "Comedy", "Drama"],
      releaseDate: "October 2024"
    },
    {
      id: "hello-2",
      title: "Hello 2",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Telugu",
      certification: "U/A",
      genres: ["Romance", "Action", "Sci-Fi"],
      releaseDate: "November 2024"
    },
    {
      id: "oh-baby-2",
      title: "Oh Baby 2",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Telugu",
      certification: "U/A",
      genres: ["Romance", "Comedy", "Fantasy"],
      releaseDate: "December 2024"
    },

    // Malayalam Romance Movies
    {
      id: "hridayam-2",
      title: "Hridayam 2",
      image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Romance", "Drama", "Musical"],
      releaseDate: "February 2024"
    },
    {
      id: "premam-2-malayalam",
      title: "Premam 2",
      image: "https://images.unsplash.com/photo-1543536448-1e76fc2795bf",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Romance", "Comedy", "Drama"],
      releaseDate: "March 2024"
    },
    {
      id: "bangalore-days-2",
      title: "Bangalore Days 2",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Romance", "Drama", "Comedy"],
      releaseDate: "April 2024"
    },
    {
      id: "charlie-2",
      title: "Charlie 2",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Romance", "Drama", "Adventure"],
      releaseDate: "May 2024"
    },
    {
      id: "ustad-hotel-2",
      title: "Ustad Hotel 2",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Romance", "Drama", "Family"],
      releaseDate: "June 2024"
    },
    {
      id: "thattathin-marayathu-2",
      title: "Thattathin Marayathu 2",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Romance", "Comedy"],
      releaseDate: "July 2024"
    },
    {
      id: "om-shanti-oshana-2",
      title: "Om Shanti Oshana 2",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Romance", "Comedy", "Drama"],
      releaseDate: "August 2024"
    },
    {
      id: "ennu-ninte-moideen-2",
      title: "Ennu Ninte Moideen 2",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Romance", "Drama", "Period"],
      releaseDate: "September 2024"
    },
    {
      id: "koode-2",
      title: "Koode 2",
      image: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Romance", "Drama", "Fantasy"],
      releaseDate: "October 2024"
    },
    {
      id: "aniyathipravu-2",
      title: "Aniyathipravu 2",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Romance", "Family", "Drama"],
      releaseDate: "November 2024"
    },

    // Hindi Action Movies
    {
      id: "pathaan-2",
      title: "Pathaan 2",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Thriller", "Spy"],
      releaseDate: "January 2024"
    },
    {
      id: "war-2",
      title: "War 2",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Thriller"],
      releaseDate: "March 2024"
    },
    {
      id: "fighter",
      title: "Fighter",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Patriotic"],
      releaseDate: "January 2024"
    },
    {
      id: "tiger-3",
      title: "Tiger 3",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Spy", "Thriller"],
      isNewRelease: true
    },
    {
      id: "dhoom-4",
      title: "Dhoom 4",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Thriller", "Heist"],
      releaseDate: "April 2024"
    },
    {
      id: "bang-bang-2",
      title: "Bang Bang 2",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Romance"],
      releaseDate: "May 2024"
    },
    {
      id: "don-3",
      title: "Don 3",
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Crime", "Thriller"],
      releaseDate: "June 2024"
    },
    {
      id: "krrish-4",
      title: "Krrish 4",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Sci-Fi", "Superhero"],
      releaseDate: "July 2024"
    },
    {
      id: "force-3",
      title: "Force 3",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Crime"],
      releaseDate: "August 2024"
    },
    {
      id: "saaho-2",
      title: "Saaho 2",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Hindi",
      certification: "U/A",
      genres: ["Action", "Sci-Fi", "Crime"],
      releaseDate: "September 2024"
    },

    // Tamil Action Movies
    {
      id: "leo-2",
      title: "Leo 2",
      image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd",
      language: "Tamil",
      certification: "U/A",
      genres: ["Action", "Crime", "Thriller"],
      releaseDate: "March 2024"
    },
    {
      id: "vikram-2",
      title: "Vikram 2",
      image: "https://images.unsplash.com/photo-1543536448-1e76fc2795bf",
      language: "Tamil",
      certification: "U/A",
      genres: ["Action", "Crime", "Thriller"],
      releaseDate: "May 2024"
    },
    {
      id: "theri-2",
      title: "Theri 2",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb",
      language: "Tamil",
      certification: "U/A",
      genres: ["Action", "Drama"],
      releaseDate: "July 2024"
    },
    {
      id: "valimai-2",
      title: "Valimai 2",
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0",
      language: "Tamil",
      certification: "U/A",
      genres: ["Action", "Crime"],
      releaseDate: "September 2024"
    },
    {
      id: "beast-2",
      title: "Beast 2",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434",
      language: "Tamil",
      certification: "U/A",
      genres: ["Action", "Thriller"],
      releaseDate: "November 2024"
    },

    // Telugu Action Movies
    {
      id: "pushpa-2",
      title: "Pushpa 2",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Crime", "Drama"],
      releaseDate: "April 2024"
    },
    {
      id: "rrr-2",
      title: "RRR 2",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Period", "Drama"],
      releaseDate: "June 2024"
    },
    {
      id: "salaar-2",
      title: "Salaar 2",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Drama"],
      releaseDate: "August 2024"
    },
    {
      id: "kgf-3",
      title: "KGF 3",
      image: "https://images.unsplash.com/photo-1535704882196-765e5fc62a53",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Crime", "Period"],
      releaseDate: "October 2024"
    },
    {
      id: "agent-2",
      title: "Agent 2",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
      language: "Telugu",
      certification: "U/A",
      genres: ["Action", "Spy", "Thriller"],
      releaseDate: "December 2024"
    },

    // Malayalam Action Movies
    {
      id: "lucifer-3",
      title: "Lucifer 3",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Action", "Crime", "Drama"],
      releaseDate: "March 2024"
    },
    {
      id: "pulimurugan-2",
      title: "Pulimurugan 2",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Action", "Adventure"],
      releaseDate: "May 2024"
    },
    {
      id: "kaduva-2",
      title: "Kaduva 2",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Action", "Drama"],
      releaseDate: "July 2024"
    },
    {
      id: "mikhael-2",
      title: "Mikhael 2",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Action", "Thriller"],
      releaseDate: "September 2024"
    },
    {
      id: "minnal-murali-2",
      title: "Minnal Murali 2",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      language: "Malayalam",
      certification: "U/A",
      genres: ["Action", "Superhero"],
      releaseDate: "November 2024"
    }
  ], []);

  // Filter movies based on search query
  const filteredMovies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const cacheKey = `${query}:${selectedCity}`;
    let results = null;

    // Check cache first
    if (query) {
      results = searchCache.get(cacheKey);
    }

    if (!results) {
      results = movies.filter(movie => {
        const matchesSearch = query === '' || 
          movie.title.toLowerCase().includes(query) ||
          movie.language.toLowerCase().includes(query) ||
          movie.genres.some(g => g.toLowerCase().includes(query));
        
        // Filter by city (can be extended based on city availability)
        const matchesCity = selectedCity === "Delhi-NCR" || true; // For now, showing all movies
        
        return matchesSearch && matchesCity;
      });

      // Cache search results
      if (query) {
        searchCache.set(cacheKey, results);
      }
    }

    return results;
  }, [movies, searchQuery, selectedCity, searchCache]);

  // Handle search events from Header
  useEffect(() => {
    const handleSearch = (event: CustomEvent<{ query: string }>) => {
      setSearchQuery(event.detail.query);
    };

    const handleCityChange = (event: CustomEvent<{ city: string }>) => {
      setSelectedCity(event.detail.city);
      searchCache.clear(); // Clear cache when city changes
    };

    window.addEventListener('movieSearch', handleSearch as EventListener);
    window.addEventListener('cityChange', handleCityChange as EventListener);

    return () => {
      window.removeEventListener('movieSearch', handleSearch as EventListener);
      window.removeEventListener('cityChange', handleCityChange as EventListener);
      searchCache.clear();
    };
  }, [searchCache]);

  // Infinite scroll using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleRows(prev => prev + ROWS_PER_LOAD);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, []);

  const visibleMovies = useMemo(() => {
    return filteredMovies.slice(0, visibleRows * MOVIES_PER_ROW);
  }, [filteredMovies, visibleRows]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {visibleMovies.map((movie: Movie) => (
          <MovieCard
            key={movie.id}
            {...movie}
          />
        ))}
      </div>
      {visibleMovies.length < filteredMovies.length && (
        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center mt-8"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      )}
      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No movies found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MovieList;