import { Injectable } from '@angular/core';
import {ComponentStore} from '@ngrx/component-store';
import {Observable} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {PlayerState, Position} from '../player/player-store.service';

@Injectable({
	providedIn: 'root'
})
export class BoxStoreService extends ComponentStore<BoxStoreState> {

	private boxHp = 20;

	private boxSize: Size = {
		width: 100,
		height: 100
	};

	constructor() {
		super(BOXES_INIT_STATE);
	}

	readonly addBox = this.updater((st: BoxStoreState) => {
		const boxes = st.boxes.slice();

		const newBox: BoxState = {
			position: getRandomPosition(),
			hp: this.boxHp,
			size: this.boxSize,
			id: Math.round(Math.random() * 1000000)
		};


		boxes.push(newBox);

		return {
			...st,
			boxes,
			lastAddedBox: newBox
		};
	});

	readonly damage = this.updater((st: BoxStoreState, id: number) => {
		const boxes = st.boxes.slice();

		const currentBox = boxes.find(b => b.id === id);

		if (currentBox) {
			currentBox.hp -= 5;

			if (currentBox.hp <= 0) {
				this.removeBox(id);
			}
		}

		return {
			...st,
			boxes
		};
	});

	readonly removeBox = this.updater((st: BoxStoreState, id: number) => {
		const boxes = st.boxes.slice().filter(b => b.id !== id);

		return {
			...st,
			boxes,
			lastAddedBox: undefined
		};
	});

}

export const getRandomPosition = (): Position => {
	return {
		x: Math.random() * (window.innerWidth * 10),
		y: Math.random() * (window.innerHeight * 10)
	};
};

export const BOXES_INIT_STATE: BoxStoreState = {
	boxes: []
};

export interface BoxStoreState {
	boxes: BoxState[];
	lastAddedBox?: BoxState;
}

export interface BoxState {
	position: Position;
	hp: number;
	size: Size;
	id: number;
}

export interface Size {
	width: number;
	height: number;
}

