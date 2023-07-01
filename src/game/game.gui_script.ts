/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as druid from 'druid.druid';
import * as druid_style from 'druid.styles.default.style';
import { hex2rgba, hide_gui_list, set_text, show_gui_list } from '../utils/utils';
import * as utf8 from '../utils/utf8';

interface props {
    druid: DruidClass;
}

let active_nodes: node[] = [];
let chars = '';
function add_char(n: node, params: string) {
    if (active_nodes.includes(n))
        return;
    active_nodes.push(n);
    chars += params;
    gui.set_color(n, hex2rgba('#e6e64d'));
}

function bind_button_hover(_this: props, node: any, params: string) {
    _this.druid.new_hover(node, (g: any, is_enter: any) => {
        if (!is_enter)
            return;
        add_char(node, params);
    });
}

function start_word() {
    active_nodes = [];
    chars = '';
}

function check_word() {
    if (chars.length == 0)
        return;
    set_text('finded_word', chars);
    for (let i = 0; i < active_nodes.length; i++) {
        gui.set_color(active_nodes[i], hex2rgba('#fff'));
    }
    show_gui_list(['popup']);
}

export function init(this: props): void {
    Manager.init_gui();
    this.druid = druid.new(this);
    druid_style.button.LONGTAP_TIME = 0.01;
    druid.set_default_style(druid_style);
    this.druid.new_button('btnHome', () => Scene.load('menu'));

    const chars = 'йцукенгшщзхфывапролдджэячсмитьбю';
    const template = gui.get_node('template_word');
    const parent = gui.get_node('game_content');
    const size = 8;
    const delta = 64 + 2;
    const offset = 5;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const index = math.random(1, utf8.len(chars));
            const ch = utf8.sub(chars, index, index);
            const params = ch;
            const n = gui.clone_tree(template);
            const np = n['template_word'];
            this.druid.new_text(n['text'], ch);
            gui.set_parent(np, parent, false);
            gui.set_position(np, vmath.vector3(-540 / 2 + offset + x * delta, 0 - offset - y * delta, 0));
            bind_button_hover(this, np, params);
        }
    }

    this.druid.new_blocker('popup');
    this.druid.new_button('btnFind', () => hide_gui_list(['popup']));
}


export function on_input(this: props, action_id: string | hash, action: any): void {
    if (action_id == ID_MESSAGES.MSG_TOUCH) {
        if (action.pressed)
            start_word();
        else if (action.released)
            check_word();
    }
    this.druid.on_input(action_id, action);
}

export function update(this: props, dt: number): void {
    this.druid.update(dt);
}

export function on_message(this: props, message_id: string | hash, message: any, sender: string | hash | url): void {
    Manager.on_message_gui(this, message_id, message, sender);
    this.druid.on_message(message_id, message, sender);
}

export function final(this: props): void {
    Manager.final();
    this.druid.final();
}


