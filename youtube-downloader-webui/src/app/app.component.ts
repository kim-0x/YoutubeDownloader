import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf, PercentPipe } from '@angular/common';
import { ReportService } from './service/report.service';
import { debounceTime, firstValueFrom, Subscription } from 'rxjs';
import { DownloadService } from './service/download.service';
import { VideoService } from './service/video.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [
    NgIf,
    PercentPipe,
    AsyncPipe,
    RouterOutlet,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _reportService = inject(ReportService);
  private readonly _downloadService = inject(DownloadService);
  private readonly _videoService = inject(VideoService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _subscription = new Subscription();

  @ViewChild('downloadAudioDialogTemplate')
  _downloadTemplate!: TemplateRef<any>;

  readonly downloadForm: FormGroup = this._formBuilder.group({
    videoUrl: [''],
    title: [''],
    startAt: [''],
    endAt: [''],
  });

  readonly progressMessage$ = this._reportService.latestProgress$;
  readonly errorMessage$ = this._reportService.errorMessage$;
  readonly outputAudioLink$ = this._reportService.completedMessage$;

  ngOnInit(): void {
    this._subscription.add(
      this.downloadForm
        .get('videoUrl')
        ?.valueChanges.pipe(debounceTime(150))
        .subscribe((url) => {
          if (url) this.getInfo(url);
        })
    );
  }

  async getInfo(url: string) {
    if (!url) {
      alert('Please enter a valid URL.');
      return;
    }

    try {
      const result = await firstValueFrom(this._videoService.getInfo(url));
      this.downloadForm.patchValue({
        title: result.title,
        startAt: '00:00:00',
        endAt: result.duration,
      });
    } catch (err) {
      console.error('Get video info error: ' + err);
    }
  }

  async download() {
    const { videoUrl, title, startAt, endAt } = this.downloadForm.value;

    if (!videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }

    try {
      await firstValueFrom(
        this._downloadService.triggerDownload({
          videoUrl,
          title,
          startAt,
          endAt,
        })
      );

      this._dialog.open(this._downloadTemplate);
    } catch (err) {
      console.error('Download error: ' + err);
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
