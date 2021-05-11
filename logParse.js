#!/usr/bin/env node
const readline = require('readline')
const fs = require('fs');
const path = require('path');
const { Console } = require('console');

let argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Использование: $0 [options]')
    .example('$0 -l log.txt', 'Запустить анализатор лога игры "орел-решка" для log-файле игры log.txt')
    .nargs('l', 1)
    .describe('l', 'Имя Log-файла')
    .demandOption(['l'])
    .help('h')
    .alias('h', 'help')
    .version('1.0.0')
    .argv;

let readStream = fs.createReadStream(path.join(__dirname,argv.l),'utf8')

let data = ''

readStream.on('data', chunk => {
    data += chunk
})

readStream.on('error', (err) => {
    if (err.errno == -4058) console.log('Ошибка! Файл ' + path.join(__dirname,argv.l) + ' не существует!')
    else console.log(`Ошибка: ${err}`)
})

readStream.on('end', () => {
    if (data.length == 0) return console.log('Файл с логом игры пуст!')
    console.log('Всего сыграно партий :', data.length)
    let plus = 0
    let minus = 0
    for (let i = 0; i < data.length; ++i) {
        if (data[i] == '+') plus += 1;
        if (data[i] == '-') minus += 1
    }
    console.log('Выиграно :', plus)
    console.log('Проиграно :', minus)
    console.log('Выиграно партий в % :', Math.round(plus/data.length * 100))
    console.log('Проиграно партий в % :', Math.round(minus/data.length * 100))

})
