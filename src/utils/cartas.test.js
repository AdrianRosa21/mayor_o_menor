import { describe, expect, it } from 'vitest';
import {
  calcularProbabilidades,
  compararCartas,
  esPaloRojo,
  etiquetaValor,
  evaluarJugada,
  nombreCarta,
  obtenerValorNumerico,
  simboloPalo,
} from './cartas';

// Ayuda para crear cartas de prueba sin repetir código
const crearCarta = (valor, palo = 'SPADES') => ({
  codigo: `${valor}${palo}`,
  valor,
  palo,
});

describe('obtenerValorNumerico', () => {
  it('devuelve el mismo número para las cartas del 2 al 10', () => {
    expect(obtenerValorNumerico('2')).toBe(2);
    expect(obtenerValorNumerico('7')).toBe(7);
    expect(obtenerValorNumerico('10')).toBe(10);
  });

  it('asigna JACK=11, QUEEN=12, KING=13 y ACE=14', () => {
    expect(obtenerValorNumerico('JACK')).toBe(11);
    expect(obtenerValorNumerico('QUEEN')).toBe(12);
    expect(obtenerValorNumerico('KING')).toBe(13);
    expect(obtenerValorNumerico('ACE')).toBe(14);
  });

  it('lanza un error si el valor no existe', () => {
    expect(() => obtenerValorNumerico('JOKER')).toThrow('JOKER');
  });
});

describe('compararCartas', () => {
  it('detecta una carta nueva mayor', () => {
    expect(compararCartas(crearCarta('5'), crearCarta('9'))).toBe('mayor');
  });

  it('detecta una carta nueva menor', () => {
    expect(compararCartas(crearCarta('KING'), crearCarta('3'))).toBe('menor');
  });

  it('detecta un empate aunque el palo sea distinto', () => {
    expect(compararCartas(crearCarta('8', 'HEARTS'), crearCarta('8', 'CLUBS'))).toBe('igual');
  });

  it('considera que el AS es la carta más alta', () => {
    expect(compararCartas(crearCarta('KING'), crearCarta('ACE'))).toBe('mayor');
    expect(compararCartas(crearCarta('ACE'), crearCarta('KING'))).toBe('menor');
  });

  it('compara bien el 10 con las figuras (no como texto)', () => {
    expect(compararCartas(crearCarta('9'), crearCarta('10'))).toBe('mayor');
    expect(compararCartas(crearCarta('10'), crearCarta('JACK'))).toBe('mayor');
  });
});

describe('evaluarJugada', () => {
  const cinco = crearCarta('5');
  const nueve = crearCarta('9');
  const dos = crearCarta('2');

  it('es acierto si eligió mayor y la carta nueva es mayor', () => {
    expect(evaluarJugada('mayor', cinco, nueve)).toBe('acierto');
  });

  it('es acierto si eligió menor y la carta nueva es menor', () => {
    expect(evaluarJugada('menor', cinco, dos)).toBe('acierto');
  });

  it('es fallo si eligió mayor y la carta nueva es menor', () => {
    expect(evaluarJugada('mayor', cinco, dos)).toBe('fallo');
  });

  it('es fallo si eligió menor y la carta nueva es mayor', () => {
    expect(evaluarJugada('menor', cinco, nueve)).toBe('fallo');
  });

  it('es empate si los valores son iguales, sin importar lo que eligió', () => {
    expect(evaluarJugada('mayor', cinco, crearCarta('5', 'HEARTS'))).toBe('empate');
    expect(evaluarJugada('menor', cinco, crearCarta('5', 'HEARTS'))).toBe('empate');
  });
});

