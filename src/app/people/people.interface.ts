export interface People {
  name: string;
  height: string;
  hair_color: string;
  eye_color: string;
  birth_year: string;
  homeworld: string;
  homeworldDetails?: Planet;
  films: string[];
  filmsDetail: Film[];
  url: string;
}

export interface Film {
  title: string;
  episode_id: 4;
  opening_crawl: string;
  release_date: string;
  url: string;
}

export interface Planet {
  name: string;
  climate: string;
  terrain: string;
  population: string;
  url: string;
}
export interface PeopleResponse {
  count: number;
  next: string;
  previous: string;
  results: People[];
}

export interface FilmResponse {
  count: number;
  next: string;
  previous: string;
  results: Film[];
}
