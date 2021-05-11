#!/usr/bin/env node
const readline = require('readline')
const fs = require('fs');
const path = require('path')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Использование: $0 [options]')
    .example('$0 -l log.txt', 'Запустить игру и сохранять результат в log-файле игры log.txt')
    .nargs('l', 1)
    .describe('l', 'Имя Log-файла')
    .demandOption(['l'])
    .help('h')
    .alias('h', 'help')
    .version('1.0.0')
    .argv;


var logStream = fs.createWriteStream(path.join(__dirname, argv.l), {flags: 'a'});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const question = (str) => new Promise(resolve => rl.question(str, resolve))
let num

const steps = {
    start: async () => {
        num = getRandomInRange(1,2)
        console.log('Игра "орел-решка"')
//        console.log(num)
        return steps.go()
    },
    go: async () => {
        const inLine = await question('Введите число (1 - "орел" 2 - "решка"  3 - завершить игру) : ')
        const x = Number(inLine)
        if (isNaN(x) || x > 3 || x < 1) {
            console.log('Ошибка! Вы ввели не целое число или число не в диапазоне 1..3!')
            return steps.start()
        }
        if (x == 3) {
            logStream.close()
            console.log('Игра завершена.')
            return steps.finish()
        }
        let s = '+'
        if (x == num) console.log('Поздравляем! Число отгадано!')
        else {
            console.log('Неудача!')
            s = '-'
        }
        logStream.write(s)
        return steps.start()
    },
    finish: async () => {
      rl.close()
      logStream.close()
    },
}

steps.start()
              