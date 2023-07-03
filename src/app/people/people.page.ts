import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InfiniteScrollCustomEvent,
  IonRouterOutlet,
  IonicModule,
} from '@ionic/angular';
import { People } from './people.interface';
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
  routerOutlet = inject(IonRouterOutlet);

  vm$ = this.peopleStore.vm$;
  presentingElement = this.routerOutlet.nativeEl;

  onIonInfinite(ev: Event) {
    this.peopleStore.loadMorePeople(ev as InfiniteScrollCustomEvent);
  }

  selectPerson(person: People) {
    this.peopleStore.setCurrentPerson(person);
  }

  closeModal() {
    this.peopleStore.updateModalStatus(false);
  }

  onWillDismiss() {
    this.peopleStore.updateModalStatus(false);
  }
}
