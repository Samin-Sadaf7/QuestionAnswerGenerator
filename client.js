async function* streamingFetch( fetchcall ) {

    const response = await fetchcall();

    const reader = response.body.getReader();
    while (true) {
 
        const { done, value } = await reader.read();
  
        if (done) break;

        yield (new TextDecoder().decode(value));
    }
}

(async () => {

    for await ( let chunk of streamingFetch( () => fetch('http://localhost:3000/') ) ) {
        console.log( chunk )
    }

})();