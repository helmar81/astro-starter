// src/pages/api/randomFact.json.ts
export async function GET() {
    const facts = [
      { fact: "The Moon has moonquakes 🌕" },
      { fact: "A day on Venus is longer than a year 🪐" },
      { fact: "Neutron stars can spin 600 times per second ⚡" },
      { fact: "The Sun makes up 99.86% of the solar system's mass ☀️" },
      { fact: "There are more trees on Earth than stars in the Milky Way 🌲✨" }
    ];
  
    const fact = facts[Math.floor(Math.random() * facts.length)];
  
    return new Response(JSON.stringify(fact), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
