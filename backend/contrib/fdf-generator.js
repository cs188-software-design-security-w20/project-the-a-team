// Derived from https://github.com/rhaseven7h/utf8-fdf-generator/blob/1e8cfea73a88b20a23493df0cdb874ae61e9cd37/lib/generator.js
// Licensed under the MIT license.

'use strict';

const bomBE = Buffer.of(0xFE, 0xFF);
function convertToUTF16BE(str) {
  return Buffer.concat([bomBE, Buffer.from(str, 'utf16le').swap16()]);
}

const header = Buffer.from(`%FDF-1.2
\xE2\xE3\xCF\xD3
1 0 obj 
<<
/FDF 
<<
/Fields [
`, 'latin1');

const footer = Buffer.from(`]
>>
>>
endobj 
trailer

<<
/Root 1 0 R
>>
%%EOF
`, 'latin1');

module.exports = (data) => {
  const body = [];

  for (const name of Object.keys(data)) {
    const value = data[name];

    body.push(Buffer.from('<<\n/T ('));
    body.push(convertToUTF16BE(name));
    body.push(Buffer.from(')\n/V ('));
    body.push(convertToUTF16BE(value.toString()));
    body.push(Buffer.from(')\n>>\n'));
  }

  return Buffer.concat([header, ...body, footer]);
};
