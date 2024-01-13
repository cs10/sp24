const docs = id => `assign.html?//docs.google.com/document/d/${id}/pub`
const gs = id => `https://www.gradescope.com/courses/354801/assignments/${id}`;
const slides = id => `https://docs.google.com/a/berkeley.edu/presentation/d/${id}`;
const labURL = topic => `https://cs10.org/bjc-r/topic/topic.html?topic=${topic}&course=cs10_fa21.html`;

// Monday of the first week of classes
const SKIPPED_ITEM = { title: 'SKIP' };
const COUNTER = {
  lecture: 1,
  homework: 0,
  discussion: 1,
  lab: 1,
}

let FIRST_DAY = dayjs('2022-01-16');
let LAST_DAY = dayjs('2022-05-14');

// TODO: Model out the schedule object for 1 day.
// TODO: Readings() should be 1 obj with multiple links.
// TODO: What about `options` stuff? 2 Due dates in 1 day?

function createSchedule(startDate, endDate) {
  if (startDate.day() !== 0) {
    throw new Error('Start Date must start on a Sunday');
  }
  let schedule = {};
  let index = startDate;
  let stop = endDate.add(1, 'day');
  while (index.isBefore(stop)) {
    // Skip weekends
    if (index.day() > 0 && index.day() < 6) {
      schedule[index.format('YYYY-MM-DD')] = {
        date: index,
        lecture: {},
        lab: {},
        reading: {},
        discussion: {},
        assignment: {}
      };
    }
    index = index.add(1, 'day');
  }
  return schedule;
}


function addToSchedule(date, item, type) {
  let key = date.format('YYYY-MM-DD');
  let column = item.type || type;
  if (!CS10_SCHEDULE[key]) {
    console.log('ERROR, what? Missing date...')
    CS10_SCHEDULE[key] = {};
  }
  CS10_SCHEDULE[key][column] = item;
}

function Lecture(title, release_date, {url, gradescope, recording, options}={}) {
  if (title.slice(0, 3) === 'No ') {
    addToSchedule(release_date, { type: 'lecture', title: 'No Class', date: release_date, classes: 'no-class'});
    // TYPE_ORDER.filter(key => key !== 'lecture').forEach(type => {});
  }
  let links = {
    'Slides': slides(url),
    'Self-Check': gs(gradescope),
    'Recording': recording
  }

  if (options && options.links) {
    links = Object.assign(links, options.links);
  }

  let lecture = {
    title: `${COUNTER.lecture}. ${title}`,
    date: release_date, url, links, options, type: 'lecture'
  }
  COUNTER.lecture += 1;
  addToSchedule(release_date, lecture);
  return lecture;
}

function Assignment(title, release_date, {spec_url, due_date, submission_url, type, options}={}) {
  let days = due_date.diff(release_date, 'day');
  let assignment = {
    title: `${COUNTER.homework}: ${title}`,
    type: 'assignment',
    classes: [type],
    date: release_date, url: spec_url,
    due_date, options, days, submission_url
  }
  COUNTER.homework += 1;
  addToSchedule(release_date, assignment);
  return assignment;
}

function Homework(title, release_date, {url, due_date, submission_url, options}={}) {
  return Assignment(title, release_date, {url, due_date, submission_url, type: 'homework', options});
}

function Project(title, {release_date, url, due_date, submission_url, options}={}) {
  return Assignment(title, release_date, url, due_date, submission_url, 'project', options);
}

// TODO: Add link to check off questions
// TODO: Add link to bCourses?
function Lab(title, release_date, {topic, due_date, options}={}) {
  if (title == 'No Lab') {
    return { type: 'lab', title: 'No Lab', date: release_date, classes: 'no-class'};
  }
  if (!due_date) {
    due_date = release_date.add(7, 'days');
  }
  let days = due_date.diff(release_date, 'day');
  let lab = {
    title: `${COUNTER.lab}. ${title}`,
    date: release_date, url: labURL(topic), due_date, options, days, type: 'lab'
  }
  COUNTER.lab += 1;
  addToSchedule(release_date, lab);
  return lab;
}

function Reading(readings, release_date, {options}={}) {
  readings.forEach(reading => {
    if (!reading.status) {
      reading.status = 'required';
    }
  })
  function renderReadings(readings) {
    return `<ul>
      <li>${readings.map(renderReading).join('</li><li>')}</li>
    </ul>`;
  }
  function renderReading({ title, url, status }) {
    return `<a href="${url}" class="reading-${status}" target=_blank>${title}</a>`;
  }
  let reading = {
    content: renderReadings(readings), date: release_date, options, type: 'reading'
  }
  addToSchedule(release_date, reading);
  return reading;
}

function Discussion(title, release_date, {url, options}={}) {
  let discussion = {
    title: `${COUNTER.discussion}: ${title}`,
    url, release_date, options, type: 'discussion'
  }
  addToSchedule(release_date, discussion);
  return discussion;
}

