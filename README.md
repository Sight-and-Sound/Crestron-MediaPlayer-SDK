# SDK package for CRPC, to integrate into a mediaplayer.

[![ci](https://github.com/Sight-and-Sound/Crestron-MediaPlayer-SDK/workflows/ci/badge.svg)](https://github.com/Sight-and-Sound/Crestron-MediaPlayer-SDK/actions/workflows/ci.yml)

Initial works from the MVP https://github.com/JayLiaProgramming/MediaPlayer rewrote into SDK-like package to hopefully
in the future make integrations with the CRPC streams easy.

## NOT READY FOR USE YET

#### TODO
- [ ] Add service selection to automatically skip the main menu in the Browser.
- [ ] Add search method which browses and inserts search query in the background with category selection like Artist, Track etc.
- [ ] Create icon/art replacement/injection based on Level/Service and item Name, for example show icons for Tidal top categories as they would in the tidal app.

```typescript
const container = new CrpcContainer('5db35e97-a379-46e4-ac32-6b16d5ed6d3e');

// When server sends data, run it into
container.pipeFromServer('{rpc data from server}');

// Whenever the SDK generates data, send it back to the server.
const subscription = container.pipeToServer.subscribe({
    next: (data: string) =>
    {
        // send "data" to server!
    },
});

// After setting this up, initialize (async method)
await container.initialize();

// Get browser and watch title, when subscribing to a property it should automatically be retrieved by the SDK
if (container.browser) {
    // Initialize browser before using it!
    container.browser.initialize();

    container.browser.title$.subscribe({
        next: (title: string) => console.log(`Received title: ${title}`),
    });

    container.browser.items$.subscribe({
        next: (items: ListItem[]) => {
            console.log('Received browsable items: ', items)
            
            // Select item
            items[0].select()
        },
    });

    container.browser.functions$.subscribe({
        next: (listFunctions: ListFunction[]) => {
            console.log('Received executable functions', listFunctions);
            
            // Execute function
            listFunctions[0].execute()
        }
    });
}

// Getting now playing lines
if (container.player) {
    container.player.initialize();
    container.player.textLines$.subscribe({
        next: (lines: string[]) =>
            console.log(`Received now playing text lines: ${lines.join(' - ')}`),
    });

    // Or start playing
    container.player.play();
}
```
