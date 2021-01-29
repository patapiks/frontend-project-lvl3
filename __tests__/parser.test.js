import fs from 'fs';
import path from 'path';
import parser from '../src/parser';

const pathToFile = path.join(__dirname, '..', '__fixtures__', 'example.xml');
const data = fs.readFileSync(pathToFile, 'utf-8');
console.log(data);

test('Parsing', () => {
  const result = parser(data);
  expect(result.feed.title).toEqual('RSS Title');
  expect(result.feed).toHaveProperty('link', 'http://www.example.com/main.html');
});
