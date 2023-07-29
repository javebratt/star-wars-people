import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Observable, filter } from 'rxjs';
import { isNotNullOrUndefined } from '../../util/type-guard';
import { People } from '../people.interface';
import { PeopleStore } from '../people.store';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class DetailComponent {
  peopleStore = inject(PeopleStore);
  person$: Observable<People> = this.peopleStore.currentPerson$.pipe(
    filter(isNotNullOrUndefined)
  );
  constructor() {}

  closeModal() {
    this.peopleStore.updateModalStatus(false);
  }
}
