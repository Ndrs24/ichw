import fs from 'fs/promises'
const resp = await fetch(
	'https://ichintranetalumnos.s3.us-east-1.amazonaws.com/materiales_extras/filemd5153-2023-07-24%2010-52-05.pdf'
)
const buffer = await resp.arrayBuffer()

fs.writeFile('filemd5153-2023-07-24%2010-52-05.pdf', new DataView(buffer))

// Code snippet from c:\node_proyects\ichdw\getDrives2.js
