export class Shrink {
  public width: number;
  public height: number;
  public quality: number;
  public images: any;

  public constructor(
    _width: number, _height: number, _quality: number, _images: any
  ) {
    this.width = _width;
    this.height = _height;
    this.quality = _quality;
    this.images = _images;
  }
}
