import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name) + 'main upd this works veel beter!';
}

showHello("greeting", "TypeScript")
