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
  private _songs$ = new BehaviorSubject<Array<SongItem>>([]);
  readonly songs$ = this._songs$.asObservable();
  private _current$ = new Subject<{ title: string; audioUrl: string }>();
  readonly currentSong$ = this._current$.asObservable();

  private readonly _httpClient = inject(HttpClient);

  constructor() {
    this.fetchItems();
  }

  updateTitleSelection(selectedItemChanges: string) {
    const snapshotSongs = this._songs$.value;
    const updatedList = snapshotSongs.map((s) =>
      s.type === 'song' ? { ...s, selected: s.text === selectedItemChanges } : s
    );
    this._songs$.next(updatedList);

    const selectedSong = updatedList.find(
      (s) => s.type === 'song' && s.selected
    );
    if (selectedSong) {
      this._current$.next({
        title: selectedSong.text,
        audioUrl: selectedSong.link,
      });
    }
  }

  private async fetchItems() {
    try {
      const data = await firstValueFrom(this._httpClient.get(SONG_API_URL));
      const result: Map<
        string,
        Array<{ title: string; audioUrl: string }>
      > = new Map(Object.entries(data));
      const nextStream = this.flatSongList(result);
      this._songs$.next(nextStream);
    } catch (error) {
      console.error('Fetch error', error);
    }
  }

  async dispatchSongUpdate(song: { title: string; audioUrl: string }) {
    try {
      const _ = await firstValueFrom(this._httpClient.post(SONG_API_URL, song));
      await this.fetchItems();
    } catch (error) {
      console.error('Post Error: ', error);
    }
  }

  private flatSongList(
    mapResult: Map<string, Array<{ title: string; audioUrl: string }>>
  ): Array<SongItem> {
    const flatResult: Array<SongItem> = [];
    for (const [key, value] of mapResult) {
      flatResult.push({ type: 'header', text: key, link: '', selected: false });

      const list: SongItem[] = value.map((v) => ({
        type: 'song',
        text: v.title,
        link: v.audioUrl,
        selected: false,
      }));
      flatResult.push(...list);

      flatResult.push({ type: 'line', text: '', link: '', selected: false });
    }

    return flatResult;
  }
}
