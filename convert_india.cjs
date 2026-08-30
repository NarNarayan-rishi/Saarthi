const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Locations
  content = content.replace(/San Francisco, CA/g, 'Bangalore, India');
  content = content.replace(/San Francisco/g, 'Bangalore');
  content = content.replace(/New York, NY/g, 'Mumbai, India');
  content = content.replace(/New York/g, 'Mumbai');
  content = content.replace(/Seattle, WA/g, 'Hyderabad, India');
  content = content.replace(/Seattle/g, 'Hyderabad');
  content = content.replace(/Boston, MA/g, 'Pune, India');
  content = content.replace(/Boston/g, 'Pune');
  content = content.replace(/Austin, TX/g, 'Delhi NCR, India');
  content = content.replace(/Austin/g, 'Delhi NCR');
  content = content.replace(/Chicago, IL/g, 'Chennai, India');
  content = content.replace(/Chicago/g, 'Chennai');

  // Currencies / Salaries - specific replacements first
  content = content.replace(/\$150,000/g, '₹25,00,000');
  content = content.replace(/\$140,000/g, '₹22,00,000');
  content = content.replace(/\$130,000/g, '₹20,00,000');
  content = content.replace(/\$125,000/g, '₹18,00,000');
  content = content.replace(/\$120,000/g, '₹16,00,000');
  content = content.replace(/\$115,000/g, '₹15,00,000');
  content = content.replace(/\$110,000/g, '₹14,00,000');
  content = content.replace(/\$105,000/g, '₹12,50,000');
  content = content.replace(/\$100,000/g, '₹12,00,000');
  content = content.replace(/\$95,000/g, '₹10,50,000');
  content = content.replace(/\$90,000/g, '₹10,00,000');
  content = content.replace(/\$85,000/g, '₹8,50,000');
  content = content.replace(/\$80,000/g, '₹8,00,000');
  content = content.replace(/\$75,000/g, '₹7,50,000');
  content = content.replace(/\$70,000/g, '₹7,00,000');
  content = content.replace(/\$65,000/g, '₹6,50,000');
  content = content.replace(/\$60,000/g, '₹6,00,000');
  
  // Stipends
  content = content.replace(/\$5,000\/mo/g, '₹50,000/mo');
  content = content.replace(/\$4,500\/mo/g, '₹45,000/mo');
  content = content.replace(/\$4,000\/mo/g, '₹40,000/mo');
  content = content.replace(/\$3,500\/mo/g, '₹35,000/mo');
  content = content.replace(/\$3,000\/mo/g, '₹30,000/mo');
  content = content.replace(/\$2,500\/mo/g, '₹25,000/mo');
  content = content.replace(/\$2,000\/mo/g, '₹20,000/mo');
  content = content.replace(/\$1,500\/mo/g, '₹15,000/mo');

  fs.writeFileSync(filePath, content);
}

processFile('src/data/mockData.ts');
processFile('src/context/AppContext.tsx');

console.log('Conversion to India specific done!');
