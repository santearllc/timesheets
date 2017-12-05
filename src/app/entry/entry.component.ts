// 
// AUTHOR: Tyler Cote
// EMAIL: tyler@santear.com
// 
// NOTE: Using the following index for days of week; 0 = Sunday; 
// functions : camelCase
// variables: lowercase, separate_words_with_underscore 

import { Component } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { forEach } from '@angular/router/src/utils/collection';

declare var jquery: any;
declare var $: any;


@Component({
	selector: 'app-entry',
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.css']
})

export class EntryComponent {

	// misc variables
	username = 'Your Name';
	timesheet_date = 'Nov 27 - Dec 3 (this week)';
	lines: Object[];
	
	timesheet = Array();
	titles = {};
	timesheet_totals = {};
	editList = true;
	save_status;
	save_status_color;	
	save_timeout;
	current_office = 1;  // 0 = Oakland   1 = Montreal
	submit_date;


	// Month and Day of Week Text
	mo_text = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	day_name_full = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	days = [1, 2, 3, 4, 5, 6, 0];  // working with Sun=0 index so need to not use 'i' for enumerating in this situations as Monday needs to be the first day that start when determining OT hours. 

	//dropdowns
	shot_tasks;
	asset_tasks;
	production_tasks;
	project_tasks;
	department_tasks;

	// projects, shots, assets	
	shots;
	assets;
	projects;
	departments;
	results;
	project_selected;
	shot_selected;
	asset_selected;
	show_ot;
	show_dt;
	current_hover_el;

	// temporary variables used during development
	week_labels = ['Nov 27 - Dec 3 (this week)',
	'Dec 4 - Dec 10 (this week)',
	'Dec 11 - Dec 17 (this week)',
	'Dec 18 - Dec 24 (this week)',
	'Dec 25 - Dec 31 (this week)'] 

	constructor(public serviceService: ServiceService) {
		// connection to database functions
	}

	ngOnInit() {
		this.timesheet_totals = {
			'rt': [0, 0, 0, 0, 0, 0, 0, 0],
			'ot': [0, 0, 0, 0, 0, 0, 0, 0],
			'dt': [0, 0, 0, 0, 0, 0, 0, 0]
		};

		this.shot_tasks = this.serviceService.getShotTasks();
		this.asset_tasks = this.serviceService.getAssetTasks();
		this.production_tasks = this.serviceService.getProductionTasks();
		this.project_tasks = this.serviceService.getProjectTasks();
		this.shots = this.serviceService.getShots();
		this.assets = this.serviceService.getAssets();
		this.projects = this.serviceService.getProjects();
		this.department_tasks = this.serviceService.getDepartmentTasks();
		this.departments = this.serviceService.getDepartments();
		this.lines = this.serviceService.getInitLines();

		// Convert rows queried from database to an object and then do some other tasks
		let convert_lines_to_timesheet = this.convertLinesToTimesheetObject(this.lines);
		this.titles = convert_lines_to_timesheet['titles'];
		this.generateTimesheet(convert_lines_to_timesheet['timesheet']);
		this.updateTimesheetTotals();
	}

