import { Component, inject, signal, WritableSignal, effect, computed, Signal } from '@angular/core';
import { EmojisResource } from './service/emojis-resource';
import { NgFor, NgIf } from '@angular/common';
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

  constructor() {
    this.debouncedSearch = toSignal(toObservable(this.searchInput).pipe(debounceTime(1000)), {initialValue: ''});
  }

  protected search(searchEvent: Event) {
    this.searchInput.set((searchEvent.target as HTMLInputElement).value);
  }
}
