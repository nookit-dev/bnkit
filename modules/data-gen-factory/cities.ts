import { randFromArray } from "./rand-num";

const cities = [
  "Albany",
  "Austin",
  "Baltimore",
  "Boston",
  "Charlotte",
  "Chicago",
  "Dallas",
  "Denver",
  "Detroit",
  "Houston",
  "Indianapolis",
  "Jacksonville",
  "Kansas City",
  "Las Vegas",
  "Los Angeles",
  "Louisville",
  "Memphis",
  "Miami",
  "Minneapolis",
  "Nashville",
  "New Orleans",
  "New York",
  "Oklahoma City",
  "Orlando",
  "Philadelphia",
  "Phoenix",
  "Portland",
  "Raleigh",
  "Sacramento",
  "San Antonio",
  "San Diego",
  "San Francisco",
  "San Jose",
  "Seattle",
  "St. Louis",
  "Tampa",
  "Washington, D.C.",
  "Albuquerque",
  "Atlanta",
  "Boise",
  "Buffalo",
  "Cincinnati",
  "Cleveland",
  "Columbus",
  "Des Moines",
  "El Paso",
  "Fort Worth",
  "Fresno",
  "Honolulu",
  "Indianapolis",
  "Jacksonville",
  "Kansas City",
  "Las Vegas",
  "Little Rock",
  "Madison",
  "Manchester",
  "Milwaukee",
  "Mobile",
  "Montgomery",
  "Newark",
  "Oakland",
  "Omaha",
  "Pittsburgh",
  "Reno",
  "Richmond",
  "Riverside",
  "Salt Lake City",
  "Santa Ana",
  "Savannah",
  "Syracuse",
  "Tacoma",
  "Toledo",
  "Tucson",
  "Tulsa",
  "Virginia Beach",
  "Wichita",
  "Wilmington",
  "Anchorage",
  "Arlington",
  "Aurora",
  "Bakersfield",
  "Chandler",
  "Chesapeake",
  "Chula Vista",
  "Durham",
  "Fremont",
  "Garland",
  "Gilbert",
  "Glendale",
  "Hialeah",
  "Irvine",
  "Irving",
  "Laredo",
  "Mesa",
  "Norfolk",
  "North Las Vegas",
  "Plano",
  "Raleigh",
  "Riverside",
  "Rochester",
  "Scottsdale",
  "Spokane",
  "Stockton",
  "Toledo",
];

export const getRandomCity = () => {
  return randFromArray(cities);
};
