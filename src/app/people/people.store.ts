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
  isModalOpen: boolean;
}

export const INITIAL_STATE = {
  people: [],
  films: [],
  currentPage: '1',
  peopleCount: 1,
  isModalOpen: false,
};

@Injectable()
export class PeopleStore extends ComponentStore<PeopleState> {
  peopleService = inject(PeopleService);

  readonly people$ = this.select((state) => state.people);
  readonly currentPage$ = this.select((state) => state.currentPage);
  readonly peopleCount$ = this.select((state) => state.peopleCount);
  readonly films$ = this.select((state) => state.films);

  readonly currentPerson$ = this.select((state) => state.currentPerson);
  readonly isModalOpen$ = this.select((state) => state.isModalOpen);

  readonly vm$ = this.select({
    people: this.people$,
    currentPerson: this.currentPerson$,
    isModalOpen: this.isModalOpen$,
  });

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

  readonly updateCurrentPerson = this.updater(
    (state, currentPerson: People) => ({
      ...state,
      currentPerson,
    })
  );

  readonly updateModalStatus = this.updater((state, isModalOpen: boolean) => ({
    ...state,
    isModalOpen,
  }));

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

  readonly setCurrentPerson = this.effect<People>((currentPerson$) =>
    currentPerson$.pipe(
      concatLatestFrom(() => [this.films$]),
      switchMap(([currentPerson, films]) =>
        this.peopleService.getPlanet(currentPerson.homeworld as string).pipe(
          tapResponse(
            (response) => {
              this.updateCurrentPerson({
                ...currentPerson,
                homeworldDetails: response,
                filmsDetail: currentPerson.films.map((filmId) => {
                  return films.find((film) => film.url === filmId) as Film;
                }),
              });
              this.updateModalStatus(true);
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
              this.setCurrentPage((parseInt(page) + 1).toString());
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
    this.currentPerson$.subscribe((person) => console.log(person));
  }
}
