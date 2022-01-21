// Import stylesheets
import './style.css';
import { FCT_TRIANGLE, TriangleType } from './triangles';
import './utils';
import { Assertion, LogTests } from './utils';

/***********************************************************************************************************************
 * A FAIRE : Complétez avec votre mail UGA
 */
const mailIdentification =
  'Mustapha-Mahrez.Bouchelouche@etu.univ-grenoble-alpes.fr';

/***********************************************************************************************************************
 * A FAIRE : Fonction qui renvoie le type d'un triangle
 * "INVALIDE" | "SCALÈNE" | "ISOCÈLE" | "ÉQUILATÉRAL"
 */
function f(a: number, b: number, c: number): TriangleType {
  let resultat: TriangleType;
  if (a <= 0 || b <= 0 || c <= 0) {
    resultat = 'INVALIDE';
  } else {
    if (c > a + b || a > c + b || b > a + c) {
      resultat = 'INVALIDE';
    } else {
      if (a != b && a != c && b != c) {
        resultat = 'SCALÈNE';
      } else {
        if (a == b && b == c) {
          resultat = 'ÉQUILATÉRAL';
        } else {
          if (a == b && b != c) {
            resultat = 'ISOCÈLE';
          } else {
            if (a == c && b != c) resultat = 'ISOCÈLE';
          }
        }
      }
    }
  }
  return resultat;
}

/***********************************************************************************************************************
 * A FAIRE : Liste de tests à effectuer
 * Chaque test est exprimé par un objet contenant 3 attributs
 *   - args : le tableau des arguments à passer à la fonction f
 *   - expectedResult : le résultat attendu
 *   - comment : un commentaire sous forme de chaine de caractère
 */
const tests: Assertion<Parameters<FCT_TRIANGLE>, ReturnType<FCT_TRIANGLE>>[] = [
  {
    args: [1, 1, 1],
    expectedResult: 'ÉQUILATÉRAL',
    comment:
      'Un triangle dont les côtés sont de longueur 1 devrait être classé comme équilatéral',
  },
  {
    args: [2, 2, 0],
    expectedResult: 'INVALIDE',
    comment:
      'Un triangle dont au moins un des cotés est égal à 0 devrait être classé comme invalide',
  },
  {
    args: [-1, 1, 1],
    expectedResult: 'INVALIDE',
    comment:
      'Un triangle dont au moins un des cotés est inférieur à 0 devrait être classé comme invalide',
  },
  {
    args: [1, 1, 2],
    expectedResult: 'ISOCÈLE',
    comment:
      'Un triangle dont deux cotés sont de méme longueur devrait être classé comme isocèle',
  },
  {
    args: [3, 4, 5],
    expectedResult: 'SCALÈNE',
    comment:
      'Un triangle dont les trois côtés sont de longueur différente devrait être classé comme scalène',
  },
];

/***********************************************************************************************************************
 * NE PAS TOUCHER
 */
LogTests<FCT_TRIANGLE>(
  "Fonction qui renvoie le type d'un triangle",
  f,
  'f',
  tests,
  document.querySelector('#local')
);

const url =
  'https://script.google.com/macros/s/AKfycbxzfVpq-9XKqdDwfSScgyYV6y90x0hmSji5N7KpqCZCsbjQu2ixbcGQq5rCOdFkR33E/exec';

const bt = document.querySelector('button');
const section = document.querySelector('#results');

bt.onclick = async () => {
  bt.disabled = true;
  const fstr = f.toString();
  const bodyStr = fstr.slice(fstr.indexOf('{') + 1, fstr.lastIndexOf('}'));

  const form = new FormData();
  form.append('id', mailIdentification);
  form.append('f', bodyStr);
  form.append('tests', JSON.stringify(tests));

  const R = await fetch(url, {
    method: 'POST',
    body: form,
  });
  const res = await R.json();
  let t = 0;
  if (res.error) {
    section.innerHTML = `<pre>${res.error}</pre>`;
    const [, strT] = /([0-9]*) secondes$/.exec(res.error);
    t = +strT;
    console.log(strT, t);
    const inter = setInterval(() => {
      t--;
      if (t <= 0) {
        bt.disabled = false;
        section.textContent = '';
        clearInterval(inter);
      } else {
        section.innerHTML = `<pre>Vous ne pouvez pas resoumettre avant ${t} secondes
  </pre>`;
      }
    }, 1000);
  } else {
    section.innerHTML = `
      Tests de contrôle passés par votre code (vert = le test passe):<br/>
      <table class="result"><tbody><tr>
      ${res.testPassed
        .map((t, i) => `<td class="${t ? '' : 'in'}correct">${i}</td>`)
        .join('')}
      </tr></tbody></table>
      <br/><br/>
      Mutants éliminés par votre code (vert = le mutant est éliminé) :<br/>
      <table class="result"><tbody><tr>
      ${res.discardedMutants
        .map((t, i) => `<td class="${t ? '' : 'in'}correct">${i}</td>`)
        .join('')}
      </tr></tbody></table>
    `;
  }
};
