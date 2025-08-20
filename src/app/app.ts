import { Component, inject, signal, WritableSignal, effect, computed, Signal, linkedSignal } from '@angular/core';
import { EmojisResource } from './service/emojis-resource';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounce, debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [NgIf, NgFor],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private emojiResource = inject(EmojisResource);

  private debouncedSearch!: Signal<string>;
  protected searchInput: WritableSignal<string> = signal('');
  protected emojiList = this.emojiResource.emojiList();
  protected filteredList = computed(() => {
    return this.emojiResource
      .emojiList()
      .value()
      .filter((v) => {
        const query = this.debouncedSearch();
        if (!query) true;
        return v.name.includes(query);
      });
  });
  protected filteredCategories = computed(() => {
    const categories = this.filteredList().map((emoji) => emoji.category);
    return [...new Set(categories)];
  });
  protected groupFilter: WritableSignal<string> = linkedSignal({
    source: this.filteredList,
    computation: () => 'All'
  });
  protected groupedEmojis = computed(() => {
    const groupedData: Record<string, any[]> = {};
    this.filteredList().forEach((emojiData) => {
      if (groupedData[emojiData.category]) {
        groupedData[emojiData.category].push(emojiData);
      } else {
        groupedData[emojiData.category] = [emojiData];
      }
    });
    return groupedData;
  });

  constructor() {
    this.debouncedSearch = toSignal(toObservable(this.searchInput).pipe(debounceTime(1000)), {
      initialValue: '',
    });

    // effect(() => {
    //   this.filteredList(),
    //   this.groupFilter.set('All');
    // })
  }

  protected search(searchEvent: Event) {
    this.searchInput.set((searchEvent.target as HTMLInputElement).value);
  }

  protected onFilterChange(searchEvent: Event) {
    const value = (searchEvent.target as HTMLInputElement).value;
    this.groupFilter.set(value);
  }

  get groupedEmojisEntries(): [string, any][] {
    return Object.entries(this.groupedEmojis());
  }

  protected copyToClipboard(emojiCode: []) {
    navigator.clipboard.writeText(emojiCode.join('')).then(() => {
      alert('Copied Successfully!')
    }).catch(() => {
      alert('Something went wrong!')
    })
  }
}
