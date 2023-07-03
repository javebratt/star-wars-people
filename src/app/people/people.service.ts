import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BASE_URL } from './people.constants';
import { FilmResponse, PeopleResponse, Planet } from './people.interface';

@Injectable()
export class PeopleService {
  http = inject(HttpClient);

  getPeople(page: string) {
    return this.http.get<PeopleResponse>(`${BASE_URL}/people`, {
      params: { page },
    });
  }

  getFilms() {
    return this.http.get<FilmResponse>(`${BASE_URL}/films`);
  }

  getPlanet(planetURL: string) {
    return this.http.get<Planet>(planetURL);
  }
}
