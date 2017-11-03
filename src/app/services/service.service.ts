import { Injectable } from '@angular/core';
import { Line } from '../models/Line'

@Injectable()
export class ServiceService {
  lines: Line[];

  constructor() {
    this.lines = [
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 2,
        Cat_3_Title: 'Asset',
        Cat_4: 111,
        Cat_4_Title: '1125',
        Cat_5: 1,
        Cat_5_Title: 'Model',
        Hours: [0,1,2,1,3,0,0]
      },
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 1,
        Cat_3_Title: 'Shot',
        Cat_4: 1,
        Cat_4_Title: '123',
        Cat_5: 1,
        Cat_5_Title: 'Paint',
        Hours: [0,1,2,1,3,0,0]
      },
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 1,
        Cat_3_Title: 'Shot',
        Cat_4: 1,
        Cat_4_Title: '123',
        Cat_5: 4,
        Cat_5_Title: 'Comp',
        Hours: [0,1,1,5,1,.5,0]
      },
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 1,
        Cat_3_Title: 'Shot',
        Cat_4: 1,
        Cat_4_Title: '123',
        Cat_5: 2,
        Cat_5_Title: 'Roto',
        Hours: [0,0,0,.25,1,2.5,0]
      },
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 1,
        Cat_3_Title: 'Shot',
        Cat_4: 2,
        Cat_4_Title: '32432',
        Cat_5: 1,
        Cat_5_Title: 'Paint',
        Hours: [0,1,2,1,3,0,0]
      },
      {
        Cat_1: 1,
        Cat_1_Title: 'Departments',
        Cat_2: 1,
        Cat_2_Title: 'Accounting',
        Cat_3: 1,
        Cat_3_Title: 'Training',
        Cat_4: null,
        Cat_4_Title: '',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: [0,1,2,1,.25,1,0]
      },
      {
        Cat_1: 1,
        Cat_1_Title: 'Departments',
        Cat_2: 1,
        Cat_2_Title: 'Accounting',
        Cat_3: 2,
        Cat_3_Title: 'Vacation',
        Cat_4: null,
        Cat_4_Title: '',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: [0,2,1,.25,1,5,0]
      }
    ]
  }


  getLines() {
    return this.lines;
  }

}
