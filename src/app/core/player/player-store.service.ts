import { Injectable } from '@angular/core';
import {ComponentStore} from '@ngrx/component-store';
import {Observable} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PlayerStoreService extends ComponentStore<PlayerState> {

	private step = 5;

	constructor() {
		super(PLAYER_INIT_STATE);
	}

	readonly go = this.effect((direction$: Observable<DirectionVariants>) => {
		return direction$.pipe(
			tap((direction: DirectionVariants) => {
				switch (direction) {
					case DirectionVariants.down:
						this.goDown();
						break;
					case DirectionVariants.left:
						this.goLeft();
						break;
					case DirectionVariants.right:
						this.goRight();
						break;
					case DirectionVariants.up:
						this.goUp();
						break;
				}
			})
		);
	});

	readonly setAngle = this.updater((st: PlayerState, angle: number) => {
		return {
			...st,
			angle
		};
	});

	private readonly goUp = this.updater((st: PlayerState) => {
		const y = st.position.y - this.step > 0 ? st.position.y - this.step : 0;

		return {
			...st,
			position: {
				...st.position,
				y
			}
		};
	});

	private readonly goDown = this.updater((st: PlayerState) => {
		const y = st.position.y + this.step < window.innerHeight * 10 ? st.position.y + this.step : window.innerHeight * 10;

		return {
			...st,
			position: {
				...st.position,
				y
			}
		};
	});

	private readonly goLeft = this.updater((st: PlayerState) => {
		const x = st.position.x - this.step > 0 ? st.position.x - this.step : 0;

		return {
			...st,
			position: {
				...st.position,
				x
			}
		};
	});

	private readonly goRight = this.updater((st: PlayerState) => {
		const x = st.position.x + this.step < window.innerWidth * 10 ? st.position.x + this.step : window.innerWidth * 10;

		return {
			...st,
			position: {
				...st.position,
				x
			}
		};
	});
}

export const PLAYER_INIT_STATE: PlayerState = {
	position: {
		x: 8000,
		y: 8000
	},
	angle: 0
};

export interface PlayerState {
	position: Position;
	angle: number;
}

export interface Position {
	x: number;
	y: number;
}

export enum DirectionVariants {
	up = 'up',
	down = 'down',
	left = 'left',
	right = 'right'
}
