import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';

const SONG_API_URL = 'https://localhost:7085/api/song';

export type SongItem = {
  type: 'header' | 'song' | 'line';
  text: string;
  link: string;
  selected: boolean;
};

@Injectable({ providedIn: 'root' })
export class SongService {
  private _songs$ = new BehaviorSubject<Array<SongItem | undefined>>([]);
  readonly songs$ = this._songs$.asObservable();
  private _current$ = new Subject<{ title: string; audioUrl: string }>();
  readonly currentSong$ = this._current$.asObservable();

  private readonly _httpClient = inject(HttpClient);

  constructor() {
    this.fetchItems();
  }

  updateTitleSelection(selectedItemChanges: string | undefined) {
    const source = this._songs$.value;
    for (let s of source) {
      if (s?.type === 'song') {
        s.selected = s.text === selectedItemChanges;
        if (s.text === selectedItemChanges) {
          this._current$.next({ title: s.text, audioUrl: s.link });
        }
      }
    }
    this._songs$.next(source);
  }

  private fetchItems() {
    firstValueFrom(this._httpClient.get(SONG_API_URL))
      .then((data) => {
        const result: Map<
          string,
          Array<{ title: string; audioUrl: string }>
        > = new Map(Object.entries(data));
        const nextStream = this.flatSongList(result);
        this._songs$.next(nextStream);
      })
      .catch((error) => {
        console.error('Fetch Error: ', error);
      });
  }

  async dispatchSongUpdate(song: { title: string; audioUrl: string }) {
    try {
      const _ = await firstValueFrom(this._httpClient.post(SONG_API_URL, song));
      this.fetchItems();
    } catch (error) {
      console.error('Post Error: ', error);
    }
  }

  private flatSongList(
    mapResult: Map<string, Array<{ title: string; audioUrl: string }>>
  ): Array<SongItem> {
    const flatResult: Array<SongItem> = [];
    for (const [key, value] of mapResult.entries()) {
      flatResult.push({ type: 'header', text: key, link: '', selected: false });
      for (const song of value) {
        flatResult.push({
          type: 'song',
          text: song.title,
          link: song.audioUrl,
          selected: false,
        });
      }
      flatResult.push({ type: 'line', text: '', link: '', selected: false });
    }

    return flatResult;
  }
}
