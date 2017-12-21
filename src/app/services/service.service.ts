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
        Data: {
          TotalHours: 0,
          TotalHours_ByDay: {
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
        Data: {
          TotalHours: 0,
          TotalHours_ByDay: {
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
        Data: {
          TotalHours: 0,
          TotalHours_ByDay: {
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
        Data: {
          TotalHours: 0,
          TotalHours_ByDay: {
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
        Data: {
          TotalHours: 0,
          TotalHours_ByDay: {
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
        Data: {
          TotalHours: 0,
          TotalHours_ByDay: {
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
        Data: {
          TotalHours: 0,
          TotalHours_ByDay: {
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
        Data: {
          TotalHours: 0,
          TotalHours_ByDay: {
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
        Data: {
          TotalHours: 0,
          TotalHours_ByDay: {
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
        Data: {
          TotalHours: 0,
          TotalHours_ByDay: {
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
        Cat_key: -1,
        Cat_Title: "Select Task"
      },
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
        Cat_key: -1,
        Cat_Title: "Select Department"
      },
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
        Cat_key: -1,
        Cat_Title: "Select Category"
      },
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
        Cat_key: 2,
        Cat_Title: "Down Time"
      },
      {
        Cat_key: 1,
        Cat_Title: "Training"
      },
      {
        Cat_key: 3,
        Cat_Title: "R&D "
      }
    ];

    this.production_tasks = [
      {
        Cat_key: -1,
        Cat_Title: 'Select Role'
      },
      {
        Cat_key: 1,
        Cat_Title: 'Assistant Editor'
      },
      {
        Cat_key: 2,
        Cat_Title: 'CG Supervisor'
      },
      {
        Cat_key: 3,
        Cat_Title: 'Coordinator'
      },
      {
        Cat_key: 4,
        Cat_Title: 'DFX Supervisor'
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
        Cat_key: -1,
        Cat_Title: 'Select Step'
      },
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
        Cat_key: -1,
        Cat_Title: "Select Step"
      },
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
        OT: null,
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
        OT: null,
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
        OT: null,
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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
        OT: [false, false, false, false, false, false, false],
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

  getProjectTasks() {
    return this.project_tasks;
  }

  getShots() {
    return this.shots;
  }

  getAssets() {
    return this.assets;
  }

  getProjects() {
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
            
            try{
              show_add_line = show_add_lines[prop_1][prop_2];               
            } catch(err){ }

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
              show_add_line: show_add_line
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
                  children: children[3]
                });
                for (var prop_4 in timesheet_in[prop_1][prop_2][prop_3]) {
                  if (prop_4 != 'Hours') {
                    children[4] = [];  // reset children
                    children[3].push({
                      title: titles[prop_1][prop_2][prop_3][prop_4].Title,
                      cat_key: prop_4, note: '',
                      hours: timesheet_in[prop_1][prop_2][prop_3][prop_4]['Hours'],
                      focus: [false, false, false, false, false, false, false],
                      children: children[4]
                    });
                    for (var prop_5 in timesheet_in[prop_1][prop_2][prop_3][prop_4]) {
                      if (prop_5 != 'Hours') {
                        children[4].push({
                          title: titles[prop_1][prop_2][prop_3][prop_4][prop_5].Title,
                          cat_key: prop_5, note: '',
                          hours: timesheet_in[prop_1][prop_2][prop_3][prop_4][prop_5]['Hours'],
                          focus: [false, false, false, false, false, false, false],
                          children: []
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
        show_add_line: (children[1].length <= 0 && parseInt(prop_1) == 0) ? true : false
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

  determineOvertimeBreakdown(timesheet_in, office_key) {
    var timesheet_out = Object.assign([], timesheet_in);
    var entry_page = false;

    if (!timesheet_out.hasOwnProperty('TotalHours_ByDay')) {
      timesheet_out['TotalHours_ByDay'] = timesheet_out;
      timesheet_out['TotalHours_ByDay']['t'] = timesheet_out['TotalHours_ByDay']['rt'];
      entry_page = true;
    }

    //Reset OT Totals
    timesheet_out['TotalHours_ByDay']['rt'][7] = 0;
    timesheet_out['TotalHours_ByDay']['ot'][7] = 0;
    timesheet_out['TotalHours_ByDay']['dt'][7] = 0;



    if (office_key == 0) { // California Rules 
      var cons_days = 0;  // counter for continous days 

      for (var i = 0; i < 7; i++) {
        var d_h = timesheet_out['TotalHours_ByDay']['t'][i];  // hours for the current day

        if (d_h > 0.0) {
          cons_days++;
        } else {
          cons_days = 0;
        }

        if (cons_days == 7) {
          timesheet_out['TotalHours_ByDay']['rt'][i] = 0;

          if (d_h <= 8) {
            timesheet_out['TotalHours_ByDay']['ot'][i] = d_h;

            // Update grand Totals
            timesheet_out['TotalHours_ByDay']['ot'][7] += d_h;

          } else {
            timesheet_out['TotalHours_ByDay']['dt'][i] = d_h - 8;
            timesheet_out['TotalHours_ByDay']['ot'][i] = 8;

            //Update Grand Totals
            timesheet_out['TotalHours_ByDay']['ot'][7] += timesheet_out['TotalHours_ByDay']['ot'][i];
            timesheet_out['TotalHours_ByDay']['dt'][7] += timesheet_out['TotalHours_ByDay']['dt'][i];
          }
        } else {
          if (d_h > 8 && d_h <= 12) {
            timesheet_out['TotalHours_ByDay']['ot'][i] = timesheet_out['TotalHours_ByDay']['rt'][i] - 8;
            timesheet_out['TotalHours_ByDay']['rt'][i] = 8;

            // Update grand Totals
            timesheet_out['TotalHours_ByDay']['ot'][7] += timesheet_out['TotalHours_ByDay']['ot'][i];
            timesheet_out['TotalHours_ByDay']['rt'][7] += timesheet_out['TotalHours_ByDay']['rt'][i];

          } else if (d_h > 12) {
            timesheet_out['TotalHours_ByDay']['dt'][i] = timesheet_out['TotalHours_ByDay']['rt'][i] - 12;
            timesheet_out['TotalHours_ByDay']['ot'][i] = 4;
            timesheet_out['TotalHours_ByDay']['rt'][i] = 8;

            //Update Grand Totals
            timesheet_out['TotalHours_ByDay']['rt'][7] += timesheet_out['TotalHours_ByDay']['rt'][i];
            timesheet_out['TotalHours_ByDay']['ot'][7] += timesheet_out['TotalHours_ByDay']['ot'][i];
            timesheet_out['TotalHours_ByDay']['dt'][7] += timesheet_out['TotalHours_ByDay']['dt'][i];
          } else {
            // Update Grand Totals
            timesheet_out['TotalHours_ByDay']['rt'][7] += timesheet_out['TotalHours_ByDay']['rt'][i];
          }
        }
      }
    } else {  // Canada Rules
      let cur_total = 0;
      let ot_triggerd = false;

      for (var i = 0; i < 7; i++) {

        var d_h = timesheet_out['TotalHours_ByDay']['t'][i];
        cur_total += d_h
        var hours_rt = 0;
        var hours_ot = 0;

        // Check to see if the current total hours are greater than 40 and that there are hours record for the current day				
        if (cur_total > 40 && timesheet_out['TotalHours_ByDay']['rt'][i] > 0) {
          hours_rt = 0;
          hours_ot = 0;

          if (ot_triggerd) {  // This day is all OT hours
            timesheet_out['TotalHours_ByDay']['rt'][i] = 0.0;
            hours_ot = d_h;
          } else {
            hours_ot = cur_total - 40;

            if (hours_ot < d_h) { //This day has both RT and OT
              hours_rt = d_h - hours_ot;
            }

            // Update the timesheet_totals
            timesheet_out['TotalHours_ByDay']['rt'][i] = hours_rt;

            // Next day will be all OT hours
            ot_triggerd = true;
          }
          timesheet_out['TotalHours_ByDay']['ot'][i] = hours_ot;
          timesheet_out['TotalHours_ByDay']['ot'][7] += hours_ot;
        } else {
          timesheet_out['TotalHours_ByDay']['rt'][i] = d_h;
          hours_rt = d_h
        }
        timesheet_out['TotalHours_ByDay']['rt'][7] += hours_rt;
      }
    }

    if(entry_page){
      return timesheet_out['TotalHours_ByDay'];      
    } else {
      return timesheet_out;
    }
  }



}
