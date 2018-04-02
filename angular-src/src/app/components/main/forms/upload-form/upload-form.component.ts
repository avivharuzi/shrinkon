import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';

import { Validator } from '../../../../models/validator.model';
import { ValidationService } from '../../../../services/validation/validation.service';
import { Shrink } from '../../../../models/shrink.model';
import { ShrinkService } from '../../../../services/shrink/shrink.service';

import { DOWNLOAD_SHRINK_FILE } from './../../../../constants/urls';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit, OnDestroy {
  public shrinkForm: FormGroup;
  public images: File[];
  public imagesLabel: string;
  public imagesUrls: any;
  public downloadLink: string;

  public typeMessage: string;
  public uploadMessage: any;

  public uploadProgress: number = 0;
  public uploadComplete: boolean = false;
  public uploadingProgressing: boolean = false;
  public fileUploadSub: Subscription;

  @ViewChild('filePicture')
  public filePicture: any;

  constructor(
    private validationService: ValidationService,
    private shrinkService: ShrinkService
  ) {
    this.imagesLabel = 'Choose Images';
  }

  ngOnInit() {
    this.createShrinkForm();
  }

  ngOnDestroy() {
    if (this.fileUploadSub) {
      this.fileUploadSub.unsubscribe();
    }
  }

  createShrinkForm(): void {
    const width = new FormControl(null, [
      Validator.required('Width'),
      Validator.isNumericFloat(),
      Validator.minAndMaxNumbers(100, 10000)
    ]);

    const height = new FormControl(null, [
      Validator.required('Height'),
      Validator.isNumericFloat(),
      Validator.minAndMaxNumbers(100, 10000)
    ]);

    const quality = new FormControl(50, [
      Validator.required('Quality'),
      Validator.isNumericFloat(),
      Validator.minAndMaxNumbers(1, 100)
    ]);

    this.shrinkForm = new FormGroup({
      width,
      height,
      quality
    });
  }

  changeImages(event): void {
    let fileList: FileList = event.target.files;

    this.images = new Array<File>();
    this.imagesUrls = new Array<any>();

    if (fileList && fileList.length) {
      for (let i = 0; i < fileList.length; i++) {
        this.images.push(fileList.item(i));

        let reader = new FileReader();
        reader.onload = (onloadEvent: any) => {
          this.imagesUrls.push(onloadEvent.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }

    if (this.images && this.images.length > 1) {
      this.imagesLabel = this.images.length + ' Images Selected';
    } else if (this.images.length === 1) {
      this.imagesLabel = this.images[0].name;
    } else {
      this.imagesLabel = 'Choose Images';
    }
  }

  onSubmit(): void {
    if (this.shrinkForm.valid && this.validateImages()) {
      const shrink: Shrink = new Shrink(
        this.getControl('width').value,
        this.getControl('height').value,
        this.getControl('quality').value,
        this.images
      );

      this.fileUploadSub = this.shrinkService.setShrink(shrink).subscribe((event) => {
        let res = this.handleProgress(event);
        if (res) {
          this.typeMessage = 'success';
          this.uploadMessage = res.message;
          this.downloadLink = DOWNLOAD_SHRINK_FILE + '/' + res.data;
          this.resetImages();
          this.resetProgress();
          this.shrinkForm.reset();
          this.getControl('quality').setValue(50);
        }
      }, (err) => {
        this.resetProgress();
        this.typeMessage = 'danger';
        this.uploadMessage = err.error.errors;
      });
    }
  }

  validateImages(): boolean {
    if (this.images && this.images.length) {
      return true;
    } else {
      return false;
    }
  }

  getControl(controlName: string): any {
    return this.shrinkForm.get(controlName);
  }

  getStatus(controlName: string): string {
    return this.validationService.statusClass(this.getControl(controlName));
  }

  handleProgress(event) {
    if (event.type === HttpEventType.DownloadProgress) {
      this.uploadingProgressing = true;
      this.uploadProgress = Math.round(100 * event.loaded / event.total);
    }

    if (event.type === HttpEventType.UploadProgress) {
      this.uploadingProgressing = true;
      this.uploadProgress = Math.round(100 * event.loaded / event.total);
    }

    if (event.type === HttpEventType.Response) {
      this.uploadComplete = true;
      return event.body;
    }
  }

  download(): void {
    if (this.downloadLink) {
      window.location.href = this.downloadLink;
    }
  }

  reupload(): void {
    this.downloadLink = null;
    this.uploadComplete = false;
    this.typeMessage = null;
    this.uploadMessage = null;
  }

  resetImages(): void {
    this.images = null;
    this.imagesUrls = null;
    this.imagesLabel = 'Choose Images';
    this.filePicture.nativeElement.value = '';
  }

  resetProgress(): void {
    this.uploadingProgressing = false;
    this.uploadProgress = 0;
  }
}