describe('calcularProbabilidades', () => {
  it('con un mazo recién barajado y un REY en mesa: 4 ases mayores, 3 reyes iguales, 44 menores', () => {
    const rey = crearCarta('KING', 'HEARTS');
    const resultado = calcularProbabilidades(rey, [rey]);

    expect(resultado.total).toBe(51);
    expect(resultado.mayor.cartas).toBe(4);
    expect(resultado.igual.cartas).toBe(3);
    expect(resultado.menor.cartas).toBe(44);
  });

  it('redondea los porcentajes (4/51 = 8%, 3/51 = 6%, 44/51 = 86%)', () => {
    const rey = crearCarta('KING', 'HEARTS');
    const resultado = calcularProbabilidades(rey, [rey]);

    expect(resultado.mayor.porcentaje).toBe(8);
    expect(resultado.igual.porcentaje).toBe(6);
    expect(resultado.menor.porcentaje).toBe(86);
  });

  it('si la carta es un AS, no puede salir una carta mayor', () => {
    const as = crearCarta('ACE', 'CLUBS');
    const resultado = calcularProbabilidades(as, [as]);

    expect(resultado.mayor.cartas).toBe(0);
    expect(resultado.mayor.porcentaje).toBe(0);
    expect(resultado.menor.cartas).toBe(48);
  });

  it('si la carta es un 2, no puede salir una carta menor', () => {
    const dos = crearCarta('2', 'CLUBS');
    const resultado = calcularProbabilidades(dos, [dos]);

    expect(resultado.menor.cartas).toBe(0);
    expect(resultado.mayor.cartas).toBe(48);
  });

  it('descuenta las cartas que ya salieron del mazo', () => {
    const cinco = crearCarta('5', 'HEARTS');
    // Ya salieron el 5 actual y dos ases
    const sacadas = [cinco, crearCarta('ACE', 'SPADES'), crearCarta('ACE', 'CLUBS')];
    const resultado = calcularProbabilidades(cinco, sacadas);

    expect(resultado.total).toBe(49);
    // Mayores a 5: valores 6..14 = 9 valores x 4 cartas = 36, menos 2 ases
    expect(resultado.mayor.cartas).toBe(34);
    expect(resultado.igual.cartas).toBe(3);
    expect(resultado.menor.cartas).toBe(12);
  });

  it('devuelve ceros si ya no quedan cartas en el mazo', () => {
    const cartas = [];
    for (const palo of ['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES']) {
      for (const valor of ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE']) {
        cartas.push(crearCarta(valor, palo));
      }
    }
    const resultado = calcularProbabilidades(cartas[0], cartas);

    expect(resultado.total).toBe(0);
    expect(resultado.mayor.porcentaje).toBe(0);
    expect(resultado.menor.porcentaje).toBe(0);
    expect(resultado.igual.porcentaje).toBe(0);
  });
});

describe('funciones de presentación', () => {
  it('nombreCarta usa español', () => {
    expect(nombreCarta(crearCarta('KING', 'SPADES'))).toBe('Rey de picas');
    expect(nombreCarta(crearCarta('ACE', 'HEARTS'))).toBe('As de corazones');
    expect(nombreCarta(crearCarta('JACK', 'DIAMONDS'))).toBe('Jota de diamantes');
    expect(nombreCarta(crearCarta('QUEEN', 'CLUBS'))).toBe('Reina de tréboles');
    expect(nombreCarta(crearCarta('7', 'HEARTS'))).toBe('7 de corazones');
  });

  it('simboloPalo devuelve el símbolo correcto', () => {
    expect(simboloPalo('HEARTS')).toBe('♥');
    expect(simboloPalo('DIAMONDS')).toBe('♦');
    expect(simboloPalo('CLUBS')).toBe('♣');
    expect(simboloPalo('SPADES')).toBe('♠');
  });

  it('etiquetaValor abrevia las figuras', () => {
    expect(etiquetaValor('ACE')).toBe('A');
    expect(etiquetaValor('KING')).toBe('K');
    expect(etiquetaValor('QUEEN')).toBe('Q');
    expect(etiquetaValor('JACK')).toBe('J');
    expect(etiquetaValor('10')).toBe('10');
  });

  it('esPaloRojo distingue los palos rojos de los negros', () => {
    expect(esPaloRojo('HEARTS')).toBe(true);
    expect(esPaloRojo('DIAMONDS')).toBe(true);
    expect(esPaloRojo('CLUBS')).toBe(false);
    expect(esPaloRojo('SPADES')).toBe(false);
  });
});
