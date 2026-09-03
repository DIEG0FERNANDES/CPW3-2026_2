document.getElementById('btn').addEventListener('click', async () => {
  const res = await fetch('http://localhost:3000/dog');
  const data = await res.json();

  const img = document.getElementById('img');
  img.src = data.message;
})