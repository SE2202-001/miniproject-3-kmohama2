class Job {
    constructor({ title, postedTime, type, level, skill, detail }) {
        this.title = title;
        this.postedTime = new Date(postedTime);
        this.type = type;
        this.level = level;
        this.skill = skill;
        this.detail = detail;
    }

    getSummary() {
        return `${this.title} - ${this.type} | ${this.level}`;
    }

    getFormattedPostedTime() {
        return this.postedTime.toLocaleDateString();
    }

    getDetails() {
        return `
            <strong>${this.title}</strong><br>
            <em>${this.type} | ${this.level}</em><br>
            <small>Posted: ${this.getFormattedPostedTime()}</small><br>
            <p>${this.detail}</p>
        `;
    }
}

let jobs = [];
const jobList = document.getElementById('jobList');
const fileInput = document.getElementById('fileInput');
const filterLevel = document.getElementById('filterLevel');
const filterType = document.getElementById('filterType');
const filterSkill = document.getElementById('filterSkill');
const sortBy = document.getElementById('sortBy');
const clearFilters = document.getElementById('clearFilters');

// Modal Elements
const jobModal = document.getElementById('jobModal');
const modalTitle = document.getElementById('modalTitle');
const modalDetails = document.getElementById('modalDetails');
const modalType = document.getElementById('modalType');
const modalLevel = document.getElementById('modalLevel');
const modalSkill = document.getElementById('modalSkill');
const modalPostedTime = document.getElementById('modalPostedTime');
const closeModal = document.querySelector('.close');

closeModal.onclick = () => {
    jobModal.style.display = "none";
};

// Click outside the modal to close
window.onclick = (event) => {
    if (event.target === jobModal) {
        jobModal.style.display = "none";
    }
};

fileInput.addEventListener('change', loadJobs);
filterLevel.addEventListener('change', applyFilters);
filterType.addEventListener('change', applyFilters);
filterSkill.addEventListener('change', applyFilters);
sortBy.addEventListener('change', applyFilters);
clearFilters.addEventListener('click', resetFilters);

function loadJobs(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                jobs = data.map(jobData => new Job(jobData));
                populateFilters();
                applyFilters();
            } catch (error) {
                alert('Invalid JSON file!');
            }
        };
        reader.readAsText(file);
    }
}

function populateFilters() {
    populateFilter(filterLevel, [...new Set(jobs.map(job => job.level))]);
    populateFilter(filterType, [...new Set(jobs.map(job => job.type))]);
    populateFilter(filterSkill, [...new Set(jobs.map(job => job.skill))]);
}

function populateFilter(filter, options) {
    filter.innerHTML = '<option value="">All</option>';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        filter.appendChild(opt);
    });
}

function applyFilters() {
    let filteredJobs = jobs.filter(job => {
        return (!filterLevel.value || job.level === filterLevel.value) &&
               (!filterType.value || job.type === filterType.value) &&
               (!filterSkill.value || job.skill === filterSkill.value);
    });

    if (sortBy.value === 'title') {
        filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy.value === 'postedTime') {
        filteredJobs.sort((a, b) => b.postedTime - a.postedTime);
    }

    displayJobs(filteredJobs);
}

function displayJobs(jobArray) {
    jobList.innerHTML = '';
    jobArray.forEach(job => {
        const div = document.createElement('div');
        div.className = 'job';
        div.innerHTML = job.getSummary();
        div.onclick = () => showJobDetails(job);
        jobList.appendChild(div);
    });
}

function showJobDetails(job) {
    modalTitle.textContent = job.title;
    modalDetails.textContent = job.detail;
    modalType.textContent = `Type: ${job.type}`;
    modalLevel.textContent = `Level: ${job.level}`;
    modalSkill.textContent = `Skill: ${job.skill}`;
    modalPostedTime.textContent = `Posted: ${job.getFormattedPostedTime()}`;
    
    jobModal.style.display = "block";
}

function resetFilters() {
    filterLevel.value = '';
    filterType.value = '';
    filterSkill.value = '';
    sortBy.value = 'title';
    applyFilters();
}