	generateTimesheet(timesheet) {
		let children = { 1: [], 2: [], 3: [], 4: [], 5: [] };
		this.timesheet = Array();

		for (var prop_1 in timesheet) {
			if (prop_1 != 'Hours') {
				children[1] = [];  // rest children				
				for (var prop_2 in timesheet[prop_1]) {
					if (prop_2 != 'Hours') {
						children[2] = [];  // reset children
						children[1].push({
							title: this.titles[prop_1][prop_2].Title,
							cat_key: prop_2,
							sum_hours: [0, 0, 0, 0, 0, 0, 0], note: '',
							ot: [false, false, false, false, false, false, false],
							ot_req: [false, false, false, false, false, false, false],
							hours: timesheet[prop_1][prop_2]['Hours'],
							focus: [false, false, false, false, false, false, false],
							children: children[2]
						});
						for (var prop_3 in timesheet[prop_1][prop_2]) {
							if (prop_3 != 'Hours') {
								children[3] = [];  // reset children
								children[2].push({
									title: this.titles[prop_1][prop_2][prop_3].Title,
									cat_key: prop_3,
									note: '',
									hours: timesheet[prop_1][prop_2][prop_3]['Hours'],
									focus: [false, false, false, false, false, false, false],
									children: children[3]
								});
								for (var prop_4 in timesheet[prop_1][prop_2][prop_3]) {
									if (prop_4 != 'Hours') {
										children[4] = [];  // reset children
										children[3].push({
											title: this.titles[prop_1][prop_2][prop_3][prop_4].Title,
											cat_key: prop_4, note: '',
											hours: timesheet[prop_1][prop_2][prop_3][prop_4]['Hours'],
											focus: [false, false, false, false, false, false, false],
											children: children[4]
										});
										for (var prop_5 in timesheet[prop_1][prop_2][prop_3][prop_4]) {
											if (prop_5 != 'Hours') {
												children[4].push({
													title: this.titles[prop_1][prop_2][prop_3][prop_4][prop_5].Title,
													cat_key: prop_5, note: '',
													hours: timesheet[prop_1][prop_2][prop_3][prop_4][prop_5]['Hours'],
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
			this.timesheet.push({
				title: this.titles[prop_1].Title,				
				cat_key: prop_1,
				hours: timesheet[prop_1]['Hours'],
				children: children[1]
			});
		}
	}

	convertLinesToTimesheetObject(lines) {
		let timesheet = {};
		let titles = {};

		for (var i = 0; i < lines.length; i++) {
			var element = this.lines[i];

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

			// Add titles to this.titles object; Will most likely change how titles are collected in the future 
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
		let loc_this = this;
		this.save_status = "saving";
		this.save_status_color = "yellow";
		clearTimeout(this.save_timeout);

		// add function to post data once database is setup

		// return state back to saved after a certain period. 
		this.save_timeout = setTimeout(function () {
			loc_this.save_status = "saved";
			loc_this.save_status_color = "green";
		}, 1500);
	}


	updateHours(event, e, day) {
		day = parseInt(day);
		console.log('update')
		console.log(e)
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
		this.timesheet_totals = {
			'rt': [0, 0, 0, 0, 0, 0, 0, 0],
			'ot': [0, 0, 0, 0, 0, 0, 0, 0],
			'dt': [0, 0, 0, 0, 0, 0, 0, 0]
		};

		// Loop through cat_1 parents
		this.timesheet.forEach(cat_1 => {
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

		this.timesheet_totals['rt'][7] = this.timesheet_totals['rt'][0]
			+ this.timesheet_totals['rt'][1]
			+ this.timesheet_totals['rt'][2]
			+ this.timesheet_totals['rt'][3]
			+ this.timesheet_totals['rt'][4]
			+ this.timesheet_totals['rt'][5]
			+ this.timesheet_totals['rt'][6];

		this.determineOvertimeBreakdown();
		this.validateOvertime();
	}

	addToTotals(array_in, sum_hours) {
		for (var i = 0; i < 7; i++) {
			this.timesheet_totals['rt'][i] += array_in.hours[i];
			sum_hours.sum_hours[i] += array_in.hours[i];
		}
	}

	determineOvertimeBreakdown() {
		//Reset OT Totals
		this.timesheet_totals['rt'][7] = 0;
		this.timesheet_totals['ot'][7] = 0;
		this.timesheet_totals['dt'][7] = 0;

		if (this.current_office == 0) { // California Rules 
			var cons_days = 0;  // counter for continous days 

			for (var x = 0; x < this.days.length; x++) {
				var i = this.days[x];
				var d_h = this.timesheet_totals['rt'][i];  // hours for the current day

				if (d_h > 0.0) {
					cons_days++;
				} else {
					cons_days = 0;
				}

				if (cons_days == 7) {
					this.timesheet_totals['rt'][i] = 0;

					if (d_h <= 8) {
						this.timesheet_totals['ot'][i] = d_h;

						// Update grand Totals
						this.timesheet_totals['ot'][7] += d_h;

					} else {
						this.timesheet_totals['dt'][i] = d_h - 8;
						this.timesheet_totals['ot'][i] = 8;

						//Update Grand Totals
						this.timesheet_totals['ot'][7] += this.timesheet_totals['ot'][i];
						this.timesheet_totals['dt'][7] += this.timesheet_totals['dt'][i];
					}
				} else {
					if (d_h > 8 && d_h <= 12) {
						this.timesheet_totals['ot'][i] = this.timesheet_totals['rt'][i] - 8;
						this.timesheet_totals['rt'][i] = 8;

						// Update grand Totals
						this.timesheet_totals['ot'][7] += this.timesheet_totals['ot'][i];
						this.timesheet_totals['rt'][7] += this.timesheet_totals['rt'][i];

					} else if (d_h > 12) {
						this.timesheet_totals['dt'][i] = this.timesheet_totals['rt'][i] - 12;
						this.timesheet_totals['ot'][i] = 4;
						this.timesheet_totals['rt'][i] = 8;

						//Update Grand Totals
						this.timesheet_totals['rt'][7] += this.timesheet_totals['rt'][i];
						this.timesheet_totals['ot'][7] += this.timesheet_totals['ot'][i];
						this.timesheet_totals['dt'][7] += this.timesheet_totals['dt'][i];
					} else {
						// Update Grand Totals
						this.timesheet_totals['rt'][7] += this.timesheet_totals['rt'][i];
					}
				}
			}
		} else {  // Canada Rules
			let cur_total = 0;
			let ot_triggerd = false;

			for (var x = 0; x < this.days.length; x++) {
				var i = this.days[x];

				var d_h = this.timesheet_totals['rt'][i];
				cur_total += d_h
				var hours_rt = 0;
				var hours_ot = 0;

				// Check to see if the current total hours are greater than 40 and that there are hours record for the current day				
				if (cur_total > 40 && this.timesheet_totals['rt'][i] > 0) {
					hours_rt = 0;
					hours_ot = 0;

					if (ot_triggerd) {  // This day is all OT hours
						this.timesheet_totals['rt'][i] = 0.0;
						hours_ot = d_h;
					} else {
						hours_ot = cur_total - 40;

						if (hours_ot < d_h) { //This day has both RT and OT
							hours_rt = d_h - hours_ot;
						}

						// Update the timesheet_totals
						this.timesheet_totals['rt'][i] = hours_rt;

						// Next day will be all OT hours
						ot_triggerd = true;
					}
					this.timesheet_totals['ot'][i] = hours_ot;
					this.timesheet_totals['ot'][7] += hours_ot;
				} else {
					this.timesheet_totals['rt'][i] = d_h;
					hours_rt = d_h
				}
				this.timesheet_totals['rt'][7] += hours_rt;
			}
		}

		if (this.timesheet_totals['ot'][7] > 0.0) {
			this.show_ot = true;
		} else {
			this.show_ot = false;
		}

		if (this.timesheet_totals['dt'][7] > 0.0) {
			this.show_dt = true;
		} else {
			this.show_dt = false;
		}
	}

	setOvertimeChoice(cat_1, cat_2, day) {
		this.timesheet.forEach(element => {
			element.children.forEach(element_2 => {
				for (var i = 0; i < element_2.ot.length; i++) {
					if (i == day && element.cat_key == parseInt(cat_1) && element_2.cat_key == parseInt(cat_2)) {
						if (element_2.ot[i]) {
							element_2.ot[i] = false;
						} else {
							element_2.ot[i] = true;
						}
					} else if (i == day) {
						element_2.ot[i] = false;
					}
				}
			});
		});
		this.saveTimesheet();
	}

	addLineShow(cats) {
		this.results = [];
		this.shot_selected = null;
		this.asset_selected = null;

		var par_obj = $("#" + "addRow_" + cats.join("_"));
		var isVisible = par_obj.is(':visible');

		if (!isVisible) {
			$('.addRowOption').hide();
			par_obj.show();
			par_obj.find('.addRowOption_shotAssetSelect').html('');
			par_obj.find('.addRowOption_shotAssetSelect_div').hide();
			par_obj.find('.addRowOption_searchShotAsset').val('');
			par_obj.find('.addRowOption_searchProjects').val('');
			par_obj.find('.addRowOption_searchProjects').show();

			

			if (cats[0] == 0) {  // If Projects			
				if (cats.length > 2) {
					if (cats[2] == 5) {
						par_obj.find('.addRowOption_shotTask').show();
					} else if (cats[2] == 4) {
						par_obj.find('.addRowOption_assetTask').show();
					} else if (cats[2] == 6) {
						par_obj.find('.addRowOption_productionTask').show();
					}
				}
			} else {  // If Departments
				par_obj.find('.addRowOption_departments').val(-1);
				par_obj.find('.addRowOption_departmentTask').val(-1);

				par_obj.find('.addRowOption_projectTask').hide();
				par_obj.find('.addRowOption_searchProjects').hide();
				par_obj.find('.addRowOption_departments').show();
				par_obj.find('.addRowOption_departmentTask').show();
			}
		} else {
			$('.addRowOption').hide();
		}
	}

	resetShotAssetSearch(event) {
		var par_obj = $(event.target).closest('div[id]');

		par_obj.find('.addRowOption_shotAssetSelect').html('');
		par_obj.find('.addRowOption_shotAssetSearch').show();
		par_obj.find('.addRowOption_shotAssetSelect_div').hide();
	}

	catUpdate(event, cat) {
		var sel_val = event.target.value;
		var par_obj = $(event.target).closest('div[id]');

		if (cat == 3) {
			// hide and reset input box for search of shot or asset.
			par_obj.find('.addRowOption_searchShotAsset').val('');
			par_obj.find('.addRowOption_shotAssetSelect').html('');
			par_obj.find('.addRowOption_shotAssetSearch').show();

			par_obj.find('.addRowOption_searchShotAsset').hide();
			par_obj.find('.addRowOption_shotAssetSelect_div').hide();
			par_obj.find('.addRowOption_assetTask').hide();
			par_obj.find('.addRowOption_shotTask').hide();

			// show shot & asset search box if selected in first dropdown
			if (sel_val == 4 || sel_val == 5) {
				this.shot_selected = null;
				this.asset_selected = null;

				par_obj.find('.addRowOption_searchShotAsset').val('');
				par_obj.find('.addRowOption_searchShotAsset').show();

				if (sel_val == 4) {
					par_obj.find('.addRowOption_assetTask').val(-1);
					par_obj.find('.addRowOption_assetTask').show();
				} else if (sel_val == 5) {
					par_obj.find('.addRowOption_shotTask').val(-1);
					par_obj.find('.addRowOption_shotTask').show();
				}
			}

			if (sel_val == 6) {
				par_obj.find('.addRowOption_productionTask').val('-1');
				par_obj.find('.addRowOption_productionTask').show();
			} else {
				par_obj.find('.addRowOption_productionTask').val('-1');
				par_obj.find('.addRowOption_productionTask').hide();
			}
		}
	}

	cancelAddRowItem(event) {
		var par_obj = $(event.target).closest('div[id]');
		this.results = [];

		$('.addRowOption_projectCat1').val(-1);
		par_obj.find('.addRowOption_searchShotAsset').hide();
		par_obj.find('.addRowOption_shotTask').hide();
		par_obj.find('.addRowOption_assetTask').hide();
		par_obj.find('.addRowOption_productionTask').hide();
		par_obj.hide();
	}


	searchShotAsset(event, cat) {
		var par_obj = $(event.target).closest('div[id]');

		if (cat == 1) {
			var search_array = this.projects;
		} else if (cat == 2) {
			var search_array = (par_obj.find('.addRowOption_projectTask').val() == 5) ? this.shots : this.assets;
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
		this.results = results
	}

	selectProject(event, el) {
		if (el.Cat_key > 0) {
			this.results = [];

			var par_obj = $(event.target).closest('div[id]');
			par_obj.find('.addRowOption_searchShotAsset').val('');
			par_obj.find('.addRowOption_searchProjects').hide();
			this.shot_selected = el;
			this.addLineItem(event, [{ cat_key: 0, title: 'Projects' }]);
			this.addLineShow(['0', el.Cat_key])
		}
	}


	selectShotAsset(event, el, cats) {
		var par_obj = $(event.target).closest('div[id]');
		var projectTask = parseInt(par_obj.find('.addRowOption_projectTask').val());

		par_obj.find('.addRowOption_projectTask').val(-1);
		par_obj.find('.addRowOption_projectTask').val(projectTask);

		if (el.Cat_key > 0) {
			this.shot_selected = el;
			par_obj.find('.addRowOption_shotAssetSelect').html(el.Cat_Title);
			par_obj.find('.addRowOption_shotAssetSearch').hide();
			par_obj.find('.addRowOption_shotAssetSelect_div').show();
			par_obj.find('.addRowOption_searchShotAsset').val('');
			par_obj.find('.addRowOption_searchProjects').hide();
			this.results = [];
		}

		this.addRowOptionChange(event, cats);
	}

	addRowOptionChange(event, cats) {
		var par_obj = $(event.target).closest('div[id]');

		if (parseInt(cats[0].cat_key) == 1) { // Departments
			var cur_class = $(event.target).attr('class')

			if (cats.length == 1) {
				if (par_obj.find('.addRowOption_departments').val() > 0 && par_obj.find('.addRowOption_departmentTask').val() > 0) {
					this.addLineItem(event, cats);
				}
			} else {
				if (par_obj.find('.addRowOption_departmentTask').val() > 0) {
					this.addLineItem(event, cats);
				}
			}
		} else {
			var cur_class = $(event.target).attr('class');
			var cur_val = parseInt($(event.target).val());
			var projectTask = parseInt(par_obj.find('.addRowOption_projectTask').val())
			var shotTask = parseInt(par_obj.find('.addRowOption_shotTask').val())
			var assetTask = parseInt(par_obj.find('.addRowOption_assetTask').val())
			var productionTask = parseInt(par_obj.find('.addRowOption_productionTask').val())

			if (projectTask != 4 && projectTask != 5 && projectTask != 6) {
				this.addLineItem(event, cats);
			} else {
				if (projectTask == 6 && productionTask != -1) {
					this.addLineItem(event, cats);
				}
				if (projectTask == 5 && this.shot_selected != null && shotTask != -1) {
					this.addLineItem(event, cats);
				}
				if (projectTask == 4 && this.shot_selected != null && assetTask != -1) {
					this.addLineItem(event, cats);
				}
			}
		}
	}


	removeLineItem(obj_parent, obj_i, cats) {
		var obj = obj_parent[(parseInt(obj_i))];
		obj_parent.splice(parseInt(obj_i), 1);

		for (var i = 0; i < this.lines.length; i++) {
			var el = this.lines[i];

			if (cats.length == 5) {
				if (el['Cat_1'] == parseInt(cats[0])
					&& el['Cat_2'] == parseInt(cats[1])
					&& el['Cat_3'] == parseInt(cats[2])
					&& el['Cat_4'] == parseInt(cats[3])
					&& el['Cat_5'] == parseInt(cats[4])) {
					this.lines.splice(i, 1);
				}
			} else if (cats.length == 4) {
				if (el['Cat_1'] == parseInt(cats[0])
					&& el['Cat_2'] == parseInt(cats[1])
					&& el['Cat_3'] == parseInt(cats[2])
					&& el['Cat_4'] == parseInt(cats[3])) {
					this.lines.splice(i, 1);
				}
			} else if (cats.length == 3) {
				if (el['Cat_1'] == parseInt(cats[0])
					&& el['Cat_2'] == parseInt(cats[1])
					&& el['Cat_3'] == parseInt(cats[2])) {
					this.lines.splice(i, 1);
				}

			} else if (cats.length == 2) {
				if (el['Cat_1'] == parseInt(cats[0])
					&& el['Cat_2'] == parseInt(cats[1])) {
					this.lines.splice(i, 1);
				}
			}
		}
		this.updateTimesheetTotals();
	}

	addLineItem(event, cats) {
		var par_obj = $(event.target).closest('div[id]');
		var cat_array = [];
		var hours = [0, 0, 0, 0, 0, 0, 0];

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
			if (cats[0]['cat_key'] == 0) {  // Projects
				hours = null;
				cat_array[1] = {
					title: this.shot_selected.Cat_Title,
					cat_key: this.shot_selected.Cat_key
				};
			} else {  // Departments
				cat_array[1] = {
					title: par_obj.find('.addRowOption_departments option:selected').text(),
					cat_key: parseInt(par_obj.find('.addRowOption_departments').val())
				};
				cat_array[2] = {
					title: par_obj.find('.addRowOption_departmentTask option:selected').text(),
					cat_key: parseInt(par_obj.find('.addRowOption_departmentTask').val())
				};
			}

		} else if (cats.length == 2 && cats[0]['cat_key'] == 1) {

			cat_array[2] = {
				title: par_obj.find('.addRowOption_departmentTask option:selected').text(),
				cat_key: parseInt(par_obj.find('.addRowOption_departmentTask').val())
			};

		} else if (cats.length == 4) {

			if (cat_array[2]['cat_key'] == 5) {
				cat_array[4] = {
					title: par_obj.find('.addRowOption_shotTask option:selected').text(),
					cat_key: parseInt(par_obj.find('.addRowOption_shotTask').val())
				};
			} else {
				cat_array[4] = {
					title: par_obj.find('.addRowOption_assetTask option:selected').text(),
					cat_key: parseInt(par_obj.find('.addRowOption_assetTask').val())
				};
			}
		} else if (cats.length == 3) {
			cat_array[3] = {
				title: par_obj.find('.addRowOption_productionTask option:selected').text(),
				cat_key: parseInt(par_obj.find('.addRowOption_productionTask').val())
			};

		} else {

			cat_array[2] = {
				title: par_obj.find('.addRowOption_projectTask option:selected').text(),
				cat_key: parseInt(par_obj.find('.addRowOption_projectTask').val())
			};

			if (cat_array[2]['cat_key'] == 5 || cat_array[2]['cat_key'] == 4) {
				cat_array[3] = {
					title: this.shot_selected.Cat_Title,
					cat_key: this.shot_selected.Cat_key
				};

				// Slice off the 's' so that it's not plural. 
				cat_array[2]['title'] = cat_array[2]['title'].slice(0, -1);

				if (cat_array[2]['cat_key'] == 5) {
					cat_array[4] = {
						title: par_obj.find('.addRowOption_shotTask option:selected').text(),
						cat_key: parseInt(par_obj.find('.addRowOption_shotTask').val())
					};
				} else {
					cat_array[4] = {
						title: par_obj.find('.addRowOption_assetTask option:selected').text(),
						cat_key: parseInt(par_obj.find('.addRowOption_assetTask').val())
					};
				}
			} else if (cat_array[2]['cat_key'] == 6) {
				cat_array[3] = {
					title: par_obj.find('.addRowOption_productionTask option:selected').text(),
					cat_key: parseInt(par_obj.find('.addRowOption_productionTask').val())
				};
			}
		}

		this.lines.push({
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
			Hours: hours
		});

		let convertLinesToTimeSheet = this.convertLinesToTimesheetObject(this.lines)
		this.titles = convertLinesToTimeSheet['titles'];
		this.generateTimesheet(convertLinesToTimeSheet['timesheet']);
		this.updateTimesheetTotals();
	}

	loadInitTimeheet() {
		this.lines = this.serviceService.getInitLines()
		var convertLinesToTimeSheet = this.convertLinesToTimesheetObject(this.lines)
		this.titles = convertLinesToTimeSheet['titles'];
		this.generateTimesheet(convertLinesToTimeSheet['timesheet']);
		this.updateTimesheetTotals();

		$('#timesheet_submitted_footer').hide();
		$('#timesheet_footer').show();
		$('input').attr('readonly', false);
		$('input').css('border', 'default');
		this.submit_date = false;
	}

	submitTimesheet() {
		if (this.validateOvertime(true)) {
			this.openPopup('Confirm Time Sheet Submission',
				'Pressing confirm below indicates that you have completed your timesheet for the currently displayed week. Please contact your manager if you need to make any changes after submission.',
				['Confirm', 'Cancel']);
		};
	}

	validateOvertime(onSubmit = false) {
		var ot_required = [false, false, false, false, false, false, false];
		var ot_selected = [false, false, false, false, false, false, false];
		var missing = [];
		var ot_check = ['ot', 'dt'];
		var tot = [];
		var can_ot = false;

		for (var x = 0; x < ot_check.length; x++) {
			var ot = ot_check[x];

			for (var i = 0; i < this.timesheet_totals[ot].length - 1; i++) {
				var hours = this.timesheet_totals[ot][this.days[i]];

				if (hours > 0.0) {
					if (i == 0 || this.current_office == 0) {
						ot_required[i] = true;
					} else {

						if (this.current_office == 1) {  // Canada rules
							if (ot_required[i - 1] != true && !can_ot) {
								ot_required[i] = true;
								can_ot = true;
							}
						}
					}
				}
			}
		}

		this.timesheet.forEach(element => {
			element.children.forEach(element_2 => {
				tot.push(element_2.cat_key);
			});
		});

		this.timesheet.forEach(element => {
			element.children.forEach(element_2 => {
				for (var i = 0; i < element_2.ot.length; i++) {

					if (element_2.ot[i]) {
						ot_selected[i - 1] = element_2.ot[i];
					}

					if (ot_required[i]) {
						element_2.ot_req[i] = true;
					} else {
						element_2.ot_req[i] = false;
					}
				}
			});
		});

		for (var i = 0; i < ot_required.length; i++) {
			if (ot_required[i] != ot_selected[i]) {
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
				, ['Close']);
			return false;
		}
		return true;
	}

	openPopup(title, text, buttonList) {
		var par_obj = $('.popup');
		var buttons = par_obj.find('button').toArray();

		par_obj.find('.popup_title').html(title);
		par_obj.find('.popup_text').html(text);

		for (var i = 0; i < buttonList.length; i++) {
			$(buttons[i]).html(buttonList[i]);
		}

		if (buttonList.length == 1) {
			$(buttons[1]).hide();
		} else {
			$(buttons[1]).show();
		}

		par_obj.show();
	}

	closePopup(event) {
		var par_obj = $(event.target).closest('.popup');
		par_obj.fadeOut();

		if (event.target.innerHTML == 'Confirm') {
			var inputs = $('input').attr('readonly', true);
			var inputs = $('input').css('border', '1px #DDD solid');

			$('#timesheet_submitted_footer').show();
			$('#timesheet_footer').hide();
			$('.addRemove_btns').hide();
			$('.note').hide();
			$('.ot_selected, .ot').addClass('disable-clicks');			
			$('textarea').attr('readonly', true);

			var dateObj = new Date();
			var mo = dateObj.getUTCMonth(); //months from 1-12
			var da = dateObj.getUTCDate();
			var yr = dateObj.getUTCFullYear();

			this.submit_date = this.mo_text[mo] + ' ' + da + ', ' + yr;			
		}
	}

	notesToggle(el) {
		if(el.show_note_force){
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
		this.lines = this.serviceService.getSampleLines();
		let convertLinesToTimeSheet = this.convertLinesToTimesheetObject(this.lines);
		this.titles = convertLinesToTimeSheet['titles'];
		this.generateTimesheet(convertLinesToTimeSheet['timesheet']);
		this.updateTimesheetTotals();
		this.submit_date = false;
	}

	// Calendar Functions (this will be moved to a global class file)
	weekSelected(week_index){
		this.timesheet_date = this.week_labels[week_index];
		$('#cal').hide();
		this.loadInitTimeheet();

	}
}
