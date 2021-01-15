import fs from 'fs';
import path from 'path';
import parser from '../src/parser';

const pathToFile = path.join(__dirname, '..', '__fixtures__', 'example.xml');
const data = fs.readFileSync(pathToFile, 'utf-8');
console.log(data);

test('Parsing', () => {
  const result = parser(data);
  expect(result[0].title).toEqual('RSS Title');
  expect(result[0]).toHaveProperty('link', 'http://www.example.com/main.html');
});
