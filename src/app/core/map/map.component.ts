import {AfterViewInit, Component, ComponentFactoryResolver, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DirectionVariants, PlayerState, PlayerStoreService, Position} from '../player/player-store.service';
import {fromEvent, Observable} from 'rxjs';
import {DynamicContentDirective} from '../dynamic-content.directive';
import {BulletComponent} from '../bullet/bullet.component';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

	@ViewChild(DynamicContentDirective, {static: true}) dynamicContent: DynamicContentDirective;

	playerPosition$: Observable<Position>;

	playerPosition: Position;

	angle: number;

	constructor(
		private ps: PlayerStoreService,
		private componentFactoryResolver: ComponentFactoryResolver) { }

	ngOnInit(): void {
		this.playerPosition$ = this.ps.select(s => {
			const y = s.position.y - window.innerHeight / 2;
			const x = s.position.x - window.innerWidth / 2;

			this.playerPosition = s.position;
			this.angle = s.angle;

			window.scrollTo(x, y);
			return s.position;
		});

		fromEvent(document.body, 'click')
			.subscribe((e: MouseEvent) => {
				this.fire();
			});
	}

	private fire(): void {

		const dynamicComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
			BulletComponent
		);
		const dynamicComponent = this.dynamicContent?.viewContainerRef.createComponent(dynamicComponentFactory);

		dynamicComponent.instance.position = this.playerPosition;
		dynamicComponent.instance.angle = this.angle;

		setTimeout(() => {
			dynamicComponent.destroy();
		}, 3000);
	}

}
