let currentData = null;

// 💬 CHAT UI
function addMessage(text, sender) {
  let div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  document.getElementById("chat").appendChild(div);

  div.scrollIntoView();
}

// 🚀 SEND MESSAGE (REAL AI)
async function send() {
  let input = document.getElementById("msg");
  let msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  try {
    let res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: msg })
    });

    let data = await res.json();

    addMessage(data.reply, "ai");

    // 🔍 CHECK JSON INSIDE RESPONSE
    try {
      let start = data.reply.indexOf("{");
      let end = data.reply.lastIndexOf("}") + 1;

      if (start !== -1 && end !== -1) {
        let jsonText = data.reply.substring(start, end);
        let parsed = JSON.parse(jsonText);

        currentData = parsed;
        draw(currentData);
      }
    } catch (e) {
      console.log("No valid JSON found");
    }

  } catch (err) {
    addMessage("⚠️ Error connecting to AI", "ai");
    console.error(err);
  }
}

// 🎨 DRAW SCHEMATIC
function draw(data) {
  if (!data) return;

  let svg = document.getElementById("canvas");
  svg.innerHTML = "";

  data.components.forEach(c => {

    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("cursor", "move");

    let offsetX, offsetY;

    group.addEventListener("mousedown", (e) => {
      offsetX = e.offsetX - c.x;
      offsetY = e.offsetY - c.y;

      function move(e) {
        c.x = e.offsetX - offsetX;
        c.y = e.offsetY - offsetY;
        draw(currentData);
      }

      function stop() {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", stop);
      }

      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", stop);
    });

    // SYMBOLS
    if (c.type === "Battery") drawBattery(c.x, c.y, group);
    else if (c.type === "Resistor") drawResistor(c.x, c.y, group);
    else if (c.type === "LED") drawLED(c.x, c.y, group);
    else if (c.type === "Capacitor") drawCapacitor(c.x, c.y, group);
    else if (c.type === "Switch") drawSwitch(c.x, c.y, group);
    else drawBox(c.x, c.y, group, c.type);

    // LABEL
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", c.x);
    text.setAttribute("y", c.y + 40);
    text.setAttribute("fill", "white");
    text.textContent = c.id;
    group.appendChild(text);

    svg.appendChild(group);
  });

  // WIRES
  data.connections.forEach(conn => {
    let from = data.components.find(c => c.id === conn[0]);
    let to = data.components.find(c => c.id === conn[1]);

    if (from && to) {
      svg.appendChild(createLine(from.x + 40, from.y, to.x, to.y, 2));
    }
  });
}

// 🔋 BATTERY
function drawBattery(x, y, g) {
  g.appendChild(createLine(x, y - 20, x, y + 20, 3));
  g.appendChild(createLine(x + 10, y - 10, x + 10, y + 10, 2));
}

// 🔶 RESISTOR
function drawResistor(x, y, g) {
  let zigzag = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  zigzag.setAttribute("points",
    `${x},${y} ${x+5},${y-10} ${x+10},${y+10} ${x+15},${y-10} ${x+20},${y+10} ${x+25},${y}`
  );
  zigzag.setAttribute("stroke", "white");
  zigzag.setAttribute("fill", "none");
  g.appendChild(zigzag);
}

// 💡 LED
function drawLED(x, y, g) {
  g.appendChild(createLine(x, y, x + 20, y, 2));

  let tri = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  tri.setAttribute("points", `${x},${y-10} ${x},${y+10} ${x+15},${y}`);
  tri.setAttribute("fill", "white");
  g.appendChild(tri);

  g.appendChild(createLine(x+20, y-10, x+30, y-20, 2));
  g.appendChild(createLine(x+20, y+10, x+30, y+20, 2));
}

// 🔋 CAPACITOR
function drawCapacitor(x, y, g) {
  g.appendChild(createLine(x, y - 15, x, y + 15, 2));
  g.appendChild(createLine(x + 10, y - 15, x + 10, y + 15, 2));
}

// 🔘 SWITCH
function drawSwitch(x, y, g) {
  g.appendChild(createLine(x, y, x + 20, y, 2));
  g.appendChild(createLine(x + 20, y, x + 30, y - 10, 2));
}

// 📦 UNKNOWN COMPONENT
function drawBox(x, y, g, label) {
  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y - 15);
  rect.setAttribute("width", 40);
  rect.setAttribute("height", 30);
  rect.setAttribute("stroke", "white");
  rect.setAttribute("fill", "none");

  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x + 5);
  text.setAttribute("y", y + 5);
  text.setAttribute("fill", "white");
  text.textContent = label;

  g.appendChild(rect);
  g.appendChild(text);
}

// 🔧 LINE
function createLine(x1, y1, x2, y2, w) {
  let l = document.createElementNS("http://www.w3.org/2000/svg", "line");
  l.setAttribute("x1", x1);
  l.setAttribute("y1", y1);
  l.setAttribute("x2", x2);
  l.setAttribute("y2", y2);
  l.setAttribute("stroke", "white");
  l.setAttribute("stroke-width", w);
  return l;
}