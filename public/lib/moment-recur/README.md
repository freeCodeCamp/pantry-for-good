moment-recur
=====
moment-recur is a recurring date plugin for [momentjs](http://momentjs.com/). This plugin handles dates only; time information is discarded.

The rule matching concept is borrowed from the excellent [node-date-recur](https://github.com/appsattic/node-date-recur) library created by Andrew Chilton.

```js
var rInterval = moment( "01/01/2014" ).recur().every(2).days();
rInterval.matches( "01/03/2014" ); // true

var rCalendar = moment.recur().every(10).dayOfMonth();
rCalendar.matches( "05/10/2014" ); // true
```



Getting Started
---------------
moment-recur can be included in your project a few different ways.

### Browser
Simply include the momentjs script, then the moment-recur script.
```html
<script src="moment.min.js"></script>
<script src="moment-recur.js"></script>
```


### Browser with RequireJS
moment-recur also works with RequireJS. Include it just like any other script.
```js
define(["moment", "moment-recur"], function(moment){
    //you probably won't need a reference to moment-recur itself, so include it last.
});
```


### Bower
moment-recur is a register bower component.
```
bower install moment-recur
```


### node.js
moment-recur can be installed with npm and required into a script.
```
npm install moment-recur
```

```js
var moment = require('moment');
require('moment-recur');
```


Creating a Recurring Date
-------------------------
You can create a recurrence from an instance of moment or from the constructor a few different ways.  

From an instance:
```js
var recurrence;

// Create a recurrence using today as the start date.
recurrence = moment().recur();

// Create a recurrence while passing the start and end dates to the recur function.
// Note: passing an end date requires you to also pass a start date.
recurrence = moment().recur( start, end );

// You may pass a start date to the moment, or use an existing moment, to set the start date.
// In this case, passing a date to the recur function sets and end date.
recurrence = moment(start).recur( end );

// Finally, you can create a recurrence and pass in an entire set of options.
recurrence = moment().recur({
    start: "01/01/2014",
    end: "01/01/2015"
});
```

From the constructor:
```js
var recurrence;

// Create recurrence without a start date. Note: this will not work with intervals.
recurrence = moment.recur();

// Create a recurrence, passing just the start, or the start and end dates.
recurrence = moment.recur( start, end );

// Create a recurrence, passing set of options.
recurrence = moment.recur({
    start: "01/01/2014",
    end: "01/01/2015"
});
```

Creating Rules
--------------
moment-recur uses rules to define when a date should recur. You can then generate future or past recurrences based on these rules, or see if a specific date matches the rules. Rules can also be overridden or removed.


### The every() Function
The `every()` function allows you to set the units and, optionally, the measurment type of the recurring date. It returns the recur object to allow chaining.

```js
var myDate, recurrence;

// Create a date to start from
myDate = moment("01/01/2014");

// You can pass the units to recur on, and the measurement type.
recurrence = myDate.recur().every(1, "days");

// You can also chain the measurement type instead of passing it to every.
recurrence = myDate.recur().every(1).day();

// It is also possible to pass an array of units.
recurrence = myDate.recur().every([3, 5]).days();

// When using the dayOfWeek measurement, you can pass days names.
recurrence = myDate.recur().every(["Monday", "wed"]).daysOfWeek();

// Month names also work when using monthOfYear.
recurrence = myDate.recur().every(["Jan", "february"], "monthsOfYear");
```

`every()` will override the last "every" if a measurement was not provided. The following line will create a recurrence for every 5 days.
```js
recurrence  = myDate.recur().every(1).every(5).days();
```
If you need to specify multiple units, pass an array to `every()`.

You may also pass the units directly to the interval functions (listed below) instead of using `every()`.
```js
var recurrence = moment.recur().monthOfYear("January");
```

### Length Intervals
moment-recur supports intervals for days, weeks, months, and years. Measurements may be singular or plural (ex: `day()` vs `days()`). Length Intervals **must** have a start date defined.

Possible Length Intervals Include:
* day / days
* week / weeks
* month / months
* year / years

#### Examples
```js
var myDate, interval;

// Create a date to start from
myDate = moment("01/01/2014");

// A daily interval - will match every day.
interval = myDate.recur().every(1).day();

// A bi-weekly interval - will match any date that is exactly 2 weeks from myDate.
interval = myDate.recur().every(2).weeks();

// A quarterly interval - will match any date that is exactly 3 months from myDate.
interval = myDate.recur().every(3).months();

// A yearly interval - will match any date that is exactly 1 year from myDate.
interval = myDate.recur().every(1).years();

// It is possible to match multiple units of a single measure using an array.
interval = myDate.recur().every([3, 5]).days();

// It is NOT possible to create compound intervals. The following will never match.
interval = myDate.recur().every(3).days().every(2).months(); // Won't work
```


### Calendar Intervals
Calendar Intervals do not depend on a start date. They define a unit of another unit. For instance, a day of a month, or a month of a year. Measurements may be singular or plural (ex: `dayOfMonth()` vs `daysOfMonth()`).

Possible Calendar Intervals Include:
* dayOfWeek / daysOfWeek
* dayOfMonth / daysOfMonth
* weekOfMonth / weeksOfMonth
* weekOfYear / weeksOfYear
* monthOfYear / monthsOfYear

#### Examples
```js
var cal;

// Will match any date that is on Sunday or Monday.
cal = moment.recur().every(["Sunday", 1]).daysOfWeek();

// Will match any date that is the first or tenth day of any month.
cal = moment.recur().every([1, 10]).daysOfMonth();

// Will match any date that is in the first or third week of any month.
cal = moment.recur().every([1, 3]).weeksOfMonth();

// Will match any date that is in the 20th week of any year.
cal = moment.recur().every(20).weekOfYear();

// Will match any date that is in January of any year.
cal = moment.recur().every("January").monthsOfYear();

// You can also combine these rules to match specific dates.
// For instance, this will match only on Valentines day
var valentines = moment.recur().every(14).daysOfMonth()
                               .every("Februray").monthsOfYear();

// A weekOfMonthByDay interval is available for combining with
// the daysOfWeek to achieve "nth weekday of month" recurrences.
// The following matches every 1st and 3rd Thursday of the month.
cal = moment.recur().every("Thursday").daysOfWeek()
                    .every([0, 2]).weeksOfMonthByDay();
```


Using the Rules
---------------

### Matching
The `matches()` function will test a date to check if all of the recurrence rules match. It returns `true` if the date matches, `false` otherwise.
```js
var interval = moment("01/01/2014").recur().every(2).days();
interval.matches("01/02/2014"); // false
interval.matches("01/03/2014"); // true
```

You may also see if a date matches before the start date or after the end date by passing `true` as the second argument to `matches()`.
```js
var interval = moment("01/01/2014").recur().every(2).days();
interval.matches("12/30/2013"); // false
interval.matches("12/30/2013", true); // true
```


### Exceptions
To prevent a date from matching that would normally match, use the `except()` function.

```js
var recurrence = moment("01/01/2014").recur().every(1).day().except("01/02/2014");
recurrence.matches("01/02/2014"); // false
```


### Overriding and Forgetting
If a rule is created with the same measurement of a previous rule, it will override the previous rule. Rules can also be removed from a recurrence.

```js
// Create a recurrence that matches every day, with an exception
var recurrence = moment("01/01/2014").recur().every(1).day().except("01/03/2014");

// This will override the previous rule and match every 2 days instead.
recurrence.every(2).days();

// Exceptions can also be removed by passing a date to the forget() function.
recurrence.forget("01/03/2014");

// Rules can be removed by passing the measurement to the forget() function.
recurrence.forget("days");
```


### Generating Dates
It is also possible to generate dates from the rules. These functions require a starting date.

```js
var recurrence, nextDates;

// Create a recurrence
recurrence = moment("01/01/2014").recur().every(2).days();

// Generate the next three dates as moments
// Outputs: [moment("01/03/2014"), moment("01/05/2014"), moment("01/07/2014")]
nextDates = recurrence.next(3); 

// Generate the next three dates, formatted in local format
// Outputs: ["01/03/2014", "01/05/2014", "01/07/2014"]
nextDates = recurrence.next(3, "L");

// Generate previous three dates, formatted in local format
// Outputs: ["12/30/2013", "12/28/2013", "12/26/2013"]
nextDates = recurrence.previous(3, "L");
```

If your recurrence does not have a start date set, or if it does but you want to start at a different date, use the `fromDate()` method first.
```js
var recurrence = moment("01/01/2014").recur().every(2).days();
recurrence.fromDate("02/05/2014");

// Outputs: ["02/06/2014", "02/08/2014", "02/10/2014"]
nextDates = recurrence.next(3, "L");
```

With both a start date and an end date set, you can generate all dates within that range that match the pattern (including the start/end dates).
```js
var recurrence = moment().recur("01/01/2014", "01/07/2014").every(2).days();

// Outputs: ["01/01/2014", "01/03/2014", "01/05/2014", "01/07/2014"]
allDates = recurrence.all("L");
```


**Important Note:** These functions may be very inefficient/slow. They work by attempting to match every date from the start of a range until the desired number of dates have been generated. So if you attempt to get 10 dates for a rule that matches once a year, it will run the match function for ~3650 days.


Options and Other Methods
-------------------------
moment-recur provides a few methods for getting/setting options, as well as two utility methods. It also creates two additional momentjs functions.

### Options
Options can be set when creating a recurrence or using the getter/setter methods listed below.

Set options upon creation. Note that the units for rules are converted to objects, so it is not recommended to set rules this way. They can be set in the options so that they can be imported.
```js
moment().recur({
    start: "01/01/2014",
    end: "12/31/2014",
    rules: [
        { units: {  2 : true }, measure: "days" }
    ],
    exceptions: ["01/05/2014"]
});
```

Get/Set the Start Date
```js
recurrence.startDate(); // Get
recurrence.startDate("01/01/2014"); // Set
```

Get/Set the End Date
```js
recurrence.endDate(); // Get
recurrence.endDate("01/01/2014"); // Set
```

Get/Set a temporary "From Date" for use with generating dates
```js
recurrence.fromDate(); // Get
recurrence.fromDate("01/01/2014"); // Set
```

### Utility Methods
Use `repeats()` to check if a recurrence has rules set.
```js
recurrence.repeats(); // true/false
```

Use `save()` to export all options, rules, and exceptions as an object. This can be used to store recurrences in a database.  
**Note:** This does not export the "From Date" which is considered a temporary option.
```js
recurrence.save();
```

### momentjs Functions
The `monthWeek()` method can be used to determine the week of the month a date is in.
```js
moment("01/01/2014").monthWeek(); // 0
```

The `dateOnly()` method can be used to remove any time information from a moment.
```js
moment("2014-01-01 09:30:26").dateOnly(); // 01/01/2014 12:00:00 AM
```

License
-------
UNLICENSE - see UNLICENSE file and [unlicense.org](http://unlicense.org/) for details.
