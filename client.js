async function* streamingFetch( fetchcall ) {

    const response = await fetchcall();
    // Attach Reader
    const reader = response.body.getReader();
    while (true) {
        // wait for next encoded chunk
        const { done, value } = await reader.read();
         // check if stream is done
        if (done) break;
        // Decodes data chunk and yields it
        yield (new TextDecoder().decode(value));
    }
}

(async () => {

    for await ( let chunk of streamingFetch( () => fetch('http://localhost:3000/') ) ) {
        console.log( chunk )
    }

})();