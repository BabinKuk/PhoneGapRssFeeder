$(document).ready(function(){
	//console.log('document ready');
	document.addEventListener('deviceready', onDeviceReady, false);

	// display feed list when #feeds page is loaded
	$(document).on('pageinit', '#feeds', function(){
		listFeeds();
	});
	
	// init google jsapi when #feed page is loaded
	$(document).on('pageinit', '#feeds', function(e){
		e.preventDefault();
		google.load('feeds', 1, {'callback': feederInit});
	});
});

function onDeviceReady(){
    //console.log('device ready');
	// get date
	$('#date').text(date('l, F j'));
	
	// check results in local storage
	if(localStorage.results == null){
		localStorage.setItem('results', '5');
	}
	
	// showFeed click handler
	$(document).on('click', '#showFeed', function(e){
		console.log('Feed clicked');
		// get custom attribute feedUrl
		var url = $(this).attr('feedUrl');
		console.log(url);
		
		// store this url in local storage
		localStorage.setItem('currentUrl', url);
		
		// display current url in the feader of the #feed page
		$('#feed h1').html(localStorage.getItem('currentUrl'));
		
		feederInit();
	});
	
	// showEntry click handler
	$(document).on('click', '#showEntry', function(){
		console.log('showEntry clicked');
		// get custom attribute entryTitle
		var currentEntryTitle = $(this).attr('entryTitle');
        // save to local storage
		localStorage.setItem('currentEntryTitle', currentEntryTitle);
        getEntry();
	});
}

function feederInit(){
	console.log('Feeder init...');
	var currentUrl = localStorage.getItem('currentUrl');
	// Feed object
	var feed = new google.feeds.Feed(currentUrl);
	
	var output = '';
	
	// specify no of entires
	feed.setNumEntries(localStorage.getItem('results'));
	
	// load feed
	feed.load(function(result){
		console.log('Getting feed...');
		if(!result.error){
			console.log(result.feed.entries);
			// loop through feeds
			for(i = 0; i < result.feed.entries.length; i++){
				output += '<li>';
				output += '<a id="showEntry" href="#entry" entryTitle="';
				output += result.feed.entries[i].title;
				output += '">';
				output += result.feed.entries[i].title;
				output += '</a>';
				output += '</li>';
			}
		}
		// display
		$('#stories').html(output);
		$('#stories').listview().listview('refresh');
	});
}

function listFeeds(){
	console.log('Listing feeds from local storage...');
	// get stored feeds
	var feeds = JSON.parse(localStorage.getItem('feeds'));
	var output = '';
	var url = '';
	// loop through feeds and create output
	if(feeds != null){
		for(i = 0; i < feeds.length; i++){
			output += '<li><a id="showFeed" feedUrl="';
			output += feeds[i].url;
			output += '" href="#feed">';
			output += feeds[i].name;
			output += '</a></li>';
		}
	}

	// display
	$('#feed-list').html(output);
	$('#feed-list').listview().listview('refresh');
}

function addFeed(){
    console.log('Adding feed...');
	// get form field values
	var name = $('#name').val();
	var url = $('#url').val();

	console.log(name +' '+url);

	// get stored feeds and parse them into json
	var feeds = JSON.parse(localStorage.getItem('feeds'));

	// create new feeds array 
	if(feeds == null){
		feeds = [];
	}

	var new_feed = {
		"name": name,
		"url": url
	}

	// add new feed to feeds array
	feeds.push(new_feed);
	// save to localstorage (as string)
	localStorage.setItem('feeds', JSON.stringify(feeds));

	alert('Feed Added!');
	window.location.href="#home";
}


function showMore(){
	console.log('More details...');
	// get no of results and set new no of results
	var results = parseInt(localStorage.getItem('results'));
	var newResults = results + 10;
	// save
	localStorage.setItem('results', newResults);
	console.log(localStorage.getItem('results'));
	// reload page and display more feeds
	location.reload();
}

function setResults(amount){
	console.log('setting results to ' + amount);
	if(!amount){
		localStorage.setItem('results', '10');
	} else {
		localStorage.setItem('results', amount);
	}
}

function getEntry(){
	console.log('Getting entry...');
	// get url and title from local storage
	var currentUrl = localStorage.getItem('currentUrl');
	var currentEntryTitle = localStorage.getItem('currentEntryTitle');
	var feed = new google.feeds.Feed(currentUrl);
	var output = '';
	feed.setNumEntries(localStorage.getItem('results'));
	feed.load(function(result){
		console.log('Getting Feed...');
		if(!result.error){
			for(i = 0; i < result.feed.entries.length; i++){
				if(currentEntryTitle == result.feed.entries[i].title){
					output += '<h3>';
					output += result.feed.entries[i].title;
					output += '</h3>';
					output += '<article>';
					output += result.feed.entries[i].content;
					output += '</article>';
				}
			}   
		}
		$('#entry-details').html(output);
	});
}

