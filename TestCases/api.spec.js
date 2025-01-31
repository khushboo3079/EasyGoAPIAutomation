const { test, expect } = require('@playwright/test');
const xlsx = require('xlsx');

// Utility function to read test data from Excel
function readExcelData(filePath, sheetName) {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
}

// Test Suite: RESTful API Automation
test.describe('RESTful API Automation', () => {
    const apiUrl = 'https://api.restful-api.dev/objects';
    const wrongURL = 'https://api.restful-api.dev/objects/id';
    const excelFilePath = 'D:/EasyGoAPIAutomation/Test-Data/testData.xlsx';
    const sheetName = 'Add_data';
    const testData = readExcelData(excelFilePath, sheetName);
    let createdObjectId;
    const data = testData[0];

    // Test Case 1: Add a new object using POST endpoint
    test('Add a new object', async ({ request }) => {
        const data = testData[3];
        const response = await request.post(apiUrl, {
            data: {
                name: data.name,
                data: {
                    Price: data.price,
                    CPUModel: data.cPUModel,
                    Capacity: data.capacity,
                    Year: data.year
                }
            }
        });

        const responseBody = await response.json();
        createdObjectId = responseBody.id;
        console.log(responseBody);

        // Assertions
        expect(response.status()).toBe(200);
        expect(createdObjectId).toBeDefined();
        expect(responseBody.name).toBe(data.name);
        expect(responseBody.data.Year).toBe(data.year);
        expect(responseBody.data.Price).toBe(data.price);
        expect(responseBody.data.CPUModel).toBe(data.cPUModel);
        expect(responseBody.data.Capacity).toBe(data.capacity);
        console.log(`Object added with ID: ${createdObjectId}`);
    });

    // Test Case 2: Retrieve the newly added object using GET by ID endpoint
    test('Retrieve newly added object', async ({ request }) => {
        const response = await request.get(`${apiUrl}/${createdObjectId}`);
        const responseBody = await response.json();

        // Assertions
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(createdObjectId);
        console.log('Object retrieved:', responseBody);
    });

    // Test Case 3: Update all fields on the newly added object using PUT endpoint
    test('Update the object', async ({ request }) => {
        const updatedObject = { ...testData[0], price: '340' };
        const response = await request.put(`${apiUrl}/${createdObjectId}`, {
            data: {
                name: data.name,
                data: {
                    Price: updatedObject.price,
                    CPUModel: data.cPUModel,
                    Capacity: data.capacity,
                    Year: data.year
                }
            }
        });

        const responseBody = await response.json();

        // Assertions
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(createdObjectId);
        expect(responseBody.name).toBe(updatedObject.name);
        expect(responseBody.data.Price).toBe(updatedObject.price);
        console.log('Object updated:', responseBody);
    });

    // Test Case 4: Retrieve the updated object using GET by ID endpoint
    test('Retrieve updated object', async ({ request }) => {
        const response = await request.get(`${apiUrl}/${createdObjectId}`);
        const responseBody = await response.json();

        // Assertions
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(createdObjectId);
        console.log('Updated object retrieved:', responseBody);
    });

    // Test Case 5: Delete the updated object using DELETE endpoint
    test('Delete the object', async ({ request }) => {
        const response = await request.delete(`${apiUrl}/${createdObjectId}`);
        const responseBody = await response.json();

        // Assertions
        expect(response.status()).toBe(200);
        expect(responseBody.message).toContain('deleted');
        console.log(`Object with ID ${createdObjectId} deleted.`);
    });
    // Test Case 6: verify 404 error providing wrong url in endpoint 
    test('wrong url  ', async ({ request }) => {
        const response = await request.get(`${wrongURL}/${createdObjectId}`);
        const responseBody = await response.json();

        // Assertions
        expect(response.status()).toBe(404);

        console.log(`✅ 404 Error Verified - Response:`, responseBody);
    });
});
