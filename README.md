# SDK package for CRPC, to integrate into a mediaplayer.

[![ci](https://github.com/Sight-and-Sound/Crestron-MediaPlayer-SDK/workflows/ci/badge.svg)](https://github.com/Sight-and-Sound/Crestron-MediaPlayer-SDK/actions/workflows/ci.yml)

Initial works from the MVP https://github.com/JayLiaProgramming/MediaPlayer rewrote into SDK-like package to hopefully in the future make integrations with the CRPC streams easy.

## NOT READY FOR USE YET

```typescript
const container = new CrpcContainer('5db35e97-a379-46e4-ac32-6b16d5ed6d3e');

// When server sends data, run it into
container.pipeFromServer('{rpc data from server}');

// Whenever the SDK generates data, send it back to the server.
const subscription = container.pipeToServer.subscribe({
  next: (data: string) => {
    // send "data" to server!
  },
});

// After setting this up, initialize (async method)
await container.initialize();

// Get browser and watch title, when subscribing to a property it should automatically be retrieved by the SDK
if (container.browser) {
  container.browser.title$.subscribe({
    next: (title: string) => console.log(`Received title: ${title}`),
  });
}

// Getting now playing lines
if (container.player) {
  container.player.textLines$.subscribe({
    next: (lines: string[]) =>
      console.log(`Received now playing text lines: ${lines.join(' - ')}`),
  });

  // Or start playing
  container.player.play();
}
```
