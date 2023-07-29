import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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
  @Input({ required: true }) person?: People;
  constructor() {}

  closeModal() {
    this.peopleStore.updateModalStatus(false);
  }
}
