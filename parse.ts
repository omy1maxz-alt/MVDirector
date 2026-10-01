import fs from 'fs';
const html = fs.readFileSync('page.html', 'utf-8');
const text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                 .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                 .replace(/<[^>]+>/g, ' ')
                 .replace(/\s+/g, ' ');
const match = text.match(/Prompting like a Creative Director(.*?)(?=Go further|Introducing multi-cluster)/i);
if (match) {
  console.log(match[0].substring(0, 2000));
} else {
  console.log('Not found');
}
