if (global.show_text) {
    draw_set_font(fnt_menu);
    draw_set_color(c_red);
    // Convert world coordinates to GUI coordinates
    var gui_x = x + 25;
    var gui_y = y - 20;
    draw_text(gui_x, gui_y, "You acquired\na power-up!");
    global.text_timer--;
    if (global.text_timer <= 0) {
        global.show_text = false;
    }
    draw_set_color(c_white);
}