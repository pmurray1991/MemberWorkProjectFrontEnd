import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule, MatToolbarModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.scss'], // 👈 fix: styleUrls (plural)
})
export class App {}
