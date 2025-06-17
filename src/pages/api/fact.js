// src/pages/api/fact.js
export async function GET() {
    const factRes = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const personRes = await fetch('https://randomuser.me/api/');
    
    const factData = await factRes.json();
    const personData = await personRes.json();
  
    return new Response(JSON.stringify({
      fact: factData.text,
      name: personData.results[0].name.first,
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  