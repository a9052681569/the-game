import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appDynamicContent]'
})
export class DynamicContentDirective {

	constructor(public viewContainerRef: ViewContainerRef) { }

}
