import { Injectable, inject } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { filter, switchMap } from 'rxjs/operators';
import { Film, People } from './people.interface';
import { PeopleService } from './people.service';

export interface PeopleState {
  people: People[];
  films: Film[];
  currentPage: string;
  peopleCount: number;
  currentPerson?: People;
}

export const INITIAL_STATE = {
  people: [],
  films: [],
  currentPage: '1',
  peopleCount: 1,
};

@Injectable()
export class PeopleStore extends ComponentStore<PeopleState> {
  peopleService = inject(PeopleService);

  readonly people$ = this.select((state) => state.people);
  readonly currentPage$ = this.select((state) => state.currentPage);
  readonly peopleCount$ = this.select((state) => state.peopleCount);
  readonly films$ = this.select((state) => state.films);

  readonly updatePeople = this.updater((state, people: People[]) => ({
    ...state,
    people: [...state.people, ...people],
  }));

  readonly setCurrentPage = this.updater((state, currentPage: string) => ({
    ...state,
    currentPage,
  }));

  readonly setPeopleCount = this.updater((state, peopleCount: number) => ({
    ...state,
    peopleCount,
  }));

  readonly updateFilms = this.updater((state, films: Film[]) => ({
    ...state,
    films,
  }));

  readonly setCurrentPerson = this.updater((state, currentPerson: People) => ({
    ...state,
    currentPerson,
  }));

  /**
   * const people = response.results.map((person) => ({
  ...person,
  films: person.films.map((filmId) => {
    return films.find((film) => film.url === filmId);
  }),
}));
   */

  readonly fetchFilms = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.peopleService.getFilms().pipe(
          tapResponse(
            (response) => {
              this.updateFilms(response.results);
            },
            (error) => console.error('error', error)
          )
        )
      )
    )
  );

  readonly fetchPeople = this.effect((trigger$) =>
    trigger$.pipe(
      concatLatestFrom(() => [this.currentPage$]),
      switchMap(([, page]) =>
        this.peopleService.getPeople(page).pipe(
          tapResponse(
            (response) => {
              this.updatePeople(response.results);
              this.setPeopleCount(response.count);
              this.setCurrentPage('2');
            },
            (error) => console.error('error', error)
          )
        )
      )
    )
  );

  readonly loadMorePeople = this.effect<InfiniteScrollCustomEvent>(
    (infiniteScrollEvent$) =>
      infiniteScrollEvent$.pipe(
        concatLatestFrom(() => [
          this.currentPage$,
          this.peopleCount$,
          this.people$,
        ]),
        filter(([infiniteScrollEvent, , count, people]) => {
          if (people.length < count) {
            return true;
          } else {
            infiniteScrollEvent.target.complete();
            return false;
          }
        }),
        switchMap(([infiniteScrollEvent, page]) =>
          this.peopleService.getPeople(page).pipe(
            tapResponse(
              (response) => {
                this.updatePeople(response.results);
                this.setCurrentPage((parseInt(page) + 1).toString());
                infiniteScrollEvent.target.complete();
              },
              (error) => console.error('error', error)
            )
          )
        )
      )
  );

  constructor() {
    super(INITIAL_STATE);
    this.fetchPeople();
    this.fetchFilms();
    this.state$.subscribe((state) => console.log(state));
  }
}
