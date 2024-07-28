const axios = require('axios');

jest.setTimeout(30000); // Set timeout to 30 seconds to handle all requests

const runLoadTest = async (numRequests) => {
    const requests = [];
    //const expectedResponse = "Say this is a test";
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < numRequests; i++) {
        requests.push(
            axios.get('http://localhost:3000')
                .then(response => {
                    if (response.status === 200){ //&& response.data.includes(expectedResponse)) {
                        successCount++;
                    } else {
                        failureCount++;
                    }
                })
                .catch(() => {
                    failureCount++;
                })
        );
    }

    await Promise.all(requests);

    return { successCount, failureCount };
};

describe('Server Load Test', () => {
    it('should handle 100 requests', async () => {
        const { successCount, failureCount } = await runLoadTest(100);
        console.log(`100 requests test: Success: ${successCount}, Failure: ${failureCount}`);
        expect(successCount).toBe(100);
    });

    it('should handle 50 requests', async () => {
        const { successCount, failureCount } = await runLoadTest(50);
        console.log(`50 requests test: Success: ${successCount}, Failure: ${failureCount}`);
        expect(successCount).toBe(50);
    });

    it('should handle 20 requests', async () => {
        const { successCount, failureCount } = await runLoadTest(20);
        console.log(`20 requests test: Success: ${successCount}, Failure: ${failureCount}`);
        expect(successCount).toBe(20);
    });
});
