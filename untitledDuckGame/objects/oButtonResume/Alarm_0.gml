event_inherited();

room_goto_previous();


if (global.nest_visit < 1) {
    room_goto(rm_Game);
}
else {
   room_goto_previous();
}