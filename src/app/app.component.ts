import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GraphService } from './core/graph.service';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  graphService: GraphService = inject(GraphService);
  searchText = 'Adatum Corporation';

  private _data: any[] = [];
  @Input() get data(): any[] {
    return this._data;
  }

  set data(value: any[]) {
    this._data = value;
  }

  ngOnInit() {
    this.graphService.init();
  }

  dataChange(e: CustomEvent) {
    const value = e.detail.response.value[0];
    const hits: any[] = [];
    if (value.hitsContainers && value.hitsContainers[0].hits) {
      for (const hit of value.hitsContainers[0].hits) {
        hits.push(hit);
      }
    }
    this.data = hits;
  }

}
