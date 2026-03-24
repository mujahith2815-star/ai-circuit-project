async function send() {
  let input = document.getElementById("input").value;

  let res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input })
  });

  let data = await res.json();
  addMessage("AI: " + data.reply);
}

async function generate() {
  let input = document.getElementById("input").value;

  let res = await fetch("http://localhost:3000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input })
  });

  let data = await res.json();

  addMessage("AI: " + data.reply);

  let drawData = extract(data.reply);
  if (drawData) draw(drawData);
}

function addMessage(msg) {
  let div = document.getElementById("messages");
  div.innerHTML += "<p>" + msg + "</p>";
}

function extract(text) {
  let match = text.match(/---DRAW_DATA---([\s\S]*?)---END---/);
  if (!match) return null;

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function draw(data) {
  let svg = document.getElementById("canvas");
  svg.innerHTML = "";

  data.forEach((c, i) => {
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", 50 + i * 100);
    rect.setAttribute("y", 150);
    rect.setAttribute("width", 60);
    rect.setAttribute("height", 30);
    rect.setAttribute("fill", "lightblue");

    svg.appendChild(rect);
  });
}
