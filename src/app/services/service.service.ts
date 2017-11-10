import { Injectable } from '@angular/core';
import { Line } from '../models/Line'

@Injectable()
export class ServiceService {
  lines: Line[];
  lines_alt: Line[];
  shotTasks = [];
  assetTasks = [];
  productionTasks = [];
  projectTasks = [];
  departmentTasks = [];
  shots = [];
  assets = [];
  projects = [];
  departments = [];

  constructor() {

    this.departments = [
      {
        Cat_key: -1,
        Cat_Title: "Select Option"
      },
      {
        Cat_key: 1,
        Cat_Title: "Accounting"
      },
      {
        Cat_key: 2,
        Cat_Title: "HR"
      },
      {
        Cat_key: 3,
        Cat_Title: "Production"
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


    this.departmentTasks = [
      {
        Cat_key: -1,
        Cat_Title: "Select Option"
      },
      {
        Cat_key: 3,
        Cat_Title: "Bereavement"
      },
      {
        Cat_key: 2,
        Cat_Title: "Down Time"
      },
      {
        Cat_key: 4,
        Cat_Title: "Flex Holiday"
      },
      {
        Cat_key: 5,
        Cat_Title: "Jury Duty"
      },
      {
        Cat_key: 6,
        Cat_Title: "Sick Time"
      },
      {
        Cat_key: 7,
        Cat_Title: "Stat Holiday"
      },
      {
        Cat_key: 1,
        Cat_Title: "Training"
      },
      {
        Cat_key: 8,
        Cat_Title: "Unpaid Time Off"
      },
      {
        Cat_key: 9,
        Cat_Title: "Vacation"
      }
    ]



    this.projectTasks = [
      {
        Cat_key: -1,
        Cat_Title: "Select Option"
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
        Cat_Title: "R&amp;D "
      }
    ];

    this.productionTasks = [
      {
        Cat_key: -1,
        Cat_Title: 'Select Option'
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
        Cat_Title: 'Select Option'
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
        Cat_Title: "Select Option"
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

    this.lines = [
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: null,
        Cat_2_Title: '',
        Cat_3: null,
        Cat_3_Title: '',
        Cat_4: null,
        Cat_4_Title: '',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: null
      },
      {
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
        Hours: null
      }
    ];

    this.lines_alt = [
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 4,
        Cat_3_Title: 'Asset',
        Cat_4: 111,
        Cat_4_Title: '1125',
        Cat_5: 12,
        Cat_5_Title: 'Model',
        Hours: [0, 1, 2, 1, 3, 0, 0]
      },
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 6,
        Cat_3_Title: 'Production Staff',
        Cat_4: 4,
        Cat_4_Title: 'Producer',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: [0, 1, 2, 1, 3, 0, 0]
      },
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 6,
        Cat_3_Title: 'Production Staff',
        Cat_4: 8,
        Cat_4_Title: 'Editor',
        Cat_5: null,
        Cat_5_Title: '',
        Hours: [0, 1, 2, 1, 3, 0, 0]
      },
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 5,
        Cat_3_Title: 'Shot',
        Cat_4: 1532,
        Cat_4_Title: '123',
        Cat_5: 13,
        Cat_5_Title: 'Paint',
        Hours: [0, 1, 2, 1, 3, 0, 0]
      },
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 5,
        Cat_3_Title: 'Shot',
        Cat_4: 1532,
        Cat_4_Title: '123',
        Cat_5: 5,
        Cat_5_Title: 'Comp',
        Hours: [0, 1, 1, 5, 1, .5, 0]
      },
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 5,
        Cat_3_Title: 'Shot',
        Cat_4: 1532,
        Cat_4_Title: '123',
        Cat_5: 14,
        Cat_5_Title: 'Roto',
        Hours: [0, 0, 0, .25, 1, 2.5, 0]
      },
      {
        Cat_1: 0,
        Cat_1_Title: 'Projects',
        Cat_2: 1,
        Cat_2_Title: 'Stranger Things',
        Cat_3: 5,
        Cat_3_Title: 'Shot',
        Cat_4: 2542,
        Cat_4_Title: '32432',
        Cat_5: 13,
        Cat_5_Title: 'Paint',
        Hours: [0, 1, 2, 1, 3, 0, 0]
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
        Hours: [0, 1, 2, 1, .25, 1, 0]
      },
      {
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
        Hours: [0, 2, 1, .25, 1, 5, 0]
      }
    ];
  }


  getLines() {
    return this.lines;
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



}
