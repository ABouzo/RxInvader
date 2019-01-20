import {update$} from "./engine/Core";
import {input$} from "./engine/Input";

// tslint:disable:no-console
update$.subscribe(console.log);

input$.subscribe(console.log);
