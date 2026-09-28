async function checkLive() {
  console.log("Checking GitHub Pages deployment status...");
  for (let i = 0; i < 24; i++) {
    try {
      const res = await fetch('https://rohitmishra2121-crypto.github.io/dream-click/');
      console.log(`[${new Date().toLocaleTimeString()}] Attempt ${i + 1}: HTTP Status ${res.status}`);
      if (res.status === 200) {
        console.log("\n🎉 SUCCESS: Dream Click website is LIVE!");
        process.exit(0);
      }
    } catch (err) {
      console.log(`Attempt ${i + 1} error:`, err.message);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  console.log("Timed out waiting for GitHub Pages.");
  process.exit(1);
}

checkLive();
