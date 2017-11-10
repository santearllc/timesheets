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

	username = 'Tyler Cote';
	timesheet_date = 'Nov 6 - Nov 12 (this week)';
	lines: Object[];
	timesheet = Object();
	timesheet_2 = Array();
	titles = {};
	timesheet_totals = [0, 0, 0, 0, 0, 0, 0, 10];
	editList = true;

	//dropdowns
	shotTasks;
	assetTasks;
	productionTasks;
	projectTasks;
	departmentTasks;

	// projects, shots, assets	
	shots;
	assets;
	projects;
	departments;
	results;
	project_selected;
	shot_selected;
	asset_selected;

	addLineItem_disabled: boolean = false;

	ngOnInit() {

		this.shotTasks = this.serviceService.getShotTasks()
		this.assetTasks = this.serviceService.getAssetTasks();
		this.productionTasks = this.serviceService.getProductionTasks();
		this.projectTasks = this.serviceService.getProjectTasks();
		this.shots = this.serviceService.getShots();
		this.assets = this.serviceService.getAssets();
		this.projects = this.serviceService.getProjects();
		this.departmentTasks = this.serviceService.getDepartmentTasks();
		this.departments = this.serviceService.getDepartments();

		

		this.lines = this.serviceService.getLines()

		let convertLinesToTimeSheet = this.convertLinesToTimeSheet(this.lines)
		this.titles = convertLinesToTimeSheet['titles'];


		this.generateTimeSheet(convertLinesToTimeSheet['timesheet']);
		this.updateTimeSheetTotals();

	}


	resetTimeSheetData() {
		this.lines = this.serviceService.getLines()

		let convertLinesToTimeSheet = this.convertLinesToTimeSheet(this.lines)
		this.titles = convertLinesToTimeSheet['titles'];


		this.generateTimeSheet(convertLinesToTimeSheet['timesheet']);
		this.updateTimeSheetTotals();
	}

	generateTimeSheet(timesheet) {
		let children = {}
		children[1] = [];
		children[2] = [];
		children[3] = [];
		children[4] = [];
		children[5] = [];

		this.timesheet_2 = Array();

		for (var prop_1 in timesheet) {
			if (prop_1 != 'Hours') {
				children[1] = [];  // rest children
				//children[1].push({ title: '__Title_1__', cat_key: prop_1, cat_level: 1, hours: timesheet[prop_1]['Hours'], children: children[2] })

				for (var prop_2 in timesheet[prop_1]) {
					if (prop_2 != 'Hours') {
						children[2] = [];  // reset children
						children[1].push({ title: this.titles[prop_1][prop_2].Title, cat_key: prop_2, ot: [false, false, false, false, false, false, false], hours: timesheet[prop_1][prop_2]['Hours'], children: children[2] })

						for (var prop_3 in timesheet[prop_1][prop_2]) {
							if (prop_3 != 'Hours') {
								children[3] = [];  // reset children
								children[2].push({ title: this.titles[prop_1][prop_2][prop_3].Title, cat_key: prop_3, hours: timesheet[prop_1][prop_2][prop_3]['Hours'], children: children[3] })

								for (var prop_4 in timesheet[prop_1][prop_2][prop_3]) {
									if (prop_4 != 'Hours') {
										children[4] = [];  // reset children
										children[3].push({ title: this.titles[prop_1][prop_2][prop_3][prop_4].Title, cat_key: prop_4, hours: timesheet[prop_1][prop_2][prop_3][prop_4]['Hours'], children: children[4] })

										for (var prop_5 in timesheet[prop_1][prop_2][prop_3][prop_4]) {
											if (prop_5 != 'Hours') {
												children[4].push({ title: this.titles[prop_1][prop_2][prop_3][prop_4][prop_5].Title, cat_key: prop_5, hours: timesheet[prop_1][prop_2][prop_3][prop_4][prop_5]['Hours'], children: [] })
											}
										}
									}
								}
							}
						}
					}
				}
			}
			this.timesheet_2.push({ title: this.titles[prop_1].Title, cat_1: prop_1, cat_key: prop_1, hours: timesheet[prop_1]['Hours'], children: children[1] });
		}


		console.log("This is a timesheet compiled:");
		console.log(this.timesheet_2);
	}


	convertLinesToTimeSheet(lines) {
		let timesheet = {};
		let titles = {};

		for (var i = 0; i < lines.length; i++) {
			var element = this.lines[i];
			for (var x = 1; x < 6; x++) {

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



				// Adds titles to title JSON
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
		}
		return { timesheet: timesheet, titles: titles }
	}

	updateHours(event, e, day) {
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
		}

		this.updateTimeSheetTotals();
	}

	isNumberKey(event) {
		var charCode = (event.which) ? event.which : event.keyCode;
		if (charCode != 46 && charCode > 31
			&& (charCode < 48 || charCode > 57))
			return false;

		return true;
	}


	constructor(public serviceService: ServiceService) {

	}


	save() {
		console.log('saving')
	}

	updateTimeSheetTotals() {
		this.timesheet_totals = [0, 0, 0, 0, 0, 0, 0, 0];

		// Loop through cat_1 parents
		this.timesheet_2.forEach(cat_1 => {
			if (cat_1.hours != undefined) {
				this.addToTotals(cat_1.hours);
			}

			// Loop through cat_1 children
			cat_1.children.forEach(cat_2 => {
				if (cat_2.hours != undefined) {
					this.addToTotals(cat_2.hours);
				}

				// Loop through cat_2 children
				cat_2.children.forEach(cat_3 => {
					if (cat_3.hours != undefined) {
						this.addToTotals(cat_3.hours);
					}

					// Loop through cat_3 children
					cat_3.children.forEach(cat_4 => {
						if (cat_4.hours != undefined) {
							this.addToTotals(cat_4.hours);
						}

						cat_4.children.forEach(cat_5 => {
							if (cat_5.hours != undefined) {
								this.addToTotals(cat_5.hours);
							}
						});
					});
				});
			});
		});

		this.timesheet_totals[7] = this.timesheet_totals[0] + this.timesheet_totals[1] + this.timesheet_totals[2] + this.timesheet_totals[3] + this.timesheet_totals[4] + this.timesheet_totals[5] + this.timesheet_totals[6]

	}


	addToTotals(array_in) {
		for (var i = 0; i < 7; i++) {
			this.timesheet_totals[i] += array_in[i];
		}
	}



	setOT(cat_1, cat_2, day) {

		this.timesheet_2.forEach(element => {
			element.children.forEach(element_2 => {
				console.log(element_2.ot);
				for (var i = 0; i < element_2.ot.length; i++) {

					if (i == day && element.cat_key == parseInt(cat_1) && element_2.cat_key == parseInt(cat_2)) {
						element_2.ot[i] = true;
					} else if (i == day) {
						element_2.ot[i] = false;
					}
				}
			});
		});
	}



	showAddLine(cats) {
		this.results = [];
		this.shot_selected = null;
		this.asset_selected = null;

		$('.addRowOption').hide();

		var par_obj = $("#" + "addRow_" + cats.join("_"));
		par_obj.show();

		par_obj.find('.addRowOption_shotAssetSelect').html('')
		par_obj.find('.addRowOption_searchProjects').html('')
		par_obj.find('.addRowOption_shotAssetSelect_div').hide()
		par_obj.find('.addRowOption_searchShotAsset').val('')
		par_obj.find('.addRowOption_searchProjects').val('')
		par_obj.find('.addRowOption_searchProjects').show();

		this.setupDropdowns(par_obj);
		this.setupShotsAssets(par_obj);

		console.log('show... ')
		console.log(cats)

		if(cats[0] == 0){
			if(cats.length > 2){
				if(cats[2] == 5){
					par_obj.find('.addRowOption_shotTask').show();
				} else if (cats[2] == 4){
					par_obj.find('.addRowOption_assetTask').show();
				}  else if (cats[2] == 6){
					par_obj.find('.addRowOption_productionTask').show();
				}
			}
		} else {
			console.log('here')
			par_obj.find('.addRowOption_departments').val(-1);
			par_obj.find('.addRowOption_departmentTask').val(-1);

			par_obj.find('.addRowOption_projectTask').hide();
			par_obj.find('.addRowOption_searchProjects').hide();
			par_obj.find('.addRowOption_departments').show();
			par_obj.find('.addRowOption_departmentTask').show();
		}
				
	}

	resetShotAssetSearch(event) {
		var par_obj = $(event.target).closest('div[id]');

		par_obj.find('.addRowOption_shotAssetSelect').html('')
		par_obj.find('.addRowOption_shotAssetSearch').show()
		par_obj.find('.addRowOption_shotAssetSelect_div').hide()
	}

	catUpdate(event, cat) {
		var sel_val = event.target.value;
		var par_obj = $(event.target).closest('div[id]');

		if (cat == 3) {
			// hide and reset input box for search of shot or asset.
			par_obj.find('.addRowOption_searchShotAsset').hide();
			par_obj.find('.addRowOption_searchShotAsset').val('');

			par_obj.find('.addRowOption_shotAssetSelect').html('')
			par_obj.find('.addRowOption_shotAssetSearch').show()
			par_obj.find('.addRowOption_shotAssetSelect_div').hide()

			par_obj.find('.addRowOption_assetTask').hide();
			par_obj.find('.addRowOption_shotTask').hide();


			// show shot & asset search box if selected in first dropdown
			if (sel_val == 4 || sel_val == 5) {
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
		par_obj.hide();

		this.results = [];

		$('.addRowOption_projectCat1').val(-1);
		par_obj.find('.addRowOption_searchShotAsset').hide();
		par_obj.find('.addRowOption_shotTask').hide();
		par_obj.find('.addRowOption_assetTask').hide();
		par_obj.find('.addRowOption_productionTask').hide();

		this.addLineItem_disabled = false;
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

	selectShotAsset(event, el, autoadd) {
		var par_obj = $(event.target).closest('div[id]');

		if (el.Cat_key > 0) {
			this.shot_selected = el;
			par_obj.find('.addRowOption_shotAssetSelect').html(el.Cat_Title)
			par_obj.find('.addRowOption_shotAssetSearch').hide()

			par_obj.find('.addRowOption_shotAssetSelect_div').show()
			par_obj.find('.addRowOption_searchShotAsset').val('')
			par_obj.find('.addRowOption_searchProjects').hide();

			this.results = [];
		}

		if(autoadd){
			this.addLineItem(event,[{cat_key:0, title : 'Projects'}]);
		}
	}

	removeLineItem(obj_parent, obj_i, cats) {

		console.log(cats)
		var obj = obj_parent[(parseInt(obj_i))];
		//console.log(obj)
		obj_parent.splice(parseInt(obj_i), 1);

		for(var i = 0; i < this.lines.length; i++){
			var el = this.lines[i];
			
			
			if(cats.length == 5){
				
				if(el['Cat_1'] == parseInt(cats[0]) && el['Cat_2'] == parseInt(cats[1]) && el['Cat_3'] == parseInt(cats[2]) && el['Cat_4'] == parseInt(cats[3]) && el['Cat_5'] == parseInt(cats[4])){
					console.log('remove:5')
					this.lines.splice(i, 1);
				}
				
			} else if(cats.length == 4){
				if(el['Cat_1'] == parseInt(cats[0]) && el['Cat_2'] == parseInt(cats[1]) && el['Cat_3'] == parseInt(cats[2]) && el['Cat_4'] == parseInt(cats[3])){
					console.log('remove:4')
					this.lines.splice(i, 1);
				}
			} else if(cats.length == 3){
				if(el['Cat_1'] == parseInt(cats[0]) && el['Cat_2'] == parseInt(cats[1]) && el['Cat_3'] == parseInt(cats[2])){
					console.log('remove:3')
					this.lines.splice(i, 1);
				}
				
			} else if(cats.length == 2){
				if(el['Cat_1'] == parseInt(cats[0]) && el['Cat_2'] == parseInt(cats[1])){
					console.log('remove:2')
					this.lines.splice(i, 1);
				}
			}
		}
		
		this.updateTimeSheetTotals();
	}


	addLineItem(event, cats) {

		console.log('This is the cat length')
		console.log(cats.length)
		console.log(cats[0])
		var par_obj = $(event.target).closest('div[id]');

		var cat_array = [];
		
		var hours = [0, 0, 0, 0, 0, 0, 0];

		for (var i = 0; i < 5; i++) {
			try {
				cat_array.push({ title: cats[i].title, cat_key: parseInt(cats[i].cat_key) });
			} catch (err) {
				cat_array.push({ title: '', cat_key: null })
			}
		}

		if (cats.length == 1) {
			if(cats[0]['cat_key'] == 0){  // Projects
				hours = null;
				cat_array[1] = { title: this.shot_selected.Cat_Title, cat_key: this.shot_selected.Cat_key };
			} else {  // Departments
				cat_array[1] = { title: par_obj.find('.addRowOption_departments option:selected').text(), cat_key: parseInt(par_obj.find('.addRowOption_departments').val()) };
				cat_array[2] = { title: par_obj.find('.addRowOption_departmentTask option:selected').text(), cat_key: parseInt(par_obj.find('.addRowOption_departmentTask').val()) };
			}

		} else if(cats.length == 2 && cats[0]['cat_key'] == 1){

			cat_array[2] = { title: par_obj.find('.addRowOption_departmentTask option:selected').text(), cat_key: parseInt(par_obj.find('.addRowOption_departmentTask').val()) };

		} else if(cats.length == 4) {
			
			if (cat_array[2]['cat_key'] == 5) {
				cat_array[4] = { title: par_obj.find('.addRowOption_shotTask option:selected').text(), cat_key: parseInt(par_obj.find('.addRowOption_shotTask').val()) };
			} else {
				cat_array[4] = { title: par_obj.find('.addRowOption_assetTask option:selected').text(), cat_key: parseInt(par_obj.find('.addRowOption_assetTask').val()) };
			}
		} else if(cats.length == 3) {
			cat_array[3] = { title: par_obj.find('.addRowOption_productionTask option:selected').text(), cat_key: parseInt(par_obj.find('.addRowOption_productionTask').val()) };

		} else {

			cat_array[2] = { title: par_obj.find('.addRowOption_projectTask option:selected').text(), cat_key: parseInt(par_obj.find('.addRowOption_projectTask').val()) };

			if (cat_array[2]['cat_key'] == 5 || cat_array[2]['cat_key'] == 4) {
				cat_array[3] = { title: this.shot_selected.Cat_Title, cat_key: this.shot_selected.Cat_key };

				// Slice off the 's' so that it's not plural. 
				cat_array[2]['title'] = cat_array[2]['title'].slice(0, -1);

				if (cat_array[2]['cat_key'] == 5) {
					cat_array[4] = { title: par_obj.find('.addRowOption_shotTask option:selected').text(), cat_key: parseInt(par_obj.find('.addRowOption_shotTask').val()) };
				} else {
					cat_array[4] = { title: par_obj.find('.addRowOption_assetTask option:selected').text(), cat_key: parseInt(par_obj.find('.addRowOption_assetTask').val()) };
				}
			} else if (cat_array[2]['cat_key'] == 6) {
				cat_array[3] = { title: par_obj.find('.addRowOption_productionTask option:selected').text(), cat_key: parseInt(par_obj.find('.addRowOption_productionTask').val()) };
			}

			
		}

		console.log('This is the cat array')
		console.log(cat_array)
		

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
		}, );

		let convertLinesToTimeSheet = this.convertLinesToTimeSheet(this.lines)
		this.titles = convertLinesToTimeSheet['titles'];

		this.generateTimeSheet(convertLinesToTimeSheet['timesheet']);
		this.updateTimeSheetTotals();

	}

	setupDropdowns(par_obj) {
		par_obj.find('.addRowOption_shotTask').empty();
		par_obj.find('.addRowOption_assetTask').empty();
		par_obj.find('.addRowOption_productionTask').empty();
		par_obj.find('.addRowOption_projectTask').empty();

		this.productionTasks.forEach(element => {
			par_obj.find('.addRowOption_productionTask').append('<option value="' + element['Cat_key'] + '">' + element['Cat_Title'] + '</option>');
		});

		this.shotTasks.forEach(element => {
			par_obj.find('.addRowOption_shotTask').append('<option value="' + element['Cat_key'] + '">' + element['Cat_Title'] + '</option>');
		});

		this.assetTasks.forEach(element => {
			par_obj.find('.addRowOption_assetTask').append('<option value="' + element['Cat_key'] + '">' + element['Cat_Title'] + '</option>');
		});

		this.projectTasks.forEach(element => {
			par_obj.find('.addRowOption_projectTask').append('<option value="' + element['Cat_key'] + '">' + element['Cat_Title'] + '</option>');
		});

		this.departmentTasks.forEach(element => {
			par_obj.find('.addRowOption_departmentTask').append('<option value="' + element['Cat_key'] + '">' + element['Cat_Title'] + '</option>');
		});

		this.departments.forEach(element => {
			par_obj.find('.addRowOption_departments').append('<option value="' + element['Cat_key'] + '">' + element['Cat_Title'] + '</option>');
		});

	}

	setupShotsAssets(par_obj) {
		//addRowOption_searchShotAsset_result
		this.shots.forEach(element => {
			//			par_obj.find('.addRowOption_shotList').append('<div value="' + element['Cat_key'] + '">' + element['Cat_Title'] + '</div>')
		});
	}

	validateAddRowFields(par_obj) {
		var isValid = false;

		if (isValid) {
			this.addLineItem_disabled = false;
		} else {
			this.addLineItem_disabled = true;
		}
	}



}




