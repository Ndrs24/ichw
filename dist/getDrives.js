import { waitSeconds } from './utils';
async function getCycleName(defaultName) {
    return new Promise((resolve) => {
        const options = document.getElementById('ciclos_ich').children;
        for (let i = 0; i < options.length; i++) {
            if (options[i].hasAttribute('selected')) {
                resolve(options[i].textContent);
                break;
            }
        }
        resolve(defaultName);
    });
}
function getCourse() {
    const classesEl = document
        .getElementById('div1')
        .querySelectorAll('.contenido');
    const coursetitle = classesEl[0].getElementsByTagName('h2')[0].textContent;
    const classesObj = [];
    for (let i = 1; i < classesEl.length; i++) {
        const classP = classesEl[i];
        const classTittle = classP.getElementsByTagName('h4')[0].textContent;
        const classDescription = classP.getElementsByTagName('h5')[0].textContent;
        let drives = [];
        const links = classP.getElementsByTagName('a');
        for (const link in links) {
            const href = links[link].href;
            if (href && (href.includes('drive.google.com') || href.includes('pdf'))) {
                drives.push(href);
            }
        }
        classesObj.push({
            title: classTittle,
            description: classDescription,
            drive: drives,
        });
    }
    return { name: coursetitle, classes: classesObj };
}
;
(async () => {
    console.log('Iniciando');
    carga_vista('ich_modulos/mod_mismateriales/index.php');
    await waitSeconds(1);
    const cycleName = await getCycleName('Ciclo Aduni');
    const cicle = {
        name: cycleName,
        courses: [],
    };
    const coursesEl = document.getElementById('div1').getElementsByTagName('a');
    for (const prop in coursesEl) {
        const courseEl = coursesEl[prop];
        if (!courseEl.textContent)
            continue;
        courseEl.click();
        await waitSeconds(1);
        const course = getCourse();
        await waitSeconds(1);
        cicle.courses.push(course);
        await waitSeconds(1);
        load_cursos();
        await waitSeconds(1);
    }
    const a = document.createElement('a');
    a.setAttribute('href', 'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(cicle, null, 2)));
    a.setAttribute('download', 'ciclo.json');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log('Ha terminado');
})();
// Ignore
function carga_vista(arg0) {
    throw new Error('Function not implemented.');
}
function load_cursos() {
    throw new Error('Function not implemented.');
}
//fetch("https://andresgarro.com/ich.js").then((r)=>r.text()).then((d) => eval(d))
