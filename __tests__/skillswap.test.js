const { filterSkillsByCategory, calculateTotalCost, matchSkillsToUser } = require('../skillswap-functions');

describe('filterSkillsByCategory', () => {

  const skills = [
    { title: 'Python Tutoring', category: 'Programming', price: 20 },
    { title: 'Guitar Lessons', category: 'Music', price: 15 },
    { title: 'Resume Review', category: 'Career', price: 0 },
    { title: 'Web Development', category: 'Programming', price: 25 }
  ];

  test('filters skills by category', () => {
    const result = filterSkillsByCategory(skills, 'Programming');
    expect(result).toEqual([
      { title: 'Python Tutoring', category: 'Programming', price: 20 },
      { title: 'Web Development', category: 'Programming', price: 25 }
    ]);
  });

  test('handles "All" category', () => {
    const result = filterSkillsByCategory(skills, 'All');
    expect(result).toEqual(skills);
  });

  test('returns empty array when no matches', () => {
    const result = filterSkillsByCategory(skills, 'Cooking');
    expect(result).toEqual([]);
  });

});

describe('calculateTotalCost', () => {

  test('returns correct values for different hours and rates', () => {
    expect(calculateTotalCost(20, 2)).toBe(40);
    expect(calculateTotalCost(25, 1.5)).toBe(37.5);
  });

  test('handles free sessions (0 price) and zero hours', () => {
    expect(calculateTotalCost(0, 3)).toBe(0);
    expect(calculateTotalCost(20, 0)).toBe(0);
  });

  test('returns correct value for decimal hours', () => {
    expect(calculateTotalCost(25, 1.5)).toBe(37.5);
  });

});

describe('matchSkillsToUser', () => {

  const skills = [
    { title: 'Python Tutoring', category: 'Programming', price: 20 },
    { title: 'JavaScript Help', category: 'Programming', price: 25 },
    { title: 'Guitar Lessons', category: 'Music', price: 15 },
    { title: 'Resume Review', category: 'Career', price: 0 }
  ];

  test('matches by category and price', () => {
    const userNeeds = { category: 'Programming', maxPrice: 30 };
    const result = matchSkillsToUser(userNeeds, skills);
    expect(result).toEqual([
      { title: 'Python Tutoring', category: 'Programming', price: 20 },
      { title: 'JavaScript Help', category: 'Programming', price: 25 }
    ]);
  });

  test('filters by max price', () => {
    const userNeeds = { category: 'Programming', maxPrice: 20 };
    const result = matchSkillsToUser(userNeeds, skills);
    expect(result).toEqual([
      { title: 'Python Tutoring', category: 'Programming', price: 20 }
    ]);
  });

  test('returns empty array for no matches', () => {
    const userNeeds = { category: 'Cooking', maxPrice: 100 };
    const result = matchSkillsToUser(userNeeds, skills);
    expect(result).toEqual([]);
  });

  test('includes free skills', () => {
    const userNeeds = { category: 'Career', maxPrice: 0 };
    const result = matchSkillsToUser(userNeeds, skills);
    expect(result).toEqual([
      { title: 'Resume Review', category: 'Career', price: 0 }
    ]);
  });

});