import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Position} from '../player/player-store.service';
import {interval, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {BoxState, BoxStoreService} from '../box/box-store.service';

@Component({
	selector: 'app-bullet',
	templateUrl: './bullet.component.html',
	styleUrls: ['./bullet.component.css']
})
export class BulletComponent implements OnInit, OnDestroy {

	@Input() position: Position;

	@Input() angle: number;

	bulletPos: Position;

	destroyer$$ = new Subject();

	xFactor = 0;
	yFactor = 0;

	bulletSpeed = 10;
	bulletStep = 10;

	boxes: BoxState[];

	constructor(private bs: BoxStoreService) { }

	ngOnInit(): void {
		this.bs.select(s => s.boxes)
			.pipe(takeUntil(this.destroyer$$))
			.subscribe(b => {
				this.boxes = b;
			});

		this.setFactors();

		this.bulletPos = {
			x: this.position.x,
			y: this.position.y
		};

		interval(this.bulletSpeed)
			.pipe(
				takeUntil(this.destroyer$$),
				tap(() => {
					if (this.angle > 270 || this.angle < 90) {
						this.bulletPos.y -= this.bulletStep * this.yFactor;
					} else {
						this.bulletPos.y += this.bulletStep * this.yFactor;
					}

					if (this.angle > 0 && this.angle < 180) {
						this.bulletPos.x += this.bulletStep * this.xFactor;
					} else {
						this.bulletPos.x -= this.bulletStep * this.xFactor;
					}

					this.boxes.forEach(box => {
						if (this.bulletPos.y >= box.position.y && this.bulletPos.y <= box.position.y + box.size.height) {
							if (this.bulletPos.x >= box.position.x && this.bulletPos.x <= box.position.x + box.size.width) {
								this.bs.damage(box.id);
								this.destroy();
							}
						}
					});
				})
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	setFactors(): void {
		if (this.angle >= 0 && this.angle <= 90) {

			this.xFactor = 100 / 90 * this.angle / 100;
			this.yFactor = 1 - this.xFactor;

		} else if (this.angle > 90 && this.angle <= 180) {

			this.yFactor = 100 / 90 * (this.angle - 90) / 100;
			this.xFactor = 1 - this.yFactor;

		} else if (this.angle > 180 && this.angle <= 270) {

			this.xFactor = 100 / 90 * (this.angle - 180) / 100;
			this.yFactor = 1 - this.xFactor;

		} else {

			this.yFactor = 100 / 90 * (this.angle - 270) / 100;
			this.xFactor = 1 - this.yFactor;
		}
	}

	destroy(): void {}

}
