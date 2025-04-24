// src/pages/api/randomPerson.json.ts
export async function GET() {
    const randomPeople = [
      { name: { first: "Helmar" } },
      { name: { first: "Lala" } },
      { name: { first: "Nova" } },
      { name: { first: "Leo" } },
      { name: { first: "Zara" } },
    ];
  
    const person = randomPeople[Math.floor(Math.random() * randomPeople.length)];
  
    return new Response(JSON.stringify(person), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  