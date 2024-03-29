import { randFromArray } from './rand-num'

export const firstNames = [
  'Adam',
  'Alex',
  'Alice',
  'Andrew',
  'Anna',
  'Anthony',
  'Barbara',
  'Betty',
  'Brandon',
  'Brian',
  'Carol',
  'Charles',
  'Christine',
  'Christopher',
  'Cynthia',
  'Daniel',
  'David',
  'Deborah',
  'Donald',
  'Donna',
  'Dorothy',
  'Edward',
  'Elizabeth',
  'Emily',
  'Eric',
  'Evelyn',
  'Frank',
  'George',
  'Grace',
  'Helen',
  'Henry',
  'Jack',
  'James',
  'Jane',
  'Jason',
  'Jennifer',
  'Jessica',
  'John',
  'Joseph',
  'Joshua',
  'Julie',
  'Karen',
  'Katherine',
  'Kathleen',
  'Kenneth',
  'Kevin',
  'Laura',
  'Linda',
  'Lisa',
  'Margaret',
  'Maria',
  'Mark',
  'Mary',
  'Matthew',
  'Melissa',
  'Michael',
  'Michelle',
  'Nancy',
  'Nicole',
  'Patricia',
  'Patrick',
  'Paul',
  'Peter',
  'Rachel',
  'Raymond',
  'Richard',
  'Robert',
  'Roger',
  'Ronald',
  'Ryan',
  'Sandra',
  'Sarah',
  'Scott',
  'Sharon',
  'Stephen',
  'Susan',
  'Teresa',
  'Thomas',
  'Timothy',
  'Virginia',
  'Walter',
  'William',
]

export const lastNames = [
  'Adams',
  'Allen',
  'Anderson',
  'Bailey',
  'Baker',
  'Barnes',
  'Bell',
  'Bennett',
  'Brooks',
  'Brown',
  'Bryant',
  'Campbell',
  'Carter',
  'Clark',
  'Collins',
  'Cook',
  'Cooper',
  'Cox',
  'Davis',
  'Diaz',
  'Edwards',
  'Evans',
  'Foster',
  'Flores',
  'Garcia',
  'Gonzales',
  'Gonzalez',
  'Gray',
  'Green',
  'Griffin',
  'Hall',
  'Harris',
  'Hayes',
  'Henderson',
  'Hernandez',
  'Hill',
  'Howard',
  'Hughes',
  'Jackson',
  'James',
  'Jenkins',
  'Johnson',
  'Jones',
  'Kelly',
  'King',
  'Lee',
  'Lewis',
  'Lopez',
  'Long',
  'Martinez',
  'Martin',
  'Miller',
  'Mitchell',
  'Moore',
  'Morgan',
  'Morris',
  'Murphy',
  'Nelson',
  'Parker',
  'Patterson',
  'Perez',
  'Perry',
  'Peterson',
  'Phillips',
  'Powell',
  'Price',
  'Ramirez',
  'Reed',
  'Richardson',
  'Rivera',
  'Roberts',
  'Robinson',
  'Rodriguez',
  'Rogers',
  'Ross',
  'Russell',
  'Sanchez',
  'Sanders',
  'Scott',
  'Simmons',
  'Smith',
  'Stewart',
  'Taylor',
  'Thomas',
  'Thompson',
  'Torres',
  'Turner',
  'Walker',
  'Washington',
  'Watson',
  'Ward',
  'White',
  'Williams',
  'Wilson',
  'Wood',
  'Wright',
  'Young',
]

export const getRandomFirstName = () => {
  return randFromArray(firstNames)
}

export const getRandomLastName = () => {
  return randFromArray(lastNames)
}

export const getRandomFullName = () => {
  return `${getRandomFirstName()} ${getRandomLastName()}`
}
