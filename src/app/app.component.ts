import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'test-app';
  @ViewChild('carouselMain') carouselMain: any;

  private readonly cardSize: number = 270;
  private readonly hiddenOpacity: number = 0.3;
  private step: number = 0;
  private activeCard: number = 0;
  private _touchStartX: number = 0;
  private _touchStartTime: number = 0;
  private _velocity: number = 0;
  private _walkUnsigned: number = 0;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    const children = this.carouselMain?.nativeElement.children;
    console.log(this.carouselMain?.nativeElement.children);
    this.renderer.setStyle(children[this.activeCard], 'opacity', `1`);
    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      this.renderer.setStyle(
        element,
        'transform',
        `translateX(${this.cardSize * i}px)`
      );
    }
  }

  scrollLeft() {
    if (this.step === 0) {
      return;
    }
    this.step = this.step - this.cardSize;
    const carouselMainElement = this.carouselMain?.nativeElement;
    this.renderer.setStyle(
      carouselMainElement,
      'transform',
      `translateX(-${this.step}px)`
    );

    // Card opacity
    this.renderer.setStyle(
      carouselMainElement.children[this.activeCard],
      'opacity',
      this.hiddenOpacity
    );
    this.activeCard--;
    this.renderer.setStyle(
      carouselMainElement.children[this.activeCard],
      'opacity',
      1
    );
  }

  scrollRight() {
    const carouselMainElement = this.carouselMain?.nativeElement;
    if (
      this.step >=
      this.cardSize * (carouselMainElement.children.length - 1)
    ) {
      return;
    }
    this.step = this.step + this.cardSize;
    let x: string = `-${this.step}px`;
    this.renderer.setStyle(
      carouselMainElement,
      'transform',
      `translateX(${x})`
    );

    // Opacity section
    this.renderer.setStyle(
      carouselMainElement.children[this.activeCard],
      'opacity',
      this.hiddenOpacity
    );
    this.activeCard++;
    this.renderer.setStyle(
      carouselMainElement.children[this.activeCard],
      'opacity',
      1
    );
  }

  touchStart(e: TouchEvent) {
    this._touchStartTime = e.timeStamp;
    this._touchStartX = e.targetTouches[0].clientX;
    this._walkUnsigned = 0;
  }

  cumulativeWalk: number = 0;
  touchEnd(e: TouchEvent) {
    console.log({ velocity: this._velocity, walk: this._walkUnsigned });

    if (this._walkUnsigned < 10) return;
    const carouselMainElement = this.carouselMain?.nativeElement;
    // if(this._velocity > 0.7) {
    //   // transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
    //   // this.renderer.setStyle(carouselMainElement, 'transform', '1s cubic-bezier(0.645, 0.045, 0.355, 1) 0s')
    //   if (this.scrollDirection === 'left') {
    //     this.cumulativeWalk = (this.cumulativeWalk - this.cardSize - (this.cumulativeWalk % this.cardSize)) * Math.round(this._walkUnsigned / this.cardSize);
    //   } else {
    //     this.cumulativeWalk = (this.cumulativeWalk + this.cardSize - (this.cumulativeWalk % this.cardSize)) * Math.round(this._walkUnsigned / this.cardSize);
    //   }
    // } else {
    const skipCards: number =  Math.round(this._walkUnsigned / this.cardSize) === 0 ? 1 :  Math.round(this._walkUnsigned / this.cardSize);
      if (this.scrollDirection === 'left') {
        this.cumulativeWalk = (this.cumulativeWalk - this.cardSize * skipCards - (this.cumulativeWalk % this.cardSize)) ;
      } else {
        this.cumulativeWalk = (this.cumulativeWalk + this.cardSize * skipCards - (this.cumulativeWalk % this.cardSize)) ;
      }
    // }

    // Walk otisao prvise levo posle startne kartice vrati na strantu
    if(this.cumulativeWalk > 0) this.cumulativeWalk = 0;
    //test
    if(Math.abs(this.cumulativeWalk) > this.cardSize * carouselMainElement.children.length - 1) this.cumulativeWalk = -this.cardSize * (carouselMainElement.children.length - 1)

    this.renderer.setStyle(carouselMainElement, 'transform', `translateX(${this.cumulativeWalk}px)`);
    this.lastStop = this.cumulativeWalk;
  }

  lastStop: number = 0;
  scrollDirection: 'left' | 'right' | null = null;
  touchMove(e: TouchEvent) {
    e.preventDefault();
    const x = e.targetTouches[0].pageX;
    const SCROLL_SPEED = 3;
    this._walkUnsigned = Math.abs(Math.round(x - this._touchStartX));
    const walkSigned = x - this._touchStartX;

    if (x - this._touchStartX < 0) {
      this.scrollDirection = 'left';
    } else {
      this.scrollDirection = 'right';
    }

    // if(Math.abs(this._walkUnsigned) < 90) {
    //   // Toliko mali walk da se ne racuna.
    //   // ali moras da pazis i na brzinu...
    //   console.log('PREMALI POMERAJ');
    //   return;
    // }

    const moveTime = e.timeStamp - this._touchStartTime;
    this._velocity = this._walkUnsigned / moveTime;

    // Pomeraj
    // Treba ti isto cumulatiWalk
    const carouselMainElement = this.carouselMain?.nativeElement;
    this.renderer.setStyle(carouselMainElement, 'transform', `translateX(${this.lastStop + walkSigned}px)`);

    if (this._velocity > 0.7) {
    }

    // Obradi slucaj proemene direkcije
  }

  scroll(e: any) { }
}