function deleteFeed(){
	console.log('deleting feed...');
	// get from local storage
	var feeds = JSON.parse(localStorage.getItem('feeds'));
	var currentUrl = localStorage.getItem('currentUrl');

	// loop through feeds array
	for(i = 0; i < feeds.length; i++){
		if(feeds[i].url == currentUrl){
			// remove current feed from feeds array
			feeds.splice(i, 1);
		}
		// save
		localStorage.setItem('feeds', JSON.stringify(feeds));
	}
	window.location.href = 'index.html';
}

// Get Date
function date (format, timestamp) {
    var that = this,
      jsdate,
      f,
      formatChr = /\\?([a-z])/gi,
      formatChrCb,
      // Keep this here (works, but for code commented-out
      // below for file size reasons)
      //, tal= [],
      _pad = function (n, c) {
        n = n.toString();
        return n.length < c ? _pad('0' + n, c, '0') : n;
      },
      txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s;
  };
  f = {
    // Day
    d: function () { // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2);
    },
    D: function () { // Shorthand day name; Mon...Sun
      return f.l().slice(0, 3);
    },
    j: function () { // Day of month; 1..31
      return jsdate.getDate();
    },
    l: function () { // Full day name; Monday...Sunday
      return txt_words[f.w()] + 'day';
    },
    N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7;
    },
    S: function () { // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j();
      if(j < 4 || j > 20){
        return (['st', 'nd', 'rd'])[j % 10 - 1];
      }
      else
      {
        return 'th';
      }
    },
    w: function () { // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay();
    },
    z: function () { // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j()),
        b = new Date(f.Y(), 0, 1);
      return Math.round((a - b) / 864e5);
    },

    // Week
    W: function () { // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
        b = new Date(a.getFullYear(), 0, 4);
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
    },

    // Month
    F: function () { // Full month name; January...December
      return txt_words[6 + f.n()];
    },
    m: function () { // Month w/leading 0; 01...12
      return _pad(f.n(), 2);
    },
    M: function () { // Shorthand month name; Jan...Dec
      return f.F().slice(0, 3);
    },
    n: function () { // Month; 1...12
      return jsdate.getMonth() + 1;
    },
    t: function () { // Days in month; 28...31
      return (new Date(f.Y(), f.n(), 0)).getDate();
    },

    // Year
    L: function () { // Is leap year?; 0 or 1
      var j = f.Y();
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
    },
    o: function () { // ISO-8601 year
      var n = f.n(),
        W = f.W(),
        Y = f.Y();
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
    },
    Y: function () { // Full year; e.g. 1980...2010
      return jsdate.getFullYear();
    },
    y: function () { // Last two digits of year; 00...99
      return f.Y().toString().slice(-2);
    },

    // Time
    a: function () { // am or pm
      return jsdate.getHours() > 11 ? "pm" : "am";
    },
    A: function () { // AM or PM
      return f.a().toUpperCase();
    },
    B: function () { // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2,
        // Hours
        i = jsdate.getUTCMinutes() * 60,
        // Minutes
        s = jsdate.getUTCSeconds(); // Seconds
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
    },
    g: function () { // 12-Hours; 1..12
      return f.G() % 12 || 12;
    },
    G: function () { // 24-Hours; 0..23
      return jsdate.getHours();
    },
    h: function () { // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2);
    },
    H: function () { // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2);
    },
    i: function () { // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2);
    },
    s: function () { // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2);
    },
    u: function () { // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6);
    },

    // Timezone
    e: function () { // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
/*              return that.date_default_timezone_get();
*/
      throw 'Not supported (see source code of date() for timezone on how to add support)';
    },
    I: function () { // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0),
        // Jan 1
        c = Date.UTC(f.Y(), 0),
        // Jan 1 UTC
        b = new Date(f.Y(), 6),
        // Jul 1
        d = Date.UTC(f.Y(), 6); // Jul 1 UTC
      return ((a - c) !== (b - d)) ? 1 : 0;
    },
    O: function () { // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset(),
        a = Math.abs(tzo);
      return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
    },
    P: function () { // Difference to GMT w/colon; e.g. +02:00
      var O = f.O();
      return (O.substr(0, 3) + ":" + O.substr(3, 2));
    },
    T: function () { // Timezone abbreviation; e.g. EST, MDT, ...
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
/*              var abbr = '', i = 0, os = 0, default = 0;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if (that.php_js && that.php_js.default_timezone) {
        default = that.php_js.default_timezone;
        for (abbr in tal) {
          for (i=0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
*/
      return 'UTC';
    },
    Z: function () { // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60;
    },

    // Full Date/Time
    c: function () { // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
    },
    r: function () { // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
    },
    U: function () { // Seconds since UNIX epoch
      return jsdate / 1000 | 0;
    }
  };
  this.date = function (format, timestamp) {
    that = this;
    jsdate = (timestamp === undefined ? new Date() : // Not provided
      (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
      new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    );
    return format.replace(formatChr, formatChrCb);
  };
  return this.date(format, timestamp);
}