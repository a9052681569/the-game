import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './core/map/map.component';
import { PlayerComponent } from './core/player/player.component';
import { EnemyComponent } from './core/enemy/enemy.component';
import { BulletComponent } from './core/bullet/bullet.component';
import { DynamicContentDirective } from './core/dynamic-content.directive';
import { BoxComponent } from './core/box/box.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    PlayerComponent,
    EnemyComponent,
    BulletComponent,
    DynamicContentDirective,
    BoxComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
