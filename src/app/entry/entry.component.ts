import { Component } from '@angular/core';
import { ServiceService } from '../services/service.service';


@Component({
	selector: 'app-entry',
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.css']
})
export class EntryComponent {

	username = 'Tyler Cote';
	timesheet_date = 'Oct 30 - Nov 5 (this week)';
	lines: Object[];
	timesheet = Object();
	timesheet_2 = Array();
	titles = {};
	timesheet_totals = [0, 0, 0, 0, 0, 0, 0, 10];
	editList = false;


	ngOnInit() {
		this.lines = this.serviceService.getLines()

		let convertLinesToTimeSheet = this.convertLinesToTimeSheet(this.lines)
		this.titles = convertLinesToTimeSheet['titles'];


		this.generateTimeSheet(convertLinesToTimeSheet['timesheet']);
		this.updateTimeSheetTotals();
	}


	generateTimeSheet(timesheet) {
		console.log('This is the timesheet object:')
		console.log(timesheet)

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
						children[1].push({ title: this.titles[prop_1][prop_2].Title, cat_key: prop_2, cat_level: 2, ot: [false, false, false, false, false, false, false], hours: timesheet[prop_1][prop_2]['Hours'], children: children[2] })

						for (var prop_3 in timesheet[prop_1][prop_2]) {
							if (prop_3 != 'Hours') {
								children[3] = [];  // reset children
								children[2].push({ title: this.titles[prop_1][prop_2][prop_3].Title, cat_key: prop_3, cat_level: 3, hours: timesheet[prop_1][prop_2][prop_3]['Hours'], children: children[3] })

								for (var prop_4 in timesheet[prop_1][prop_2][prop_3]) {
									if (prop_4 != 'Hours') {
										children[4] = [];  // reset children
										children[3].push({ title: this.titles[prop_1][prop_2][prop_3][prop_4].Title, cat_key: prop_4, cat_level: 4, hours: timesheet[prop_1][prop_2][prop_3][prop_4]['Hours'], children: children[4] })

										for (var prop_5 in timesheet[prop_1][prop_2][prop_3][prop_4]) {
											if (prop_5 != 'Hours') {
												children[4].push({ title: this.titles[prop_1][prop_2][prop_3][prop_4][prop_5].Title, cat_key: prop_5, cat_level: 5, hours: timesheet[prop_1][prop_2][prop_3][prop_4][prop_5]['Hours'], children: [] })
											}
										}
									}
								}
							}
						}
					}
				}
			}

			this.timesheet_2.push({ title: this.titles[prop_1].Title, cat_1: prop_1, cat_key: prop_1, cat_level: 1, hours: timesheet[prop_1]['Hours'], children: children[1] });
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


	addLine() {
		console.log('Add Line')
	}


	removeLine(obj_parent, obj_i){
		console.log('removing item');
		console.log(obj_parent);
		console.log(obj_i);

		obj_parent.splice(parseInt(obj_i), 1);
		this.updateTimeSheetTotals();
	}

	compare(a, b) {
		if (a.last_nom < b.last_nom)
			return -1;
		if (a.last_nom > b.last_nom)
			return 1;
		return 0;
	}

	//objs.sort(compare);


}




