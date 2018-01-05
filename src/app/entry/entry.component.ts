// 
// AUTHOR: Tyler Cote
// EMAIL: tyler@santear.com
// 
// NOTE: Using the following index for days of week; 0 = Monday; 
// functions : camelCase
// variables: lowercase, separate_words_with_underscore 

import { Component } from '@angular/core';
import { ServiceService } from '../services/service.service';

declare var jquery: any;
declare var $: any;

@Component({
	selector: 'app-entry',
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.css']
})


export class EntryComponent {
	// store all variables, objects, arrays in this object
	vars = Object();

	// day of week text	
	days_label = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	day_name_full = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	// temporary variables used during development	
	user_department = 8;
	week_labels = ['Jan 1 - Jan 7 (this week)',
	'Jan 8 - Jan 14',
	'Jan 15 - Jan 21',
	'Jan 22 - Jan 28',
	'Jan 29 - Feb 4'
	]


	constructor(public serviceService: ServiceService) {
		// connection to database functions
	}

	ngOnInit() {
		this.vars.timesheet_totals = {
			'rt': [0, 0, 0, 0, 0, 0, 0, 0],
			'ot': [0, 0, 0, 0, 0, 0, 0, 0],
			'dt': [0, 0, 0, 0, 0, 0, 0, 0]
		};

		this.vars.days = [0, 1, 2, 3, 4, 5, 6]
		this.vars.ot_req = [0, 0, 0, 0, 0, 0, 0]
		this.vars.ot_sel = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]]
		this.vars.current_office = 1;  // 0 = Oakland   1 = Montreal		
		this.vars.user_name = "Your Name"
		this.vars.timesheet_date = 'Jan 1 - Jan 7 (this week)';	

		this.vars.show_add_lines = Object();

		this.vars.shot_tasks = this.serviceService.getShotTasks();
		this.vars.asset_tasks = this.serviceService.getAssetTasks();
		this.vars.production_tasks = this.serviceService.getProductionTasks();
		this.vars.supervision_tasks = this.serviceService.getSupervisionTasks();
		this.vars.show_tasks = this.serviceService.getShowTasks();
		this.vars.department_tasks = this.serviceService.getDepartmentTasks();

		this.vars.shots = this.serviceService.getShots();
		this.vars.assets = this.serviceService.getAssets();
		this.vars.shows = this.serviceService.getShows();

		this.vars.departments = this.serviceService.getDepartments();
		this.vars.lines = this.serviceService.getInitLines();

		// Convert rows queried from database to an object and then do some other tasks
		let converted = this.convertLinesToObject(this.vars.lines);

		this.vars.titles = converted['titles'];
		this.vars.timesheet = this.serviceService.generateTimesheetByUser(converted['timesheet'], this.vars.titles, this.vars.show_add_lines)

		// sum hours
		this.vars.timesheet = this.serviceService.sumHours(this.vars.timesheet);
	}

	weekSelected(week_i) {
		this.vars.timesheet_date = this.week_labels[week_i];
		//$('#cal').hide();
		this.loadInitTimeheet();
	}

	convertLinesToObject(lines) {
		let timesheet = {};
		let titles = {};

		for (var i = 0; i < lines.length; i++) {
			var element = this.vars.lines[i];

			// Go through all of the tTime records and creates a JSON
			try {
				if (!timesheet.hasOwnProperty(element['Cat_1']) && element['Cat_1'] != null) {
					timesheet[element['Cat_1']] = {};
					titles[element['Cat_1']] = {};
				}
			} catch (err) { }

			try {
				if (!timesheet[element['Cat_1']].hasOwnProperty(element['Cat_2']) && element['Cat_2'] != null) {
					timesheet[element['Cat_1']][element['Cat_2']] = {};
					titles[element['Cat_1']][element['Cat_2']] = {};
				}
			} catch (err) { }

			try {
				if (!timesheet[element['Cat_1']][element['Cat_2']].hasOwnProperty(element['Cat_3']) && element['Cat_3'] != null) {
					timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']] = {};
					titles[element['Cat_1']][element['Cat_2']][element['Cat_3']] = {};
				}
			} catch (err) { }

			try {
				if (!timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']].hasOwnProperty(element['Cat_4']) && element['Cat_4'] != null) {
					timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']] = {};
					titles[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']] = {};
				}
			} catch (err) { }

			try {
				if (!timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']].hasOwnProperty(element['Cat_5']) && element['Cat_5'] != null) {
					timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']][element['Cat_5']] = {};
					titles[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']][element['Cat_5']] = {};
				}
			} catch (err) { }


			// assign element hours to timesheet object
			if (element['Cat_5'] != null) {
				timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']][element['Cat_5']]['Hours'] = element['Hours'];
			} else if (element['Cat_4'] != null) {
				timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']]['Hours'] = element['Hours'];
			} else if (element['Cat_3'] != null) {
				timesheet[element['Cat_1']][element['Cat_2']][element['Cat_3']]['Hours'] = element['Hours'];
			} else if (element['Cat_2'] != null) {
				timesheet[element['Cat_1']][element['Cat_2']]['Hours'] = element['Hours'];
			} else if (element['Cat_1'] != null) {
				timesheet[element['Cat_1']]['Hours'] = element['Hours'];
			}

			// Add titles to this.vars.titles object; Will most likely change how titles are collected in the future 
			try {
				titles[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']][element['Cat_5']]['Title'] = element['Cat_5_Title'];
			} catch (err) { }

			try {
				titles[element['Cat_1']][element['Cat_2']][element['Cat_3']][element['Cat_4']]['Title'] = element['Cat_4_Title'];
			} catch (err) { }

			try {
				titles[element['Cat_1']][element['Cat_2']][element['Cat_3']]['Title'] = element['Cat_3_Title'];
			} catch (err) { }

			try {
				titles[element['Cat_1']][element['Cat_2']]['Title'] = element['Cat_2_Title'];
			} catch (err) { }

			try {
				titles[element['Cat_1']]['Title'] = element['Cat_1_Title'];
			} catch (err) { }
		}
		return { timesheet: timesheet, titles: titles }
	}


	saveTimesheet() {
		// add function to post data once database is setup

		let loc_this = this;
		this.vars.save_status = "saving";
		this.vars.save_status_color = "yellow";
		clearTimeout(this.vars.save_timeout);

		// return state back to saved after a certain period. 
		this.vars.save_timeout = setTimeout(function () {
			loc_this.vars.save_status = "saved";
			loc_this.vars.save_status_color = "green";
		}, 1500);
	}


	updateHours(event, e, day) {

		// Hide remove buttons
		this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'show_menu', false);
		this.vars.edit_line_items = false;
		this.vars.show_edit_line_items = false;

		day = parseInt(day);

		if (isNaN(event.target.value) || event.target.value.trim() == '') {
			e[day] = 0;
			if (event.target.value.trim() != '.') {
				event.target.value = '';
			}
		} else {
			e[day] = parseFloat(event.target.value);

			if (event.type == 'blur' && event.target.value == 0) {
				event.target.value = '';
			}
			this.saveTimesheet();
		}
		this.updateTimesheetTotals();
	}

	isNumberKey(event) {
		var charCode = (event.which) ? event.which : event.keyCode;
		if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		} else {
			return true;
		}
	}

	updateTimesheetTotals() {
		// Reset timehseet totals before running function
		this.vars.timesheet_totals = {
			'rt': [0, 0, 0, 0, 0, 0, 0, 0],
			'ot': [0, 0, 0, 0, 0, 0, 0, 0],
			'dt': [0, 0, 0, 0, 0, 0, 0, 0]
		};

		// Loop through cat_1 parents
		this.vars.timesheet.forEach(cat_1 => {
			if (cat_1.hours != undefined) {
				this.addToTotals(cat_1.hours, false);
			}

			// Loop through cat_1 children
			cat_1.children.forEach(cat_2 => {
				cat_2.sum_hours = [0, 0, 0, 0, 0, 0, 0]
				if (cat_2.hours != undefined) {
					this.addToTotals(cat_2, cat_2);
				}

				// Loop through cat_2 children
				cat_2.children.forEach(cat_3 => {
					if (cat_3.hours != undefined) {
						this.addToTotals(cat_3, cat_2);
					}

					// Loop through cat_3 children
					cat_3.children.forEach(cat_4 => {
						if (cat_4.hours != undefined) {
							this.addToTotals(cat_4, cat_2);
						}

						cat_4.children.forEach(cat_5 => {
							if (cat_5.hours != undefined) {
								this.addToTotals(cat_5, cat_2);
							}
						});
					});
				});
			});
		});

		this.vars.timesheet_totals['rt'][7] = this.vars.timesheet_totals['rt'][0]
			+ this.vars.timesheet_totals['rt'][1]
			+ this.vars.timesheet_totals['rt'][2]
			+ this.vars.timesheet_totals['rt'][3]
			+ this.vars.timesheet_totals['rt'][4]
			+ this.vars.timesheet_totals['rt'][5]
			+ this.vars.timesheet_totals['rt'][6];

		
		var totalsOvertimeBreakdown = this.serviceService.totalsOvertimeBreakdown(this.vars.timesheet, this.vars.timesheet_totals, this.vars.current_office);
		this.vars.timesheet_totals = totalsOvertimeBreakdown['TotalHours_byDay'];

		this.vars.timesheet_totals_byShow = totalsOvertimeBreakdown['TotalHours_byShow'];

		this.validateOvertime();

		this.serviceService.overtimeBreakdown(this.vars, false);
	}

	addToTotals(array_in, sum_hours) {
		for (var i = 0; i < 7; i++) {
			this.vars.timesheet_totals['rt'][i] += array_in.hours[i];
			sum_hours.sum_hours[i] += array_in.hours[i];
		}
	}


	setOvertimeChoice(cat_1, cat_2, day) {

		if (this.vars.current_office == 0) {

			if (this.vars.ot_sel[day][0] == cat_1 && this.vars.ot_sel[day][1] == cat_2) {
				this.vars.ot_sel[day][0] = -1;
				this.vars.ot_sel[day][1] = -1;
			} else {
				this.vars.ot_sel[day][0] = cat_1;
				this.vars.ot_sel[day][1] = cat_2;
			}

		} else if (this.vars.current_office == 1) {
			for (var i = 0; i < 7; i++) {
				if (i != day) {
					this.vars.ot_sel[i][0] = -1;
					this.vars.ot_sel[i][1] = -1;
				}
			}

			if (this.vars.ot_sel[day][0] == cat_1 && this.vars.ot_sel[day][1] == cat_2) {
				this.vars.ot_sel[day][0] = -1;
				this.vars.ot_sel[day][1] = -1;
			} else {
				this.vars.ot_sel[day][0] = cat_1;
				this.vars.ot_sel[day][1] = cat_2;
			}
		}

		this.serviceService.overtimeBreakdown(this.vars, false)
		this.saveTimesheet();
	}

	clearOvertimeChoice() {
		this.vars.timesheet.forEach(element => {
			element.children.forEach(element_2 => {
				for (var i = 0; i < element_2.ot.length; i++) {
					element_2.ot[i] = false;
				}
			});
		});
	}


	//
	//
	//	ADD/REMOVE ROW FUNCTIONS 
	//
	//


	searchShotAsset(event, cat, showTask, element) {
		if (cat == 1) {
			var search_array = this.vars.shows;
		} else if (cat == 2) {
			var search_array = (showTask == 5) ? this.vars.shots : this.vars.assets;
		}

		var results = [];
		var phrase = event.target.value.trim().toLowerCase()

		if (phrase.length > 0) {
			// search array
			search_array.forEach(el => {
				if (el.Cat_Title.toLowerCase().indexOf(phrase) != -1) {
					results.push(el);
				}
			});

			// populate the result div
			for (var i = 0; i < results.length; i++) {
				var el = results[i];
			}

			if (results.length == 0) {
				results.push({ Cat_Title: "No Results", Cat_key: -1 })
			} else if (results.length > 5) {
				results.splice(5);
				results.push({ Cat_Title: "More (Refine Search)", Cat_key: -1 })
			}
		}
		element.results = results
	}

	selectShow(el, cat) {
		if (el.Cat_key > 0) {
			cat.shot_selected = el;

			this.addLineItem([cat]);
			this.resetDropdowns(cat);
		}
	}

	selectShotAsset(el, cats) {
		var cat = cats[cats.length - 1];
		if (el.Cat_key > 0) {
			cat.shot_selected = el;
			cat.results = [];
			this.addRowOptionChange(cats);
		}
	}

	addRowOptionChange(cats, option_sel = Object()) {
		var cat = cats[cats.length - 1];
		cat.results = [];



		if (parseInt(cats[0].cat_key) == 1) { // Departments
			if (cat.cat_key > 0 && option_sel.Cat_key >= 0) {
				cat.departmentTask = option_sel.Cat_key;
				this.addLineItem(cats);
			}
		} else { // Shows			
			if (cat.showTask == -1) {
				return false;
			} else if (cat.showTask == 4) {
				if (cat.assetTask != -1 && cat.shot_selected && cat.shot_selected.Cat_key >= 0) {
					this.addLineItem(cats);
				} else {

					if (cat.assetTask != undefined && cat.assetTask > -1) {
						this.inputFocus(cats, 'shot');
					} else {
						this.inputFocus(cats, 'assetTask');
					}

				}
			} else if (cat.showTask == 5) {

				if (cat.shotTask != -1 && cat.shot_selected && cat.shot_selected.Cat_key >= 0) {
					this.addLineItem(cats);
				} else {

					if (cat.shotTask != undefined && cat.shotTask > -1) {
						this.inputFocus(cats, 'shot');
					} else {
						this.inputFocus(cats, 'shotTask');
					}
				}
			} else if (cat.showTask == 6) {
				this.inputFocus(cats, 'productionTask');
				if (cat.productionTask != -1 && cat.productionTask != undefined) {
					this.addLineItem(cats);
				}
			} else if (cat.showTask == 7) {
				this.inputFocus(cats, 'supervisionTask');
				if (cat.supervisionTask != -1 && cat.supervisionTask != undefined) {
					this.addLineItem(cats);
				}
			} else {
				this.addLineItem(cats);
			}
		}
	}


	addLineItem(cats) {
		var cat = cats[cats.length - 1];

		var cat_array = [];
		var hours = [0, 0, 0, 0, 0, 0, 0];
		var show_add_line_force = false;

		for (var i = 0; i < 5; i++) {
			try {
				cat_array.push({
					title: cats[i].title,
					cat_key: parseInt(cats[i].cat_key)
				});
			} catch (err) {
				cat_array.push({
					title: '',
					cat_key: null
				})
			}
		}

		if (cats.length == 1) {
			if (cats[0]['cat_key'] == 0) {  // Shows
				hours = null;
				cat_array[1] = {
					title: cat.shot_selected.Cat_Title,
					cat_key: cat.shot_selected.Cat_key
				};

				this.inputFocus(cat_array, 'showTask');

			} else {  // Departments				
				cat_array[1] = {
					title: this.label(cat.department, this.vars.departments),
					cat_key: cat.department
				};
				cat_array[2] = {
					title: this.label(cat.departmentTask, this.vars.department_tasks),
					cat_key: cat.departmentTask
				};
			}

		} else if (cats.length == 2 && cats[0]['cat_key'] == 1) {
			cat_array[2] = {
				title: this.label(cat.departmentTask, this.vars.department_tasks),
				cat_key: cat.departmentTask
			};

		} else if (cats.length == 4) {
			if (cat_array[2]['cat_key'] == 5) {
				cat_array[4] = {
					title: cat.shot_selected.Cat_Title,
					cat_key: cat.shot_selected.Cat_key
				};
			} else {
				cat_array[4] = {
					title: cat.shot_selected.Cat_Title,
					cat_key: cat.shot_selected.Cat_key
				};
			}
		} else if (cats.length == 3) {

			if (cat_array[2]['cat_key'] == 6) {
				cat_array[3] = {
					title: this.label(cat.productionTask, this.vars.production_tasks),
					cat_key: cat.productionTask
				};
			} else if (cat_array[2]['cat_key'] == 7) {
				cat_array[3] = {
					title: this.label(cat.supervisionTask, this.vars.supervision_tasks),
					cat_key: cat.supervisionTask
				};
			}

		} else {

			cat_array[2] = {
				title: this.label(cat.showTask, this.vars.show_tasks),
				cat_key: cat.showTask
			};


			if (cat_array[2]['cat_key'] == 5 || cat_array[2]['cat_key'] == 4) {
				cat_array[4] = {
					title: cat.shot_selected.Cat_Title,
					cat_key: cat.shot_selected.Cat_key
				};

				// Slice off the 's' so that it's not plural. 
				cat_array[2]['title'] = cat_array[2]['title'].slice(0, -1);

				if (cat_array[2]['cat_key'] == 5) {
					cat_array[3] = {
						title: this.label(cat.shotTask, this.vars.shot_tasks),
						cat_key: cat.shotTask
					};
				} else {
					cat_array[3] = {
						title: this.label(cat.assetTask, this.vars.asset_tasks),
						cat_key: cat.assetTask
					};
				}
			} else if (cat_array[2]['cat_key'] == 6) {
				cat_array[3] = {
					title: this.label(cat.productionTask, this.vars.production_tasks),
					cat_key: cat.productionTask
				};
			} else if (cat_array[2]['cat_key'] == 7) {
				cat_array[3] = {
					title: this.label(cat.supervisionTask, this.vars.supervision_tasks),
					cat_key: cat.supervisionTask
				};
			}
		}


		this.vars.cur_sel = '';
		var tmp_cats = Array();

		for (var i = 0; i < cat_array.length; i++) {
			if (cat_array[i]['cat_key'] != null) {
				tmp_cats.push(cat_array[i]['cat_key'])
			}
		}

		this.vars.cur_sel = tmp_cats.join('_');


		if (!this.checkLineExists(cat_array)) {
			this.vars.lines.push({
				Cat_1: cat_array[0]['cat_key'],
				Cat_1_Title: cat_array[0]['title'],
				Cat_2: cat_array[1]['cat_key'],
				Cat_2_Title: cat_array[1]['title'],
				Cat_3: cat_array[2]['cat_key'],
				Cat_3_Title: cat_array[2]['title'],
				Cat_4: cat_array[3]['cat_key'],
				Cat_4_Title: cat_array[3]['title'],
				Cat_5: cat_array[4]['cat_key'],
				Cat_5_Title: cat_array[4]['title'],
				Hours: hours,
				Focus: this.vars.cur_sel
			});
		}

		if (hours != null) {
			this.inputFocus(cat_array, '0_hour');
		}

		let convertLinesToTimeSheet = this.convertLinesToObject(this.vars.lines)
		this.vars.titles = convertLinesToTimeSheet['titles'];
		this.vars.timesheet = this.serviceService.generateTimesheetByUser(convertLinesToTimeSheet['timesheet'], this.vars.titles, this.vars.show_add_lines);

		this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'autofocus', null);

		this.updateTimesheetTotals();
		this.vars.show_add_lines = {}
		this.resetDropdowns(cat)
	}

	inputFocus(cats, suffix) {
		// Determine which input should be highlighted
		this.vars.cur_sel = '';
		var tmp_cats = Array();

		for (var i = 0; i < cats.length; i++) {
			if (cats[i]['cat_key'] != null) {
				tmp_cats.push(cats[i]['cat_key'])
			}
		}

		this.vars.focusInput = 'input_' + tmp_cats.join('_') + '_' + suffix;
		let loc_this = this;

		setTimeout(function () {
			$('#' + loc_this.vars.focusInput).focus();
		}, 10)

	}

	checkLineExists(ca) {
		for (var i = 0; i < this.vars.lines.length; i++) {
			var li = this.vars.lines[i];
			if (li['Cat_1'] == ca[0]['cat_key'] && li['Cat_2'] == ca[1]['cat_key'] && li['Cat_3'] == ca[2]['cat_key'] && li['Cat_4'] == ca[3]['cat_key'] && li['Cat_5'] == ca[4]['cat_key']) {
				return true;
			}
		}
		return false;
	}

	removeLineItem(obj_parent, obj_i, cats) {

		var obj = obj_parent[(parseInt(obj_i))];
		obj_parent.splice(parseInt(obj_i), 1);


		var incl = Array();
		for (var i = 0; i < this.vars.lines.length; i++) {
			var el = this.vars.lines[i];
			var incl_el = true;

			if (cats.length == 5) {
				if (el['Cat_1'] == parseInt(cats[0])
					&& el['Cat_2'] == parseInt(cats[1])
					&& el['Cat_3'] == parseInt(cats[2])
					&& el['Cat_4'] == parseInt(cats[3])
					&& el['Cat_5'] == parseInt(cats[4])) {
					incl_el = false;
				}
			} else if (cats.length == 4) {
				if (el['Cat_1'] == parseInt(cats[0])
					&& el['Cat_2'] == parseInt(cats[1])
					&& el['Cat_3'] == parseInt(cats[2])
					&& el['Cat_4'] == parseInt(cats[3])) {
					incl_el = false;
				}
			} else if (cats.length == 3) {


				if (parseInt(el['Cat_1']) == 0) {
					if (el['Cat_1'] == parseInt(cats[0])
						&& el['Cat_2'] == parseInt(cats[1])
						&& el['Cat_3'] == parseInt(cats[2])) {
						incl_el = false;
					}
				} else if (parseInt(el['Cat_1']) == 1) {
					if (el['Cat_1'] == parseInt(cats[0]) && el['Cat_2'] == parseInt(cats[1]) && el['Cat_3'] == parseInt(cats[2]) && el['Cat_3'] != 11) {
						incl_el = false;
					}
				}

			} else if (cats.length == 2) {
				if (el['Cat_1'] == parseInt(cats[0])
					&& el['Cat_2'] == parseInt(cats[1])) {
					incl_el = false;
				}
			}

			if (incl_el === true) {
				incl.push(el);
			}
		}

		this.vars.lines = incl;

		var exists = [false, false]

		for (var i = 0; i < this.vars.lines.length; i++) {
			exists[this.vars.lines[i]['Cat_1']] = true;
		}

		for (var i = 0; i < exists.length; i++) {
			if (i == 0 && !exists[i]) {
				this.vars.lines.push({
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
				})
			}
		}

		let convertLinesToTimeSheet = this.convertLinesToObject(this.vars.lines)
		this.vars.titles = convertLinesToTimeSheet['titles'];
		this.vars.timesheet = this.serviceService.generateTimesheetByUser(convertLinesToTimeSheet['timesheet'], this.vars.titles, this.vars.show_add_lines);
		this.updateTimesheetTotals();
	}

	resetDropdowns(cat) {
		cat.showTask = -1;
		cat.productionTask = -1;
		cat.assetTask = -1;
		cat.shotTask = -1;
		cat.department = -1;
		cat.departmentTask = -1;
	}


	showEditLineItems(cats) {
		var cat = cats[cats.length - 1];
		cat.show_menu = false;

		this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'show_menu', false);

		if (this.vars.show_edit_line_items) {
			this.vars.show_edit_line_items = false;
			this.vars.edit_line_items = false
		} else {
			this.vars.show_edit_line_items = true;
			this.vars.edit_line_items = true
		}

	}

	//
	//	LOAD/SUBMIT TIMESHEET
	//

	searchDropDown(phrase, arr, cats) {
		var results = Array();

		if (phrase != undefined) {
			phrase = phrase.trim().toLowerCase()
		} else {
			phrase = '';
		}

		if (phrase.length <= 0) {
			return results;
		}

		for (var i = 0; i < arr.length; i++) {
			if (arr[i].Cat_Title.toLowerCase().indexOf(phrase) != -1 && arr[i].Cat_key != -1) {
				arr[i].cats = cats
				results.push(arr[i]);
			}
		}

		if (results.length == 0) {
			results.push({ Cat_Title: 'No Results', Cat_key: -1 })
		}

		return results;
	}

	resetNewLine(event, el) {

		el.assetTask = -1;
		el.dd_results_assetTask = false;
		el.searchDD_assetTask = '';

		el.shotTask = -1;
		el.dd_results_shotTask = false;
		el.searchDD_shotTask = '';

		el.productionTask = -1;
		el.dd_results_productionTask = false;
		el.searchDD_productionTask = '';

		el.showTask = -1;
		el.dd_results_showTask = false;
		el.searchDD_showTask = '';

		el.shot_selected = null;
		el.dd_results_shot = false;
		el.searchDD_shot = '';

	}

	dropDownReset(event, dd_results) {
		if (event != false) {
			if (event.target.innerHTML.indexOf('&#9660;') != -1 || event.target.innerHTML.indexOf('▼') != -1) {
				event.target.innerHTML = '&#9650;';
				event = false;
			} else {
				event.target.innerHTML = '&#9660;';
				event = true;
			}
		}

		if (event) {
			dd_results = Array();
		}

		for (var i = 0; i < dd_results.length; i++) {
			dd_results[i].selected = false;
		}

		return dd_results;
	}

	dropDownKey(event, el, dd_results, cats, level = '') {

		var k_code = event.keyCode;
		var cur_i = -1;


		for (var i = 0; i < dd_results.length; i++) {
			if (dd_results[i].selected == true) {
				cur_i = i;
			}
			dd_results[i].selected = false;
		}



		if (k_code == 13) { // Enter Key  (9 = tab)
			if (cur_i >= 0) {
				if (dd_results[cur_i].cats.length == 1) { // add show					
					if (dd_results[cur_i].Cat_key > 0) {
						this.dropDownReset(false, dd_results);
						cats[0].shot_selected = dd_results[cur_i];
						this.addLineItem(cats);
					}
				} else {
					if (level == 'assetTask') {
						cats[cats.length - 1].assetTask = dd_results[cur_i].Cat_key
						cats[cats.length - 1].dd_results_assetTask = false;
						cats[cats.length - 1].searchDD_assetTask = dd_results[cur_i].Cat_Title
					} else if (level == 'shotTask') {
						cats[cats.length - 1].shotTask = dd_results[cur_i].Cat_key
						cats[cats.length - 1].dd_results_shotTask = false;
						cats[cats.length - 1].searchDD_shotTask = dd_results[cur_i].Cat_Title
					} else if (level == 'productionTask') {
						cats[cats.length - 1].productionTask = dd_results[cur_i].Cat_key
						cats[cats.length - 1].dd_results_productionTask = false;
						cats[cats.length - 1].searchDD_productionTask = dd_results[cur_i].Cat_Title
					} else if (level == 'supervisionTask') {
						cats[cats.length - 1].supervisionTask = dd_results[cur_i].Cat_key
						cats[cats.length - 1].dd_results_supervisionTask = false;
						cats[cats.length - 1].searchDD_supervisionTask = dd_results[cur_i].Cat_Title
					} else if (level == 'showTask') {
						cats[cats.length - 1].showTask = dd_results[cur_i].Cat_key
						cats[cats.length - 1].dd_results_showTask = false;
						cats[cats.length - 1].searchDD_showTask = dd_results[cur_i].Cat_Title
					} else if (level == 'shot') {
						cats[cats.length - 1].shot_selected = dd_results[cur_i]
						cats[cats.length - 1].dd_results_shot = false;
						cats[cats.length - 1].searchDD_shot = dd_results[cur_i].Cat_Title
					}

					this.addRowOptionChange(dd_results[cur_i].cats, dd_results[cur_i])
				}
			}
		} else {
			this.dropDownReset(false, dd_results)

			for (var i = 0; i < dd_results.length; i++) {
				if (dd_results[i].selected == true) {
					cur_i = i;
				}
				dd_results[i].selected = false;
			}
			if (k_code == 40) { //Key Down				
				if (cur_i + 1 < dd_results.length) {
					cur_i += 1;
				} else {
					cur_i = 0;
				}
				try {
					dd_results[cur_i].selected = true;
				} catch (err) { }
			} else if (k_code == 38) { //Key Up
				if (cur_i == 0) {
					cur_i = dd_results.length - 1;
				} else {
					cur_i -= 1;
				}
				try {
					dd_results[cur_i].selected = true;
				} catch (err) { }
			} else {
				try {
					dd_results[0].selected = true;
				} catch (err) { }
			}
		}
	}

	loadInitTimeheet() {
		this.vars.timesheet_submitted = false;
		this.vars.lines = Array();
		this.vars.lines = this.serviceService.getInitLines()
		console.log(this.vars.lines);

		var convertLinesToTimeSheet = this.convertLinesToObject(this.vars.lines)
		this.vars.titles = convertLinesToTimeSheet['titles'];
		this.vars.timesheet = this.serviceService.generateTimesheetByUser(convertLinesToTimeSheet['timesheet'], this.vars.titles, this.vars.show_add_lines);
		this.vars.ot_sel = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]];
		this.updateTimesheetTotals();
		this.vars.submit_date = false;

		setTimeout(function () {
			$('#input_0').focus();
		}, 10)
		this.vars.showCal = false;
	}

	submitTimesheet(window) {
		this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'show_menu', false);
		this.vars.edit_line_items = false;
		this.vars.show_edit_line_items = false;


		if (this.validateOvertime(true)) {
			this.openPopup('Confirm Time Sheet Submission',
				'Pressing confirm below indicates that you have completed your timesheet for the currently displayed week. Please contact your manager if you need to make any changes after submission.',
				[{ label: 'Confirm', action: 'confirmTimesheet' }, { label: 'Cancel', action: 'closePopup' }]);
		} else {
			// else option
		}
	}

	validateOvertime(onSubmit = false) {
		var ot_required = [false, false, false, false, false, false, false];
		var ot_selected = [false, false, false, false, false, false, false];
		var missing = [];
		var ot_check = ['ot', 'dt'];
		var tot = [];
		var can_ot = false;

		this.vars.ot_req = [0, 0, 0, 0, 0, 0, 0]

		for (var x = 0; x < this.vars.timesheet.length; x++) {
			for (var x_1 = 0; x_1 < this.vars.timesheet[x].children.length; x_1++) {
				for (var x_2 = 0; x_2 < 7; x_2++) {
					if (this.vars.timesheet[x].children[x_1].sum_hours[x_2] > 0.0) {
						this.vars.ot_req[x_2]++;
					}
				}
			}
		}

		for (var x = 0; x < ot_check.length; x++) {
			var ot = ot_check[x];

			for (var i = 0; i < this.vars.timesheet_totals[ot].length - 1; i++) {
				var hours = this.vars.timesheet_totals[ot][i];

				if (hours > 0.0) {
					if (this.vars.current_office == 0) {
						ot_required[i] = true;
					} else if (this.vars.current_office == 1) {
						if (!can_ot) {
							if(this.vars.timesheet_totals['rt'][i] > 0.0){
								ot_required[i] = true;
							}
							
							can_ot = true;
						}
					}
				}
			}
		}

		this.vars.timesheet.forEach(element => {
			element.children.forEach(element_2 => {
				for (var i = 0; i < element_2.ot.length; i++) {
					if (element_2.ot[i]) {
						ot_selected[i] = element_2.ot[i];
					}
					if (ot_required[i] && element_2.sum_hours[i] > 0.0 && this.vars.timesheet_totals['rt'][i] > 0.0) {
						element_2.ot_req[i] = true;
					} else {
						element_2.ot_req[i] = false;						
					}
				}
			});
		});


		for (var i = 0; i < ot_required.length; i++) {			
			if (ot_required[i] && this.vars.ot_sel[i][0] == -1) {
				missing.push(i);
			}
		}

		if (missing.length > 0 && onSubmit) {
			var missing_days = []
			missing.forEach(element => {
				missing_days.push(this.day_name_full[element])
			});

			this.openPopup('Set Overtime (OT) Options',
				'You need to select which show/department will be assigned OT for the following day(s): <span style="font-weight:700;">'
				+ missing_days.join(', ')
				+ "</span><br><br><span style='font-style:italic;font-size:0.8em;'>Click the OT button on the timesheet for the specific day and show that gets OT assigned to it.</span>"
				, [{ label: 'Close', action: 'closePopup' }]);
			return false;
		}
		return true;
	}

	openPopup(title, text, buttons) {
		this.vars.popup = Object();
		this.vars.popup.text = text;
		this.vars.popup.title = title;
		this.vars.popup.buttons = buttons;
		this.vars.showPopup = true
	}

	notesToggle(el) {
		if (el.show_note_force) {
			el.show_note_force = false;
		} else {
			el.show_note_force = true;
		}
	}

	notesUpdate(event, obj) {
		obj.note = event.target.value.trim();
		this.saveTimesheet();
	}

	loadSampleTimesheet() {
		this.loadInitTimeheet();

		this.vars.lines = this.serviceService.getSampleLines();
		let convertLinesToTimeSheet = this.convertLinesToObject(this.vars.lines);
		this.vars.titles = convertLinesToTimeSheet['titles'];
		this.vars.timesheet = this.serviceService.generateTimesheetByUser(convertLinesToTimeSheet['timesheet'], this.vars.titles, this.vars.show_add_lines);
		this.vars.submit_date = false;

		this.updateTimesheetTotals();
		this.vars.showCal = false;
	}

	// Testing out this funciton - currently not being used. 
	popupFunction(functionName) {
		this.vars.showPopup = false;

		if (functionName == 'confirmTimesheet') {
			this.vars.timesheet_submitted = true;
			this.vars.submit_date = this.serviceService.generateDate(true);
			this.vars.timesheet = this.serviceService.hideShowDivs(this.vars.timesheet, 'show_note_force', false);
		}
	}

	label(cat_key, in_array) {
		var label = 'Label';
		for (var i = 0; i < in_array.length; i++) {
			if (in_array[i]['Cat_key'] == cat_key) {
				label = in_array[i]['Cat_Title'];
			}
		}
		return label;
	}

	scrollBug() {
		var cur_scroll = document.documentElement.scrollTop;
		window.scrollTo(0, 0); // values are x,y-offset
		window.scrollTo(0, cur_scroll); // values are x,y-offset		
	}

	resetMenus(){
		console.log('reset Menus')
	}

}


