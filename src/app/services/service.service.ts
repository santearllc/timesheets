// 
// AUTHOR: Tyler Cote
// EMAIL: tyler@santear.com
// 
// NOTE: Using the following index for days of week; 0 = Monday; 
// functions : camelCase
// variables: lowercase, separate_words_with_underscore 
//
// the data in this file will be replaced with responses from sql database in next stage. 

import { Injectable } from '@angular/core';
import { Line } from '../models/Line'

@Injectable()
export class ServiceService {
  lines: Line[];
  lines_sample: Line[];
  lines_init: Line[];
  lines_approval: Line[];
  shot_tasks = [];
  asset_tasks = [];
  production_tasks = [];
  supervision_tasks = [];
  project_tasks = [];
  department_tasks = [];
  shots = [];
  assets = [];
  projects = [];
  departments = [];
  users = Object();
  mo_text = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor() {
    this.users = {
      0: {
        FullName: 'Violet Rogerson',
        FullName_r: 'Rogerson, Violet',
        FirstName: 'Violet',
        LastName: 'Rogerson',
        OfficeKey: 1,
        TimeSheetStatus: 0,        
        ot_sel: [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
        Data: {
          WorkedOn: [],
          TotalHours: 0,
          TotalHours_byDay: {
            t: [0, 0, 0, 0, 0, 0, 0, 0],
            rt: [0, 0, 0, 0, 0, 0, 0, 0],
            ot: [0, 0, 0, 0, 0, 0, 0, 0],
            dt: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      1: {
        FullName: 'Drake Donaldson',
        FullName_r: 'Donaldson, Drake',
        FirstName: 'Drake',
        LastName: 'Donaldson',
        OfficeKey: 1,
        TimeSheetStatus: 1,
        ot_sel: [[-1, -1], [-1, -1], [-1, -1], [0, 1], [-1, -1], [-1, -1], [-1, -1]],
        Data: {
          WorkedOn: [],
          TotalHours: 0,
          TotalHours_byDay: {
            t: [0, 0, 0, 0, 0, 0, 0, 0],
            rt: [0, 0, 0, 0, 0, 0, 0, 0],
            ot: [0, 0, 0, 0, 0, 0, 0, 0],
            dt: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      2: {
        FullName: 'Traci Stacie',
        FullName_r: 'Stacie, Traci',
        FirstName: 'Traci',
        LastName: 'Stacie',
        OfficeKey: 1,
        TimeSheetStatus: 0,
        ot_sel: [[-1, -1], [-1, -1], [-1, -1], [0, 2], [-1, -1], [-1, -1], [-1, -1]],
        Data: {
          WorkedOn: [],
          TotalHours: 0,
          TotalHours_byDay: {
            t: [0, 0, 0, 0, 0, 0, 0, 0],
            rt: [0, 0, 0, 0, 0, 0, 0, 0],
            ot: [0, 0, 0, 0, 0, 0, 0, 0],
            dt: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      3: {
        FullName: 'Erick Kelley',
        FullName_r: 'Kelley, Erick',
        FirstName: 'Erick',
        LastName: 'Kelley',
        OfficeKey: 1,
        TimeSheetStatus: 3,
        ot_sel: [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
        Data: {
          WorkedOn: [],
          TotalHours: 0,
          TotalHours_byDay: {
            t: [0, 0, 0, 0, 0, 0, 0, 0],
            rt: [0, 0, 0, 0, 0, 0, 0, 0],
            ot: [0, 0, 0, 0, 0, 0, 0, 0],
            dt: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      4: {
        FullName: 'Joyce Cross',
        FullName_r: 'Cross, Joyce',
        FirstName: 'Joyce',
        LastName: 'Cross',
        OfficeKey: 1,
        TimeSheetStatus: 0,
        ot_sel: [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
        Data: {
          WorkedOn: [],
          TotalHours: 0,
          TotalHours_byDay: {
            t: [0, 0, 0, 0, 0, 0, 0, 0],
            rt: [0, 0, 0, 0, 0, 0, 0, 0],
            ot: [0, 0, 0, 0, 0, 0, 0, 0],
            dt: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      5: {
        FullName: 'Tommy Fleming',
        FullName_r: 'Fleming, Tommy',
        FirstName: 'Tommy',
        LastName: 'Fleming',
        OfficeKey: 1,
        TimeSheetStatus: 4,
        ot_sel: [[-1, -1], [-1, -1], [-1, -1], [0, 2], [-1, -1], [-1, -1], [-1, -1]],
        Data: {
          WorkedOn: [],
          TotalHours: 0,
          TotalHours_byDay: {
            t: [0, 0, 0, 0, 0, 0, 0, 0],
            rt: [0, 0, 0, 0, 0, 0, 0, 0],
            ot: [0, 0, 0, 0, 0, 0, 0, 0],
            dt: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      6: {
        FullName: 'Trent Townsend',
        FullName_r: 'Townsend, Trent',
        FirstName: 'Trent',
        LastName: 'Townsend',
        OfficeKey: 1,
        TimeSheetStatus: 4,
        ot_sel: [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
        Data: {
          WorkedOn: [],
          TotalHours: 0,
          TotalHours_byDay: {
            t: [0, 0, 0, 0, 0, 0, 0, 0],
            rt: [0, 0, 0, 0, 0, 0, 0, 0],
            ot: [0, 0, 0, 0, 0, 0, 0, 0],
            dt: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      7: {
        FullName: 'Michael Layton',
        FullName_r: 'Layton, Michael',
        FirstName: 'Michael',
        LastName: 'Layton',
        OfficeKey: 1,
        TimeSheetStatus: 4,
        ot_sel: [[-1, -1], [-1, -1], [-1, -1], [0, 1], [-1, -1], [-1, -1], [-1, -1]],
        Data: {
          WorkedOn: [],
          TotalHours: 0,
          TotalHours_byDay: {
            t: [0, 0, 0, 0, 0, 0, 0, 0],
            rt: [0, 0, 0, 0, 0, 0, 0, 0],
            ot: [0, 0, 0, 0, 0, 0, 0, 0],
            dt: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      8: {
        FullName: 'Nate Simonson',
        FullName_r: 'Simonson, Nate',
        FirstName: 'Nate',
        LastName: 'Simonson',
        OfficeKey: 1,
        TimeSheetStatus: 0,
        ot_sel: [[-1, -1], [-1, -1], [-1, -1], [0, 2], [-1, -1], [-1, -1], [-1, -1]],
        Data: {
          WorkedOn: [],
          TotalHours: 0,
          TotalHours_byDay: {
            t: [0, 0, 0, 0, 0, 0, 0, 0],
            rt: [0, 0, 0, 0, 0, 0, 0, 0],
            ot: [0, 0, 0, 0, 0, 0, 0, 0],
            dt: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      9: {
        FullName: 'Jeannine Chandler',
        FullName_r: 'Chandler, Jeannine',
        FirstName: 'Jeannine',
        LastName: 'Chandler',
        OfficeKey: 1,
        TimeSheetStatus: 2,
        ot_sel: [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
        Data: {
          WorkedOn: [],
          TotalHours: 0,
          TotalHours_byDay: {
            t: [0, 0, 0, 0, 0, 0, 0, 0],
            rt: [0, 0, 0, 0, 0, 0, 0, 0],
            ot: [0, 0, 0, 0, 0, 0, 0, 0],
            dt: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      }
    }


    this.department_tasks = [
      {
        Cat_key: 1,
        Cat_Title: "Bereavement"
      },
      {
        Cat_key: 2,
        Cat_Title: "Company Event"
      },
      {
        Cat_key: 3,
        Cat_Title: "Down Time"
      },
      {
        Cat_key: 4,
        Cat_Title: "Holiday"
      },
      {
        Cat_key: 5,
        Cat_Title: "Jury Duty"
      },
      {
        Cat_key: 6,
        Cat_Title: "Sick"
      },
      {
        Cat_key: 7,
        Cat_Title: "Studio Closure"
      },
      {
        Cat_key: 8,
        Cat_Title: "Training"
      },
      {
        Cat_key: 9,
        Cat_Title: "Unpaid Time Off"
      },
      {
        Cat_key: 10,
        Cat_Title: "Vacation"
      },
      {
        Cat_key: 11,
        Cat_Title: "Work"
      }
    ]

    this.projects = [
      {
        Cat_key: 1,
        Cat_Title: "Stranger Things"
      },
      {
        Cat_key: 2,
        Cat_Title: "Game of Thrones"
      },
      {
        Cat_key: 3,
        Cat_Title: "The Walk"
      },
      {
        Cat_key: 4,
        Cat_Title: "Transformers"
      }

    ]

    this.shots = [
      {
        Cat_key: 1,
        Cat_Title: "ST001_001_001"
      },
      {
        Cat_key: 2,
        Cat_Title: "ST001_001_002"
      },
      {
        Cat_key: 3,
        Cat_Title: "ST001_001_003"
      },
      {
        Cat_key: 4,
        Cat_Title: "ST001_001_004"
      },
      {
        Cat_key: 5,
        Cat_Title: "ST001_001_005"
      },
      {
        Cat_key: 6,
        Cat_Title: "ST001_001_006"
      },
      {
        Cat_key: 7,
        Cat_Title: "ST001_001_007"
      },
      {
        Cat_key: 8,
        Cat_Title: "ST001_001_008"
      },
      {
        Cat_key: 9,
        Cat_Title: "ST001_001_009"
      },
      {
        Cat_key: 10,
        Cat_Title: "ST001_001_010"
      }
    ]


    this.assets = [
      {
        Cat_key: 1,
        Cat_Title: "ST001"
      },
      {
        Cat_key: 2,
        Cat_Title: "ST002"
      },
      {
        Cat_key: 3,
        Cat_Title: "ST003"
      },
      {
        Cat_key: 4,
        Cat_Title: "ST004"
      },
      {
        Cat_key: 5,
        Cat_Title: "ST005"
      },
      {
        Cat_key: 6,
        Cat_Title: "ST006"
      },
      {
        Cat_key: 7,
        Cat_Title: "ST007"
      },
      {
        Cat_key: 8,
        Cat_Title: "ST008"
      },
      {
        Cat_key: 9,
        Cat_Title: "ST009"
      },
      {
        Cat_key: 10,
        Cat_Title: "ST010"
      },

    ]


    this.departments = [
      {
        Cat_key: 1,
        Cat_Title: "Executive"
      },
      {
        Cat_key: 2,
        Cat_Title: "Facilities"
      },
      {
        Cat_key: 3,
        Cat_Title: "Finance"
      },
      {
        Cat_key: 4,
        Cat_Title: "Human Resources"
      },
      {
        Cat_key: 5,
        Cat_Title: "Marketing"
      },
      {
        Cat_key: 6,
        Cat_Title: "Operations"
      },
      {
        Cat_key: 7,
        Cat_Title: "Pipeline"
      },
      {
        Cat_key: 8,
        Cat_Title: "Production"
      },
      {
        Cat_key: 9,
        Cat_Title: "Resources"
      },
      {
        Cat_key: 10,
        Cat_Title: "Sales"
      },
      {
        Cat_key: 11,
        Cat_Title: "Systems"
      }
    ]



    this.project_tasks = [
      {
        Cat_key: 5,
        Cat_Title: "Shots"
      },
      {
        Cat_key: 4,
        Cat_Title: "Assets"
      },
      {
        Cat_key: 6,
        Cat_Title: "Production Staff"
      },
      {
        Cat_key: 7,
        Cat_Title: "Supervision"
      },
      {
        Cat_key: 2,
        Cat_Title: "Down Time"
      },
      {
        Cat_key: 3,
        Cat_Title: "R&D "
      },
      {
        Cat_key: 1,
        Cat_Title: "Training"
      }
    ];

    this.production_tasks = [
      {
        Cat_key: 1,
        Cat_Title: 'Assistant Editor'
      },
      {
        Cat_key: 3,
        Cat_Title: 'Coordinator'
      },
      {
        Cat_key: 5,
        Cat_Title: 'Editor'
      },
      {
        Cat_key: 6,
        Cat_Title: 'Producer'
      },
      {
        Cat_key: 7,
        Cat_Title: 'Production Assistant'
      },
      {
        Cat_key: 8,
        Cat_Title: 'Production Manager'
      }
    ];


    this.supervision_tasks = [
      {
        Cat_key: 2,
        Cat_Title: 'CG Supervisor'
      },
      {
        Cat_key: 4,
        Cat_Title: 'DFX Supervisor'
      },
      {
        Cat_key: 9,
        Cat_Title: 'VFX Supervisor'
      },
      {
        Cat_key: 10,
        Cat_Title: 'Lead Artist'
      }
    ];

    this.shot_tasks = [
      {
        Cat_key: 1,
        Cat_Title: 'Animation'
      },
      {
        Cat_key: 2,
        Cat_Title: 'Camera Tracking'
      },
      {
        Cat_key: 3,
        Cat_Title: 'CFX Finaling'
      },
      {
        Cat_key: 4,
        Cat_Title: 'Cloth Simulation'
      },
      {
        Cat_key: 5,
        Cat_Title: 'Compositing'
      },
      {
        Cat_key: 6,
        Cat_Title: 'Crowd'
      },
      {
        Cat_key: 7,
        Cat_Title: 'FX'
      },
      {
        Cat_key: 8,
        Cat_Title: 'Hair Simulation'
      },
      {
        Cat_key: 9,
        Cat_Title: 'Layout'
      },
      {
        Cat_key: 10,
        Cat_Title: 'Lighting'
      },
      {
        Cat_key: 11,
        Cat_Title: 'Match Move'
      },
      {
        Cat_key: 12,
        Cat_Title: 'Matte Painting'
      },
      {
        Cat_key: 13,
        Cat_Title: 'Paint'
      },
      {
        Cat_key: 14,
        Cat_Title: 'Rotoscope'
      },
      {
        Cat_key: 15,
        Cat_Title: 'Stereo'
      }
    ];


    this.asset_tasks = [
      {
        Cat_key: 1,
        Cat_Title: "3D Enviro Build"
      },
      {
        Cat_key: 2,
        Cat_Title: "Animation Rig Testing"
      },
      {
        Cat_key: 3,
        Cat_Title: "CFX Cloth Setup"
      },
      {
        Cat_key: 4,
        Cat_Title: "CFX Hair Groom"
      },
      {
        Cat_key: 5,
        Cat_Title: "Concept Art"
      },
      {
        Cat_key: 6,
        Cat_Title: "Crowd Setup"
      },
      {
        Cat_key: 7,
        Cat_Title: "Enviro Layout"
      },
      {
        Cat_key: 8,
        Cat_Title: "Enviro Texture"
      },
      {
        Cat_key: 9,
        Cat_Title: "FX"
      },
      {
        Cat_key: 10,
        Cat_Title: "Look Dev"
      },
      {
        Cat_key: 11,
        Cat_Title: "Matte Painting"
      },
      {
        Cat_key: 12,
        Cat_Title: "Model"
      },
      {
        Cat_key: 13,
        Cat_Title: "Rigging"
      },
      {
        Cat_key: 14,
        Cat_Title: "Texture"
      }
    ];

    this.lines_init = [
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: 'Shows',
        Cat_2: null,
        Cat_2_Title: '',
        Cat_3: null,
        Cat_3_Title: '',
        Cat_4: null,
        Cat_4_Title: '',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: null,        
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 1,
        Cat_1_Title: 'Studio',
        Cat_2: 8,
        Cat_2_Title: 'Production',
        Cat_3: 11,
        Cat_3_Title: 'Work',
        Cat_4: null,
        Cat_4_Title: '',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: [0, 0, 0, 0, 0, 0, 0],        
        Note: null
      }
    ];


    this.lines_sample = [
      {
        UserKey: 0,
        Cat_1: 1,
        Cat_1_Title: 'Studio',
        Cat_2: 8,
        Cat_2_Title: 'Production',
        Cat_3: 11,
        Cat_3_Title: 'Work',
        Cat_4: null,
        Cat_4_Title: '',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: [0, 0, 0, 0, 0, 0, 0],        
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 6,
        Cat_3_Title: "Production Staff",
        Cat_4: 6,
        Cat_4_Title: "Producer",
        Cat_5: null,
        Cat_5_Title: "ST001_001_003",
        Hours: [0, 2, 0, 1.75, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "Animation",
        Cat_5: 3,
        Cat_5_Title: "ST001_001_003",
        Hours: [0, 2, 0, 1.75, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "Animation",
        Cat_5: 4,
        Cat_5_Title: "ST001_001_004",
        Hours: [0, 2, 0, 1.75, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "Animation",
        Cat_5: 5,
        Cat_5_Title: "ST001_001_005",
        Hours: [0, 2, 0, 1.75, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 4,
        Cat_4_Title: "Cloth Simulation",
        Cat_5: 3,
        Cat_5_Title: "ST001_001_003",
        Hours: [0, 2, 0, 3, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 6,
        Cat_4_Title: "Crowd Setup",
        Cat_5: 2,
        Cat_5_Title: "ST002",
        Hours: [0, 2, 0, 2.5, 4, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 6,
        Cat_4_Title: "Crowd Setup",
        Cat_5: 3,
        Cat_5_Title: "ST003",
        Hours: [0, 2, 0, 2.5, 4, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 2, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 7,
        Cat_4_Title: "FX",
        Cat_5: 1,
        Cat_5_Title: "ST001_001_001",
        Hours: [0, 0, 7, 0, 5, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 1, 0, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 1, 0, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [8, 0, 0, 0, 0, 0, 0],
        Note: null
      }
    ]




    this.lines_approval = [
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "ST001_001_001",
        Cat_5: 7,
        Cat_5_Title: "FX",
        Hours: [0, 0, 0, 1, 2, 0, 0],
        Note: 'This is a note from the user.'
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 0, 1, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [1, 1, 1, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 0,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 11,
        Cat_3_Title: "Work",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 1, 2, 2, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 1,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 1,
        Cat_5_Title: "Animation",
        Hours: [2, 0, 1, 1, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 1,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 4,
        Cat_5_Title: "Cloth Simulation",
        Hours: [0, 1, 0, 2, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 1,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 6,
        Cat_5_Title: "Crowd Setup",
        Hours: [0, 0, 0, 1, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 1,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 7,
        Cat_5_Title: "Enviro Layout",
        Hours: [2, 2, 2, 0, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 1,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 1, 2, 2, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 1,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "ST001_001_001",
        Cat_5: 7,
        Cat_5_Title: "FX",
        Hours: [2, 2, 0, 2, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 1,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 1, 2, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 1,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 1, 2, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 1,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 11,
        Cat_3_Title: "Work",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 1, 2, 2, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 2,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 1,
        Cat_5_Title: "Animation",
        Hours: [0, 1, 1, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 2,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 4,
        Cat_5_Title: "Cloth Simulation",
        Hours: [2, 0, 0, 2, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 2,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 6,
        Cat_5_Title: "Crowd Setup",
        Hours: [0, 1, 2, 2, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 2,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 7,
        Cat_5_Title: "Enviro Layout",
        Hours: [2, 2, 2, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 2,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [1, 0, 2, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 2,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "ST001_001_001",
        Cat_5: 7,
        Cat_5_Title: "FX",
        Hours: [0, 2, 0, 1, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 2,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [1, 2, 1, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 2,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 1, 2, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 2,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 2, 0, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 2,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 1,
        Cat_2_Title: "Executive",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 2, 0, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 5,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 1,
        Cat_2_Title: "Executive",
        Cat_3: 11,
        Cat_3_Title: "Work",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 2, 0, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 3,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 1,
        Cat_5_Title: "Animation",
        Hours: [0, 2, 2, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 3,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 4,
        Cat_5_Title: "Cloth Simulation",
        Hours: [0, 1, 0, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 3,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 6,
        Cat_5_Title: "Crowd Setup",
        Hours: [0, 0, 1, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 3,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 7,
        Cat_5_Title: "Enviro Layout",
        Hours: [2, 1, 2, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 3,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 0, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 3,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "ST001_001_001",
        Cat_5: 7,
        Cat_5_Title: "FX",
        Hours: [2, 1, 0, 0, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 3,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 0, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 3,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 1, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 3,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 2, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 4,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 1,
        Cat_5_Title: "Animation",
        Hours: [1, 0, 2, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 4,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 4,
        Cat_5_Title: "Cloth Simulation",
        Hours: [0, 1, 2, 0, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 4,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 6,
        Cat_5_Title: "Crowd Setup",
        Hours: [0, 2, 2, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 4,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 7,
        Cat_5_Title: "Enviro Layout",
        Hours: [2, 0, 0, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 4,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 0, 2, 2, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 4,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "ST001_001_001",
        Cat_5: 7,
        Cat_5_Title: "FX",
        Hours: [0, 0, 1, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 4,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 0, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 4,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 1, 0, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 4,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [1, 0, 1, 0, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 5,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 1,
        Cat_5_Title: "Animation",
        Hours: [2, 2, 2, 1, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 5,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 4,
        Cat_5_Title: "Cloth Simulation",
        Hours: [1, 1, 2, 1, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 5,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 6,
        Cat_5_Title: "Crowd Setup",
        Hours: [0, 2, 1, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 5,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 7,
        Cat_5_Title: "Enviro Layout",
        Hours: [1, 0, 2, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 5,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 1, 0, 1, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 5,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "ST001_001_001",
        Cat_5: 7,
        Cat_5_Title: "FX",
        Hours: [0, 1, 1, 0, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 5,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 1, 0, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 5,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [1, 2, 2, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 5,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 2, 1, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 6,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 1,
        Cat_5_Title: "Animation",
        Hours: [2, 1, 1, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 6,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 4,
        Cat_5_Title: "Cloth Simulation",
        Hours: [1, 1, 0, 1, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 6,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 6,
        Cat_5_Title: "Crowd Setup",
        Hours: [2, 0, 1, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 6,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 7,
        Cat_5_Title: "Enviro Layout",
        Hours: [1, 2, 2, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 6,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 2, 1, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 6,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "ST001_001_001",
        Cat_5: 7,
        Cat_5_Title: "FX",
        Hours: [0, 0, 2, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 6,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 1, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 6,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 2, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 6,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [1, 0, 1, 0, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 7,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 1,
        Cat_5_Title: "Animation",
        Hours: [1, 2, 2, 0, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 7,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 4,
        Cat_5_Title: "Cloth Simulation",
        Hours: [2, 1, 0, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 7,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 6,
        Cat_5_Title: "Crowd Setup",
        Hours: [0, 0, 2, 2, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 7,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 7,
        Cat_5_Title: "Enviro Layout",
        Hours: [1, 0, 2, 1, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 7,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 2, 1, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 7,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "ST001_001_001",
        Cat_5: 7,
        Cat_5_Title: "FX",
        Hours: [1, 2, 1, 2, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 7,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 0, 2, 2, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 7,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 0, 0, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 7,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 2, 0, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 8,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 1,
        Cat_5_Title: "Animation",
        Hours: [2, 1, 2, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 8,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 4,
        Cat_5_Title: "Cloth Simulation",
        Hours: [0, 1, 2, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 8,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 6,
        Cat_5_Title: "Crowd Setup",
        Hours: [0, 2, 0, 2, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 8,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 7,
        Cat_5_Title: "Enviro Layout",
        Hours: [1, 2, 0, 2, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 8,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 1, 2, 1, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 8,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "ST001_001_001",
        Cat_5: 7,
        Cat_5_Title: "FX",
        Hours: [1, 0, 1, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 8,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 2, 0, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 8,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [1, 1, 0, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 8,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [2, 1, 0, 0, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 9,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 1,
        Cat_5_Title: "Animation",
        Hours: [2, 0, 0, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 9,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 3,
        Cat_4_Title: "ST001_001_003",
        Cat_5: 4,
        Cat_5_Title: "Cloth Simulation",
        Hours: [2, 2, 2, 1, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 9,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 6,
        Cat_5_Title: "Crowd Setup",
        Hours: [1, 1, 1, 1, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 9,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 4,
        Cat_3_Title: "Asset",
        Cat_4: 2,
        Cat_4_Title: "ST002",
        Cat_5: 7,
        Cat_5_Title: "Enviro Layout",
        Hours: [0, 1, 0, 0, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 9,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 1,
        Cat_2_Title: "Stranger Things",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [1, 1, 2, 0, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 9,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 5,
        Cat_3_Title: "Shot",
        Cat_4: 1,
        Cat_4_Title: "ST001_001_001",
        Cat_5: 7,
        Cat_5_Title: "FX",
        Hours: [2, 2, 0, 1, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 9,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 1,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 2, 2, 0, 1, 0, 0],
        Note: null
      },
      {
        UserKey: 9,
        Cat_1: 0,
        Cat_1_Title: "Shows",
        Cat_2: 2,
        Cat_2_Title: "Game of Thrones",
        Cat_3: 2,
        Cat_3_Title: "Down Time",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [1, 2, 1, 2, 0, 0, 0],
        Note: null
      },
      {
        UserKey: 9,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 3,
        Cat_2_Title: "Finance",
        Cat_3: 6,
        Cat_3_Title: "Sick",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 1, 2, 2, 0, 0],
        Note: null
      },
      {
        UserKey: 9,
        Cat_1: 1,
        Cat_1_Title: "Studio",
        Cat_2: 3,
        Cat_2_Title: "Finance",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 1, 2, 2, 0, 0],
        Note: null
      }
    ]
  }


  getLines() {
    return this.lines;
  }

  getApprovalLines() {
    return this.lines_approval;
  }

  getInitLines() {
    return Object.assign([], this.lines_init);
  }

  getSampleLines() {
    return Object.assign([], this.lines_sample);
  }

  getShotTasks() {
    return this.shot_tasks;
  }

  getAssetTasks() {
    return this.asset_tasks;
  }

  getProductionTasks() {
    return this.production_tasks;
  }

  getSupervisionTasks() {
    return this.supervision_tasks;
  }

  getShowTasks() {
    return this.project_tasks;
  }

  getShots() {
    return this.shots;
  }

  getAssets() {
    return this.assets;
  }

  getShows() {
    return this.projects;
  }

  getDepartmentTasks() {
    return this.department_tasks;
  }

  getDepartments() {
    return this.departments;
  }

  getUsers() {
    return Object.assign([], this.users);
  }

  sumHours(data_in) {
    var data_out = data_in;

    try {
      for (var i_1 = 0; i_1 < data_out.length; i_1++) {
        var obj_1 = data_out[i_1];
        for (var i_2 = 0; i_2 < obj_1.children.length; i_2++) {
          var obj_2 = obj_1.children[i_2];
          for (var i_3 = 0; i_3 < obj_2.children.length; i_3++) {
            var sum_hours = [0, 0, 0, 0, 0, 0, 0];
            var obj_3 = obj_2.children[i_3];
            for (var i_4 = 0; i_4 < obj_3.children.length; i_4++) {
              var obj_4 = obj_3.children[i_4];
              if (obj_4['hours'] != undefined) {
                for (var hr = 0; hr < 7; hr++) {
                  sum_hours[hr] += obj_4['hours'][hr];
                }
              }
              for (var i_5 = 0; i_5 < obj_4.children.length; i_5++) {
                var obj_5 = obj_4.children[i_5];
                for (var i_6 = 0; i_6 < obj_5.children.length; i_6++) {
                  var obj_6 = obj_5.children[i_6];
                  for (var hr = 0; hr < 7; hr++) {
                    sum_hours[hr] += obj_6['hours'][hr];
                  }
                }
              }
            }
            obj_3.sum_hours = sum_hours;
          }
        }
      }
    } catch (err) { }
    return data_out;
  }



  generateTimesheetByUser(timesheet_in, titles, show_add_lines) {
    let children = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    var timesheet_out = Array();

    for (var prop_1 in timesheet_in) {
      if (prop_1 != 'Hours') {
        children[1] = [];  // rest children				
        for (var prop_2 in timesheet_in[prop_1]) {
          if (prop_2 != 'Hours') {
            children[2] = [];  // reset children
            var show_add_line = false;

            try {
              show_add_line = show_add_lines[prop_1][prop_2];
            } catch (err) { }

            children[1].push({
              title: titles[prop_1][prop_2].Title,
              cat_key: prop_2,
              sum_hours: [0, 0, 0, 0, 0, 0, 0],
              note: '',
              ot: [false, false, false, false, false, false, false],
              ot_req: [false, false, false, false, false, false, false],
              hours: timesheet_in[prop_1][prop_2]['Hours'],
              focus: [false, false, false, false, false, false, false],
              children: children[2],
              projectTask: -1,
              departmentTask: -1,
              show_add_line: show_add_line,
              autofocus: null
            });
            for (var prop_3 in timesheet_in[prop_1][prop_2]) {
              if (prop_3 != 'Hours') {
                children[3] = [];  // reset children
                children[2].push({
                  title: titles[prop_1][prop_2][prop_3].Title,
                  cat_key: prop_3,
                  note: '',
                  hours: timesheet_in[prop_1][prop_2][prop_3]['Hours'],
                  focus: [false, false, false, false, false, false, false],
                  children: children[3],
                  productionTask: -1,
                  autofocus: null
                });
                for (var prop_4 in timesheet_in[prop_1][prop_2][prop_3]) {
                  if (prop_4 != 'Hours') {
                    children[4] = [];  // reset children
                    children[3].push({
                      title: titles[prop_1][prop_2][prop_3][prop_4].Title,
                      cat_key: prop_4, note: '',
                      hours: timesheet_in[prop_1][prop_2][prop_3][prop_4]['Hours'],
                      focus: [false, false, false, false, false, false, false],
                      children: children[4],
                      productionTask: -1,
                      autofocus: null
                    });
                    for (var prop_5 in timesheet_in[prop_1][prop_2][prop_3][prop_4]) {
                      if (prop_5 != 'Hours') {
                        children[4].push({
                          title: titles[prop_1][prop_2][prop_3][prop_4][prop_5].Title,
                          cat_key: prop_5, note: '',
                          hours: timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5]['Hours'],
                          focus: [false, false, false, false, false, false, false],
                          children: [],
                          productionTask: -1,
                          autofocus: null
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      timesheet_out.push({
        title: titles[prop_1].Title,
        cat_key: prop_1,
        hours: timesheet_in[prop_1]['Hours'],
        children: children[1],
        show_add_line: (children[1].length <= 0 && parseInt(prop_1) == 0) ? true : false,
        autofocus: (children[1].length <= 0 && parseInt(prop_1) == 0) ? true : null,
      });
    }
    return timesheet_out;
  }

  generateDate(today = false) {
    var dateObj = new Date();
    var mo = dateObj.getUTCMonth(); //months from 1-12
    var da = dateObj.getUTCDate();
    var yr = dateObj.getUTCFullYear();

    return this.mo_text[mo] + ' ' + da + ', ' + yr;;
  }

  hideShowDivs(timesheet, prop_sel, bool_set) {

    for (var x_1 in timesheet) {
      try {
        timesheet[x_1][prop_sel] = bool_set;
      } catch (err) { }
      for (var x_2 in timesheet[x_1]['children']) {
        try {
          timesheet[x_1]['children'][x_2][prop_sel] = bool_set;
        } catch (err) { }
        for (var x_3 in timesheet[x_1]['children'][x_2]['children']) {
          try {
            timesheet[x_1]['children'][x_2]['children'][x_3][prop_sel] = bool_set;
          } catch (err) { }
          for (var x_4 in timesheet[x_1]['children'][x_2]['children'][x_3]['children']) {
            try {
              timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4][prop_sel] = bool_set;
            } catch (err) { }
            for (var x_5 in timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children']) {
              try {
                timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children'][x_5][prop_sel] = bool_set;
              } catch (err) { }
            }
          }
        }
      }
    }
    return timesheet;
  }

  totalsOvertimeBreakdown(timesheet, totals_in, office_key) {
    var totals_out = Object.assign([], totals_in);    
    var entry_page = false;


    // Get totals by Show/Department
    var by_show = { 0: {}, 1: {} };

    for (var x_1 = 0; x_1 < timesheet.length; x_1++) {
      for (var x_2 = 0; x_2 < timesheet[x_1]['children'].length; x_2++) {
        by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']] = {};
        by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'] = [0, 0, 0, 0, 0, 0, 0, 0];
        by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['ot'] = timesheet[x_1]['children'][x_2]['ot'];

        for (var x_3 = 0; x_3 < timesheet[x_1]['children'][x_2]['children'].length; x_3++) {
          if (timesheet[x_1]['children'][x_2]['children'][x_3]['hours']) {
            for (var d = 0; d < 7; d++) {
              by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][d] += timesheet[x_1]['children'][x_2]['children'][x_3]['hours'][d];
              by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][7] += timesheet[x_1]['children'][x_2]['children'][x_3]['hours'][d];
            }
          }
          for (var x_4 = 0; x_4 < timesheet[x_1]['children'][x_2]['children'][x_3]['children'].length; x_4++) {
            if (timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['hours']) {
              for (var d = 0; d < 7; d++) {
                by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][d] += timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['hours'][d];
                by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][7] += timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['hours'][d];
              }
            }
            for (var x_5 = 0; x_5 < timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children'].length; x_5++) {
              if (timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children'][x_5]['hours']) {
                for (var d = 0; d < 7; d++) {
                  by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][d] += timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children'][x_5]['hours'][d];
                  by_show[timesheet[x_1]['cat_key']][timesheet[x_1]['children'][x_2]['cat_key']]['hours'][7] += timesheet[x_1]['children'][x_2]['children'][x_3]['children'][x_4]['children'][x_5]['hours'][d];
                }
              }
            }
          }
        }
      }
    }

    totals_out['TotalHours_byShow']  = by_show;

    if (!totals_out.hasOwnProperty('TotalHours_byDay')) {
      totals_out['TotalHours_byDay'] = totals_out;
      totals_out['TotalHours_byDay']['t'] = totals_out['TotalHours_byDay']['rt'];
      entry_page = true;
    }

    //Reset OT Totals
    totals_out['TotalHours_byDay']['rt'][7] = 0;
    totals_out['TotalHours_byDay']['ot'][7] = 0;
    totals_out['TotalHours_byDay']['dt'][7] = 0;

    if (office_key == 0) { // California Rules 
      var cons_days = 0;  // counter for continous days 

      for (var i = 0; i < 7; i++) {
        var d_h = totals_out['TotalHours_byDay']['t'][i];  // hours for the current day

        if (d_h > 0.0) {
          cons_days++;
        } else {
          cons_days = 0;
        }

        if (cons_days == 7) {
          totals_out['TotalHours_byDay']['rt'][i] = 0;

          if (d_h <= 8) {
            totals_out['TotalHours_byDay']['ot'][i] = d_h;

            // Update grand Totals
            totals_out['TotalHours_byDay']['ot'][7] += d_h;

          } else {
            totals_out['TotalHours_byDay']['dt'][i] = d_h - 8;
            totals_out['TotalHours_byDay']['ot'][i] = 8;

            //Update Grand Totals
            totals_out['TotalHours_byDay']['ot'][7] += totals_out['TotalHours_byDay']['ot'][i];
            totals_out['TotalHours_byDay']['dt'][7] += totals_out['TotalHours_byDay']['dt'][i];
          }
        } else {
          if (d_h > 8 && d_h <= 12) {
            totals_out['TotalHours_byDay']['ot'][i] = totals_out['TotalHours_byDay']['t'][i] - 8;
            totals_out['TotalHours_byDay']['rt'][i] = 8;

            // Update grand Totals
            totals_out['TotalHours_byDay']['ot'][7] += totals_out['TotalHours_byDay']['ot'][i];
            totals_out['TotalHours_byDay']['rt'][7] += totals_out['TotalHours_byDay']['t'][i];

          } else if (d_h > 12) {
            totals_out['TotalHours_byDay']['dt'][i] = totals_out['TotalHours_byDay']['t'][i] - 12;
            totals_out['TotalHours_byDay']['ot'][i] = 4;
            totals_out['TotalHours_byDay']['rt'][i] = 8;

            //Update Grand Totals
            totals_out['TotalHours_byDay']['rt'][7] += totals_out['TotalHours_byDay']['rt'][i];
            totals_out['TotalHours_byDay']['ot'][7] += totals_out['TotalHours_byDay']['ot'][i];
            totals_out['TotalHours_byDay']['dt'][7] += totals_out['TotalHours_byDay']['dt'][i];
          } else {
            // Update Grand Totals
            totals_out['TotalHours_byDay']['rt'][7] += totals_out['TotalHours_byDay']['rt'][i];
          }
        }
      }
    } else {  // Canada Rules
      let cur_total = 0;
      let ot_triggerd = false;

      // go through every day... 
      for (var i = 0; i < 7; i++) {

        var d_h = totals_out['TotalHours_byDay']['t'][i]; // set current day hours         
        cur_total += d_h
        var hours_rt = 0;
        var hours_ot = 0;

        // Check to see if the current total hours are greater than 40 and that there are hours record for the current day				
        if (cur_total > 40 && totals_out['TotalHours_byDay']['rt'][i] > 0) {
          hours_rt = 0;
          hours_ot = 0;

          if (ot_triggerd) {  // This day is all OT hours
            totals_out['TotalHours_byDay']['rt'][i] = 0.0;
            hours_ot = d_h;            
          } else {
            hours_ot = cur_total - 40;

            if (hours_ot < d_h) { //This day has both RT and OT
              hours_rt = d_h - hours_ot;
            }

            // Update the timesheet_totals
            totals_out['TotalHours_byDay']['rt'][i] = hours_rt;

            // Next day will be all OT hours
            ot_triggerd = true;
          }
          totals_out['TotalHours_byDay']['ot'][i] = hours_ot;
          totals_out['TotalHours_byDay']['ot'][7] += hours_ot;
        } else {
          totals_out['TotalHours_byDay']['rt'][i] = d_h;
          hours_rt = d_h
        }
        totals_out['TotalHours_byDay']['rt'][7] += hours_rt;
      }      
    }
    return totals_out;
  }


  overtimeBreakdown(vars, return_values) {
    // push show/dept to array with hours (that aren't the ot sel item)
    var byHours = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    for (var s_1 in vars.timesheet_totals_byShow) {
      for (var s_2 in vars.timesheet_totals_byShow[s_1]) {
        for (var i = 0; i < 7; i++) {
          if (!(vars.ot_sel[i][0] == s_1 && vars.ot_sel[i][1] == s_2)) {
            if (vars.timesheet_totals_byShow[s_1][s_2]['hours'][i] > 0.0) {
              byHours[i].push({ hours: vars.timesheet_totals_byShow[s_1][s_2]['hours'][i], cat_1: s_1, cat_2: s_2 });
            }
          }
        }
      }
    }

    // sort days' hour by show/dept hours (DESC)
    for (var i = 0; i < 7; i++) {
      byHours[i].sort(function (a, b) { return (a.hours < b.hours) ? 1 : ((b.hours < a.hours) ? -1 : 0); });
    }

    // prepend to the front the show/dept to array that is selected as the ot priority
    for (var s_1 in vars.timesheet_totals_byShow) {
      for (var s_2 in vars.timesheet_totals_byShow[s_1]) {
        for (var i = 0; i < 7; i++) {
          if (vars.ot_sel[i][0] == s_1 && vars.ot_sel[i][1] == s_2) {
            byHours[i].unshift({ hours: vars.timesheet_totals_byShow[s_1][s_2]['hours'][i], cat_1: s_1, cat_2: s_2 });
          }
        }
      }
    }

    var ot_assignment = { 'rt': [], 'ot': [], 'dt': [] };

    
    for (var i = 0; i < 7; i++) {
      if (vars.timesheet_totals['ot'][i] > 0.0) {
        var hours = vars.timesheet_totals['rt'][i];
        var hours_ot = vars.timesheet_totals['ot'][i];
        var hours_dt = vars.timesheet_totals['dt'][i];

        // go through the projects in order of priorty
        for (var x_1 in byHours[i]) {
          var hours_byShow = byHours[i][x_1]['hours'];
          
          if (vars.current_office == 0) { // California Rules
            
            if (hours_dt > 0.0) {
              ot_assignment['dt'].push({ day: i, hours: (hours_byShow > hours_dt) ? hours_dt : hours_byShow, cat_1: byHours[i][x_1]['cat_1'], cat_2: byHours[i][x_1]['cat_2'] });

              // after assignment then we need to adjust the hours
              var hours_byShow_tmp = hours_byShow;
              hours_byShow = (hours_byShow > hours_dt) ? hours_byShow - hours_dt : 0;
              hours_dt = (hours_byShow_tmp > hours_dt) ? 0 : hours_dt - hours_byShow_tmp;
            }
          }

          if (hours_ot > 0.0 && hours_byShow > 0.0) {
            ot_assignment['ot'].push({ day: i, hours: (hours_byShow > hours_ot) ? hours_ot : hours_byShow, cat_1: byHours[i][x_1]['cat_1'], cat_2: byHours[i][x_1]['cat_2'] });

            // after assignment then we need to adjust the hours
            var hours_byShow_tmp = hours_byShow;
            hours_byShow = (hours_byShow > hours_ot) ? hours_byShow - hours_ot : 0;
            hours_ot = (hours_byShow_tmp > hours_ot) ? 0 : hours_ot - hours_byShow_tmp;
          }
        }
      }
    }

    vars.ot_assignment = ot_assignment;
    vars.show_ot_breakdown = false;

    
    if(return_values){     
      return vars.ot_assignment;
    }
  }



}
