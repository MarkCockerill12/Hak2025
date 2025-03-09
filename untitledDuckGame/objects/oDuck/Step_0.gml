var tap_interval = 10; // Max frames between taps to trigger dash

// Collision checks - MOVED THESE TO THE TOP
if (place_meeting(x, y, oSpikes)) {
    room_restart();
} else if (place_meeting(x, y, oNest)) {
    if (global.nest_visit = 1) {
         room_goto(rm_Victory);
    }
    else {
        global.nest_visit += 1;
        room_goto_next();
    }
} else if (place_meeting(x, y, oEggDash)) {
    dash = 1;
    global.show_text = true;
    global.text_timer = 120; // Show message for 2 seconds
    if (instance_exists(oEggDash)) {
        instance_destroy(oEggDash);
    }
} else if (place_meeting(x, y, oEggHat)) {
    hat = 1;
    global.show_text = true;
    global.text_timer = 120; // Show message for 2 seconds
    if (instance_exists(oEggHat)) {
        instance_destroy(oEggHat);
    }
    sprite_index = sPsyduck;
} else if (place_meeting(x, y, oEggJump)) {
    jump = 1;
    global.show_text = true;
    global.text_timer = 120; // Show message for 2 seconds
    if (instance_exists(oEggJump)) {
        instance_destroy(oEggJump);
    }
}

// Pause menu
if (keyboard_check(vk_escape)) {
    room_goto(rm_Pause);
}

if (keyboard_check(vk_enter)) {
    audio_play_sound(sound_Quack, 1, false);
}

// Dash input handling (double-tap detection)
if (dash == 1 && keyboard_check_pressed(vk_control)) {
    dashing = true;
    alarm[0] = room_speed / 2;
    if (keyboard_check(vk_up)) {
        dash_dir = 90;    // set the dashing direction
    } else if (keyboard_check(vk_right)) {
        dash_dir = 0;
    } else if (keyboard_check(vk_left)) {
        dash_dir = 180;
    } else if (keyboard_check(vk_down)) {
        dash_dir = 270;
    }
}

if (dashing) {
    x += lengthdir_x(dash_speed, dash_dir);
    y += lengthdir_y(dash_speed, dash_dir);
    if (place_meeting(x+lengthdir_x(dash_speed, dash_dir), y+lengthdir_y(dash_speed, dash_dir), oGrass)) {
        dashing = false; // disable dashing
        alarm[0] = -1; // disable the previously set alarm
        repeat(ceil(abs(dash_speed))) {
            if (!place_meeting(x+lengthdir_x(1, dash_dir), y+lengthdir_y(1, dash_dir), oGrass)) {
                x += lengthdir_x(1, dash_dir);
                y += lengthdir_y(1, dash_dir);
            }
            else break;
        }
    }
} else {
    // Basic movement
    move_x = keyboard_check(vk_right) - keyboard_check(vk_left);
    move_x *= move_speed;

    if (place_meeting(x, y+2, oGrass)) {
        move_y = 0;
        global.can_double_jump = true; // Reset double jump when grounded
        if (keyboard_check(vk_space)) move_y = -jump_speed;
    } else if (move_y < 10) move_y += 1;

    // Handle double jump
    if (jump == 1 && global.can_double_jump && !place_meeting(x, y+2, oGrass)) {
        if (keyboard_check_pressed(vk_space)) {
            move_y = -jump_speed;
            global.can_double_jump = false; // Disable double jump after use
        }
    }

    // Movement and collision handling
    move_and_collide(move_x, move_y, oGrass, 4, 0, 0, move_speed, -1);
}

// Handle sprite animations AFTER handling movement
if (hat == 1) {
    // Always use Psyduck sprite if hat is equipped
    sprite_index = sPsyduck;
} else if (move_x != 0) {
    // Use movement sprite if moving (and no hat)
    sprite_index = sDuckMove;
} else {
    // Use idle sprite if not moving (and no hat)
    sprite_index = sDuck;
}

// Set the facing direction based on movement
if (move_x != 0) image_xscale = sign(move_x);