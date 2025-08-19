import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmojisResource {
  private http = inject(HttpClient);
  private search = signal('');
  private url = `https://emojihub.yurace.pro/api/`;

  private _EmojiList = rxResource({
    params: this.search,
    defaultValue: [],
    stream: ({params: search}) => this.http.get<any[]>( search ? this.url+'similar/'+search : this.url+'all').pipe(delay(1000))
  })

  public emojiList() {
    return this._EmojiList;
  }

  public emojiSearch(searchValue: string) {
    this.search.set(searchValue);
  }
}
