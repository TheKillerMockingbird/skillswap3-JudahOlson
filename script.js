function filterSkillsByCategory(skills, category) {
  if (category === 'All') {
    return skills;
  }
  return skills.filter(skill => skill.category === category);
}

const allSkills = [
  { title: 'Python Tutoring', category: 'Programming', price: 20, provider: 'Marcus T.' },
  { title: 'Guitar Lessons', category: 'Music', price: 15, provider: 'Jake L.' },
  { title: 'Resume Review', category: 'Career', price: 0, provider: 'Aisha R.' },
  { title: 'Web Development', category: 'Programming', price: 25, provider: 'Sarah K.' }
];

const skillsContainer = document.getElementById('skills-container');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderSkills(skills) {
  skillsContainer.innerHTML = '';

  if (skills.length === 0) {
    skillsContainer.innerHTML = '<p>No skills found in this category.</p>';
    return;
  }

  skills.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <h3>${skill.title}</h3>
      <p class="description">${skill.category}</p>
      <p class="price">$${skill.price} / hour</p>
      <p class="provider">Provider: ${skill.provider}</p>
      <button class="details-btn">More Info</button>
    `;
    skillsContainer.appendChild(card);
  });
}

renderSkills(allSkills);

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.getAttribute('data-category');
    const filtered = filterSkillsByCategory(allSkills, category);
    renderSkills(filtered);
  });
});

function calculateTotalCost(hourlyRate, hours) {
  return hourlyRate * hours;
}

const rateInput = document.getElementById('hourly-rate');
const hoursInput = document.getElementById('hours');
const calculateBtn = document.getElementById('calculate-btn');
const costResult = document.getElementById('cost-result');

calculateBtn.addEventListener('click', () => {
  const rate = parseFloat(rateInput.value) || 0;
  const hours = parseFloat(hoursInput.value) || 0;
  const total = calculateTotalCost(rate, hours);
  costResult.textContent = `Total Cost: $${total.toFixed(2)}`;
});

function matchSkillsToUser(userNeeds, skills) {
  return skills.filter(skill => {
    return skill.category === userNeeds.category && skill.price <= userNeeds.maxPrice;
  });
}

const matchCategory = document.getElementById('match-category');
const matchMaxPrice = document.getElementById('match-max-price');
const findMatchBtn = document.getElementById('find-match-btn');
const matchResults = document.getElementById('match-results');

findMatchBtn.addEventListener('click', () => {
  const userNeeds = {
    category: matchCategory.value,
    maxPrice: parseFloat(matchMaxPrice.value) || 0
  };

  const matched = matchSkillsToUser(userNeeds, allSkills);
  
  matchResults.innerHTML = '';

  if (matched.length === 0) {
    matchResults.innerHTML = '<p>No matching skills found.</p>';
    return;
  }

  matched.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <h3>${skill.title}</h3>
      <p class="description">${skill.category}</p>
      <p class="price">$${skill.price} / hour</p>
      <p class="provider">Provider: ${skill.provider || 'N/A'}</p>
    `;
    matchResults.appendChild(card);
  });
});