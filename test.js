async function test() {
  try {
    const res = await fetch('http://localhost:3001/api/content/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: "Dark/light/dyslexia-friendly themes — including OpenDyslexic font option (huge accessibility win).\nExport summary — at the end of a session, generate a one-page summary of what was learned.\nBackground focus sounds — optional brown noise, rain, or lo-fi while reading.\nShare progress — quick share card for social media after completing a session.\nIf you only have time for 3, do #1, #2, and #8 — they're the most demo-friendly and reinforce your accessibility angle.",
        simplify: false
      })
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

test();