function GenerateDateIncrementor(start_date, skip_days) {
  // Return a function that returns the next date after start_date
  // incremented by skip_days, where skip_days is an array.
  // at the end of the array, the days cycle.
  // e.g. a Monday-Wednesdy schedule has skip_days = [2, 5]
  // Returns start_date the first time the function is called.
  let skip_days_index = 0;
  let next_date = start_date;
  return function() {
    let current_date = next_date;
    next_date = current_date.add(skip_days[skip_days_index], 'day');
    skip_days_index = (skip_days_index + 1) % skip_days.length;
    return current_date;
  }
}

function weekNumber(date, startDate) {
  // Return the number of weeks of firstWeek - date of the course in range [1, 17] else -1
  return Math.abs(startDate.week() - date.week()) + 1;
}

function render(item) {
  console.log('Render Indiv.', item);
  let content = '';
  if (!item || !item.title) { return ''; }
  if (item.content) {
    return item.content;
  }

  if (!item.url) {
    content += `<span>${item.title}</span>`;
  } else {
    contet += `<a href="${item.url}" target=_blank>${item.title}</a>"`;
  }
  if (item.due_date) {
    content += `<br><strong>Due: <time>${item.due_date}</time>`;
  }
  if (item.submision_url) {
    content += `(<a class="submission-link" aria-label="Submit ${item.title}" href="${item.submission_url}">Submit</a>)`
  }
  if (item.links) {
    content += renderLinks(item.links)
  }
  if (item.options) {
    content += options;
  }
  return content;
}

// Turn a {link-text: URL} map into a nice series of links.
function renderLinks(links) {
  return Object.entries(links).filter(link => link[0] && link[1]).map(link => `(<a href="${link[1]}">${link[0]}</a>)`).join(' | ');
}

const MONDAY = 1;
const SUNDAY = 0;
const SATURDAY = 6;
const TYPE_ORDER = [
  'lecture',
  'reading',
  'lab',
  'discussion',
  'assignment'
];

function renderSchedule(schedule, target) {
  let scheduleTable = $(target);
  let currentDate = FIRST_DAY;
  let now = dayjs();
  let row;
  console.log('RENDER SCHEDULE: ', schedule)
  while (currentDate.isBefore(LAST_DAY)) {
    let dayOfWeek = currentDate.day();
    if (dayOfWeek == SATURDAY || dayOfWeek == SUNDAY) {
      currentDate = currentDate.add(1, 'day');
      continue;
    }
    // TODO: Getting a value by date object needs to be easier.
    let current = schedule[currentDate.format('YYYY-MM-DD')];
    let week = weekNumber(currentDate, FIRST_DAY);
    let rowClasses = week % 2 == 0 ? 'even' : 'odd';
    let colspan = 1;
    let rowspan = 1;
    if (currentDate.isSame(now, 'day')) {
      rowClasses += ' today'
    }
    row = $(`<tr class="${rowClasses}">`);
    console.log(row);
    if (dayOfWeek == MONDAY) {
      row.append(`<td rowspan=5 class="">${week}</td>`);
    }
    row.append(`<td>${currentDate.format('dd M/D')}</td>`);
    TYPE_ORDER.forEach(type => {
      let event = current[type];
      if (event === SKIPPED_ITEM) {
        return;
      }
      row.append(`<td class="schedule-${type}" colspan="${colspan}" rowspan="${rowspan}">
        ${render(event || {})}
      </td>`);
    });
    scheduleTable.append(row);
    currentDate = currentDate.add(1, 'day');
  }
}

//////////////////////////////////////////////////
// FIRST_DAY == Sunday
let firstLecture = FIRST_DAY.add(1, 'day');
let firstLab = FIRST_DAY.add(4, 'days');
let firstDiscussion = FIRST_DAY.add(5, 'days');
let firstReading = firstLab;

let nextLecture = GenerateDateIncrementor(firstLecture, [2, 7]);
let nextLab = GenerateDateIncrementor(firstLab, [2, 7]);
let nextDiscussion = GenerateDateIncrementor(firstDiscussion, [7]);
let nextReading = GenerateDateIncrementor(firstReading, [7]);

let CS10_SCHEDULE = createSchedule(FIRST_DAY, LAST_DAY);

// Monday 1/17
Lecture('No Class', nextLecture());
// Tues 1/18
Lab('No Lab', nextLab());
// Weds 1/19
Lecture('Welcome to CS10!', nextLecture(), {
      slides: '1R2-4v31x8TF1N4owleDSKJR1AqXKtVxLUXfA8gJZO5E',
      recording: 'https://youtu.be/HDtns_jV-Y8',
});
// Thurs 1/20
Lab('Intro to Snap!', nextLab(), {
  topic: 'berkeley_bjc/intro_pair/1-introduction.topic'
});
// Fri 1/21
Discussion('Welcome to CS10', nextDiscussion());
Homework('Introduce Yourself', dayjs('2022-01-19'), {
  url: gs(1770006),
  due_date: dayjs('2022-01-22')
});

// Week 2:

// Week 3:

// Week 4:

// Week 5:


window.addEventListener('load', () => {
  dayjs.extend(dayjs_plugin_weekOfYear);
  renderSchedule(CS10_SCHEDULE, '.schedule-table');
});
