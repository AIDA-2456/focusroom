async function test() {
  try {
    const res = await fetch('http://localhost:3001/api/content/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: "https://en.wikipedia.org/wiki/Attention_deficit_hyperactivity_disorder",
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
