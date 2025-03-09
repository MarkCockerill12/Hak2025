move_speed = 6;
jump_speed = 15;
move_x = 0;
move_y = 0;

dash = 0;
hat = 0;
jump = 0;

dashing = false;
dash_speed = 12;
dash_dir = 0;


if (!variable_global_exists("can_double_jump")) global.can_double_jump = false;
if (!variable_global_exists("show_text")) global.show_text = false;
if (!variable_global_exists("text_timer")) global.text_timer = 0;
