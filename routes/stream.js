async function* generateData() {
    for (let i = 0; i < 1000; i++) {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Yield data chunk
        yield `data chunk ${i}\n`;
    }
}
