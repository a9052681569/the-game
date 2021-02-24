import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BoxState, BoxStoreService} from './box-store.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
	  selector: 'app-box',
	  templateUrl: './box.component.html',
	  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit, OnDestroy {

	box: BoxState;

	destroyer$$ = new Subject();

	constructor(private bs: BoxStoreService) { }

	get hpPercentage(): number {
		return 100 / 20 * this.box.hp;
	}

	ngOnInit(): void {
		this.bs.select(s => {
			const box = s.boxes.find(b => b.id === this.box.id);

			if (!box) {
				this.destroy();
			}
		})
			.pipe(takeUntil(this.destroyer$$))
			.subscribe();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	destroy(): void {}

}
