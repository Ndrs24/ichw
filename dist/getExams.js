import { waitSeconds } from './utils';
async function onOpenModal(table, handler) {
    const tbody = table.getElementsByTagName('tbody')[0];
    for (let i = 0; i < tbody.children.length; i++) {
        const tr = tbody.children[i];
        const button = tr.getElementsByTagName('button')[0];
        if (!button) {
            continue;
        }
        button.click();
        await waitSeconds(2);
        await handler(tr);
    }
}
async function main(exams) {
    const table = document.getElementById('tablaEvaluaciones');
    if (!table) {
        throw new Error('Table tablaEvaluaciones not found');
    }
    await onOpenModal(table, async (tr) => {
        const table = document.getElementById('tableSolucionarios');
        if (!table) {
            console.log('Table tableSolucionarios not found');
            return;
        }
        const title = tr.getElementsByTagName('td')[1].textContent;
        const docs = [];
        await onOpenModal(table, () => {
            const iframe = document.getElementById('iframePDF');
            if (!iframe) {
                console.log('iframePDF not found');
                return;
            }
            docs.push(iframe.src);
        });
        exams.push({
            title,
            docs,
        });
    });
    return exams;
}
const useNext = () => {
    let next = document.getElementById('tablaEvaluaciones_next');
    let canNext = true;
    if (!next) {
        throw new Error('Next button not found');
    }
    if (next.className.includes('disabled')) {
        canNext = false;
    }
    return { next, canNext };
};
async function main2() {
    const { next, canNext } = useNext();
    let nextZ = next;
    let canNextZ = canNext;
    let exams = [];
    while (canNextZ) {
        const moreExams = await main(exams);
        exams = [...exams, ...moreExams];
        nextZ.click();
        await waitSeconds(2);
        const { next, canNext } = useNext();
        nextZ = next;
        canNextZ = canNext;
    }
    const a = document.createElement('a');
    a.setAttribute('href', 'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(exams, null, 2)));
    a.setAttribute('download', 'praticas.json');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log('Ha terminado');
}
main2();
