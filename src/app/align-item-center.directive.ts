import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAlignItemCenter]'
})
export class AlignItemCenterDirective {

  constructor(private el:ElementRef,
              private render:Renderer2)
    { 
      this.render.setStyle(this.el.nativeElement,'width','100%');
      this.render.setStyle(this.el.nativeElement,'display','flex');
      this.render.setStyle(this.el.nativeElement,'align-item','center');
      this.render.setStyle(this.el.nativeElement,'justify-content','center');  
    }

}
