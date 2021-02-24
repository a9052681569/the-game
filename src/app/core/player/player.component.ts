import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {DirectionVariants, PlayerStoreService, Position} from './player-store.service';
import {fromEvent, Observable, Subject} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import {DynamicContentDirective} from '../dynamic-content.directive';
import {BulletComponent} from '../bullet/bullet.component';


@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

	deg = 70;

	playerPosition: Position;

	private intervals: MoveIntervals = {
		up: null,
		down: null,
		left: null,
		right: null
	};

	private stepTime = 10;

	constructor(private ps: PlayerStoreService) { }

	ngOnInit(): void {
		this.initMoveHandler();

		this.ps.select(s => {
			this.playerPosition = s.position;
			this.deg = s.angle;
		}).subscribe();

		this.initMouseWatcher();

	}

	private initMoveHandler(): void {
		fromEvent(document.body, 'keypress')
			.pipe(
				tap((e: KeyboardEvent) => {

					switch (e.key) {
						case 'a':
							this.go(DirectionVariants.left);
							break;
						case 'w':
							this.go(DirectionVariants.up);
							break;
						case 'd':
							this.go(DirectionVariants.right);
							break;
						case 's':
							this.go(DirectionVariants.down);
							break;
					}

				})
			)
			.subscribe();

		fromEvent(document.body, 'keyup')
			.pipe(
				tap((e: KeyboardEvent) => {
					switch (e.key) {
						case 'a':
							this.stop(DirectionVariants.left);
							break;
						case 'w':
							this.stop(DirectionVariants.up);
							break;
						case 'd':
							this.stop(DirectionVariants.right);
							break;
						case 's':
							this.stop(DirectionVariants.down);
							break;
					}
				})
			)
			.subscribe();
	}

	private go(dir: DirectionVariants): void {
		if (!this.intervals[dir]) {
			this.intervals[dir] = setInterval(() => {
				this.ps.go(DirectionVariants[dir]);
			}, this.stepTime);
		}
	}

	private stop(dir: DirectionVariants): void {
		if (this.intervals[dir]) {
			clearInterval(this.intervals[dir]);
			this.intervals[dir] = null;
		}
	}

	private initMouseWatcher(): void {
		fromEvent(document.body, 'mousemove')
			.pipe(
				tap((e: MouseEvent) => {
					const mx = e.pageX - this.playerPosition.x;
					const my = this.playerPosition.y - e.pageY;

					const angle = Math.atan(mx / my) * 180 / Math.PI;

					const res = my > 0 ? angle : angle + 180;

					this.ps.setAngle(res > 0 ? res : 360 + res);

				})
			)
			.subscribe();
	}
}


export interface MoveIntervals {
	up: any;
	down: any;
	left: any;
	right: any;
}
