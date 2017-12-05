import { Injectable } from '@angular/core';
import { Line } from '../models/Line'

@Injectable()
export class ServiceService {
  lines: Line[];
  lines_alt: Line[];
  lines_sample: Line[];
  lines_init: Line[];
  lines_approval: Line[];
  shotTasks = [];
  assetTasks = [];
  productionTasks = [];
  projectTasks = [];
  departmentTasks = [];
  shots = [];
  assets = [];
  projects = [];
  departments = [];
  users = Object();

  constructor() {


    this.users = {
      0: {
        FullName: 'Violet Rogerson',
        FullName_r: 'Rogerson, Violet',
        FirstName: 'Violet',
        LastName: 'Rogerson',
        OfficeKey: 0,
        Data: {
          TotalHours: 0
        }
      },
      1: {
        FullName: 'Drake Donaldson',
        FullName_r: 'Donaldson, Drake',
        FirstName: 'Drake',
        LastName: 'Donaldson',
        OfficeKey: 0,
        Data: {
          TotalHours: 0
        }
      },
      2: {
        FullName: 'Traci Stacie',
        FullName_r: 'Stacie, Traci',
        FirstName: 'Traci',
        LastName: 'Stacie',
        OfficeKey: 0,
        Data: {
          TotalHours: 0
        }
      },
      3: {
        FullName: 'Erick Kelley',
        FullName_r: 'Kelley, Erick',
        FirstName: 'Erick',
        LastName: 'Kelley',
        OfficeKey: 0,
        Data: {
          TotalHours: 0
        }
      },
      4: {
        FullName: 'Joyce Cross',
        FullName_r: 'Cross, Joyce',
        FirstName: 'Joyce',
        LastName: 'Cross',
        OfficeKey: 0,
        Data: {
          TotalHours: 0
        }
      },
      5: {
        FullName: 'Tommy Fleming',
        FullName_r: 'Fleming, Tommy',
        FirstName: 'Tommy',
        LastName: 'Fleming',
        OfficeKey: 0,
        Data: {
          TotalHours: 0
        }
      },
      6: {
        FullName: 'Trent Townsend',
        FullName_r: 'Townsend, Trent',
        FirstName: 'Trent',
        LastName: 'Townsend',
        OfficeKey: 0,
        Data: {
          TotalHours: 0
        }
      },
      7: {
        FullName: 'Michael Layton',
        FullName_r: 'Layton, Michael',
        FirstName: 'Michael',
        LastName: 'Layton',
        OfficeKey: 0,
        Data: {
          TotalHours: 0
        }
      },
      8: {
        FullName: 'Nate Simonson',
        FullName_r: 'Simonson, Nate',
        FirstName: 'Nate',
        LastName: 'Simonson',
        OfficeKey: 0,
        Data: {
          TotalHours: 0
        }
      },
      9: {
        FullName: 'Jeannine Chandler',
        FullName_r: 'Chandler, Jeannine',
        FirstName: 'Jeannine',
        LastName: 'Chandler',
        OfficeKey: 0,
        Data: {
          TotalHours: 0
        }
      }
    }


    this.departmentTasks = [
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



    this.projectTasks = [
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

    this.productionTasks = [
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
      }
    ];

    this.shotTasks = [
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


    this.assetTasks = [
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
        OT: null
      },
      {
        UserKey: 0,
        Cat_1: 1,
        Cat_1_Title: 'Departments',
        Cat_2: null,
        Cat_2_Title: '',
        Cat_3: null,
        Cat_3_Title: '',
        Cat_4: null,
        Cat_4_Title: '',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: null,
        OT: null
      }
    ];

    this.lines_alt = [
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: 'Shows',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 4,
        Cat_3_Title: 'Asset',
        Cat_4: 111,
        Cat_4_Title: '1125',
        Cat_5: 12,
        Cat_5_Title: 'Model',
        Hours: [0, 1, 2, 1, 3, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: 'Shows',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 6,
        Cat_3_Title: 'Production Staff',
        Cat_4: 4,
        Cat_4_Title: 'Producer',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: [0, 1, 2, 1, 3, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: 'Shows',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 6,
        Cat_3_Title: 'Production Staff',
        Cat_4: 8,
        Cat_4_Title: 'Editor',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: [0, 1, 2, 1, 3, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: 'Shows',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 5,
        Cat_3_Title: 'Shot',
        Cat_4: 1532,
        Cat_4_Title: '123',
        Cat_5: 13,
        Cat_5_Title: 'Paint',
        Hours: [0, 1, 2, 1, 3, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: 'Shows',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 5,
        Cat_3_Title: 'Shot',
        Cat_4: 1532,
        Cat_4_Title: '123',
        Cat_5: 5,
        Cat_5_Title: 'Comp',
        Hours: [0, 1, 1, 5, 1, .5, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: 'Shows',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 5,
        Cat_3_Title: 'Shot',
        Cat_4: 1532,
        Cat_4_Title: '123',
        Cat_5: 14,
        Cat_5_Title: 'Roto',
        Hours: [0, 0, 0, .25, 1, 2.5, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
        Cat_1: 0,
        Cat_1_Title: 'Shows',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 5,
        Cat_3_Title: 'Shot',
        Cat_4: 2542,
        Cat_4_Title: '32432',
        Cat_5: 13,
        Cat_5_Title: 'Paint',
        Hours: [0, 1, 2, 1, 3, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
        Cat_1: 1,
        Cat_1_Title: 'Departments',
        Cat_2: 1,
        Cat_2_Title: 'Accounting',
        Cat_3: 8,
        Cat_3_Title: 'Training',
        Cat_4: null,
        Cat_4_Title: '',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: [0, 1, 2, 1, .25, 1, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
        Cat_1: 1,
        Cat_1_Title: 'Departments',
        Cat_2: 1,
        Cat_2_Title: 'Accounting',
        Cat_3: 9,
        Cat_3_Title: 'Vacation',
        Cat_4: null,
        Cat_4_Title: '',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: [0, 2, 1, .25, 1, 5, 0],
        OT: [false, false, false, false, false, false, false]
      }
    ];



    this.lines_sample = [
      {
        UserKey: 0,
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
        Hours: [0, 0, 2, 0, 1.75, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
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
        Hours: [0, 0, 2, 0, 3, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
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
        Hours: [0, 0, 2, 0, 2.5, 4, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
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
        Hours: [0, 0, 2, 0, 1, 4, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 2, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
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
        Hours: [0, 0, 0, 7, 0, 5, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 0, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 0, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 8, 0, 0, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 0, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 0, 1, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 1, 1, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 0,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 2, 1, 2, 2, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 0, 1, 1, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 0, 2, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 0, 1, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 2, 2, 0, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 2, 2, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 2, 0, 2, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 1, 2, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 1, 2, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 1,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 2, 1, 2, 2, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 1, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 0, 0, 2, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 2, 2, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 2, 2, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 0, 2, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 2, 0, 1, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 2, 1, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 1, 2, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 2,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 2, 2, 0, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 2, 2, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 0, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 1, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 1, 2, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 1, 0, 0, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 0, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 1, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 3,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 0, 2, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 0, 2, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 2, 0, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 2, 2, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 0, 0, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 0, 2, 2, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 1, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 0, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 4,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 1, 0, 1, 0, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 2, 2, 1, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 1, 2, 1, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 2, 1, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 0, 2, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 0, 1, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 1, 0, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 0, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 2, 2, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 5,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 2, 2, 1, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 1, 1, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 1, 0, 1, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 0, 1, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 2, 2, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 2, 1, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 2, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 1, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 2, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 6,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 1, 0, 1, 0, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 2, 2, 0, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 1, 0, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 0, 2, 2, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 0, 2, 1, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 2, 1, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 2, 1, 2, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 0, 2, 2, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 0, 0, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 7,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 2, 0, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 1, 2, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 2, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 2, 0, 2, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 2, 0, 2, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 1, 2, 1, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 0, 1, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 2, 0, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 1, 0, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 8,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 8,
        Cat_2_Title: "Production",
        Cat_3: 8,
        Cat_3_Title: "Training",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 2, 1, 0, 0, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 0, 0, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 2, 2, 1, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 1, 1, 1, 0, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 1, 0, 0, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 1, 2, 0, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 2, 2, 0, 1, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 0, 2, 2, 0, 1, 0],
        OT: [false, false, false, false, false, false, false]
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
        Hours: [0, 1, 2, 1, 2, 0, 0],
        OT: [false, false, false, false, false, false, false]
      },
      {
        UserKey: 9,
        Cat_1: 1,
        Cat_1_Title: "Departments",
        Cat_2: 3,
        Cat_2_Title: "Finance",
        Cat_3: 6,
        Cat_3_Title: "Sick",
        Cat_4: null,
        Cat_4_Title: "",
        Cat_5: null,
        Cat_5_Title: "",
        Hours: [0, 0, 0, 1, 2, 2, 0],
        OT: [false, false, false, false, false, false, false]
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
    return Object.assign([], this.lines_init);;
  }


  getSampleLines() {
    return Object.assign([], this.lines_sample);;
  }


  getShotTasks() {
    return this.shotTasks;
  }

  getAssetTasks() {
    return this.assetTasks;
  }

  getProductionTasks() {
    return this.productionTasks;
  }

  getProjectTasks() {
    return this.projectTasks;
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
    return this.departmentTasks;
  }

  getDepartments() {
    return this.departments;
  }

  getUsers() {
    return this.users;
  }



}
