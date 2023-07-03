import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { PeopleService } from './people.service';
import { PeopleStore } from './people.store';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
  standalone: true,
  providers: [PeopleService, PeopleStore],
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class PeoplePage {
  peopleStore = inject(PeopleStore);

  people$ = this.peopleStore.people$;

  onIonInfinite(ev: Event) {
    console.log('calling');
    this.peopleStore.loadMorePeople(ev as InfiniteScrollCustomEvent);
  }
}
