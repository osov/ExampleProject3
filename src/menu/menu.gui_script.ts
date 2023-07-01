/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as druid from 'druid.druid';
import * as druid_const from 'druid.const';
import * as druid_layout from 'druid.extended.layout';
import * as druid_style from 'druid.styles.default.style';

interface props {
    druid: DruidClass;
}

function on_long(_this: any, params: any, button: any, hold_time: number) {
    print("On long callback", hold_time);
}

function on_hold(_this: any, params: any, button: any, hold_time: number) {
    print("On hold callback", hold_time, params);
}

export function init(this: props): void {
    Manager.init_gui();
    druid.register('layout', druid_layout);
    this.druid = druid.new(this);

    this.druid.new_button('btnRestart', () => Scene.restart());
    this.druid.new_button('btnGame', () => Scene.load('game'));

    druid_style.button.LONGTAP_TIME = 0.01;
    druid.set_default_style(druid_style);
    const btn = this.druid.new_button('btnHome', () => print('click'));
    btn.params = 'btn_1';
    btn.on_hold_callback.subscribe(on_hold);
    btn.on_long_click.subscribe(on_long);


    this.druid.new_text('w1').set_text_adjust(druid_const.TEXT_ADJUST.DOWNSCALE);
    this.druid.new_text('w2');

    const words: string[] = ['вилка', 'спичка', 'губки', 'плевок', 'олень', 'валик', 'надобность', 'горечь', 'жидкость', 'крючок', 'мотать', 'виски', 'хроника', 'молния', 'картон', 'санки', 'организм', 'бухта', 'изменение', 'иерархия', 'текстиль', 'совесть', 'башмак', 'кратность', 'карман', 'жилище', 'гипс', 'психик', 'замочить', 'входной', 'рационализм', 'пионер', 'леность', 'реферат', 'классика', 'выполнение', 'туфли', 'визг', 'кинофильм', 'потребность', 'странность', 'чердак', 'комплект', 'трусики', 'воронка', 'любимчик', 'обернуть', 'ценность', 'тряпочный'];
    const src = gui.get_node('w1');
    for (let x = 2; x <= 5; x++) {
        const box = gui.get_node('box' + x);
        for (let i = 1; i <= 10; i++) {
            const n = gui.clone(src);
            gui.set_text(n, words[math.random(0, words.length - 1)]);
            gui.set_parent(n, box);
            gui.set_position(n, vmath.vector3(0, -40 * i, 0));
            this.druid.new_text(n).set_text_adjust(x == 2 ? druid_const.TEXT_ADJUST.TRIM : druid_const.TEXT_ADJUST.DOWNSCALE);
        }
    }

    for (let x = 1; x <= 5; x++) {
        //this.druid.new_layout("box" + x, druid_const.LAYOUT_MODE.STRETCH);
    }

}


export function on_input(this: props, action_id: string | hash, action: unknown): void {
    return this.druid.on_input(action_id, action);
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
