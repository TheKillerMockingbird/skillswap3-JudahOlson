let allSkills = [];

function filterSkillsByCategory(skills, category) {
  if (category === 'All') {
    return skills;
  }
  return skills.filter(skill => skill.category === category);
}

function calculateTotalCost(hourlyRate, hours) {
  return hourlyRate * hours;
}

function matchSkillsToUser(userNeeds, skills) {
  return skills.filter(skill => {
    return skill.category === userNeeds.category && skill.price <= userNeeds.maxPrice;
  });
}

function renderSkills(skills, container = document.getElementById('skills-container')) {
  if (!container) return;

  container.innerHTML = '';

  if (skills.length === 0) {
    container.innerHTML = '<p>No skills found.</p>';
    return;
  }

  skills.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <h3>${skill.title}</h3>
      <p class="description">${skill.category}</p>
      <p class="price">$${skill.price} / hour</p>
      <p class="provider">Provider: ${skill.provider || 'N/A'}</p>
    `;
    container.appendChild(card);
  });
}

async function loadSkills() {
  try {
    allSkills = await window.apiService.fetchSkills();
    renderSkills(allSkills);
  } catch (error) {
    console.error('Failed to load skills:', error);
    const container = document.getElementById('skills-container');
    if (container) {
      container.innerHTML = '<p>Error loading skills. Make sure the backend is running on port 3000.</p>';
    }
  }
}

const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.getAttribute('data-category');
    const filtered = filterSkillsByCategory(allSkills, category);
    renderSkills(filtered);
  });
});

const rateInput = document.getElementById('hourly-rate');
const hoursInput = document.getElementById('hours');
const calculateBtn = document.getElementById('calculate-btn');
const costResult = document.getElementById('cost-result');

if (calculateBtn) {
  calculateBtn.addEventListener('click', () => {
    const rate = parseFloat(rateInput.value) || 0;
    const hours = parseFloat(hoursInput.value) || 0;
    const total = calculateTotalCost(rate, hours);
    costResult.textContent = `Total Cost: $${total.toFixed(2)}`;
  });
}

const matchCategory = document.getElementById('match-category');
const matchMaxPrice = document.getElementById('match-max-price');
const findMatchBtn = document.getElementById('find-match-btn');
const matchResults = document.getElementById('match-results');

if (findMatchBtn) {
  findMatchBtn.addEventListener('click', () => {
    const userNeeds = {
      category: matchCategory.value,
      maxPrice: parseFloat(matchMaxPrice.value) || 0
    };

    const matched = matchSkillsToUser(userNeeds, allSkills);
    renderSkills(matched, matchResults);
  });
}

const createSkillForm = document.getElementById('create-skill-form');
const createSkillMessage = document.getElementById('create-skill-message');

if (createSkillForm) {
  createSkillForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const skillData = {
      title: document.getElementById('skill-title').value.trim(),
      category: document.getElementById('skill-category').value,
      price: parseFloat(document.getElementById('skill-price').value) || 0,
      description: document.getElementById('skill-description').value.trim()
    };

    try {
      await window.apiService.createSkill(skillData);
      
      if (createSkillMessage) {
        createSkillMessage.textContent = 'Skill created successfully!';
        createSkillMessage.style.color = 'green';
      }

      createSkillForm.reset();
      await loadSkills();
    } catch (error) {
      if (createSkillMessage) {
        createSkillMessage.textContent = 'Failed to create skill. Check the console.';
        createSkillMessage.style.color = 'red';
      }
      console.error(error);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSkills();
});