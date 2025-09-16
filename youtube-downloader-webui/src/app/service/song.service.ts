import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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
    try {
      fetch(`${SONG_API_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((data) => data.json())
        .then((data) => {
          const result: Map<
            string,
            Array<{ title: string; audioUrl: string }>
          > = new Map(Object.entries(data));
          const nextStream = this.flatSongList(result);
          this._songs$.next(nextStream);
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    } catch (err) {
      console.log('download error: ' + err);
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
