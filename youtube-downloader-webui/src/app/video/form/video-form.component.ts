import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, firstValueFrom, Subscription } from 'rxjs';
import { VideoService } from '../../service/video.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { VideoDialogComponent } from '../dialog/video-dialog.component';
import { ReportService } from '../../service/report.service';

@Component({
  selector: 'app-video-form',
  templateUrl: './video-form.component.html',
  styleUrl: './video-form.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class VideoFormComponent implements OnInit, OnDestroy {
  private readonly _reportService = inject(ReportService);
  private readonly _videoService = inject(VideoService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _subscription = new Subscription();
  private readonly _dialog: MatDialog = inject(MatDialog);

  readonly downloadForm: FormGroup = this._formBuilder.group({
    videoUrl: [''],
    title: [''],
    startAt: [''],
    endAt: [''],
  });

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
      await this._reportService.dispatchDownload({
        videoUrl,
        title,
        startAt,
        endAt,
      });
      this._dialog.open(VideoDialogComponent);
    } catch (err) {
      console.error('Download error: ' + err);
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
