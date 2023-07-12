const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('input.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(worksheet);

// Convert Excel data to the desired format
const result = {
  section: [],
  document_id: 'realsoft-data',
  title: 'socio-economic information',
  metadata_json: '{"company_name": "Realsoft", "transcript_date": "06/18/23 5:00 PM ET", "section_type": "socio-economic information", "transcript_url": ""}'
};

const categories = new Map(); // To store category objects by CAT_ID

for (const row of jsonData) {
  const category = categories.get(row.CAT_ID);
  if (category) {
    // Add report to existing category
    category.section.push({
      id: row.REPORT_ID,
      text: row.REPORT_EN_NAME,
      metadata_json: JSON.stringify({
        CATEGORY_EN_NAME: row.CATEGORY_EN_NAME,
        CATEGORY_AR_NAME: row.CATEGORY_AR_NAME,
        REPORT_EN_NAME: row.REPORT_EN_NAME,
        REPORT_AR_NAME: row.REPORT_AR_NAME,
        PARENT_ID: row.PARENT_ID,
        Tag_En: row.Tag_En,
        Tag_Ar: row.Tag_Ar,
        FREQUENCY: row.FREQUENCY,
        INDICATOR_EN_NAME: row.INDICATOR_EN_NAME,
        Description: row.Description
      })
    });
  } else {
    // Create new category
    const newCategory = {
      title: row.CATEGORY_EN_NAME,
      id: row.CAT_ID,
      section: [{
        id: row.REPORT_ID,
        text: row.REPORT_EN_NAME,
        metadata_json: JSON.stringify({
          CATEGORY_EN_NAME: row.CATEGORY_EN_NAME,
          CATEGORY_AR_NAME: row.CATEGORY_AR_NAME,
          REPORT_EN_NAME: row.REPORT_EN_NAME,
          REPORT_AR_NAME: row.REPORT_AR_NAME,
          PARENT_ID: row.PARENT_ID,
          Tag_En: row.Tag_En,
          Tag_Ar: row.Tag_Ar,
          FREQUENCY: row.FREQUENCY,
          INDICATOR_EN_NAME: row.INDICATOR_EN_NAME,
          Description: row.Description
        })
      }]
    };
    result.section.push(newCategory);
    categories.set(row.CAT_ID, newCategory);
  }
}

// Write the converted data to a JSON file
fs.writeFileSync('output.json', JSON.stringify(result, null, 2));

console.log('Conversion completed successfully.');
