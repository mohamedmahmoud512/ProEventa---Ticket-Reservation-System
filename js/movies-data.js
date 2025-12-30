// movies-data.js
// Acts as local JSON — modify/add movies as you like.
const MOVIES = [
  {
    id: 1,
    title: "Mission: Impossible - Fallout",
    rating: 8.4,
    year: 2018,
    votes: 40648,
    poster: "../assets/MI_–_Fallout.jpg",
    description: "It explains that when an IMF mission fails, the world faces catastrophic consequences. Ethan Hunt must fix the aftermath while the CIA questions his motives. The team races against time while being hunted by assassins as they try to stop a global disaster.",
    cast: ["Tom Cruise", "Henry Cavill", "Ving Rhames", "Simon Pegg", "Rebecca Ferguson"],
    language: "English",
    cinema: "AMC Theatres",
    showtimes: [
      { date: "08/20/2018", time: "1:20 PM" },
      { date: "08/20/2018", time: "4:30 PM" },
      { date: "08/20/2018", time: "7:45 PM" }
    ]
  },
  {
    id: 2,
    title: "John Wick: Chapter 4",
    rating: 8.2,
    year: 2023,
    votes: 21000,
    poster: "../assets/John Wick.jpg",
    description: "John Wick faces enemies across the globe in his fight for freedom.",
    cast: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård"],
    language: "English",
    cinema: "Regal Cinemas",
    showtimes: [
      { date: "03/24/2023", time: "2:00 PM" },
      { date: "03/24/2023", time: "5:15 PM" },
      { date: "03/24/2023", time: "8:30 PM" }
    ]
  },
  {
    id: 3,
    title: "Oppenheimer",
    rating: 9.0,
    year: 2023,
    votes: 145000,
    poster: "../assets/Oppenheimer.jpg",
    description: "A dramatic biopic about J. Robert Oppenheimer and the development of the atomic bomb.",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
    language: "English",
    cinema: "Cinemark",
    showtimes: [
      { date: "07/21/2023", time: "12:00 PM" },
      { date: "07/21/2023", time: "3:15 PM" },
      { date: "07/21/2023", time: "6:30 PM" }
    ]
  },
  {
    id: 4,
    title: "Avengers: Endgame",
    rating: 8.5,
    year: 2019,
    votes: 800000,
    poster: "../assets/Avengers.jpg",
    description: "The Avengers assemble once more to undo Thanos' actions.",
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    language: "English",
    cinema: "AMC Theatres",
    showtimes: [
      { date: "04/26/2019", time: "10:00 AM" },
      { date: "04/26/2019", time: "1:15 PM" },
      { date: "04/26/2019", time: "4:30 PM" }
    ]
  },
  {
    id: 5,
    title: "Inception",
    rating: 8.8,
    year: 2010,
    votes: 2100000,
    poster: "../assets/Inception.jpg",
    description: "A mind-bending thriller about dream infiltration and regrets.",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"]
  },
  {
    id: 6,
    title: "The Dark Knight",
    rating: 9.0,
    year: 2008,
    votes: 2300000,
    poster: "../assets/The Dark Knight.jpg",
    description: "Batman faces the Joker in a battle for Gotham's soul.",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    language: "English",
    cinema: "AMC Theatres",
    showtimes: [
      { date: "07/18/2008", time: "12:15 PM" },
      { date: "07/18/2008", time: "3:30 PM" },
      { date: "07/18/2008", time: "6:45 PM" }
    ]
  },
  {
    id: 7,
    title: "Interstellar",
    rating: 8.6,
    year: 2014,
    votes: 1500000,
    poster: "../assets/Interstellar.jpg",
    description: "A team of explorers travel through a wormhole in space.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    language: "English",
    cinema: "AMC Theatres",
    showtimes: [
      { date: "11/07/2014", time: "11:00 AM" },
      { date: "11/07/2014", time: "2:30 PM" },
      { date: "11/07/2014", time: "6:00 PM" }
    ]
  },
  {
    id: 8,
    title: "Parasite",
    rating: 8.6,
    year: 2019,
    votes: 700000,
    poster: "../assets/Parasite.jpg",
    description: "A darkly comic thriller about class conflict and deception.",
    cast: ["Song Kang-ho", "Cho Yeo-jeong", "Choi Woo-shik"],
    language: "Korean",
    cinema: "Regal Cinemas",
    showtimes: [
      { date: "05/30/2019", time: "4:00 PM" },
      { date: "05/30/2019", time: "7:15 PM" },
      { date: "05/30/2019", time: "10:30 PM" }
    ]
  },
  {
    id: 9,
    title: "The Matrix",
    rating: 8.7,
    year: 1999,
    votes: 1700000,
    poster: "../assets/The Matrix.jpg",
    description: "A hacker discovers reality is a simulation controlled by machines.",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    language: "English",
    cinema: "Cinemark",
    showtimes: [
      { date: "03/31/1999", time: "3:30 PM" },
      { date: "03/31/1999", time: "6:45 PM" },
      { date: "03/31/1999", time: "10:00 PM" }
    ]
  },
  {
    id: 10,
    title: "Gladiator",
    rating: 8.5,
    year: 2000,
    votes: 1400000,
    poster: "../assets/Gladiator.jpg",
    description: "A former Roman general seeks vengeance against a corrupt emperor.",
    cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"],
    language: "English",
    cinema: "AMC Theatres",
    showtimes: [
      { date: "05/05/2000", time: "1:45 PM" },
      { date: "05/05/2000", time: "5:00 PM" },
      { date: "05/05/2000", time: "8:15 PM" }
    ]
  },
  {
    id: 11,
    title: "Dune",
    rating: 8.1,
    year: 2021,
    votes: 500000,
    poster: "../assets/Dune.jpg",
    description: "A noble family becomes embroiled in a war for control of the desert planet Arrakis.",
    cast: ["Timothée Chalamet", "Zendaya", "Oscar Isaac"],
    language: "English",
    cinema: "Cinemark",
    showtimes: [
      { date: "10/22/2021", time: "11:15 AM" },
      { date: "10/22/2021", time: "2:45 PM" },
      { date: "10/22/2021", time: "6:15 PM" }
    ]
  },
  {
    id: 12,
    title: "Tenet",
    rating: 7.3,
    year: 2020,
    votes: 300000,
    poster: "../assets/Tenet.jpg",
    description: "A spy embarks on a mission that involves time inversion to prevent World War III.",
    cast: ["John David Washington", "Robert Pattinson", "Elizabeth Debicki"],
    language: "English",
    cinema: "Regal Cinemas",
    showtimes: [
      { date: "09/03/2020", time: "3:00 PM" },
      { date: "09/03/2020", time: "6:30 PM" },
      { date: "09/03/2020", time: "10:00 PM" }
    ]
  }
];

