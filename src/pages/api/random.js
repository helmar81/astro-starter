import factData from '../../lib/randomFact.json';
import personData from '../../lib/randomPerson.json';

export function GET() {
  const fact = factData[Math.floor(Math.random() * factData.length)];
  const person = personData[Math.floor(Math.random() * personData.length)];

  return new Response(
    JSON.stringify({
      fact: fact.text,
      name: `${person.name.first} ${person.name.last}`,
    }),
    { status: 200 }
  );
}
