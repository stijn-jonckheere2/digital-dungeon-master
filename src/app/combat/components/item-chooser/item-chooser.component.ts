import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { InventoryItem } from '../../../shared/models';

@Component({
  selector: 'app-item-chooser',
  templateUrl: './item-chooser.component.html',
  styleUrls: ['./item-chooser.component.scss']
})
export class ItemChooserComponent implements OnInit {
  @Input() inventory: InventoryItem[];
  @Output() itemSelected: EventEmitter<InventoryItem> = new EventEmitter();
  @Output() itemCanceled: EventEmitter<null> = new EventEmitter();

  availableItems: InventoryItem[] = [];

  constructor() { }

  ngOnInit() {
    this.filterItems();
  }

  filterItems() {
    for (const it of this.inventory) {
      if (it.consumable) {
        this.availableItems.push(it);
      }
    }
  }

  useItem(item: InventoryItem) {
    this.itemSelected.emit(item);
  }

  cancelItem() {
    this.itemCanceled.emit();
  }

}
